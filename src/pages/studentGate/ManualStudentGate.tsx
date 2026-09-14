import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';
import masterServices from '../../services/masterSerices';
import studentGateServices from '../../services/studentGateServices';
import studentServices from '../../services/studentsServices';
import { showError, showSuccess } from '../../features/common/commonSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import type { SchoolModel } from '../../models/SchoolModel';
import type { StudentModel } from '../../models/StudentModel';
import type { StudentGateSwipeResult } from '../../models/StudentGateModel';

type EventChoice = '' | 'IN' | 'OUT';

export default function ManualStudentGate() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.common.userLoginInfo);
    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [students, setStudents] = useState<StudentModel[]>([]);
    const [schoolID, setSchoolID] = useState(0);
    const [studentID, setStudentID] = useState(0);
    const [gateCode, setGateCode] = useState('MAIN_GATE');
    const [eventType, setEventType] = useState<EventChoice>('');
    const [remarks, setRemarks] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<StudentGateSwipeResult | null>(null);

    useEffect(() => {
        void masterServices.getSchoolsByAccountID(user.AccountID)
            .then((response) => {
                const values = response.data?.Result ?? [];
                setSchools(values);
                setSchoolID(values[0]?.SchoolID ?? 0);
            })
            .catch((err: unknown) => dispatch(showError(err instanceof Error ? err.message : 'Unable to load schools.')));
    }, [dispatch, user.AccountID]);

    useEffect(() => {
        if (!schoolID) return;
        setStudentID(0);
        void studentServices.getStudentsList({ Prefix: '', StudentID: 0, ClassID: 0, SchoolID: schoolID, AccountID: user.AccountID, IsDropdown: true, LoginUserID: user.UserID })
            .then((response) => setStudents(response.data?.Result ?? []))
            .catch((err: unknown) => dispatch(showError(err instanceof Error ? err.message : 'Unable to load students.')));
    }, [dispatch, schoolID, user.AccountID, user.UserID]);

    const submit = async () => {
        if (!schoolID || !studentID || !gateCode.trim() || submitting) {
            dispatch(showError('Select a school, student, and gate before recording the event.'));
            return;
        }
        setSubmitting(true);
        setResult(null);
        try {
            const response = await studentGateServices.recordManualSwipe({ SchoolID: schoolID, StudentID: studentID, GateCode: gateCode.trim(), EventType: eventType || null, EventTime: new Date().toISOString(), Remarks: remarks.trim() || null });
            const data = response.data?.Result as StudentGateSwipeResult | undefined;
            if (!data?.Success) {
                dispatch(showError(data?.Message ?? response.data?.Message ?? 'The manual event was not accepted.'));
            } else {
                setResult(data);
                dispatch(showSuccess(data.Message));
                setEventType('');
                setRemarks('');
            }
        } catch (err: unknown) {
            dispatch(showError(err instanceof Error ? err.message : 'Unable to record the manual event.'));
        } finally {
            setSubmitting(false);
        }
    };

    const selectedStudent = students.find((student) => student.StudentID === studentID);

    return <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
        <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={700}>Manual Gate Entry</Typography>
            <Typography color="text.secondary">Record a student entrance or exit when a reader is unavailable.</Typography>
        </Stack>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
                <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack spacing={2.5}>
                        <Typography variant="h6">Record movement</Typography>
                        <TextField select fullWidth label="School" value={schoolID} onChange={(event) => setSchoolID(Number(event.target.value))}>
                            <MenuItem value={0}>Select school</MenuItem>
                            {schools.map((school) => <MenuItem key={school.SchoolID} value={school.SchoolID}>{school.SchoolName}</MenuItem>)}
                        </TextField>
                        <TextField select fullWidth label="Student" value={studentID} onChange={(event) => setStudentID(Number(event.target.value))} disabled={!schoolID}>
                            <MenuItem value={0}>Select student</MenuItem>
                            {students.map((student) => <MenuItem key={student.StudentID} value={student.StudentID}>{student.StudentName} ({student.AdmissionNo})</MenuItem>)}
                        </TextField>
                        <TextField fullWidth label="Gate code" value={gateCode} onChange={(event) => setGateCode(event.target.value)} helperText="Use the configured gate code, for example MAIN_GATE." />
                        <TextField select fullWidth label="Movement" value={eventType} onChange={(event) => setEventType(event.target.value as EventChoice)} helperText="Automatic follows the student's latest valid gate status.">
                            <MenuItem value="">Automatic</MenuItem>
                            <MenuItem value="IN">IN - enter school</MenuItem>
                            <MenuItem value="OUT">OUT - leave school</MenuItem>
                        </TextField>
                        <TextField fullWidth multiline minRows={2} label="Remarks (optional)" value={remarks} onChange={(event) => setRemarks(event.target.value)} />
                        <Button variant="contained" size="large" startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SyncAltRoundedIcon />} onClick={() => void submit()} disabled={submitting || !schoolID || !studentID}>
                            Record gate event
                        </Button>
                    </Stack>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
                <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, minHeight: 280, bgcolor: 'background.default' }}>
                    <Typography variant="overline" color="text.secondary">Selected student</Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>{selectedStudent?.StudentName ?? 'No student selected'}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>{selectedStudent?.AdmissionNo ?? 'Choose a student to review the action.'}</Typography>
                    {result && <Stack spacing={2}><Alert severity={result.EventType === 'IN' ? 'success' : 'info'} icon={result.EventType === 'IN' ? <LoginRoundedIcon /> : <LogoutRoundedIcon />}><Typography fontWeight={700}>{result.EventType === 'IN' ? 'Student entered school' : 'Student exited school'}</Typography>{result.CurrentStatus} · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Alert><Typography variant="body2" color="text.secondary">Event ID: {result.GateEventID ?? '-'}</Typography></Stack>}
                </Paper>
            </Grid>
        </Grid>
    </Box>;
}