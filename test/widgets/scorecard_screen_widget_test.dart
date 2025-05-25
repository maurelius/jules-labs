import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:golf_gps_app/models/course_model.dart';
import 'package:golf_gps_app/models/scorecard_model.dart';
import 'package:golf_gps_app/screens/scorecard_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  // Mock SharedPreferences for ScorecardScreen's persistence service
  setUpAll(() async {
    SharedPreferences.setMockInitialValues({});
  });

  group('ScorecardScreen Widget Tests (Basic)', () {
    late Course sampleCourseWithHoles;
    late Course sampleCourseWithoutHoles;

    setUp(() {
      sampleCourseWithHoles = Course(
        id: 'course_with_holes_id',
        name: 'Grand Golf Club',
        address: '789 Golf Avenue',
        holes: List.generate(
          18,
          (index) => Hole(
            holeNumber: (index + 1).toString(),
            par: (index % 3) + 3, // Pars 3, 4, 5 repeating
            teeBoxes: [TeeBox(name: 'Men\'s', yardage: 350 + index * 10)],
            green: Green(middle: GpsCoordinates(latitude: 34.0 + index * 0.001, longitude: -118.0 - index * 0.001)),
          ),
        ),
      );

      sampleCourseWithoutHoles = Course(
        id: 'course_no_holes_id',
        name: 'Simpler Times GC',
        address: '456 Old Rd',
        // holes is null or empty for this course
      );
    });

    testWidgets('Displays course name and date', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: ScorecardScreen(course: sampleCourseWithHoles)));
      await tester.pumpAndSettle(); // Allow for async operations in initState (like loading round)

      expect(find.text('Scorecard - Grand Golf Club'), findsOneWidget); // AppBar title
      // Check for date display (format might vary slightly based on locale, so check for prefix)
      expect(find.textContaining('Date: ${DateTime.now().toLocal().toString().split(' ')[0]}'), findsOneWidget);
    });

    testWidgets('Displays DataTable for scoring', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: ScorecardScreen(course: sampleCourseWithHoles)));
      await tester.pumpAndSettle();

      expect(find.byType(DataTable), findsOneWidget);
      // Check for column headers
      expect(find.text('Hole'), findsOneWidget);
      expect(find.text('Par'), findsOneWidget);
      expect(find.text('Score'), findsOneWidget);
      expect(find.text('Putts'), findsOneWidget);
      expect(find.text('Fairway'), findsOneWidget);
      expect(find.text('GIR'), findsOneWidget);
    });

    testWidgets('Displays correct number of hole rows (with course hole data)', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: ScorecardScreen(course: sampleCourseWithHoles)));
      await tester.pumpAndSettle();

      // sampleCourseWithHoles has 18 holes
      // Find DataRow widgets. There will be 18 rows for holes.
      // The DataTable itself is one widget, its rows are internal.
      // We check for the content of the rows, e.g., hole numbers.
      expect(find.text('1'), findsOneWidget); // Hole 1
      expect(find.text('18'), findsOneWidget); // Hole 18
      expect(find.text('19'), findsNothing); // Hole 19 should not exist
    });
    
    testWidgets('Displays default 18 hole rows (without course hole data)', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: ScorecardScreen(course: sampleCourseWithoutHoles)));
      await tester.pumpAndSettle();

      // sampleCourseWithoutHoles has no explicit hole data, should default to 18
      expect(find.text('1'), findsOneWidget); // Hole 1
      expect(find.text('18'), findsOneWidget); // Hole 18
      expect(find.text('19'), findsNothing); // Hole 19 should not exist
    });

    testWidgets('Score input field updates score', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: ScorecardScreen(course: sampleCourseWithHoles)));
      await tester.pumpAndSettle();

      // Find the score TextField for the first hole.
      // This is tricky as TextFields in a DataTable don't have unique easy finders.
      // We find it by its initial value (which is '0' after initState if not loaded)
      // Or, if we set a default, then that. The current code defaults score to 0.
      final firstHoleScoreField = find.widgetWithText(TextField, ''); // Assuming it's empty or '0'
      // More robust: find all TextFields, take the first one in the 'Score' column.
      // For simplicity, let's assume the first TextField we find that's part of a DataRow is it.
      
      // Find all TextField widgets within DataRow widgets.
      final dataRowTextFields = find.descendant(
        of: find.byType(DataRow),
        matching: find.byType(TextField),
      );

      // The first TextField in the first DataRow should be for the score of hole 1.
      // The second TextField in the first DataRow should be for putts of hole 1.
      // So, we expect at least 2 * 18 = 36 such TextFields for an 18 hole course.
      expect(dataRowTextFields, findsAtLeastNWidgets(36)); 
      
      // Tap into the first score field (0th overall TextField in the rows)
      await tester.enterText(dataRowTextFields.at(0), '5');
      await tester.testTextInput.receiveAction(TextInputAction.done); // Simulate done action
      await tester.pumpAndSettle();

      // Verify the displayed total score reflects the change.
      // Par for hole 1 is 3. Score is 5. Diff is +2. Other 17 holes score 0, par (index%3)+3.
      // Total score will be 5.
      // Total score against par will be +2.
      expect(find.textContaining('Total Score: 5 (+2 to Par)'), findsOneWidget);

      // Enter score for second hole
      // Par for hole 2 is 4. Let's score a 3.
      // Score field for hole 2 is the 2nd score field (index 2 in dataRowTextFields)
      await tester.enterText(dataRowTextFields.at(2), '3');
      await tester.testTextInput.receiveAction(TextInputAction.done);
      await tester.pumpAndSettle();

      // Total score: 5 (hole 1) + 3 (hole 2) = 8
      // Total score against par: +2 (hole 1) + (-1) (hole 2) = +1
      expect(find.textContaining('Total Score: 8 (+1 to Par)'), findsOneWidget);
    });

    testWidgets('Save Round button exists', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(home: ScorecardScreen(course: sampleCourseWithHoles)));
      await tester.pumpAndSettle();
      expect(find.widgetWithText(ElevatedButton, 'Save Round'), findsOneWidget);
      // Tapping it would show a SnackBar, which can also be tested.
      // await tester.tap(find.widgetWithText(ElevatedButton, 'Save Round'));
      // await tester.pump(); // pump once for SnackBar animation
      // await tester.pump(); // pump again
      // expect(find.text('Round Saved for Grand Golf Club!'), findsOneWidget);
    });

  });
}
