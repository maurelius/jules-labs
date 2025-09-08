import 'package:flutter/material.dart';
import 'package:golf_gps_app/models/course_model.dart';
import 'package:golf_gps_app/services/course_service.dart';
import 'package:golf_gps_app/services/gps_service.dart'; // For fetching current location
import 'package:geolocator/geolocator.dart'; // For Position object
// import 'package:golf_gps_app/screens/hole_overview_screen.dart'; // No longer directly navigating here first
import 'package:golf_gps_app/screens/scorecard_screen.dart'; // Import ScorecardScreen


class CourseSelectionScreen extends StatefulWidget {
  @override
  _CourseSelectionScreenState createState() => _CourseSelectionScreenState();
}

class _CourseSelectionScreenState extends State<CourseSelectionScreen> {
  List<Course> _courses = [];
  bool _isLoading = false;
  String? _errorMessage;
  final CourseService _courseService = CourseService();
  final GpsService _gpsService = GpsService(); 
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchCoursesByCurrentLocation();
  }

  Future<void> _fetchCoursesByCurrentLocation() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      final Position position = await _gpsService.getCurrentPosition();
      final courses = await _courseService.getCourses(
        latitude: position.latitude,
        longitude: position.longitude,
      );
      setState(() {
        _courses = courses;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to fetch courses by location: ${e.toString()}';
        _isLoading = false;
        _fetchCoursesBySearchTerm(); 
      });
    }
  }

  Future<void> _fetchCoursesBySearchTerm({String? searchTerm}) async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      final courses = await _courseService.getCourses(searchTerm: searchTerm);
      setState(() {
        _courses = courses;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to fetch courses: ${e.toString()}';
        _isLoading = false;
      });
    }
  }

  // Renamed for clarity, now navigates to ScorecardScreen
  Future<void> _startNewRound(Course courseSummary) async {
    setState(() {
      _isLoading = true; 
      _errorMessage = null;
    });
    try {
      // Fetch full course details as it might contain more hole information
      final Course courseDetails = await _courseService.getCourseDetails(courseSummary.id);
      setState(() {
        _isLoading = false;
      });
      
      // Navigate to ScorecardScreen with the detailed course object
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ScorecardScreen(course: courseDetails),
        ),
      );

    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Failed to fetch course details for round: ${e.toString()}';
      });
       showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Error"),
          content: Text('Failed to fetch course details for round: ${e.toString()}'),
          actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text('OK'))],
        )
      );
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Select a Course'),
      ),
      body: Column(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      labelText: 'Search Courses',
                      hintText: 'Enter course name or city',
                      prefixIcon: Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                    onSubmitted: (value) { 
                      _fetchCoursesBySearchTerm(searchTerm: value);
                    },
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.my_location),
                  onPressed: _fetchCoursesByCurrentLocation,
                  tooltip: 'Find courses near me',
                )
              ],
            ),
          ),
          if (_isLoading)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Center(child: CircularProgressIndicator()),
            ),
          if (_errorMessage != null)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Center(child: Text(_errorMessage!, style: TextStyle(color: Colors.red))),
            ),
          if (!_isLoading && _courses.isEmpty && _errorMessage == null)
             Padding(
              padding: const EdgeInsets.all(16.0),
              child: Center(child: Text('No courses found. Try searching or using current location.')),
            ),
          Expanded(
            child: ListView.builder(
              itemCount: _courses.length,
              itemBuilder: (context, index) {
                final course = _courses[index];
                // CourseListItem's onTap will now call _startNewRound
                return CourseListItem( 
                  course: course,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// Modify CourseListItem to call the new _startNewRound method
class CourseListItem extends StatelessWidget {
  final Course course;

  CourseListItem({required this.course});

  @override
  Widget build(BuildContext context) {
    final screenState = context.findAncestorStateOfType<_CourseSelectionScreenState>();

    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: ListTile(
        title: Text(course.name, style: TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(course.address),
        trailing: ElevatedButton( // Added a button to start the round
          child: Text('Start Round'),
          onPressed: () {
            if (screenState != null) {
              screenState._startNewRound(course); 
            } else {
              print("Error: Could not find _CourseSelectionScreenState to call _startNewRound");
            }
          },
        ),
        onTap: () { // Keep onTap for general selection if needed, or remove if button is primary
          if (screenState != null) {
            screenState._startNewRound(course); 
          } else {
            print("Error: Could not find _CourseSelectionScreenState to call _startNewRound");
          }
        },
      ),
    );
  }
}
