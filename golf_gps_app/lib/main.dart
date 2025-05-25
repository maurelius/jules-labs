import 'package:flutter/material.dart';
import 'package:golf_gps_app/screens/home_screen.dart'; // Assuming this path is correct

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Golf GPS App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: HomeScreen(), // Set HomeScreen as the initial screen
    );
  }
}
