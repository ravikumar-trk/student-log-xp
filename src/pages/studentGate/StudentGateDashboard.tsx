import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_PaginationState, type MRT_TableOptions } from 'material-react-table';
import { useAppSelector } from '../../hooks/reduxHooks';
import masterServices from '../../services/masterSerices';
import studentGateServices from '../../services/studentGateServices';
import type { SchoolModel } from '../../models/SchoolModel';
import type { StudentGateDashboardRow, StudentGateDashboardSummary } from '../../models/StudentGateModel';
import { GetTableOptions } from '../../common/tableStyles';
import LiveGateActivity from './LiveGateActivity';

const today = new Date().toISOString().slice(0, 10);
const formatTime = (value?: string | null) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';

function Metric({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
    return <Paper variant="outlined" sx={{ p: 2, height: '100%', borderTop: `3px solid ${color}` }}><Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ color }}>{icon}</Box><Box><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h5" fontWeight={700}>{value.toLocaleString()}</Typography></Box></Stack></Paper>;
}

export default function StudentGateDashboard() {
    const user = useAppSelector((state) => state.common.userLoginInfo);
    const [schools, setSchools] = useState<SchoolModel[]>([]);
    const [schoolID, setSchoolID] = useState(0);
    const [date, setDate] = useState(today);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [rows, setRows] = useState<StudentGateDashboardRow[]>([]);
    const [summary, setSummary] = useState<StudentGateDashboardSummary>({ TotalRows: 0, CurrentlyInside: 0, CurrentlyOutside: 0, NotYetEntered: 0, LateArrivals: 0, EarlyExits: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 25 });

    useEffect(() => {
        void masterServices.getSchoolsByAccountID(user.AccountID).then((response) => {
            const values = response.data?.Result ?? [];
            setSchools(values);
            setSchoolID((current) => current || values[0]?.SchoolID || 0);
        }).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load schools.'));
    }, [user.AccountID]);

    useEffect(() => {
        if (!schoolID) return;
        let mounted = true;
        setLoading(true);
        void studentGateServices.getDashboard({ SchoolID: schoolID, AttendanceDate: date, PageNumber: pagination.pageIndex + 1, PageSize: pagination.pageSize, Search: search || null, Status: status || null })
            .then((response) => { if (mounted) { setRows(response.data?.Result ?? []); setSummary((current) => response.data?.Summary ?? current); setError(''); } })
            .catch((err: unknown) => { if (mounted) setError(err instanceof Error ? err.message : 'Unable to load gate dashboard.'); })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [schoolID, date, pagination, search, status]);

    const columns = useMemo<MRT_ColumnDef<StudentGateDashboardRow>[]>(() => [
        { accessorKey: 'StudentName', header: 'Student' },
        { accessorKey: 'AdmissionNo', header: 'Admission No.' },
        { accessorKey: 'ClassID', header: 'Class' },
        { accessorKey: 'FirstInTime', header: 'First IN', Cell: ({ cell }) => formatTime(cell.getValue<string>()) },
        { accessorKey: 'LastOutTime', header: 'Last OUT', Cell: ({ cell }) => formatTime(cell.getValue<string>()) },
        { accessorKey: 'TotalPresenceMinutes', header: 'Presence', Cell: ({ cell }) => `${Math.floor(Number(cell.getValue()) / 60)}h ${Number(cell.getValue()) % 60}m` },
        { accessorKey: 'CurrentStatus', header: 'Status' },
        { accessorKey: 'LastGate', header: 'Last Gate' },
        { accessorKey: 'LastSwipeTime', header: 'Last Swipe', Cell: ({ cell }) => formatTime(cell.getValue<string>()) },
    ], []);

    const table = useMaterialReactTable({ ...(GetTableOptions() as unknown as MRT_TableOptions<StudentGateDashboardRow>), columns, data: rows, manualPagination: true, rowCount: summary.TotalRows, onPaginationChange: setPagination, state: { isLoading: loading, pagination } });

    return <Box sx={{ p: { xs: 1, md: 2 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2} sx={{ mb: 2 }}>
            <Box><Typography variant="h4" fontWeight={700}>School Gate Attendance</Typography><Typography color="text.secondary">Physical entrance and exit status for students</Typography></Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField select size="small" label="School" value={schoolID} onChange={(event) => setSchoolID(Number(event.target.value))} sx={{ minWidth: 180 }}>{schools.map((school) => <MenuItem key={school.SchoolID} value={school.SchoolID}>{school.SchoolName}</MenuItem>)}</TextField>
                <TextField size="small" type="date" label="Date" value={date} onChange={(event) => setDate(event.target.value)} InputLabelProps={{ shrink: true }} />
            </Stack>
        </Stack>
        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><Metric label="Total Students" value={summary.TotalRows} icon={<PeopleAltOutlinedIcon />} color="#1565c0" /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><Metric label="Currently Inside" value={summary.CurrentlyInside} icon={<LoginRoundedIcon />} color="#2e7d32" /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><Metric label="Currently Outside" value={summary.CurrentlyOutside} icon={<LogoutRoundedIcon />} color="#c62828" /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><Metric label="Late Arrivals" value={summary.LateArrivals} icon={<ScheduleOutlinedIcon />} color="#ed6c02" /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}><Metric label="Early Exits" value={summary.EarlyExits} icon={<ExitToAppOutlinedIcon />} color="#6a1b9a" /></Grid>
        </Grid>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 8 }}><Paper variant="outlined" sx={{ p: 1 }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ p: 1 }}><TextField size="small" label="Search student or admission no." value={search} onChange={(event) => { setSearch(event.target.value); setPagination((current) => ({ ...current, pageIndex: 0 })); }} /><TextField select size="small" label="Status" value={status} onChange={(event) => { setStatus(event.target.value); setPagination((current) => ({ ...current, pageIndex: 0 })); }} sx={{ minWidth: 150 }}><MenuItem value="">All</MenuItem><MenuItem value="INSIDE">Inside</MenuItem><MenuItem value="OUTSIDE">Outside</MenuItem><MenuItem value="NOT_ENTERED">Not entered</MenuItem></TextField></Stack><MaterialReactTable table={table} /></Paper></Grid>
            <Grid size={{ xs: 12, lg: 4 }}>{schoolID > 0 && <LiveGateActivity schoolID={schoolID} />}</Grid>
        </Grid>
    </Box>;
}
