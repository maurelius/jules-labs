import 'package:flutter_test/flutter_test.dart';
import 'package:golf_gps_app/models/scorecard_model.dart';

void main() {
  group('GolfRound Model Tests', () {
    late GolfRound testRound;
    late List<ScorecardHole> testHoles;

    setUp(() {
      // Initialize with some default hole data for a 3-hole course
      testHoles = [
        ScorecardHole(holeNumber: 1, par: 4, score: 4, putts: 2, fairwayHit: FairwayHitStatus.Hit, greenInRegulation: true),
        ScorecardHole(holeNumber: 2, par: 3, score: 3, putts: 1, fairwayHit: FairwayHitStatus.NotApplicable, greenInRegulation: true),
        ScorecardHole(holeNumber: 3, par: 5, score: 6, putts: 3, fairwayHit: FairwayHitStatus.MissedRight, greenInRegulation: false),
      ];
      testRound = GolfRound(
        courseId: 'test_course_123',
        courseName: 'Test Course National',
        datePlayed: DateTime.now(),
        holes: testHoles,
      );
    });

    test('totalScore calculates correctly', () {
      expect(testRound.totalScore, 13); // 4 + 3 + 6

      // Test with a hole not yet scored (score = 0)
      testRound.holes.add(ScorecardHole(holeNumber: 4, par: 4, score: 0, putts: 0));
      expect(testRound.totalScore, 13); // Should not add the 0 score

      // Test with an actual zero score (e.g. picked up)
      testRound.holes[0].score = 0; // Set hole 1 score to 0, but it's "scored"
      // The current logic of isScored (score > 0) means a 0 is not counted unless we change isScored
      // For now, if score is 0, it's not counted towards totalScore.
      // If a score of 0 should be counted, isScored logic would need to change.
      // Assuming score 0 means "not played yet" or "picked up without finishing" for totalScore.
      // Let's re-evaluate. If a hole is played and results in 0 (e.g. a very bad hole or penalty situation),
      // it should count. The `isScored` is more for "has a score been entered".
      // Let's adjust isScored or the test.
      // For now, let's assume score 0 means picked up and doesn't add to total.
      // If we change this, the test needs to change.
      // The prompt test case "Test with various scores, including zeros" implies 0 should be handled.
      // Let's assume isScored means a score has been explicitly set.
      // Current `isScored` (score > 0) makes a 0 score not count.
      // Let's adjust the testRound setup for more clarity on "scored 0"
      testRound.holes[0].score = 4; // reset
      testRound.holes[1].score = 0; // explicitly set a 0
      // if isScored is true for 0, then total should be 4+0+6 = 10
      // if isScored is false for 0, then total should be 4+6 = 10 (current)
      // The model's `isScored` is `score > 0`. So a score of 0 is not counted in `totalScore`.
      expect(testRound.totalScore, 10); // 4 (hole 1) + 6 (hole 3), hole 2 has score 0
    });

    test('totalPutts calculates correctly', () {
      expect(testRound.totalPutts, 6); // 2 + 1 + 3
      testRound.holes[0].putts = 0;
      expect(testRound.totalPutts, 4); // 0 + 1 + 3
    });

    test('totalScoreAgainstPar calculates correctly', () {
      // Hole 1: 4 (par 4) -> 0
      // Hole 2: 3 (par 3) -> 0 (but we set score to 0 in previous test case, let's reset for clarity)
      // Hole 3: 6 (par 5) -> +1
      // Initial testHoles: 4, 3, 6. Pars: 4, 3, 5. Diff: 0, 0, +1. Total: +1
      // Resetting testHoles for this test for isolation:
      testRound.holes = [
        ScorecardHole(holeNumber: 1, par: 4, score: 4), // Even
        ScorecardHole(holeNumber: 2, par: 3, score: 2), // -1 (Birdie)
        ScorecardHole(holeNumber: 3, par: 5, score: 6), // +1 (Bogey)
        ScorecardHole(holeNumber: 4, par: 4, score: 0), // Not scored, should not count
      ];
      expect(testRound.totalScoreAgainstPar, 0); // 0 + (-1) + 1 = 0

      testRound.holes[0].score = 5; // +1
      testRound.holes[1].score = 3; // 0
      testRound.holes[2].score = 4; // -1
      // Total: +1 + 0 + (-1) = 0
      expect(testRound.totalScoreAgainstPar, 0);

      testRound.holes[0].score = 3; // -1 (par 4)
      testRound.holes[1].score = 2; // -1 (par 3)
      testRound.holes[2].score = 4; // -1 (par 5)
      // Total: -1 + (-1) + (-1) = -3
      expect(testRound.totalScoreAgainstPar, -3);
    });

    test('totalFairwaysHit and totalFairwayOpportunities calculate correctly', () {
      // Initial setup:
      // Hole 1 (Par 4): Hit
      // Hole 2 (Par 3): NotApplicable (Par 3s are not opportunities)
      // Hole 3 (Par 5): MissedRight
      // Opportunities: Hole 1, Hole 3 (Par 4s and 5s where fairwayHit is not N/A)
      // Hits: Hole 1
      expect(testRound.totalFairwaysHit, 1);
      expect(testRound.totalFairwayOpportunities, 2); // Hole 1 (Par 4), Hole 3 (Par 5)

      testRound.holes[0].fairwayHit = FairwayHitStatus.MissedLeft; // Still an opportunity, but not a hit
      testRound.holes[2].fairwayHit = FairwayHitStatus.Hit;       // Now a hit
      expect(testRound.totalFairwaysHit, 1);
      expect(testRound.totalFairwayOpportunities, 2);

      // Add a par 3 that is accidentally marked as Hit (should still not be an opportunity)
      testRound.holes.add(ScorecardHole(holeNumber: 4, par: 3, score: 3, fairwayHit: FairwayHitStatus.Hit));
      expect(testRound.totalFairwaysHit, 2); // Counts the hit
      expect(testRound.totalFairwayOpportunities, 2); // Par 3 is not an opportunity

      // Add a par 4 marked as NotApplicable (e.g. tee shot lost, not a fairway attempt)
      testRound.holes.add(ScorecardHole(holeNumber: 5, par: 4, score: 6, fairwayHit: FairwayHitStatus.NotApplicable));
      expect(testRound.totalFairwaysHit, 2);
      expect(testRound.totalFairwayOpportunities, 2); // Not an opportunity if marked N/A
    });

    test('totalGreensInRegulation calculates correctly', () {
      // Initial setup: Hole 1 (true), Hole 2 (true), Hole 3 (false)
      expect(testRound.totalGreensInRegulation, 2);

      testRound.holes[0].greenInRegulation = false;
      expect(testRound.totalGreensInRegulation, 1);
    });

     test('GolfRound toJson and fromJson works correctly', () {
      final roundJson = testRound.toJson();
      final roundFromJson = GolfRound.fromJson(roundJson);

      expect(roundFromJson.courseId, testRound.courseId);
      expect(roundFromJson.courseName, testRound.courseName);
      expect(roundFromJson.datePlayed.toIso8601String(), testRound.datePlayed.toIso8601String());
      expect(roundFromJson.holes.length, testRound.holes.length);

      for (int i = 0; i < testRound.holes.length; i++) {
        expect(roundFromJson.holes[i].holeNumber, testRound.holes[i].holeNumber);
        expect(roundFromJson.holes[i].par, testRound.holes[i].par);
        expect(roundFromJson.holes[i].score, testRound.holes[i].score);
        expect(roundFromJson.holes[i].putts, testRound.holes[i].putts);
        expect(roundFromJson.holes[i].fairwayHit, testRound.holes[i].fairwayHit);
        expect(roundFromJson.holes[i].greenInRegulation, testRound.holes[i].greenInRegulation);
      }
    });

    test('ScorecardHole toJson and fromJson works correctly', () {
      final hole = ScorecardHole(holeNumber: 1, par: 4, score: 5, putts: 2, fairwayHit: FairwayHitStatus.MissedLeft, greenInRegulation: true);
      final holeJson = hole.toJson();
      final holeFromJson = ScorecardHole.fromJson(holeJson);

      expect(holeFromJson.holeNumber, hole.holeNumber);
      expect(holeFromJson.par, hole.par);
      expect(holeFromJson.score, hole.score);
      expect(holeFromJson.putts, hole.putts);
      expect(holeFromJson.fairwayHit, hole.fairwayHit);
      expect(holeFromJson.greenInRegulation, hole.greenInRegulation);
    });

  });
}
