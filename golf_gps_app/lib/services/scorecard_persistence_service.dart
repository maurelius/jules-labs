import 'dart:convert';
import 'package:golf_gps_app/models/scorecard_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ScorecardPersistenceService {
  static const String _allRoundsKey = 'all_golf_rounds';

  Future<void> saveRound(GolfRound round) async {
    final prefs = await SharedPreferences.getInstance();
    
    // Load existing rounds
    final List<String> roundsJsonList = prefs.getStringList(_allRoundsKey) ?? [];
    
    // Add the new round (or update if it's an existing one based on a unique ID if we had one)
    // For simplicity here, we'll just add it. If rounds had unique IDs, we could replace.
    // To avoid duplicates if saving the same round multiple times without a proper ID system,
    // we could filter out a round with the same courseId and datePlayed before adding.
    // However, the current task implies just saving, so we'll append.
    final String roundJson = jsonEncode(round.toJson());
    roundsJsonList.add(roundJson);
    
    await prefs.setStringList(_allRoundsKey, roundsJsonList);
  }

  Future<List<GolfRound>> loadRounds() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> roundsJsonList = prefs.getStringList(_allRoundsKey) ?? [];
    
    return roundsJsonList.map((roundJson) {
      final Map<String, dynamic> decodedJson = jsonDecode(roundJson) as Map<String, dynamic>;
      return GolfRound.fromJson(decodedJson);
    }).toList();
  }

  // Optional: Load the last round played for a specific course
  Future<GolfRound?> loadLastRoundForCourse(String courseId) async {
    final List<GolfRound> allRounds = await loadRounds();
    final List<GolfRound> roundsForCourse = allRounds.where((round) => round.courseId == courseId).toList();
    
    if (roundsForCourse.isNotEmpty) {
      // Sort by date to get the latest
      roundsForCourse.sort((a, b) => b.datePlayed.compareTo(a.datePlayed));
      return roundsForCourse.first;
    }
    return null;
  }

  // Helper to clear all rounds (for testing or reset)
  Future<void> clearAllRounds() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_allRoundsKey);
  }
}
