import { useEffect, useState } from 'react';
import { Alert, Box, Chip, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions } from 'material-react-table';
import studentGateServices from '../../services/studentGateServices';
import masterServices from '../../services/masterSerices';
import studentServices from '../../services/studentsServices';
import { useAppSelector } from '../../hooks/reduxHooks';
import type { SchoolModel } from '../../models/SchoolModel';
import type { StudentModel } from '../../models/StudentModel';
import type { StudentGateDailySummary, StudentGateHistoryEvent } from '../../models/StudentGateModel';
import { GetTableOptions } from '../../common/tableStyles';

const formatTime = (value?: string | null) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
const formatDate = (value: string) => new Date(value).toLocaleDateString();

export default function StudentGateHistory() {
    const user = useAppSelector((state) => state.common.userLoginInfo);
    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [students, setStudents] = useState<StudentModel[]>([]);
    const [schoolID, setSchoolID] = useState(0);
    const [studentID, setStudentID] = useState(0);
    const [fromDate, setFromDate] = useState(new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10));
    const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
    const [events, setEvents] = useState<StudentGateHistoryEvent[]>([]);
    const [summaries, setSummaries] = useState<StudentGateDailySummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        void masterServices.getSchoolsByAccountID(user.AccountID).then((response) => {
            const values = response.data?.Result ?? [];
            setSchools(values);
            setSchoolID(values[0]?.SchoolID ?? 0);
        }).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load schools.'));
    }, [user.AccountID]);

    useEffect(() => {
        if (!schoolID) return;
        void studentServices.getStudentsList({ Prefix: '', StudentID: 0, ClassID: 0, SchoolID: schoolID, AccountID: user.AccountID, IsDropdown: true, LoginUserID: user.UserID })
            .then((response) => setStudents(response.data?.Result ?? []))
            .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load students.'));
    }, [schoolID, user.AccountID, user.UserID]);

    useEffect(() => {
        if (!schoolID || !studentID) return;
        setLoading(true);
        void studentGateServices.getHistory(studentID, schoolID, fromDate, toDate)
            .then((response) => { setEvents(response.data?.Events ?? []); setSummaries(response.data?.Result ?? []); setError(''); })
            .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load student gate history.'))
            .finally(() => setLoading(false));
    }, [schoolID, studentID, fromDate, toDate]);

    const summaryColumns: MRT_ColumnDef<StudentGateDailySummary>[] = [
        { accessorKey: 'AttendanceDate', header: 'Date', Cell: ({ cell }) => formatDate(cell.getValue<string>()) },
        { accessorKey: 'FirstInTime', header: 'First IN', Cell: ({ cell }) => formatTime(cell.getValue<string>()) },
        { accessorKey: 'LastOutTime', header: 'Last OUT', Cell: ({ cell }) => formatTime(cell.getValue<string>()) },
        { accessorKey: 'TotalPresenceMinutes', header: 'Presence', Cell: ({ cell }) => `${Math.floor(Number(cell.getValue()) / 60)}h ${Number(cell.getValue()) % 60}m` },
        { accessorKey: 'NumberOfEntries', header: 'Entries' },
        { accessorKey: 'NumberOfExits', header: 'Exits' },
        { accessorKey: 'CurrentStatus', header: 'Status', Cell: ({ cell }) => <Chip size="small" label={cell.getValue<string>()} color={cell.getValue<string>() === 'INSIDE' ? 'success' : 'default'} /> },
    ];
    const eventColumns: MRT_ColumnDef<StudentGateHistoryEvent>[] = [
        { accessorKey: 'EventType', header: 'Event', Cell: ({ cell }) => <Chip size="small" label={cell.getValue<string>()} color={cell.getValue<string>() === 'IN' ? 'success' : 'error'} /> },
        { accessorKey: 'DeviceEventTime', header: 'Device Time', Cell: ({ cell }) => `${formatDate(cell.row.original.EventDate)} ${formatTime(cell.getValue<string>())}` },
        { accessorKey: 'GateName', header: 'Gate' },
        { accessorKey: 'IsValid', header: 'Accepted', Cell: ({ cell }) => cell.getValue<boolean>() ? 'Yes' : cell.row.original.ValidationCode ?? 'No' },
    ];
    const summaryTable = useMaterialReactTable({ ...(GetTableOptions() as unknown as MRT_TableOptions<StudentGateDailySummary>), columns: summaryColumns, data: summaries, state: { isLoading: loading } });
    const eventTable = useMaterialReactTable({ ...(GetTableOptions() as unknown as MRT_TableOptions<StudentGateHistoryEvent>), columns: eventColumns, data: events, state: { isLoading: loading } });

    return <Box sx={{ p: { xs: 1, md: 2 } }}><Typography variant="h4" fontWeight={700}>Student Gate History</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>Review daily presence and every physical gate movement.</Typography>{error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}<Paper variant="outlined" sx={{ p: 2, mb: 2 }}><Grid container spacing={2} alignItems="center"><Grid size={{ xs: 12, sm: 6, md: 3 }}><TextField select fullWidth size="small" label="School" value={schoolID} onChange={(event) => { setSchoolID(Number(event.target.value)); setStudentID(0); }}>{schools.map((school) => <MenuItem key={school.SchoolID} value={school.SchoolID}>{school.SchoolName}</MenuItem>)}</TextField></Grid><Grid size={{ xs: 12, sm: 6, md: 3 }}><TextField select fullWidth size="small" label="Student" value={studentID} onChange={(event) => setStudentID(Number(event.target.value))}><MenuItem value={0}>Select student</MenuItem>{students.map((student) => <MenuItem key={student.StudentID} value={student.StudentID}>{student.StudentName} ({student.AdmissionNo})</MenuItem>)}</TextField></Grid><Grid size={{ xs: 12, sm: 6, md: 2 }}><TextField fullWidth size="small" type="date" label="From" value={fromDate} onChange={(event) => setFromDate(event.target.value)} InputLabelProps={{ shrink: true }} /></Grid><Grid size={{ xs: 12, sm: 6, md: 2 }}><TextField fullWidth size="small" type="date" label="To" value={toDate} onChange={(event) => setToDate(event.target.value)} InputLabelProps={{ shrink: true }} /></Grid></Grid></Paper><Stack spacing={2}><Paper variant="outlined" sx={{ p: 1 }}><Typography variant="h6" sx={{ p: 1 }}>Daily Summary</Typography><MaterialReactTable table={summaryTable} /></Paper><Paper variant="outlined" sx={{ p: 1 }}><Typography variant="h6" sx={{ p: 1 }}>Movement Timeline</Typography><MaterialReactTable table={eventTable} /></Paper></Stack></Box>;
}
