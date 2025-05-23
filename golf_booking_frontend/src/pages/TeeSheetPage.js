import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllTeeTimes, deleteTeeTime } from '../services/teeTimeService';

function TeeSheetPage() {
    const [teeTimes, setTeeTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeeTimes();
    }, []);

    const fetchTeeTimes = async () => {
        try {
            setLoading(true);
            // Assuming the service handles default sorting or API sorts by start_time
            const data = await getAllTeeTimes({ ordering: 'start_time' });
            setTeeTimes(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch tee times:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tee time?')) {
            try {
                await deleteTeeTime(id);
                fetchTeeTimes(); // Refresh the list
            } catch (err) {
                setError(err.message);
                console.error("Failed to delete tee time:", err);
                alert(`Failed to delete tee time: ${err.message}`);
            }
        }
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(dateTimeString).toLocaleString(undefined, options);
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateTimeString; // return original if formatting fails
        }
    };

    if (loading) return <p>Loading tee times...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h2>Tee Sheet</h2>
            <Link to="/teetimes/new">
                <button style={{ marginBottom: '20px' }}>Add New Tee Time</button>
            </Link>
            {teeTimes.length === 0 && !loading && <p>No tee times found. Add some!</p>}
            {teeTimes.length > 0 && (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Start Time</th>
                            <th>Course Section</th>
                            <th>Available Slots</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teeTimes.map((teeTime) => (
                            <tr key={teeTime.id}>
                                <td>{formatDateTime(teeTime.start_time)}</td>
                                <td>{teeTime.course_section}</td>
                                <td>{teeTime.available_slots}</td>
                                <td>
                                    <button onClick={() => navigate(`/teetimes/edit/${teeTime.id}`)} style={{ marginRight: '5px' }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(teeTime.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TeeSheetPage;
