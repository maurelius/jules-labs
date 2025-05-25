import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:golf_gps_app/models/course_model.dart';

class CourseService {
  final String _baseUrl = 'https://api.golfcourseapi.com/api'; // Assumed base URL
  final String _apiKey = 'YOUR_API_KEY'; // Placeholder API Key

  // Helper method to handle API requests
  Future<dynamic> _makeRequest(Uri uri) async {
    try {
      final response = await http.get(uri, headers: {
        // 'Authorization': 'Bearer $_apiKey', // Common for Bearer tokens
        // Or, if the API key is passed as a query parameter or a custom header:
        // 'X-Api-Key': _apiKey, // Example custom header
      });

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else if (response.statusCode == 401) {
        throw Exception('API Key invalid or missing. Please check your API key.');
      } else if (response.statusCode == 404) {
        throw Exception('Resource not found. Please check the API endpoint.');
      }
      else {
        throw Exception('Failed to load data from API: ${response.statusCode} ${response.reasonPhrase}');
      }
    } catch (e) {
      // Handle network errors or other exceptions
      throw Exception('Failed to connect to the API: $e');
    }
  }

  Future<List<Course>> getCourses({String? searchTerm, double? latitude, double? longitude}) async {
    Uri uri;
    if (latitude != null && longitude != null) {
      // Assumed endpoint for searching by location
      // Example: /courses/nearby?lat=latitude&lon=longitude&radius=50&apikey=_apiKey
      uri = Uri.parse('$_baseUrl/courses/nearby?lat=$latitude&lon=$longitude&radius=50&apikey=$_apiKey');
    } else if (searchTerm != null && searchTerm.isNotEmpty) {
      // Assumed endpoint for searching by name
      // Example: /courses/search?name=searchTerm&apikey=_apiKey
      uri = Uri.parse('$_baseUrl/courses/search?name=${Uri.encodeComponent(searchTerm)}&apikey=$_apiKey');
    } else {
      // Default: fetch a list of courses (might be paginated or limited)
      // Example: /courses?apikey=_apiKey
      uri = Uri.parse('$_baseUrl/courses?apikey=$_apiKey');
    }

    final data = await _makeRequest(uri);

    // The actual structure of the response is unknown.
    // Assuming the API returns a list of courses directly, or a JSON object with a 'courses' key.
    // For example, if it's { "courses": [ ... ] }
    if (data is Map<String, dynamic> && data.containsKey('courses')) {
      final List<dynamic> coursesJson = data['courses'] as List<dynamic>;
      return coursesJson.map((json) => Course.fromSummaryJson(json as Map<String, dynamic>)).toList();
    }
    // Or if it's directly a list: [ { ... }, { ... } ]
    else if (data is List) {
      return data.map((json) => Course.fromSummaryJson(json as Map<String, dynamic>)).toList();
    }
    else {
      // If the structure is different, this will fail.
      // This is a major limitation of not having API documentation.
      print('Unexpected API response structure for getCourses: $data');
      throw Exception('Unexpected API response structure for getCourses.');
    }
  }

  Future<Course> getCourseDetails(String courseId) async {
    // Assumed endpoint for getting course details
    // Example: /courses/{courseId}?apikey=_apiKey
    final uri = Uri.parse('$_baseUrl/courses/$courseId?apikey=$_apiKey');
    final data = await _makeRequest(uri);

    // Assuming the API returns a single course object for details
    if (data is Map<String, dynamic>) {
      // We use Course.fromJson here as it's expected to parse detailed hole information
      return Course.fromJson(data);
    } else {
      print('Unexpected API response structure for getCourseDetails: $data');
      throw Exception('Unexpected API response structure for getCourseDetails.');
    }
  }
}
