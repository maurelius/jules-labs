const API_URL = 'http://localhost:8000/api/golfers/';

export const getAllGolfers = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch golfers');
    }
    return await response.json();
};

export const getGolferById = async (id) => {
    const response = await fetch(`${API_URL}${id}/`);
    if (!response.ok) {
        throw new Error(`Failed to fetch golfer with id ${id}`);
    }
    return await response.json();
};

export const createGolfer = async (golferData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(golferData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create golfer');
    }
    return await response.json();
};

export const updateGolfer = async (id, golferData) => {
    const response = await fetch(`${API_URL}${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(golferData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to update golfer with id ${id}`);
    }
    return await response.json();
};

export const deleteGolfer = async (id) => {
    const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) { // 204 No Content is a success for delete
        throw new Error(`Failed to delete golfer with id ${id}`);
    }
    // For DELETE, there might not be a JSON response body, or it might be empty
    if (response.status === 204) {
        return null; 
    }
    return await response.json(); 
};
