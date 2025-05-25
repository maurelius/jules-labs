enum FairwayHitStatus { Hit, MissedLeft, MissedRight, NotApplicable }

class ScorecardHole {
  final int holeNumber;
  final int par;
  int score;
  int putts;
  FairwayHitStatus fairwayHit;
  bool greenInRegulation;

  ScorecardHole({
    required this.holeNumber,
    required this.par,
    this.score = 0,
    this.putts = 0,
    this.fairwayHit = FairwayHitStatus.NotApplicable,
    this.greenInRegulation = false,
  });

  bool get isScored => score > 0;

  // toJson method
  Map<String, dynamic> toJson() => {
        'holeNumber': holeNumber,
        'par': par,
        'score': score,
        'putts': putts,
        'fairwayHit': fairwayHit.name, // Store enum by name
        'greenInRegulation': greenInRegulation,
      };

  // fromJson factory constructor
  factory ScorecardHole.fromJson(Map<String, dynamic> json) {
    return ScorecardHole(
      holeNumber: json['holeNumber'] as int,
      par: json['par'] as int,
      score: json['score'] as int,
      putts: json['putts'] as int,
      fairwayHit: FairwayHitStatus.values
          .firstWhere((e) => e.name == json['fairwayHit'], orElse: () => FairwayHitStatus.NotApplicable),
      greenInRegulation: json['greenInRegulation'] as bool,
    );
  }
}

class GolfRound {
  final String courseId;
  final String courseName;
  final DateTime datePlayed;
  List<ScorecardHole> holes;

  GolfRound({
    required this.courseId,
    required this.courseName,
    required this.datePlayed,
    required this.holes,
  });

  int get totalScore {
    return holes.fold(0, (sum, hole) => sum + (hole.isScored ? hole.score : 0));
  }

  int get totalScoreAgainstPar {
     return holes.fold(0, (sum, hole) => sum + (hole.isScored ? (hole.score - hole.par) : 0));
  }

  int get totalPutts {
    return holes.fold(0, (sum, hole) => sum + hole.putts);
  }
  
  int get totalFairwaysHit {
    return holes.where((h) => h.fairwayHit == FairwayHitStatus.Hit).length;
  }

  int get totalFairwayOpportunities {
    return holes.where((h) => h.par > 3 && h.fairwayHit != FairwayHitStatus.NotApplicable).length;
  }

  int get totalGreensInRegulation {
    return holes.where((h) => h.greenInRegulation).length;
  }

  // toJson method
  Map<String, dynamic> toJson() => {
        'courseId': courseId,
        'courseName': courseName,
        'datePlayed': datePlayed.toIso8601String(), // Convert DateTime to ISO 8601 string
        'holes': holes.map((hole) => hole.toJson()).toList(), // List of ScorecardHole JSON objects
      };

  // fromJson factory constructor
  factory GolfRound.fromJson(Map<String, dynamic> json) {
    var holesFromJson = json['holes'] as List;
    List<ScorecardHole> holesList = holesFromJson.map((i) => ScorecardHole.fromJson(i as Map<String, dynamic>)).toList();

    return GolfRound(
      courseId: json['courseId'] as String,
      courseName: json['courseName'] as String,
      datePlayed: DateTime.parse(json['datePlayed'] as String), // Parse ISO 8601 string back to DateTime
      holes: holesList,
    );
  }
}
