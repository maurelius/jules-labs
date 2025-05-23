import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBookings, deleteBooking } from '../services/bookingService';

function BookingListPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getAllBookings();
            // The backend should sort by booking_time or tee_time by default,
            // or we can sort here if needed: data.sort((a, b) => new Date(b.booking_time) - new Date(a.booking_time));
            setBookings(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await deleteBooking(id);
                fetchBookings(); // Refresh the list
            } catch (err) {
                setError(err.message);
                console.error("Failed to cancel booking:", err);
                alert(`Failed to cancel booking: ${err.message}`);
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
            return dateTimeString;
        }
    };

    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h2>Bookings</h2>
            <Link to="/bookings/new">
                <button style={{ marginBottom: '20px' }}>Create New Booking</button>
            </Link>
            {bookings.length === 0 && !loading && <p>No bookings found. Create one!</p>}
            {bookings.length > 0 && (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Golfer Name</th>
                            <th>Golfer Email</th>
                            <th>Tee Time</th>
                            <th>Course Section</th>
                            <th>Players</th>
                            <th>Booking Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.golfer?.name || 'N/A'}</td>
                                <td>{booking.golfer?.email || 'N/A'}</td>
                                <td>{formatDateTime(booking.tee_time?.start_time)}</td>
                                <td>{booking.tee_time?.course_section || 'N/A'}</td>
                                <td>{booking.number_of_players}</td>
                                <td>{formatDateTime(booking.booking_time)}</td>
                                <td>
                                    <button onClick={() => handleCancelBooking(booking.id)}>
                                        Cancel Booking
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

export default BookingListPage;
