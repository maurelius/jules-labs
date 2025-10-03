import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGolferById, createGolfer, updateGolfer } from '../services/golferService';
import { Container, FlexContainer } from '../components/styled/Container';
import { Card } from '../components/styled/Card';
import { Title, Text } from '../components/styled/Typography';
import { Button } from '../components/styled/Button';
import { Form, FormGroup, Label, Input } from '../components/styled/Form';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';

function GolferFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const { isDarkMode } = useTheme();
    const colors = theme.colors[isDarkMode ? 'dark' : 'light'];

    const [golfer, setGolfer] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchGolfer();
        }
    }, [id]);

    const fetchGolfer = async () => {
        try {
            const data = await getGolferById(id);
            setGolfer(data);
        } catch (err) {
            setError('Failed to fetch golfer: ' + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await updateGolfer(id, golfer);
            } else {
                await createGolfer(golfer);
            }
            navigate('/golfers');
        } catch (err) {
            setError('Failed to save golfer: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGolfer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container>
            <Card style={{ backgroundColor: colors.cardBg }}>
                <Title style={{ color: colors.text.dark }}>
                    {isEditMode ? 'Edit Golfer' : 'Add New Golfer'}
                </Title>

                {error && <Text style={{ color: colors.accent }}>{error}</Text>}

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label isDark={isDarkMode}>Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={golfer.name}
                            onChange={handleChange}
                            required
                            isDark={isDarkMode}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label isDark={isDarkMode}>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            value={golfer.email}
                            onChange={handleChange}
                            required
                            isDark={isDarkMode}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label isDark={isDarkMode}>Phone</Label>
                        <Input
                            type="tel"
                            name="phone"
                            value={golfer.phone}
                            onChange={handleChange}
                            required
                            isDark={isDarkMode}
                        />
                    </FormGroup>

                    <FlexContainer gap="md">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            style={{ backgroundColor: colors.primary }}
                        >
                            {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Golfer')}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => navigate('/golfers')}
                            variant="secondary"
                            style={{ backgroundColor: colors.secondary }}
                        >
                            Cancel
                        </Button>
                    </FlexContainer>
                </Form>
            </Card>
        </Container>
    );
}

export default GolferFormPage;
