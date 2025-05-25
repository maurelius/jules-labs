import 'package:flutter/material.dart';
import 'package:golf_gps_app/models/course_model.dart';
import 'package:golf_gps_app/models/scorecard_model.dart';
import 'package:golf_gps_app/screens/hole_overview_screen.dart'; 
import 'package:golf_gps_app/services/scorecard_persistence_service.dart'; // Import persistence service

class ScorecardScreen extends StatefulWidget {
  final Course course;

  ScorecardScreen({required this.course});

  @override
  _ScorecardScreenState createState() => _ScorecardScreenState();
}

class _ScorecardScreenState extends State<ScorecardScreen> {
  late GolfRound _currentRound;
  final ScorecardPersistenceService _persistenceService = ScorecardPersistenceService();
  bool _isLoadingSavedRound = true; // To show loading indicator while checking for saved round

  @override
  void initState() {
    super.initState();
    _loadOrCreateRound();
  }

  Future<void> _loadOrCreateRound() async {
    setState(() {
      _isLoadingSavedRound = true;
    });
    // Try to load the last round for this course
    GolfRound? savedRound = await _persistenceService.loadLastRoundForCourse(widget.course.id);
    
    if (savedRound != null) {
      // For simplicity, automatically load. Could add a prompt here.
      _currentRound = savedRound;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Resumed last saved round for ${widget.course.name}.')),
      );
    } else {
      _initializeNewRound();
    }
    setState(() {
      _isLoadingSavedRound = false;
    });
  }


  void _initializeNewRound() {
    List<ScorecardHole> scorecardHoles = [];
    if (widget.course.holes != null && widget.course.holes!.isNotEmpty) {
      for (var courseHole in widget.course.holes!) {
        scorecardHoles.add(ScorecardHole(
          holeNumber: int.tryParse(courseHole.holeNumber) ?? 0,
          par: courseHole.par,
          score: 0, // Start with 0, not par
          putts: 0,
        ));
      }
    } else {
      for (int i = 1; i <= 18; i++) {
        scorecardHoles.add(ScorecardHole(holeNumber: i, par: 4, score: 0, putts: 0));
      }
    }

    _currentRound = GolfRound(
      courseId: widget.course.id,
      courseName: widget.course.name,
      datePlayed: DateTime.now(),
      holes: scorecardHoles,
    );
  }

  Future<void> _saveCurrentRound() async {
    await _persistenceService.saveRound(_currentRound);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Round Saved for ${widget.course.name}!')),
    );
  }

  void _updateScore(int holeIndex, int newScore) {
    if (newScore >= 0) { 
      setState(() {
        _currentRound.holes[holeIndex].score = newScore;
      });
    }
  }

  void _updatePutts(int holeIndex, int newPutts) {
     if (newPutts >= 0) {
      setState(() {
        _currentRound.holes[holeIndex].putts = newPutts;
      });
    }
  }

  void _updateFairwayHit(int holeIndex, FairwayHitStatus status) {
    setState(() {
      _currentRound.holes[holeIndex].fairwayHit = status;
    });
  }

  void _updateGreenInRegulation(int holeIndex, bool gir) {
    setState(() {
      _currentRound.holes[holeIndex].greenInRegulation = gir;
    });
  }

  void _navigateToHoleOverview(int holeIndex) {
    if (widget.course.holes != null && holeIndex < widget.course.holes!.length) {
      final CourseHole courseHole = widget.course.holes![holeIndex];
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => HoleOverviewScreen(
            course: widget.course,
            hole: courseHole,
          ),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Detailed map data not available for this hole.')),
      );
    }
  }


  Widget _buildScorecardRow(int index, ScorecardHole holeData) {
    TextEditingController scoreController = TextEditingController(text: holeData.score > 0 ? holeData.score.toString() : '');
    TextEditingController puttsController = TextEditingController(text: holeData.putts > 0 ? holeData.putts.toString() : '');

    return DataRow(cells: [
      DataCell(
        GestureDetector(
          onTap: () => _navigateToHoleOverview(index),
          child: Text(holeData.holeNumber.toString(), style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).primaryColor)),
        ),
      ),
      DataCell(Text(holeData.par.toString())),
      DataCell(
        SizedBox(
          width: 50,
          child: TextField(
            controller: scoreController,
            keyboardType: TextInputType.number,
            textAlign: TextAlign.center,
            decoration: InputDecoration(border: InputBorder.none),
            onSubmitted: (value) => _updateScore(index, int.tryParse(value) ?? 0), // Default to 0 if parse fails
            onTap: () => scoreController.selection = TextSelection(baseOffset: 0, extentOffset: scoreController.text.length),
          ),
        )
      ),
      DataCell(
        SizedBox(
          width: 50,
          child: TextField(
            controller: puttsController,
            keyboardType: TextInputType.number,
            textAlign: TextAlign.center,
            decoration: InputDecoration(border: InputBorder.none),
            onSubmitted: (value) => _updatePutts(index, int.tryParse(value) ?? 0),
            onTap: () => puttsController.selection = TextSelection(baseOffset: 0, extentOffset: puttsController.text.length),
          ),
        )
      ),
      DataCell(
        DropdownButton<FairwayHitStatus>(
          value: holeData.fairwayHit,
          items: FairwayHitStatus.values.map((FairwayHitStatus status) {
            String statusText = '';
            switch(status) {
              case FairwayHitStatus.Hit: statusText = 'Hit'; break;
              case FairwayHitStatus.MissedLeft: statusText = 'Left'; break;
              case FairwayHitStatus.MissedRight: statusText = 'Right'; break;
              case FairwayHitStatus.NotApplicable: statusText = 'N/A'; break;
            }
            return DropdownMenuItem<FairwayHitStatus>(
              value: status,
              child: Text(statusText, style: TextStyle(fontSize: 12)),
            );
          }).toList(),
          onChanged: (FairwayHitStatus? newValue) {
            if (newValue != null) {
              _updateFairwayHit(index, newValue);
            }
          },
        ),
      ),
      DataCell(
        Checkbox(
          value: holeData.greenInRegulation,
          onChanged: (bool? newValue) {
            if (newValue != null) {
              _updateGreenInRegulation(index, newValue);
            }
          },
        ),
      ),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoadingSavedRound) {
      return Scaffold(
        appBar: AppBar(title: Text('Scorecard - ${widget.course.name}')),
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Scorecard - ${widget.course.name}'),
      ),
      body: SingleChildScrollView( 
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text("Date: ${_currentRound.datePlayed.toLocal().toString().split(' ')[0]}", style: TextStyle(fontSize: 16)),
            ),
            DataTable(
              columnSpacing: 10.0, 
              columns: const [
                DataColumn(label: Text('Hole', style: TextStyle(fontWeight: FontWeight.bold))),
                DataColumn(label: Text('Par', style: TextStyle(fontWeight: FontWeight.bold))),
                DataColumn(label: Text('Score', style: TextStyle(fontWeight: FontWeight.bold))),
                DataColumn(label: Text('Putts', style: TextStyle(fontWeight: FontWeight.bold))),
                DataColumn(label: Text('Fairway', style: TextStyle(fontWeight: FontWeight.bold))),
                DataColumn(label: Text('GIR', style: TextStyle(fontWeight: FontWeight.bold))),
              ],
              rows: _currentRound.holes
                  .asMap()
                  .entries
                  .map((entry) => _buildScorecardRow(entry.key, entry.value))
                  .toList(),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Totals:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  SizedBox(height: 8),
                  Text('Total Score: ${_currentRound.totalScore} (${_currentRound.totalScoreAgainstPar > 0 ? "+" : ""}${_currentRound.totalScoreAgainstPar} to Par)', style: TextStyle(fontSize: 16)),
                  Text('Total Putts: ${_currentRound.totalPutts}', style: TextStyle(fontSize: 16)),
                  Text('Fairways Hit: ${_currentRound.totalFairwaysHit} of ${_currentRound.totalFairwayOpportunities}', style: TextStyle(fontSize: 16)),
                  Text('Greens in Regulation: ${_currentRound.totalGreensInRegulation} of ${_currentRound.holes.length}', style: TextStyle(fontSize: 16)),
                ],
              ),
            ),
             Padding(
              padding: const EdgeInsets.all(16.0),
              child: ElevatedButton(
                child: Text('Save Round'),
                onPressed: _saveCurrentRound, // Call the save method
              ),
            )
          ],
        ),
      ),
    );
  }
}
