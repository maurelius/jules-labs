import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllTeeTimes } from '../services/teeTimeService';
import { Container, FlexContainer } from '../components/styled/Container';
import { Card } from '../components/styled/Card';
import { Title, Text } from '../components/styled/Typography';
import { Button } from '../components/styled/Button';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';

function TeeSheetPage() {
    const [teeTimes, setTeeTimes] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode } = useTheme();
    const colors = theme.colors[isDarkMode ? 'dark' : 'light'];

    const fetchTeeTimes = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAllTeeTimes();
            const sortedData = [...data].sort((a, b) => 
                new Date(a.start_time) - new Date(b.start_time)
            );
            setTeeTimes(sortedData);
            console.log('Fetched tee times:', sortedData);
        } catch (err) {
            setError('Failed to fetch tee times');
            console.error('Error fetching tee times:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeeTimes();
    }, [location.key]);

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
                        <Title style={{ color: colors.text.dark }}>Tee Sheet</Title>
                        <Button
                            onClick={() => navigate('/teetimes/new')}
                            style={{ 
                                backgroundColor: colors.primary,
                                color: colors.text.light,
                                border: 'none',
                                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                                borderRadius: theme.borderRadius.medium,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    opacity: 0.9
                                }
                            }}
                        >
                            Create Tee Time
                        </Button>
                    </FlexContainer>

                    {isLoading ? (
                        <Text style={{ 
                            color: colors.text.dark,
                            textAlign: 'center',
                            padding: theme.spacing.lg
                        }}>Loading tee times...</Text>
                    ) : error ? (
                        <Text style={{ 
                            color: colors.error,
                            textAlign: 'center',
                            padding: theme.spacing.lg
                        }}>{error}</Text>
                    ) : teeTimes.length === 0 ? (
                        <Text style={{ 
                            color: colors.text.dark,
                            textAlign: 'center',
                            padding: theme.spacing.lg
                        }}>No tee times available.</Text>
                    ) : (
                        <div style={{ 
                            overflowX: 'auto',
                            backgroundColor: colors.cardBg,
                            borderRadius: theme.borderRadius.medium
                        }}>
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
                                            color: colors.text.dark,
                                            fontWeight: 600,
                                            textAlign: 'left'
                                        }}>Date</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            color: colors.text.dark,
                                            fontWeight: 600,
                                            textAlign: 'left'
                                        }}>Time</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            color: colors.text.dark,
                                            fontWeight: 600,
                                            textAlign: 'left'
                                        }}>Course Section</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            color: colors.text.dark,
                                            fontWeight: 600,
                                            textAlign: 'left'
                                        }}>Available Slots</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            color: colors.text.dark,
                                            fontWeight: 600,
                                            textAlign: 'left'
                                        }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teeTimes.map((teeTime, index) => {
                                        const { date, time } = formatDateTime(teeTime.start_time);
                                        return (
                                            <tr key={teeTime.id} style={{
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
                                                }}>{teeTime.course_section}</td>
                                                <td style={{ 
                                                    padding: theme.spacing.md, 
                                                    borderBottom: `1px solid ${colors.secondary}`,
                                                    color: colors.text.dark
                                                }}>{teeTime.available_slots}</td>
                                                <td style={{ 
                                                    padding: theme.spacing.md, 
                                                    borderBottom: `1px solid ${colors.secondary}`
                                                }}>
                                                    <Button
                                                        onClick={() => navigate(`/teetimes/${teeTime.id}`)}
                                                        style={{ 
                                                            backgroundColor: colors.secondary,
                                                            color: colors.text.dark,
                                                            border: 'none',
                                                            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                                                            borderRadius: theme.borderRadius.medium,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                opacity: 0.9
                                                            }
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

export default TeeSheetPage;
