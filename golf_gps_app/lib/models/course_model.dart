// Represents GPS coordinates
class GpsCoordinates {
  final double latitude;
  final double longitude;

  GpsCoordinates({required this.latitude, required this.longitude});

  factory GpsCoordinates.fromJson(Map<String, dynamic> json) {
    return GpsCoordinates(
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

// Represents a Tee Box for a hole
class TeeBox {
  final String name; // e.g., "Championship", "Men's", "Ladies'"
  final int yardage;
  final GpsCoordinates? coordinates; // Optional GPS data for the tee box

  TeeBox({required this.name, required this.yardage, this.coordinates});

  factory TeeBox.fromJson(Map<String, dynamic> json) {
    return TeeBox(
      name: json['name'] as String? ?? 'Default Tee',
      yardage: (json['yardage'] as num?)?.toInt() ?? 0,
      coordinates: json['coordinates'] != null
          ? GpsCoordinates.fromJson(json['coordinates'] as Map<String, dynamic>)
          : null,
    );
  }
}

// Represents the Green area for a hole
class Green {
  final GpsCoordinates? front;
  final GpsCoordinates? middle;
  final GpsCoordinates? back;
  // Alternatively, could be a list of GpsCoordinates for a polygon
  // final List<GpsCoordinates>? polygon;

  Green({this.front, this.middle, this.back});

  factory Green.fromJson(Map<String, dynamic> json) {
    return Green(
      front: json['front'] != null
          ? GpsCoordinates.fromJson(json['front'] as Map<String, dynamic>)
          : null,
      middle: json['middle'] != null
          ? GpsCoordinates.fromJson(json['middle'] as Map<String, dynamic>)
          : null,
      back: json['back'] != null
          ? GpsCoordinates.fromJson(json['back'] as Map<String, dynamic>)
          : null,
    );
  }
}

// Represents a single Hole on a golf course
class Hole {
  final String holeNumber; // e.g., "1", "10"
  final int par;
  final List<TeeBox> teeBoxes;
  final Green? green; // GPS data for the green

  Hole({
    required this.holeNumber,
    required this.par,
    this.teeBoxes = const [],
    this.green,
  });

  factory Hole.fromJson(Map<String, dynamic> json) {
    var teeBoxesList = json['teeBoxes'] as List?;
    List<TeeBox> _teeBoxes = teeBoxesList != null
        ? teeBoxesList.map((i) => TeeBox.fromJson(i as Map<String, dynamic>)).toList()
        : [];

    return Hole(
      holeNumber: json['holeNumber'] as String? ?? 'N/A',
      par: (json['par'] as num?)?.toInt() ?? 0,
      teeBoxes: _teeBoxes,
      green: json['green'] != null
          ? Green.fromJson(json['green'] as Map<String, dynamic>)
          : null,
    );
  }
}

// Represents a Golf Course
class Course {
  final String id;
  final String name;
  final String address;
  final String? phoneNumber;
  final String? website;
  final List<Hole>? holes; // Detailed hole information
  final GpsCoordinates? coordinates; // GPS coordinates for the course itself

  Course({
    required this.id,
    required this.name,
    required this.address,
    this.phoneNumber,
    this.website,
    this.holes,
    this.coordinates,
  });

  // Factory constructor to create a Course from JSON
  // This will be used when parsing the API response
  factory Course.fromJson(Map<String, dynamic> json) {
    var holesList = json['holes'] as List?;
    List<Hole> _holes = holesList != null
        ? holesList.map((i) => Hole.fromJson(i as Map<String, dynamic>)).toList()
        : [];

    return Course(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? 'Unknown Course',
      address: json['address'] as String? ?? 'No address provided',
      phoneNumber: json['phoneNumber'] as String?,
      website: json['website'] as String?,
      holes: _holes.isNotEmpty ? _holes : null,
      coordinates: json['coordinates'] != null
          ? GpsCoordinates.fromJson(json['coordinates'] as Map<String, dynamic>)
          : null,
    );
  }

  // A method to create a "summary" course, used for lists where details aren't needed
  factory Course.fromSummaryJson(Map<String, dynamic> json) {
    return Course(
      id: json['courseId'] as String? ?? json['id'] as String? ?? '', // API might use 'courseId' or 'id'
      name: json['courseName'] as String? ?? json['name'] as String? ?? 'Unknown Course', // API might use 'courseName' or 'name'
      address: json['address'] as String? ?? 'No address provided',
      coordinates: json['coordinates'] != null
          ? GpsCoordinates.fromJson(json['coordinates'] as Map<String, dynamic>)
          : (json['lat'] != null && json['lng'] != null) // Some APIs might return lat/lng directly
              ? GpsCoordinates(latitude: (json['lat'] as num).toDouble(), longitude: (json['lng'] as num).toDouble())
              : null,
    );
  }
}
