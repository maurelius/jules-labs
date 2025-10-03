import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeeTimeById, createTeeTime, updateTeeTime } from '../services/teeTimeService';
import { Container, FlexContainer, Grid } from '../components/styled/Container';
import { Card } from '../components/styled/Card';
import { Title, Text, Subtitle } from '../components/styled/Typography';
import { Button } from '../components/styled/Button';
import { Form, FormGroup, Label, Input, Select } from '../components/styled/Form';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';

// Storage key for custom presets
const CUSTOM_PRESETS_KEY = 'dd_golf_tee_time_presets';

// Default preset configurations
const DEFAULT_PRESETS = {
    weekday: {
        name: 'Weekday Standard',
        slots: [
            { start_time: '07:00', end_time: '09:00', interval: 10 },
            { start_time: '09:00', end_time: '15:00', interval: 12 },
            { start_time: '15:00', end_time: '19:00', interval: 10 }
        ]
    },
    weekend: {
        name: 'Weekend Peak',
        slots: [
            { start_time: '06:30', end_time: '09:00', interval: 8 },
            { start_time: '09:00', end_time: '16:00', interval: 8 },
            { start_time: '16:00', end_time: '19:30', interval: 10 }
        ]
    },
    tournament: {
        name: 'Tournament Schedule',
        slots: [
            { start_time: '07:00', end_time: '15:00', interval: 12 },
            { start_time: '15:00', end_time: '19:00', interval: 15 }
        ]
    }
};

function TeeTimeFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const colors = theme.colors[isDarkMode ? 'dark' : 'light'];
    const isEditMode = Boolean(id);

    const [isCustom, setIsCustom] = useState(false);
    const [teeTime, setTeeTime] = useState({
        start_time: '',
        course_section: 'Main Course',
        available_slots: 4,
    });
    const [bulkSettings, setBulkSettings] = useState({
        selectedPreset: 'weekday',
        customName: '',
        startDate: new Date().toISOString().split('T')[0], // Today's date
        endDate: new Date().toISOString().split('T')[0],   // Today's date
        slots: DEFAULT_PRESETS.weekday.slots
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [previewData, setPreviewData] = useState({
        totalTimes: 0,
        timeSlotBreakdown: [],
        hasOverlaps: false,
        overlappingSlots: []
    });

    // State for custom presets
    const [customPresets, setCustomPresets] = useState(() => {
        const saved = localStorage.getItem(CUSTOM_PRESETS_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    // Combined presets
    const allPresets = { ...DEFAULT_PRESETS, ...customPresets };

    const [manualSlot, setManualSlot] = useState({
        date: new Date().toISOString().split('T')[0],
        time: '07:00',
        available_slots: 4
    });

    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchTeeTime();
        }
    }, [id]);

    const fetchTeeTime = async () => {
        try {
            const data = await getTeeTimeById(id);
            setTeeTime(prev => ({
                ...prev,
                ...data,
                start_time: formatDateTimeForInput(data.start_time),
            }));
        } catch (err) {
            setError('Failed to fetch tee time: ' + err.message);
        }
    };

    const formatDateTimeForInput = (isoString) => {
        if (!isoString) return '';
        try {
            const date = new Date(isoString);
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const localDate = new Date(date.getTime() - timezoneOffset);
            return localDate.toISOString().slice(0, 16);
        } catch (e) {
            console.error("Error formatting date for input:", e);
            return '';
        }
    };
    
    const formatDateTimeForBackend = (inputString) => {
        if (!inputString) return null;
        try {
            const date = new Date(inputString);
            return date.toISOString();
        } catch (e) {
            console.error("Error formatting date for backend:", e);
            return null;
        }
    };

    const generateTeeTimes = async (settings) => {
        const { date, slots, course_section, available_slots } = settings;
        const teeTimePromises = [];

        // Sort time slots by start time to ensure proper order
        const sortedTimeSlots = [...slots].sort((a, b) => 
            a.start_time.localeCompare(b.start_time)
        );

        for (const slot of sortedTimeSlots) {
            const startDateTime = new Date(`${date}T${slot.start_time}`);
            const endDateTime = new Date(`${date}T${slot.end_time}`);
            let currentTime = startDateTime;

            while (currentTime < endDateTime) {
                const teeTimeData = {
                    start_time: currentTime.toISOString(),
                    course_section,
                    available_slots,
                };
                teeTimePromises.push(createTeeTime(teeTimeData));
                
                // Add interval minutes to current time
                currentTime = new Date(currentTime.getTime() + slot.interval * 60000);
            }
        }

        return Promise.all(teeTimePromises);
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
            setLoading(true);
                    setError(null);

        try {
            await generateTeeTimes(bulkSettings);
            navigate('/teetimes');
        } catch (err) {
            setError('Failed to create tee times: ' + err.message);
            console.error('Failed to create tee times:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkChange = (e) => {
        const { name, value, type } = e.target;
        setBulkSettings(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
    };

    const handleTimeSlotChange = (index, field, value) => {
        setBulkSettings(prev => ({
            ...prev,
            slots: prev.slots.map((slot, i) => 
                i === index ? { ...slot, [field]: value } : slot
            )
        }));
    };

    const addTimeSlot = () => {
        setBulkSettings(prev => ({
            ...prev,
            slots: [
                ...prev.slots,
                {
                    start_time: '07:00',
                    end_time: '19:00',
                    interval: 10
                }
            ]
        }));
    };

    const removeTimeSlot = (index) => {
        setBulkSettings(prev => ({
            ...prev,
            slots: prev.slots.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
        const payload = {
            ...teeTime,
            start_time: formatDateTimeForBackend(teeTime.start_time),
        };
        
        if (!payload.start_time) {
                throw new Error("Invalid start time format.");
        }

            if (isEditMode) {
                await updateTeeTime(id, payload);
            } else {
                await createTeeTime(payload);
            }
            navigate('/teetimes');
        } catch (err) {
            setError('Failed to save tee time: ' + err.message);
            console.error('Failed to save tee time:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setTeeTime(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
    };

    // Helper function to check if two time slots overlap
    const checkOverlap = (slot1, slot2) => {
        const start1 = new Date(`2000-01-01T${slot1.start_time}`);
        const end1 = new Date(`2000-01-01T${slot1.end_time}`);
        const start2 = new Date(`2000-01-01T${slot2.start_time}`);
        const end2 = new Date(`2000-01-01T${slot2.end_time}`);

        return start1 < end2 && start2 < end1;
    };

    // Calculate number of tee times for a slot
    const calculateTeeTimesForSlot = (slot) => {
        const start = new Date(`2000-01-01T${slot.start_time}`);
        const end = new Date(`2000-01-01T${slot.end_time}`);
        const minutes = (end - start) / (1000 * 60);
        return Math.floor(minutes / slot.interval);
    };

    // Update preview data whenever time slots change
    useEffect(() => {
        const sortedSlots = [...bulkSettings.slots].sort((a, b) => 
            a.start_time.localeCompare(b.start_time)
        );

        // Check for overlaps
        const overlaps = [];
        for (let i = 0; i < sortedSlots.length; i++) {
            for (let j = i + 1; j < sortedSlots.length; j++) {
                if (checkOverlap(sortedSlots[i], sortedSlots[j])) {
                    overlaps.push([i, j]);
                }
            }
        }

        // Calculate totals and breakdown
        const breakdown = sortedSlots.map(slot => ({
            timeRange: `${slot.start_time} - ${slot.end_time}`,
            interval: slot.interval,
            count: calculateTeeTimesForSlot(slot)
        }));

        const total = breakdown.reduce((sum, slot) => sum + slot.count, 0);

        setPreviewData({
            totalTimes: total,
            timeSlotBreakdown: breakdown,
            hasOverlaps: overlaps.length > 0,
            overlappingSlots: overlaps
        });
    }, [bulkSettings.slots]);

    // Save custom preset
    const saveCustomPreset = () => {
        if (!bulkSettings.customName) {
            alert('Please enter a name for your custom preset');
            return;
        }

        const newPresets = {
            ...customPresets,
            [bulkSettings.customName.toLowerCase().replace(/\s+/g, '_')]: {
                name: bulkSettings.customName,
                slots: bulkSettings.slots
            }
        };

        setCustomPresets(newPresets);
        localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(newPresets));
    };

    // Delete custom preset
    const deleteCustomPreset = (presetKey) => {
        const newPresets = { ...customPresets };
        delete newPresets[presetKey];
        setCustomPresets(newPresets);
        localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(newPresets));
    };

    // Handle preset selection
    const handlePresetChange = (presetKey) => {
        if (presetKey === 'custom') {
            setIsCustom(true);
        } else {
            setIsCustom(false);
            setBulkSettings(prev => ({
                ...prev,
                selectedPreset: presetKey,
                slots: allPresets[presetKey].slots
            }));
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        // Clear notification after 5 seconds
        setTimeout(() => setNotification(null), 5000);
    };

    const handleCreateSingleTeeTime = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Create the date in local time
            const [hours, minutes] = manualSlot.time.split(':');
            const dateTime = new Date(manualSlot.date);
            dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            // Adjust for timezone offset
            const offset = dateTime.getTimezoneOffset() * 60000;
            const adjustedDateTime = new Date(dateTime.getTime() - offset);

            await createTeeTime({
                start_time: adjustedDateTime.toISOString(),
                course_section: 'Main Course',
                available_slots: manualSlot.available_slots
            });

            showNotification('Tee time created successfully!');
            
            // Reset form
            setManualSlot(prev => ({
                ...prev,
                time: '07:00',
                available_slots: 4
            }));

        } catch (err) {
            console.error('Error creating tee time:', err);
            showNotification(err.message || 'Failed to create tee time', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateBulkTeeTimes = async () => {
        setIsLoading(true);
        setError(null);
        const errors = [];
        let successCount = 0;
        
        try {
            const startDate = new Date(bulkSettings.startDate);
            const endDate = new Date(bulkSettings.endDate);
            
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                for (const slot of bulkSettings.slots) {
                    const [startHours, startMinutes] = slot.start_time.split(':');
                    const [endHours, endMinutes] = slot.end_time.split(':');
                    
                    const currentSlotTime = new Date(date);
                    currentSlotTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

                    const endTime = new Date(date);
                    endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

                    for (
                        let teeTime = new Date(currentSlotTime);
                        teeTime < endTime;
                        teeTime.setMinutes(teeTime.getMinutes() + slot.interval)
                    ) {
                        try {
                            await createTeeTime({
                                start_time: new Date(teeTime).toISOString(),
                                course_section: 'Main Course',
                                available_slots: 4
                            });
                            successCount++;
                        } catch (err) {
                            errors.push(`${teeTime.toLocaleString()}: ${err.message}`);
                        }
                    }
                }
            }

            if (errors.length === 0) {
                showNotification(`Successfully created ${successCount} tee times!`);
                navigate('/teetimes');
            } else {
                showNotification(
                    `Created ${successCount} tee times with ${errors.length} failures. Check console for details.`,
                    'warning'
                );
                console.error('Tee time creation errors:', errors);
            }
        } catch (err) {
            showNotification(`Failed to create tee times: ${err.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isEditMode) {
    return (
            <Container>
                <Card style={{ backgroundColor: colors.cardBg }}>
                    <Title style={{ color: colors.text.dark }}>Edit Tee Time</Title>
                    {error && <Text style={{ color: colors.accent }}>{error}</Text>}

                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label isDark={isDarkMode}>Start Time</Label>
                            <Input
                        type="datetime-local"
                        name="start_time"
                        value={teeTime.start_time}
                        onChange={handleChange}
                        required
                                isDark={isDarkMode}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label isDark={isDarkMode}>Course Section</Label>
                            <Select
                        name="course_section"
                        value={teeTime.course_section}
                        onChange={handleChange}
                        required
                                isDark={isDarkMode}
                            >
                                <option value="Main Course">Main Course</option>
                                <option value="Back Nine">Back Nine</option>
                                <option value="Front Nine">Front Nine</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label isDark={isDarkMode}>Available Slots</Label>
                            <Input
                        type="number"
                        name="available_slots"
                        value={teeTime.available_slots}
                        onChange={handleChange}
                        min="0"
                                max="4"
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
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => navigate('/teetimes')}
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

    return (
        <Container>
            <Card>
                <Title>{id ? 'Edit Tee Time' : 'Create Tee Times'}</Title>
                
                {/* Notification Component */}
                {notification && (
                    <div
                        style={{
                            padding: theme.spacing.md,
                            marginBottom: theme.spacing.lg,
                            borderRadius: theme.borderRadius.medium,
                            backgroundColor: notification.type === 'error' ? '#ffebee' :
                                          notification.type === 'warning' ? '#fff3e0' : '#e8f5e9',
                            color: notification.type === 'error' ? '#c62828' :
                                  notification.type === 'warning' ? '#ef6c00' : '#2e7d32',
                        }}
                    >
                        {notification.message}
                    </div>
                )}

                {/* Date Range Selection */}
                <FormGroup>
                    <Label>Date Range</Label>
                    <Grid columns="1fr 1fr" gap="md">
                        <div>
                            <Label size="small">Start Date</Label>
                            <Input
                                type="date"
                                value={bulkSettings.startDate}
                                onChange={(e) => setBulkSettings(prev => ({
                                    ...prev,
                                    startDate: e.target.value,
                                    endDate: e.target.value > prev.endDate ? e.target.value : prev.endDate
                                }))}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <Label size="small">End Date</Label>
                            <Input
                                type="date"
                                value={bulkSettings.endDate}
                                onChange={(e) => setBulkSettings(prev => ({
                                    ...prev,
                                    endDate: e.target.value
                                }))}
                                min={bulkSettings.startDate}
                            />
                        </div>
                    </Grid>
                </FormGroup>

                {/* Preset Selection */}
                <FormGroup>
                    <Label>Schedule Preset</Label>
                    <Select
                        value={bulkSettings.selectedPreset}
                        onChange={(e) => handlePresetChange(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <option value="weekday">Weekday Standard</option>
                        <option value="weekend">Weekend Peak</option>
                        <option value="tournament">Tournament Schedule</option>
                        <option value="custom">Custom Schedule</option>
                    </Select>
                </FormGroup>

                {/* Custom Schedule Configuration - Only shown when custom is selected */}
                {isCustom && (
                    <>
                        <FormGroup>
                            <Label>Time Slots</Label>
                            <Grid columns="1fr 1fr 1fr" gap="md">
                                <Input
                                    type="time"
                                    value={bulkSettings.slots[0].start_time}
                                    onChange={(e) => {
                                        const newSlots = [...bulkSettings.slots];
                                        newSlots[0].start_time = e.target.value;
                                        setBulkSettings(prev => ({ ...prev, slots: newSlots }));
                                    }}
                                />
                                <Input
                                    type="time"
                                    value={bulkSettings.slots[0].end_time}
                                    onChange={(e) => {
                                        const newSlots = [...bulkSettings.slots];
                                        newSlots[0].end_time = e.target.value;
                                        setBulkSettings(prev => ({ ...prev, slots: newSlots }));
                                    }}
                                />
                                <Input
                                    type="number"
                                    min="5"
                                    max="30"
                                    value={bulkSettings.slots[0].interval}
                                    onChange={(e) => {
                                        const newSlots = [...bulkSettings.slots];
                                        newSlots[0].interval = parseInt(e.target.value);
                                        setBulkSettings(prev => ({ ...prev, slots: newSlots }));
                                    }}
                                    placeholder="Interval (min)"
                                />
                            </Grid>
                        </FormGroup>

                        <FormGroup>
                            <Label>Save Custom Schedule</Label>
                            <FlexContainer gap="md">
                                <Input
                                    type="text"
                                    placeholder="Enter schedule name"
                                    value={bulkSettings.customName}
                                    onChange={(e) => setBulkSettings(prev => ({
                                        ...prev,
                                        customName: e.target.value
                                    }))}
                                    style={{ flex: 1 }}
                                />
                                <Button 
                                    type="button" 
                                    onClick={saveCustomPreset}
                                    style={{ backgroundColor: colors.primary, color: colors.text.light }}
                                >
                                    Save
                                </Button>
                            </FlexContainer>
                        </FormGroup>
                    </>
                )}

                {/* Preview of selected preset */}
                <FormGroup>
                    <Label>Selected Schedule</Label>
                    <Text>
                        {isCustom ? 'Custom Schedule' : allPresets[bulkSettings.selectedPreset].name}:
                        {' '}
                        {bulkSettings.slots.map((slot, index) => (
                            <span key={index}>
                                {slot.start_time} - {slot.end_time} ({slot.interval}min intervals)
                                {index < bulkSettings.slots.length - 1 ? '; ' : ''}
                            </span>
                        ))}
                    </Text>
                </FormGroup>

                {/* Manual Slot Addition */}
                <FormGroup>
                    <Label>Add Individual Slot</Label>
                    <Grid columns="1fr 1fr 1fr auto" gap="md" alignItems="flex-end">
                        <div>
                            <Label size="small">Date</Label>
                            <Input
                                type="date"
                                value={manualSlot.date}
                                onChange={(e) => setManualSlot(prev => ({
                                    ...prev,
                                    date: e.target.value
                                }))}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <Label size="small">Time</Label>
                            <Input
                                type="time"
                                value={manualSlot.time}
                                onChange={(e) => setManualSlot(prev => ({
                                    ...prev,
                                    time: e.target.value
                                }))}
                            />
                        </div>
                        <div>
                            <Label size="small">Available Slots</Label>
                            <Input
                                type="number"
                                value={manualSlot.available_slots}
                                onChange={(e) => setManualSlot(prev => ({
                                    ...prev,
                                    available_slots: parseInt(e.target.value)
                                }))}
                                min="1"
                                max="4"
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={handleCreateSingleTeeTime}
                            style={{ backgroundColor: colors.primary, color: colors.text.light }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adding...' : 'Add Slot'}
                        </Button>
                    </Grid>
                </FormGroup>

                {/* Action Buttons */}
                <FlexContainer gap="md" justifyContent="flex-end" style={{ marginTop: theme.spacing.xl }}>
                    <Button 
                        type="button" 
                        onClick={() => navigate('/teetimes')}
                        style={{ backgroundColor: colors.secondary, color: colors.text.dark }}
                        disabled={isLoading}
                    >
                    Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleCreateBulkTeeTimes}
                        style={{ backgroundColor: colors.primary, color: colors.text.light }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Tee Times'}
                    </Button>
                </FlexContainer>
            </Card>
        </Container>
    );
}

export default TeeTimeFormPage;
