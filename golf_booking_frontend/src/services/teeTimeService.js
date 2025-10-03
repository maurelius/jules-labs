import { API_URL } from '../config';

export const getAllTeeTimes = async () => {
    try {
        const response = await fetch(`${API_URL}/api/teetimes/?ordering=start_time`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                `Failed to fetch tee times: ${response.status} ${response.statusText}` +
                (errorData ? ` - ${JSON.stringify(errorData)}` : '')
            );
        }

        const data = await response.json();
        console.log('Fetched tee times:', data); // Debug log
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching tee times:', error);
        throw error;
    }
};

export const getTeeTimeById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/teetimes/${id}/`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                `Failed to fetch tee time: ${response.status} ${response.statusText}` +
                (errorData ? ` - ${JSON.stringify(errorData)}` : '')
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching tee time:', error);
        throw error;
    }
};

export const createTeeTime = async (teeTimeData) => {
    try {
        console.log('Creating tee time with data:', teeTimeData); // Debug log
        const response = await fetch(`${API_URL}/api/teetimes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teeTimeData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                `Failed to create tee time: ${response.status} ${response.statusText}` +
                (errorData ? ` - ${JSON.stringify(errorData)}` : '')
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating tee time:', error);
        throw error;
    }
};

export const updateTeeTime = async (id, teeTimeData) => {
    try {
        const response = await fetch(`${API_URL}/api/teetimes/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teeTimeData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                `Failed to update tee time: ${response.status} ${response.statusText}` +
                (errorData ? ` - ${JSON.stringify(errorData)}` : '')
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating tee time:', error);
        throw error;
    }
};

export const deleteTeeTime = async (id) => {
    const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) { // 204 No Content is a success for delete
        throw new Error(`Failed to delete tee time with id ${id}`);
    }
    if (response.status === 204) {
        return null; 
    }
    return await response.json(); 
};
