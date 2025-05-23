import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGolferById, createGolfer, updateGolfer } from '../services/golferService';

function GolferFormPage() {
    const { id } = useParams(); // For edit mode
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [golfer, setGolfer] = useState({
        name: '',
        email: '',
        phone: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            getGolferById(id)
                .then(data => {
                    setGolfer(data);
                    setError(null);
                })
                .catch(err => {
                    setError(err.message);
                    console.error(`Failed to fetch golfer ${id}:`, err);
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGolfer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await updateGolfer(id, golfer);
            } else {
                await createGolfer(golfer);
            }
            navigate('/golfers');
        } catch (err) {
            setError(err.message);
            console.error('Failed to save golfer:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <p>Loading golfer details...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h2>{isEditMode ? 'Edit Golfer' : 'Add New Golfer'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={golfer.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={golfer.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={golfer.phone}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="notes">Notes:</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={golfer.notes}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Golfer')}
                </button>
                <button type="button" onClick={() => navigate('/golfers')} style={{ marginLeft: '10px' }} disabled={loading}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default GolferFormPage;
