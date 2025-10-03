import React from 'react';
import { Container, FlexContainer, Grid } from '../components/styled/Container';
import { Card } from '../components/styled/Card';
import { Title, Subtitle, Text } from '../components/styled/Typography';
import { Button } from '../components/styled/Button';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
    const { isDarkMode } = useTheme();
    const colors = theme.colors[isDarkMode ? 'dark' : 'light'];
    const navigate = useNavigate();

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
                        : '0 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: theme.spacing.xl
                }}>
                    <FlexContainer gap="lg" alignItems="center">
                        <img 
                            src="/dd-logo.jpeg" 
                            alt="DD Golf Club Logo" 
                            style={{
                                width: '120px',
                                height: '120px',
                                objectFit: 'contain',
                                borderRadius: theme.borderRadius.medium,
                                border: `1px solid ${colors.secondary}`,
                                backgroundColor: colors.cardBg
                            }}
                        />
                        <div>
                            <Title style={{ 
                                color: colors.text.dark,
                                marginBottom: theme.spacing.xs
                            }}>
                                Welcome to the Data Driven Golf Dashboard!
                            </Title>
                            <Text style={{ 
                                color: colors.text.muted,
                                fontSize: '1.1rem'
                            }}>
                                Manage your golf experience with ease
                            </Text>
                        </div>
                    </FlexContainer>

                    <Grid 
                        gap="xl" 
                        style={{ 
                            marginTop: theme.spacing.xl,
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
                        }}
                    >
                        <Card style={{ 
                            backgroundColor: isDarkMode 
                                ? 'rgba(0, 0, 0, 0.2)' 
                                : 'rgba(255, 255, 255, 0.9)',
                            border: `1px solid ${colors.secondary}`,
                            padding: theme.spacing.lg
                        }}>
                            <Subtitle style={{ 
                                color: colors.text.dark,
                                marginBottom: theme.spacing.md
                            }}>
                                Quick Actions
                            </Subtitle>
                            <FlexContainer direction="column" gap="md">
                                <Button 
                                    onClick={() => navigate('/teetimes/new')}
                                    style={{ 
                                        backgroundColor: colors.primary,
                                        color: colors.text.light,
                                        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                                        border: 'none',
                                        borderRadius: theme.borderRadius.medium,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            opacity: 0.9
                                        }
                                    }}
                                >
                                    Book a Tee Time
                                </Button>
                                <Button 
                                    onClick={() => navigate('/bookings')}
                                    style={{ 
                                        backgroundColor: colors.secondary,
                                        color: colors.text.dark,
                                        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                                        border: 'none',
                                        borderRadius: theme.borderRadius.medium,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            opacity: 0.9
                                        }
                                    }}
                                >
                                    View My Bookings
                                </Button>
                                <Button 
                                    style={{ 
                                        backgroundColor: colors.secondary,
                                        color: colors.text.dark,
                                        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                                        border: 'none',
                                        borderRadius: theme.borderRadius.medium,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            opacity: 0.9
                                        }
                                    }}
                                >
                                    Course Information
                                </Button>
                            </FlexContainer>
                        </Card>

                        <Card style={{ 
                            backgroundColor: isDarkMode 
                                ? 'rgba(0, 0, 0, 0.2)' 
                                : 'rgba(255, 255, 255, 0.9)',
                            border: `1px solid ${colors.secondary}`,
                            padding: theme.spacing.lg
                        }}>
                            <Subtitle style={{ 
                                color: colors.text.dark,
                                marginBottom: theme.spacing.md
                            }}>
                                Recent Activity
                            </Subtitle>
                            <Text style={{ 
                                color: colors.text.muted,
                                fontSize: '0.95rem'
                            }}>
                                No recent bookings found.
                            </Text>
                        </Card>

                        <Card style={{ 
                            backgroundColor: isDarkMode 
                                ? 'rgba(0, 0, 0, 0.2)' 
                                : 'rgba(255, 255, 255, 0.9)',
                            border: `1px solid ${colors.secondary}`,
                            padding: theme.spacing.lg
                        }}>
                            <Subtitle style={{ 
                                color: colors.text.dark,
                                marginBottom: theme.spacing.md
                            }}>
                                Weather Forecast
                            </Subtitle>
                            <Text style={{ 
                                color: colors.text.muted,
                                fontSize: '0.95rem'
                            }}>
                                Loading weather information...
                            </Text>
                        </Card>
                    </Grid>
                </Card>
            </Container>
        </div>
    );
}

export default DashboardPage;
