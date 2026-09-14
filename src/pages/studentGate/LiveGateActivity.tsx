import { useEffect, useState } from 'react';
import { Alert, Box, Chip, CircularProgress, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import studentGateServices from '../../services/studentGateServices';
import type { StudentGateLiveEvent } from '../../models/StudentGateModel';

const formatTime = (value?: string | null) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';

export default function LiveGateActivity({ schoolID }: { schoolID: number }) {
    const [events, setEvents] = useState<StudentGateLiveEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const response = await studentGateServices.getLiveEvents(schoolID);
                if (mounted) {
                    setEvents(response.data?.Result ?? []);
                    setError('');
                }
            } catch (err: unknown) {
                if (mounted) setError(err instanceof Error ? err.message : 'Unable to load gate activity.');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        void load();
        const timer = window.setInterval(() => void load(), 15000);
        return () => { mounted = false; window.clearInterval(timer); };
    }, [schoolID]);

    return (
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6">Live Gate Activity</Typography>
                {loading && <CircularProgress size={20} />}
            </Stack>
            {error && <Alert severity="warning" sx={{ mb: 1 }}>{error}</Alert>}
            {!loading && events.length === 0 && <Typography color="text.secondary">No gate events found.</Typography>}
            <List dense disablePadding>
                {events.map((event) => (
                    <ListItem key={event.GateEventID} divider sx={{ px: 0 }}>
                        {event.EventType === 'IN' ? <LoginRoundedIcon color="success" sx={{ mr: 1 }} /> : <LogoutRoundedIcon color="error" sx={{ mr: 1 }} />}
                        <ListItemText
                            primary={<Stack direction="row" spacing={1} alignItems="center"><Typography variant="body2" fontWeight={600}>{event.StudentName}</Typography><Chip size="small" label={event.EventType} color={event.EventType === 'IN' ? 'success' : 'error'} /></Stack>}
                            secondary={`${event.GateName ?? 'Gate'} · ${formatTime(event.DeviceEventTime)}${event.IsValid ? '' : ` · ${event.ValidationCode ?? 'INVALID'}`}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
