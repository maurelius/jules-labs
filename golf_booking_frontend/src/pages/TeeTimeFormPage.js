import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeeTimeById, createTeeTime, updateTeeTime } from '../services/teeTimeService';

function TeeTimeFormPage() {
    const { id } = useParams(); // For edit mode
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [teeTime, setTeeTime] = useState({
        start_time: '', // Format: YYYY-MM-DDTHH:MM
        course_section: 'Main Course',
        available_slots: 4,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper to format date for datetime-local input
    const formatDateTimeForInput = (isoString) => {
        if (!isoString) return '';
        // Converts ISO string to 'YYYY-MM-DDTHH:MM'
        try {
            const date = new Date(isoString);
            // Adjust for timezone offset to display local time correctly in input
            const timezoneOffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
            const localDate = new Date(date.getTime() - timezoneOffset);
            return localDate.toISOString().slice(0, 16);
        } catch (e) {
            console.error("Error formatting date for input:", e);
            return '';
        }
    };
    
    // Helper to format date back to ISO string for backend
    const formatDateTimeForBackend = (inputString) => {
        if (!inputString) return null;
        // Assuming inputString is 'YYYY-MM-DDTHH:MM' in local time
        // Convert it to an ISO string (UTC)
        try {
            const date = new Date(inputString);
            return date.toISOString();
        } catch (e) {
            console.error("Error formatting date for backend:", e);
            return null;
        }
    };


    useEffect(() => {
        if (isEditMode && id) {
            setLoading(true);
            getTeeTimeById(id)
                .then(data => {
                    setTeeTime({
                        ...data,
                        start_time: formatDateTimeForInput(data.start_time),
                    });
                    setError(null);
                })
                .catch(err => {
                    setError(err.message);
                    console.error(`Failed to fetch tee time ${id}:`, err);
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setTeeTime(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...teeTime,
            start_time: formatDateTimeForBackend(teeTime.start_time),
        };
        
        if (!payload.start_time) {
            setError("Invalid start time format.");
            setLoading(false);
            alert("Error: Invalid start time. Please ensure it's correctly formatted.");
            return;
        }

        try {
            if (isEditMode) {
                await updateTeeTime(id, payload);
            } else {
                await createTeeTime(payload);
            }
            navigate('/teetimes');
        } catch (err) {
            setError(err.message);
            console.error('Failed to save tee time:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <p>Loading tee time details...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h2>{isEditMode ? 'Edit Tee Time' : 'Add New Tee Time'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="start_time">Start Time:</label>
                    <input
                        type="datetime-local"
                        id="start_time"
                        name="start_time"
                        value={teeTime.start_time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="course_section">Course Section:</label>
                    <input
                        type="text"
                        id="course_section"
                        name="course_section"
                        value={teeTime.course_section}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="available_slots">Available Slots:</label>
                    <input
                        type="number"
                        id="available_slots"
                        name="available_slots"
                        value={teeTime.available_slots}
                        onChange={handleChange}
                        min="0"
                        max="4" // Assuming typical max slots
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Tee Time')}
                </button>
                <button type="button" onClick={() => navigate('/teetimes')} style={{ marginLeft: '10px' }} disabled={loading}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default TeeTimeFormPage;
