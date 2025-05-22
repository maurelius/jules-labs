const API_URL = 'http://localhost:8000/api/teetimes/';

export const getAllTeeTimes = async (params = {}) => {
    // Example: params = { ordering: 'start_time' }
    const query = new URLSearchParams(params).toString();
    const requestUrl = query ? `${API_URL}?${query}` : API_URL;
    const response = await fetch(requestUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch tee times');
    }
    return await response.json();
};

export const getTeeTimeById = async (id) => {
    const response = await fetch(`${API_URL}${id}/`);
    if (!response.ok) {
        throw new Error(`Failed to fetch tee time with id ${id}`);
    }
    return await response.json();
};

export const createTeeTime = async (teeTimeData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(teeTimeData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create tee time');
    }
    return await response.json();
};

export const updateTeeTime = async (id, teeTimeData) => {
    const response = await fetch(`${API_URL}${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(teeTimeData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to update tee time with id ${id}`);
    }
    return await response.json();
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
