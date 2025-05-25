import 'package:flutter_test/flutter_test.dart';
import 'package:golf_gps_app/models/scorecard_model.dart';
import 'package:golf_gps_app/services/scorecard_persistence_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

void main() {
  group('ScorecardPersistenceService Tests', () {
    late ScorecardPersistenceService service;
    late GolfRound testRound1;
    late GolfRound testRound2;
    late GolfRound testRoundCourse2;

    setUp(() async {
      // Mock SharedPreferences
      SharedPreferences.setMockInitialValues({});
      service = ScorecardPersistenceService();

      testRound1 = GolfRound(
        courseId: 'course1',
        courseName: 'Course One',
        datePlayed: DateTime(2023, 1, 15),
        holes: [
          ScorecardHole(holeNumber: 1, par: 4, score: 5, putts: 2),
          ScorecardHole(holeNumber: 2, par: 3, score: 3, putts: 1),
        ],
      );

      testRound2 = GolfRound(
        courseId: 'course1', // Same course, different date
        courseName: 'Course One',
        datePlayed: DateTime(2023, 1, 20), // Later date
        holes: [
          ScorecardHole(holeNumber: 1, par: 4, score: 4, putts: 1),
          ScorecardHole(holeNumber: 2, par: 3, score: 4, putts: 2),
        ],
      );

      testRoundCourse2 = GolfRound(
        courseId: 'course2',
        courseName: 'Course Two',
        datePlayed: DateTime(2023, 1, 18),
        holes: [
          ScorecardHole(holeNumber: 1, par: 5, score: 5, putts: 2),
        ],
      );
    });

    tearDown(() async {
      // Clear SharedPreferences after each test for isolation
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
    });

    test('saveRound saves a round correctly', () async {
      await service.saveRound(testRound1);
      final prefs = await SharedPreferences.getInstance();
      final roundsJsonList = prefs.getStringList('all_golf_rounds');

      expect(roundsJsonList, isNotNull);
      expect(roundsJsonList!.length, 1);

      final savedRoundJson = jsonDecode(roundsJsonList.first) as Map<String, dynamic>;
      expect(savedRoundJson['courseId'], testRound1.courseId);
      expect(savedRoundJson['courseName'], testRound1.courseName);
      expect(savedRoundJson['datePlayed'], testRound1.datePlayed.toIso8601String());
      expect(savedRoundJson['holes'].length, testRound1.holes.length);
    });

    test('loadRounds loads multiple rounds correctly', () async {
      // Save a few rounds
      await service.saveRound(testRound1);
      await service.saveRound(testRoundCourse2);

      final loadedRounds = await service.loadRounds();
      expect(loadedRounds.length, 2);

      // Verify some data from each round
      final loadedRound1 = loadedRounds.firstWhere((r) => r.courseId == testRound1.courseId);
      expect(loadedRound1.courseName, testRound1.courseName);
      expect(loadedRound1.holes.length, testRound1.holes.length);
      expect(loadedRound1.holes.first.score, testRound1.holes.first.score);

      final loadedRoundCourse2 = loadedRounds.firstWhere((r) => r.courseId == testRoundCourse2.courseId);
      expect(loadedRoundCourse2.courseName, testRoundCourse2.courseName);
      expect(loadedRoundCourse2.holes.length, testRoundCourse2.holes.length);
    });

    test('loadRounds returns empty list when no rounds are saved', () async {
      final loadedRounds = await service.loadRounds();
      expect(loadedRounds, isEmpty);
    });

    test('loadLastRoundForCourse returns the correct latest round', () async {
      await service.saveRound(testRound1);      // Course 1, Date Jan 15
      await service.saveRound(testRound2);      // Course 1, Date Jan 20 (latest for course1)
      await service.saveRound(testRoundCourse2); // Course 2, Date Jan 18

      // Test for course1
      GolfRound? lastRoundCourse1 = await service.loadLastRoundForCourse('course1');
      expect(lastRoundCourse1, isNotNull);
      expect(lastRoundCourse1!.courseId, 'course1');
      expect(lastRoundCourse1.datePlayed, testRound2.datePlayed); // Should be testRound2
      expect(lastRoundCourse1.holes.first.score, testRound2.holes.first.score);

      // Test for course2
      GolfRound? lastRoundCourse2 = await service.loadLastRoundForCourse('course2');
      expect(lastRoundCourse2, isNotNull);
      expect(lastRoundCourse2!.courseId, 'course2');
      expect(lastRoundCourse2.datePlayed, testRoundCourse2.datePlayed);
    });

    test('loadLastRoundForCourse returns null if no rounds for that course', () async {
      await service.saveRound(testRoundCourse2); // Only save a round for course2

      GolfRound? lastRound = await service.loadLastRoundForCourse('non_existent_course');
      expect(lastRound, isNull);

      GolfRound? lastRoundCourse1 = await service.loadLastRoundForCourse('course1');
      expect(lastRoundCourse1, isNull);
    });
    
    test('clearAllRounds removes all rounds', async () {
      await service.saveRound(testRound1);
      await service.saveRound(testRound2);
      
      var rounds = await service.loadRounds();
      expect(rounds.length, 2); // Ensure rounds were saved

      await service.clearAllRounds();
      rounds = await service.loadRounds();
      expect(rounds, isEmpty); // Ensure rounds are cleared
    });
  });
}
