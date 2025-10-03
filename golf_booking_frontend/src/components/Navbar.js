import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './styled/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';

function Navbar() {
    const { isDarkMode, toggleTheme } = useTheme();
    const colors = theme.colors[isDarkMode ? 'dark' : 'light'];

    const navStyle = {
        backgroundColor: colors.cardBg,
        padding: '10px 20px',
        borderBottom: `2px solid ${colors.secondary}`,
        marginBottom: '0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // This helps position items
    };

    const navLinksStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    };

    const titleStyle = {
        fontWeight: 'bold',
        fontSize: '1.2em',
        color: colors.text.dark,
    };

    const linkStyle = {
        textDecoration: 'none',
        color: colors.text.dark,
        padding: '5px 10px',
        borderRadius: theme.borderRadius.small,
        transition: 'all 0.2s ease',
    };

    const themeToggleStyle = {
        backgroundColor: colors.cardBg,
        color: colors.text.dark,
        border: `2px solid ${colors.secondary}`,
        padding: '8px 16px',
        borderRadius: theme.borderRadius.medium,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    return (
        <nav style={navStyle}>
            <div style={navLinksStyle}>
                <span style={titleStyle}>Pro Shop Dashboard</span>
                <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                <Link to="/teetimes" style={linkStyle}>Tee Times</Link>
                <Link to="/golfers" style={linkStyle}>Golfers</Link>
                <Link to="/bookings" style={linkStyle}>Bookings</Link>
            </div>
            <button 
                onClick={toggleTheme} 
                style={themeToggleStyle}
            >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
        </nav>
    );
}

export default Navbar;
