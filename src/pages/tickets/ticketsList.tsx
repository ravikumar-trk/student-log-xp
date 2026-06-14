import { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { useStyles } from '../../theme/styles';
import { GetTableOptions } from '../../common/tableStyles';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ThemedButton from '../../common/ThemedButton';
import Chip from '../../common/chip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { formatDateTime } from '../../utils/function';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import RoutePaths from '../../utils/routes';
import ticketsSerices from "../../services/ticketsSerices";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import masterServices from '../../services/masterSerices';
import type { UserModel } from '../../models/UserModel';
import ThemedAutocomplete from '../../common/ThemedAutocomplete';

// Ticket data type
type Ticket = {
    TicketName: string;
    IssueType: string;
    CreatedBy: string;
    CreatedOn: string; // ISO date or formatted
    Priority: string;
    Status: string;
};



export default function TicketsList() {
    // startDate and endDate state
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const navigate = useNavigate();
    const { ticketListTextStyle, ticketListIconStyle } = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const theme = useTheme();
    const
        fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [users, setUsers] = useState<UserModel[]>([]);
    const [usersLoading, setUsersLoading] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

    const getUsersByAccountIDAPI = async () => {
        try {
            const res: any = await masterServices.getUsersByAccountID(-1);
            setUsersLoading(true);
            setTimeout(() => {
                setUsers(res?.data?.Result ?? []);
                setUsersLoading(false);
            }, 1000);
        } catch (err: any) {
            setUsersLoading(false);
            console.error(err?.message ?? err);
            alert(err?.message ?? 'Failed to fetch account details');
        }
    }

    const handleClickOpenDialog = () => {
        const selectedRows = table.getSelectedRowModel().flatRows;
        if (selectedRows.length === 0) {
            alert('Please select a ticket to assign');
            return;
        }
        getUsersByAccountIDAPI();
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };


    function timeAgo(isoDate?: string) {
        if (!isoDate) return 'some time ago';
        const date = new Date(isoDate);
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        const units: { name: Intl.RelativeTimeFormatUnit; secs: number }[] = [
            { name: 'year', secs: 31536000 },
            { name: 'month', secs: 2592000 },
            { name: 'day', secs: 86400 },
            { name: 'hour', secs: 3600 },
            { name: 'minute', secs: 60 },
            { name: 'second', secs: 1 },
        ];

        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        for (const u of units) {
            const value = Math.round(seconds / u.secs);
            if (Math.abs(value) >= 1) {
                // Intl.RelativeTimeFormat expects negative for past values
                return rtf.format(-value, u.name);
            }
        }

        return 'just now';
    }

    // Top-level cell renderer components/functions
    const CreatedCell: React.FC<{ value?: string }> = ({ value }) => (
        <div>
            <p style={{
                fontWeight: '700',
                margin: '0px',
                marginBottom: '2px',
                fontSize: '15px',
            }}>{`${timeAgo(value)}`}</p>
            <span>{formatDateTime(value)}</span>
        </div>
    );
    const StatusCell: React.FC<{ value?: string }> = ({ value }) => (
        <div>
            <Chip status={value || ''} />
        </div>
    );

    // Priority cell with color mapping
    const priorityColorMap: Record<string, string> = {
        Critical: '#c62828', // red
        High: '#ef6c00', // orange
        Medium: '#f9a825', // amber/yellow
        Low: '#2e7d32', // green
    };

    const PriorityCell: React.FC<{ value?: string }> = ({ value }) => {
        const text = value || '';
        const color = priorityColorMap[text] || '#41464b';
        return <span style={{ color, fontWeight: 700 }}>{text}</span>;
    };

    // Small adapters so the column Cell can reference a top-level function (avoids inline functions)
    const CreatedCellRenderer = ({ cell }: any) => <CreatedCell value={cell.getValue()} />;
    const StatusCellRenderer = ({ cell }: any) => <StatusCell value={cell.getValue()} />;
    const PriorityCellRenderer = ({ cell }: any) => <PriorityCell value={cell.getValue()} />;
    const ActionsCellRenderer = ({ cell }: any) => {
        const ticket = cell.row.original as Ticket;
        return (
            <Tooltip title="View" arrow>
                <IconButton
                    aria-label={`view-${ticket.TicketName}`}
                    onClick={() => {
                        // Replace with navigation/modal logic as needed
                        // eslint-disable-next-line no-console
                        // console.log('View ticket', ticket);
                        // alert(`View ticket ${ticket.TicketName}: ${ticket.IssueType}`);
                        navigateToTicketDetails(ticket);
                    }}
                    size="small"
                >
                    <VisibilityIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        );
    };


    const columns = useMemo<MRT_ColumnDef<Ticket>[]>(
        () => [
            { accessorKey: 'TicketName', header: 'Ticket No.', size: 160 },
            { accessorKey: 'IssueType', header: 'Issue', size: 400 },
            { accessorKey: 'Priority', header: 'Priority', size: 120, Cell: PriorityCellRenderer },
            { accessorKey: 'CreatedBy', header: 'Requested By', size: 200 },
            { accessorKey: 'CreatedOn', header: 'Requested On', size: 160, Cell: CreatedCellRenderer },
            { accessorKey: 'Status', header: 'Status', size: 120, Cell: StatusCellRenderer },
            { id: 'actions', header: 'Actions', size: 80, Cell: ActionsCellRenderer },
        ],
        [],
    );
    const renderTopToolbarCustomActions = () => (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '8px' }}>
            <div
                style={{ display: 'flex', cursor: 'pointer', ...ticketListTextStyle }}
                onClick={handleClickOpenDialog}
            >
                <ManageAccountsIcon style={ticketListIconStyle} /> <span> Assign</span>
            </div>
        </div>
    );


    const table = useMaterialReactTable({
        columns,
        data: tickets,
        state: {
            isLoading: loading,
            showLoadingOverlay: false,
        },
        enableRowSelection: true,
        renderTopToolbarCustomActions: () => (
            renderTopToolbarCustomActions()
        ),
        ...(GetTableOptions() as any),
    });

    const navigateToNewTicket = () => {
        navigate(RoutePaths.NewTicket);
    }

    const navigateToTicketDetails = (ticket: Ticket) => {
        navigate(`${RoutePaths.TicketDetails}`, { state: { ticket } });
    }

    const fetchTickets = async () => {
        try {
            const AccountID = 1;
            const schoolIDs = '1,9';
            const response = await ticketsSerices.getTickets(AccountID, schoolIDs);
            console.log('Fetched tickets:', response);
            setLoading(false);
            setTickets(response?.data?.Result ?? []);
        }
        catch (err: any) {
            console.error('Error fetching tickets:', err?.message ?? err);
            setLoading(false);
            alert(err?.message ?? 'Failed to fetch tickets');
        }
    }

    const handleAssignTicketToUser = async () => {
        try {
            debugger
            const selectedRows = table.getSelectedRowModel().flatRows;
            if (selectedRows.length === 0) {
                alert('Please select a ticket to assign');
                return;
            }
            // 
            const ticketIds = selectedRows.map((row) => row.original.TicketID);
            const userId = selectedUser?.UserID;
            if (!userId) {
                alert('Please select a user to assign the ticket to');
                return;
            }
            const response = await ticketsSerices.assignTicketsToUser(ticketIds.join(','), userId);
            if (response.status === 200) {
                console.log('Assign ticket response:', response);
                alert(response.data.Message || 'Ticket(s) assigned successfully');
                // Optionally, refresh tickets list after assignment
                fetchTickets();
            }
            if (response.status === 202) {
                alert(response.data.Warnings[0] || 'Ticket assignment returned a warning');
            }
        }
        catch (err: any) {
            console.error('Error assigning ticket:', err?.message ?? err);
            alert(err?.message ?? 'Failed to assign ticket');
        }
        finally {
            setOpenDialog(false);
            setSelectedUser(null);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchTickets();
    }, []);

    const userProps = {
        options: users,
        blurOnSelect: true,
        getOptionLabel: (option: UserModel) => option.UserName,
        loading: usersLoading,
        value: selectedUser,
        onChange: (_: any, newValue: UserModel | null) => {
            setSelectedUser(newValue);
        },
    };


    return <>
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={8}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                        {/* Start date: disable past dates by setting minDate to today */}
                        <DatePicker
                            label="Start date"
                            value={startDate}
                            onChange={(newValue) => {
                                // When startDate changes, if endDate is before new start, clear endDate
                                setStartDate(newValue);
                                if (newValue && endDate?.isBefore(newValue, 'day')) {
                                    setEndDate(null);
                                }
                            }}
                            // disable dates before today
                            minDate={dayjs().startOf('day')}
                            // if an endDate exists, don't allow start after end
                            maxDate={endDate ?? undefined}
                        />

                        {/* End date: cannot be before start date; disable past dates */}
                        <DatePicker
                            label="End date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            // disable dates before today; ensure endDate is not before startDate
                            minDate={
                                startDate?.startOf('day')?.isAfter(dayjs().startOf('day'))
                                    ? startDate.startOf('day')
                                    : dayjs().startOf('day')
                            }
                        // optionally, you could set a maxDate for endDate; omitted here
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </Grid>
            <Grid size={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                <ThemedButton
                    text="Clear"
                    variant="outlined"
                    onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                    }}
                    // disable clear when both are already null
                    disabled={!startDate && !endDate}
                /> &nbsp;&nbsp;
                <ThemedButton text="Search" variant="contained" /> &nbsp;&nbsp;
                <ThemedButton text="New Ticket" variant="contained" handleClick={navigateToNewTicket} />
            </Grid>
        </Grid >
        <MaterialReactTable table={table} />
        <Dialog
            fullScreen={fullScreen}
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                Assign Ticket to User
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Grid container spacing={2} sx={{ width: '500px' }}>
                        <Grid size={12}>
                            <ThemedAutocomplete
                                {...userProps}
                                id="user-select"
                                disableCloseOnSelect
                                label="Users"
                            />
                        </Grid>
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ paddingBottom: '16px' }}>
                <ThemedButton
                    text="Close"
                    variant="outlined"
                    autoFocus onClick={handleClose}
                /> &nbsp;&nbsp;
                <ThemedButton text="Assign" variant="contained" onClick={handleAssignTicketToUser} autoFocus /> &nbsp;&nbsp;
            </DialogActions>
        </Dialog>
    </>;
}
