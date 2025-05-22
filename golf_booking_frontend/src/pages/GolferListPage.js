import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllGolfers, deleteGolfer } from '../services/golferService';

function GolferListPage() {
    const [golfers, setGolfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGolfers();
    }, []);

    const fetchGolfers = async () => {
        try {
            setLoading(true);
            const data = await getAllGolfers();
            setGolfers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch golfers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this golfer?')) {
            try {
                await deleteGolfer(id);
                fetchGolfers(); // Refresh the list
            } catch (err) {
                setError(err.message);
                console.error("Failed to delete golfer:", err);
                alert(`Failed to delete golfer: ${err.message}`);
            }
        }
    };

    if (loading) return <p>Loading golfers...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h2>Golfers</h2>
            <Link to="/golfers/new">
                <button style={{ marginBottom: '20px' }}>Add New Golfer</button>
            </Link>
            {golfers.length === 0 && !loading && <p>No golfers found. Add one!</p>}
            {golfers.length > 0 && (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {golfers.map((golfer) => (
                            <tr key={golfer.id}>
                                <td>{golfer.name}</td>
                                <td>{golfer.email}</td>
                                <td>{golfer.phone || 'N/A'}</td>
                                <td>
                                    <button onClick={() => navigate(`/golfers/edit/${golfer.id}`)} style={{ marginRight: '5px' }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(golfer.id)}>
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

export default GolferListPage;
