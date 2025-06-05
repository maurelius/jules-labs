import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGolfers } from '../services/golferService';
import { Container, FlexContainer } from '../components/styled/Container';
import { Card } from '../components/styled/Card';
import { Title, Text } from '../components/styled/Typography';
import { Button } from '../components/styled/Button';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';

function GolferListPage() {
    const [golfers, setGolfers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const colors = theme.colors[isDarkMode ? 'dark' : 'light'];

    useEffect(() => {
        fetchGolfers();
    }, []);

    const fetchGolfers = async () => {
        try {
            setIsLoading(true);
            const data = await getAllGolfers();
            setGolfers(data);
        } catch (err) {
            setError('Failed to fetch golfers');
            console.error('Error fetching golfers:', err);
        } finally {
            setIsLoading(false);
        }
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
                        <Title style={{ color: colors.text.dark }}>Golfers</Title>
                        <Button
                            onClick={() => navigate('/golfers/new')}
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
                            Add Golfer
                        </Button>
                    </FlexContainer>

                    {isLoading ? (
                        <Text style={{ color: colors.text.dark }}>Loading golfers...</Text>
                    ) : error ? (
                        <Text style={{ color: colors.error }}>{error}</Text>
                    ) : golfers.length === 0 ? (
                        <Text style={{ color: colors.text.dark }}>No golfers found.</Text>
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
                                        }}>Name</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            textAlign: 'left',
                                            color: colors.text.dark
                                        }}>Email</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            textAlign: 'left',
                                            color: colors.text.dark
                                        }}>Phone</th>
                                        <th style={{ 
                                            padding: theme.spacing.md, 
                                            borderBottom: `1px solid ${colors.secondary}`,
                                            textAlign: 'left',
                                            color: colors.text.dark
                                        }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {golfers.map((golfer, index) => (
                                        <tr key={golfer.id} style={{
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
                                            }}>{golfer.name}</td>
                                            <td style={{ 
                                                padding: theme.spacing.md, 
                                                borderBottom: `1px solid ${colors.secondary}`,
                                                color: colors.text.dark
                                            }}>{golfer.email}</td>
                                            <td style={{ 
                                                padding: theme.spacing.md, 
                                                borderBottom: `1px solid ${colors.secondary}`,
                                                color: colors.text.dark
                                            }}>{golfer.phone}</td>
                                            <td style={{ 
                                                padding: theme.spacing.md, 
                                                borderBottom: `1px solid ${colors.secondary}`
                                            }}>
                                                <Button
                                                    onClick={() => navigate(`/golfers/${golfer.id}`)}
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
}

export default GolferListPage;
