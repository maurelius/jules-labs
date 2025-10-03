const API_URL = 'http://localhost:8000/api/bookings/';

export const getAllBookings = async () => {
    try {
        console.log('Attempting to fetch bookings from:', API_URL);
        const response = await fetch(API_URL);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
            throw new Error(
                `Failed to fetch bookings: ${response.status} ${response.statusText}` +
                ` - ${JSON.stringify(data)}`
            );
        }
        return data;
    } catch (error) {
        console.error('Booking fetch error:', error);
        throw error;
    }
};

export const createBooking = async (bookingData) => {
    // bookingData should be { tee_time: teeTimeId, golfer: golferId, number_of_players: count }
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        // The backend might return errors in a specific format, e.g., errorData.detail or errorData.non_field_errors
        const errorMessage = errorData.detail || errorData.non_field_errors || JSON.stringify(errorData);
        throw new Error(errorMessage || 'Failed to create booking');
    }
    return await response.json();
};

export const deleteBooking = async (id) => {
    const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) { // 204 No Content is a success for delete
        throw new Error(`Failed to delete booking with id ${id}`);
    }
    if (response.status === 204) {
        return null; // Or a success message/status
    }
    // It's unusual for DELETE to return a body, but handle if it does
    return await response.json(); 
};
