import 'package:flutter/material.dart';
import 'package:golf_gps_app/models/course_model.dart';

class CourseListItem extends StatelessWidget {
  final Course course;

  CourseListItem({required this.course});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: ListTile(
        title: Text(course.name, style: TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(course.address),
        onTap: () {
          // TODO: Implement navigation to course details screen or selection action
          print('Selected course: ${course.name}');
        },
      ),
    );
  }
}
