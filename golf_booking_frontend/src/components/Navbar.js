import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    // Basic styling for the navbar and links
    const navStyle = {
        backgroundColor: '#f0f0f0',
        padding: '10px 20px',
        borderBottom: '1px solid #ccc',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center'
    };

    const titleStyle = {
        fontWeight: 'bold',
        fontSize: '1.2em',
        marginRight: '30px'
    };

    const linkStyle = {
        marginLeft: '15px',
        textDecoration: 'none',
        color: '#333'
    };

    return (
        <nav style={navStyle}>
            <span style={titleStyle}>Pro Shop Dashboard</span>
            <Link to="/" style={linkStyle}>Dashboard</Link>
            <Link to="/golfers" style={linkStyle}>Golfers</Link>
            <Link to="/teetimes" style={linkStyle}>Tee Sheet</Link>
            <Link to="/bookings" style={linkStyle}>Bookings</Link>
            {/* Could also include a LogoutButton here */}
        </nav>
    );
}

export default Navbar;
