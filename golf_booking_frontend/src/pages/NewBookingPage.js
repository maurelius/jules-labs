import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/bookingService';
import { getAllGolfers } from '../services/golferService';
import { getAllTeeTimes } from '../services/teeTimeService';

function NewBookingPage() {
    const [golfers, setGolfers] = useState([]);
    const [teeTimes, setTeeTimes] = useState([]);
    const [selectedGolfer, setSelectedGolfer] = useState('');
    const [selectedTeeTime, setSelectedTeeTime] = useState('');
    const [numberOfPlayers, setNumberOfPlayers] = useState(1);
    
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false); // For submit button
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [golfersData, teeTimesData] = await Promise.all([
                    getAllGolfers(),
                    getAllTeeTimes() // Fetch all, then filter
                ]);
                setGolfers(golfersData);
                // Filter out tee times with 0 available slots
                setTeeTimes(teeTimesData.filter(tt => tt.available_slots > 0));
                setError(null);
            } catch (err) {
                console.error("Failed to fetch data for booking form:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleTeeTimeChange = (e) => {
        const ttId = e.target.value;
        setSelectedTeeTime(ttId);
        // Reset number of players if it exceeds the new tee time's capacity
        const teeTime = teeTimes.find(t => t.id.toString() === ttId);
        if (teeTime && numberOfPlayers > teeTime.available_slots) {
            setNumberOfPlayers(1); // Reset to 1 or teeTime.available_slots
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedGolfer || !selectedTeeTime || numberOfPlayers < 1) {
            setError("Please fill in all fields and ensure number of players is at least 1.");
            return;
        }

        const teeTime = teeTimes.find(t => t.id.toString() === selectedTeeTime);
        if (teeTime && numberOfPlayers > teeTime.available_slots) {
            setError(`Number of players cannot exceed available slots (${teeTime.available_slots}).`);
            return;
        }
        
        setFormLoading(true);
        setError(null);

        try {
            await createBooking({
                golfer: parseInt(selectedGolfer),
                tee_time: parseInt(selectedTeeTime),
                number_of_players: parseInt(numberOfPlayers)
            });
            navigate('/bookings');
        } catch (err) {
            console.error("Failed to create booking:", err);
            setError(err.message || "An unexpected error occurred.");
            alert(`Error creating booking: ${err.message}`);
        } finally {
            setFormLoading(false);
        }
    };
    
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateTimeString).toLocaleString(undefined, options);
    };

    if (loading) return <p>Loading booking form...</p>;
    if (error && !golfers.length && !teeTimes.length) return <p style={{ color: 'red' }}>Initial Error: {error}</p>;


    return (
        <div>
            <h2>Create New Booking</h2>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="golfer">Select Golfer:</label>
                    <select id="golfer" value={selectedGolfer} onChange={(e) => setSelectedGolfer(e.target.value)} required disabled={formLoading}>
                        <option value="">-- Select Golfer --</option>
                        {golfers.map(g => (
                            <option key={g.id} value={g.id}>{g.name} ({g.email})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="teeTime">Select Tee Time:</label>
                    <select id="teeTime" value={selectedTeeTime} onChange={handleTeeTimeChange} required disabled={formLoading}>
                        <option value="">-- Select Tee Time --</option>
                        {teeTimes.map(tt => (
                            <option key={tt.id} value={tt.id}>
                                {formatDateTime(tt.start_time)} - {tt.course_section} (Slots: {tt.available_slots})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="numberOfPlayers">Number of Players:</label>
                    <input
                        type="number"
                        id="numberOfPlayers"
                        value={numberOfPlayers}
                        onChange={(e) => setNumberOfPlayers(parseInt(e.target.value, 10))}
                        min="1"
                        max={selectedTeeTime ? teeTimes.find(t => t.id.toString() === selectedTeeTime)?.available_slots : 1}
                        required
                        disabled={formLoading || !selectedTeeTime}
                    />
                    {selectedTeeTime && 
                        <small> (Max: {teeTimes.find(t => t.id.toString() === selectedTeeTime)?.available_slots})</small>
                    }
                </div>

                <button type="submit" disabled={loading || formLoading || !selectedGolfer || !selectedTeeTime}>
                    {formLoading ? 'Creating Booking...' : 'Create Booking'}
                </button>
                <button type="button" onClick={() => navigate('/bookings')} style={{ marginLeft: '10px' }} disabled={formLoading}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default NewBookingPage;
