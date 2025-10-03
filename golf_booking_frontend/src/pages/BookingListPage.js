import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings } from '../services/bookingService';
import { Container, FlexContainer } from '../components/styled/Container';
import { Card } from '../components/styled/Card';
import { Title, Text } from '../components/styled/Typography';
import { Button } from '../components/styled/Button';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';

function BookingListPage() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const colors = theme.colors[isDarkMode ? 'dark' : 'light'];

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const data = await getAllBookings();
            setBookings(data);
        } catch (err) {
            setError('Failed to fetch bookings');
            console.error('Error fetching bookings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return {
            date: date.toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit'
            })
        };
    };

    return (
        <div style={{
            backgroundColor: colors.background,
            minHeight: '100vh',
            paddingTop: theme.spacing.lg,
            paddingBottom: theme.spacing.lg
        }}>
            <Container>
                <Card style={{ 
                    backgroundColor: colors.cardBg,
                    boxShadow: isDarkMode 
                        ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
                        : '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <FlexContainer 
                        justifyContent="space-between" 
                        alignItems="center" 
                        style={{ marginBottom: theme.spacing.lg }}
                    >
                        <Title style={{ color: colors.text.dark }}>Bookings</Title>
                        <Button
                            onClick={() => navigate('/bookings/new')}
                            style={{ 
                                backgroundColor: colors.primary,
                                color: colors.text.light,
                                border: 'none',
                                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                                borderRadius: theme.borderRadius.medium,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            New Booking
                        </Button>
                    </FlexContainer>

                    {isLoading ? (
                        <Text style={{ color: colors.text.dark }}>Loading bookings...</Text>
                    ) : error ? (
                        <Text style={{ color: colors.error }}>{error}</Text>
                    ) : bookings.length === 0 ? (
                        <Text style={{ color: colors.text.dark }}>No bookings found.</Text>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                color: colors.text.dark
                            }}>
                                <thead>
                                    <tr style={{
                                        backgroundColor: isDarkMode 
                                            ? 'rgba(0, 0, 0, 0.2)' 
                                            : 'rgba(0, 0, 0, 0.05)'
                                    }}>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            textAlign: 'left',
                                            color: colors.text.dark
                                        }}>Date</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            textAlign: 'left',
                                            color: colors.text.dark
                                        }}>Time</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            textAlign: 'left',
                                            color: colors.text.dark
                                        }}>Golfer</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            textAlign: 'left',
                                            color: colors.text.dark
                                        }}>Course Section</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            textAlign: 'left',
                                            color: colors.text.dark
                                        }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking, index) => {
                                        const { date, time } = formatDateTime(booking.tee_time);
                                        return (
                                            <tr key={booking.id} style={{
                                                backgroundColor: index % 2 === 0 
                                                    ? 'transparent'
                                                    : isDarkMode 
                                                        ? 'rgba(255, 255, 255, 0.02)'
                                                        : 'rgba(0, 0, 0, 0.02)'
                                            }}>
                                                <td style={{ 
                                                    padding: theme.spacing.md, 
                                                    borderBottom: `1px solid ${colors.secondary}`,
                                                    color: colors.text.dark
                                                }}>{date}</td>
                                                <td style={{ 
                                                    padding: theme.spacing.md, 
                                                    borderBottom: `1px solid ${colors.secondary}`,
                                                    color: colors.text.dark
                                                }}>{time}</td>
                                                <td style={{ 
                                                    padding: theme.spacing.md, 
                                                    borderBottom: `1px solid ${colors.secondary}`,
                                                    color: colors.text.dark
                                                }}>{booking.golfer_name}</td>
                                                <td style={{ 
                                                    padding: theme.spacing.md, 
                                                    borderBottom: `1px solid ${colors.secondary}`,
                                                    color: colors.text.dark
                                                }}>{booking.course_section}</td>
                                                <td style={{ 
                                                    padding: theme.spacing.md, 
                                                    borderBottom: `1px solid ${colors.secondary}`
                                                }}>
                                                    <Button
                                                        onClick={() => navigate(`/bookings/${booking.id}`)}
                                                        style={{ 
                                                            backgroundColor: colors.secondary,
                                                            color: colors.text.dark,
                                                            border: 'none',
                                                            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                                                            borderRadius: theme.borderRadius.medium,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
}

export default BookingListPage;
