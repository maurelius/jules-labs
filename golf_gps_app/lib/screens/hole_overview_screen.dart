import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:golf_gps_app/models/course_model.dart';
import 'package:latlong2/latlong.dart'; // For LatLng objects
import 'package:geolocator/geolocator.dart'; // For distance calculation

class HoleOverviewScreen extends StatefulWidget {
  final Course course;
  final Hole hole;

  HoleOverviewScreen({required this.course, required this.hole});

  @override
  _HoleOverviewScreenState createState() => _HoleOverviewScreenState();
}

class _HoleOverviewScreenState extends State<HoleOverviewScreen> {
  LatLng? _targetLocation;
  TeeBox? _selectedTeeBox;
  double? _yardageToTarget;
  Map<String, double> _yardagesToGreen = {}; // To store yardages to front, middle, back

  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    // Default to the first tee box if available
    if (widget.hole.teeBoxes.isNotEmpty) {
      _selectedTeeBox = widget.hole.teeBoxes.first;
    }
    _calculateYardagesToGreen();
  }

  LatLng? _getInitialCenter() {
    if (widget.hole.green?.middle != null) {
      return LatLng(widget.hole.green!.middle!.latitude, widget.hole.green!.middle!.longitude);
    }
    if (widget.hole.green?.front != null) {
      return LatLng(widget.hole.green!.front!.latitude, widget.hole.green!.front!.longitude);
    }
    if (widget.hole.green?.back != null) {
      return LatLng(widget.hole.green!.back!.latitude, widget.hole.green!.back!.longitude);
    }
    if (_selectedTeeBox?.coordinates != null) {
      return LatLng(_selectedTeeBox!.coordinates!.latitude, _selectedTeeBox!.coordinates!.longitude);
    }
    if (widget.hole.teeBoxes.isNotEmpty && widget.hole.teeBoxes.first.coordinates != null) {
      return LatLng(widget.hole.teeBoxes.first.coordinates!.latitude, widget.hole.teeBoxes.first.coordinates!.longitude);
    }
    if (widget.course.coordinates != null) {
      return LatLng(widget.course.coordinates!.latitude, widget.course.coordinates!.longitude);
    }
    return LatLng(0, 0);
  }

  void _handleMapTap(TapPosition tapPosition, LatLng latLng) {
    setState(() {
      _targetLocation = latLng;
      _calculateYardageToTarget();
    });
  }

  void _calculateYardageToTarget() {
    if (_targetLocation != null && _selectedTeeBox?.coordinates != null) {
      final distanceInMeters = Geolocator.distanceBetween(
        _selectedTeeBox!.coordinates!.latitude,
        _selectedTeeBox!.coordinates!.longitude,
        _targetLocation!.latitude,
        _targetLocation!.longitude,
      );
      setState(() {
        _yardageToTarget = distanceInMeters * 1.09361; // Convert meters to yards
      });
    } else {
      setState(() {
        _yardageToTarget = null;
      });
    }
  }

  void _calculateYardagesToGreen() {
    _yardagesToGreen.clear();
    if (_selectedTeeBox?.coordinates == null) return;

    final teeLat = _selectedTeeBox!.coordinates!.latitude;
    final teeLng = _selectedTeeBox!.coordinates!.longitude;

    if (widget.hole.green?.front?.latitude != null) {
      final distance = Geolocator.distanceBetween(
          teeLat, teeLng, widget.hole.green!.front!.latitude, widget.hole.green!.front!.longitude);
      _yardagesToGreen['Front'] = distance * 1.09361;
    }
    if (widget.hole.green?.middle?.latitude != null) {
      final distance = Geolocator.distanceBetween(
          teeLat, teeLng, widget.hole.green!.middle!.latitude, widget.hole.green!.middle!.longitude);
      _yardagesToGreen['Middle'] = distance * 1.09361;
    }
    if (widget.hole.green?.back?.latitude != null) {
      final distance = Geolocator.distanceBetween(
          teeLat, teeLng, widget.hole.green!.back!.latitude, widget.hole.green!.back!.longitude);
      _yardagesToGreen['Back'] = distance * 1.09361;
    }
    setState(() {}); // Update UI with new green yardages
  }


  List<Marker> _buildMarkers() {
    final List<Marker> markers = [];
    bool hasDetailedMarkers = false;

    // Add markers for tee boxes
    for (var teeBox in widget.hole.teeBoxes) {
      if (teeBox.coordinates != null) {
        markers.add(
          Marker(
            width: 80.0,
            height: 80.0,
            point: LatLng(teeBox.coordinates!.latitude, teeBox.coordinates!.longitude),
            child: Column(
              children: [
                Icon(Icons.sports_golf, color: (_selectedTeeBox == teeBox) ? Colors.yellow : Colors.blue, size: 30.0),
                Text(teeBox.name, style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 10))
              ],
            )
          ),
        );
        hasDetailedMarkers = true;
      }
    }

    // Add markers for green (front, middle, back if available)
    if (widget.hole.green?.front != null) {
      markers.add(
        Marker(
          width: 80.0,
          height: 80.0,
          point: LatLng(widget.hole.green!.front!.latitude, widget.hole.green!.front!.longitude),
          child: Column(
            children: [
              Icon(Icons.flag, color: Colors.red.shade300, size: 30.0),
              Text("Front", style: TextStyle(color: Colors.red.shade700, fontWeight: FontWeight.bold, fontSize: 10))
            ]
          ),
        ),
      );
      hasDetailedMarkers = true;
    }
    if (widget.hole.green?.middle != null) {
      markers.add(
        Marker(
          width: 80.0,
          height: 80.0,
          point: LatLng(widget.hole.green!.middle!.latitude, widget.hole.green!.middle!.longitude),
          child: Column(
            children: [
              Icon(Icons.flag, color: Colors.green, size: 30.0),
               Text("Middle", style: TextStyle(color: Colors.green.shade700, fontWeight: FontWeight.bold, fontSize: 10))
            ]
          )
        ),
      );
      hasDetailedMarkers = true;
    }
    if (widget.hole.green?.back != null) {
      markers.add(
        Marker(
          width: 80.0,
          height: 80.0,
          point: LatLng(widget.hole.green!.back!.latitude, widget.hole.green!.back!.longitude),
          child: Column(
            children: [
              Icon(Icons.flag, color: Colors.black54, size: 30.0),
              Text("Back", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 10))
            ]
          )
        ),
      );
      hasDetailedMarkers = true;
    }
    
    if (!hasDetailedMarkers && widget.course.coordinates != null) {
        markers.add(
             Marker(
                width: 80.0,
                height: 80.0,
                point: LatLng(widget.course.coordinates!.latitude, widget.course.coordinates!.longitude),
                child: Column(
                  children: [
                    Icon(Icons.golf_course, color: Colors.purple, size: 30.0),
                    Text(widget.course.name, style: TextStyle(color: Colors.purple, fontSize: 10), textAlign: TextAlign.center,)
                  ]
                )
            )
        );
    }

    // Add target marker if set
    if (_targetLocation != null) {
      markers.add(
        Marker(
          width: 80.0,
          height: 80.0,
          point: _targetLocation!,
          child: Column(
            children: [
              Icon(Icons.location_pin, color: Colors.orange, size: 35.0),
              Text("Target", style: TextStyle(color: Colors.orange.shade700, fontWeight: FontWeight.bold, fontSize: 10))
            ]
          )
        ),
      );
    }
    return markers;
  }

  Widget _buildTeeBoxSelector() {
    if (widget.hole.teeBoxes.where((tb) => tb.coordinates != null).toList().isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Text("No GPS data for tee boxes.", style: TextStyle(color: Colors.red)),
      );
    }

    // Filter tee boxes that have coordinates
    List<TeeBox> availableTeeBoxes = widget.hole.teeBoxes.where((tb) => tb.coordinates != null).toList();
    
    // Ensure _selectedTeeBox is one of the available ones or default to first if current is null or lacks coords
    if (_selectedTeeBox == null || _selectedTeeBox!.coordinates == null) {
        _selectedTeeBox = availableTeeBoxes.isNotEmpty ? availableTeeBoxes.first : null;
         // Recalculate distances if the selected tee box changed due to this fallback
        WidgetsBinding.instance.addPostFrameCallback((_) {
          _calculateYardagesToGreen();
          _calculateYardageToTarget();
        });
    }


    return DropdownButton<TeeBox>(
      value: _selectedTeeBox,
      hint: Text("Select Tee Box"),
      isExpanded: true,
      items: availableTeeBoxes.map((TeeBox teeBox) {
        return DropdownMenuItem<TeeBox>(
          value: teeBox,
          child: Text('${teeBox.name} (${teeBox.yardage} yds)'), // Assuming yardage is defined for the tee itself
        );
      }).toList(),
      onChanged: (TeeBox? newValue) {
        if (newValue != null) {
          setState(() {
            _selectedTeeBox = newValue;
            _calculateYardageToTarget();
            _calculateYardagesToGreen();
          });
        }
      },
    );
  }


  @override
  Widget build(BuildContext context) {
    final initialCenter = _getInitialCenter();
    final markers = _buildMarkers();
    bool hasGpsDataForHole = markers.any((m) {
      if (m.child is Column) {
        final columnChildren = (m.child as Column).children;
        return columnChildren.any((child) => child is Icon && (child.icon == Icons.sports_golf || child.icon == Icons.flag));
      }
      return false;
    });

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.course.name} - Hole ${widget.hole.holeNumber} (Par ${widget.hole.par})'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: _buildTeeBoxSelector(),
          ),
          if (!hasGpsDataForHole && initialCenter == LatLng(0,0))
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                'No GPS data available for this hole or course.',
                style: TextStyle(color: Colors.red, fontSize: 16),
                textAlign: TextAlign.center,
              ),
            )
          else if (!hasGpsDataForHole)
             Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                'Detailed GPS data for tees and green not available for this hole. Showing course location.',
                style: TextStyle(color: Colors.orange, fontSize: 16),
                textAlign: TextAlign.center,
              ),
            ),
          Expanded(
            child: FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: initialCenter!,
                initialZoom: (initialCenter == LatLng(0,0) || !hasGpsDataForHole) ? 14.0 : 17.0,
                onTap: _handleMapTap, // Handle map taps
              ),
              children: [
                OpenStreetMapTileLayer(),
                if (markers.isNotEmpty) MarkerLayer(markers: markers),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_yardageToTarget != null)
                  Text(
                    'To Target: ${_yardageToTarget!.toStringAsFixed(0)} yards',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.orange.shade800),
                  ),
                SizedBox(height: 8),
                Text('To Green:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                if (_yardagesToGreen.isEmpty && _selectedTeeBox?.coordinates != null)
                    Text("  No GPS data for green elements.", style: TextStyle(fontSize: 14, fontStyle: FontStyle.italic))
                else if (_selectedTeeBox?.coordinates == null)
                    Text("  Select a tee box with GPS data to see green yardages.", style: TextStyle(fontSize: 14, fontStyle: FontStyle.italic))
                else
                    ..._yardagesToGreen.entries.map((entry) => Text(
                        '  ${entry.key}: ${entry.value.toStringAsFixed(0)} yards',
                        style: TextStyle(fontSize: 14),
                    )),
              ],
            ),
          )
        ],
      ),
    );
  }
}
