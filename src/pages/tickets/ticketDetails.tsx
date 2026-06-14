import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useStyles } from '../../theme/styles';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CommentIcon from '@mui/icons-material/Comment';
import DescriptionIcon from '@mui/icons-material/Description';
// import Chip from '../../common/chip';
import TextChip from '../../common/chip/TextChip';
import StatusChip from '../../common/chip/statusChip';
import { useLocation, useNavigate } from "react-router-dom";
import ticketsSerices from "../../services/ticketsSerices";
import RoutePaths from '../../utils/routes';

export default function ticketDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const ticket = location?.state?.ticket;
    const { m_0, flexCenter, verticalCenter, pageDetailsTitle, trackerIconStyle, displayTitle, displayValue } = useStyles();
    const [ticketDetails, setTicketDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!location.state?.ticket) {
            navigate(RoutePaths.TicketsList, { replace: true });
        }
    }, [location.state, navigate]);

    const fetchTicketDetails = async () => {
        try {
            const response = await ticketsSerices.getTicketDetails(ticket.TicketID);
            console.log('Fetched ticket details:', response);
            setLoading(false);
            setTicketDetails(response?.data?.Result[0] ?? []);
        }
        catch (err: any) {
            console.error('Error fetching ticket details:', err?.message ?? err);
            setLoading(false);
            alert(err?.message ?? 'Failed to fetch ticket details');
        }
    }

    useEffect(() => {
        if (ticket?.TicketID) {
            fetchTicketDetails();
        }
    }, [ticket]);

    return (
        <>
            <Grid container spacing={2} sx={{ p: 2 }} >
                <Grid size={12}>
                    <h3 style={pageDetailsTitle}>Login failure for user - TCK-001</h3>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ p: '0px 16px' }} >
                <Grid size={12}>
                    <hr style={m_0} />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ p: 2 }} >
                <Grid size={1} style={flexCenter}>
                    <CheckCircleOutlineIcon style={trackerIconStyle} />
                </Grid>
                <Grid size={11} style={verticalCenter}>
                    <h3 style={pageDetailsTitle}>Request Ticket Details</h3>
                </Grid>
                <Grid size={1}>
                </Grid>
                <Grid size={11}>
                    <Grid container spacing={2}>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <BusinessIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>School</div>
                                    <div style={displayValue}>{ticketDetails?.SchoolName}</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <PriorityHighIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Priority</div>
                                    <div style={displayValue}><TextChip text={ticketDetails?.Priority} /></div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <BusinessIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Status</div>
                                    <div style={displayValue}><StatusChip status={ticketDetails?.Status} /></div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <PersonIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Requested By</div>
                                    <div style={displayValue}>{ticketDetails?.CreatedByName}</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <AccessTimeFilledIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Requested On</div>
                                    <div style={displayValue}>{ticketDetails?.CreatedOn}</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <EmailIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Requested User Email</div>
                                    <div style={displayValue}>{ticketDetails?.CreatedByUserEmail}</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={12} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <DescriptionIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Description</div>
                                    <div style={displayValue}>Login failure for user</div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ p: '0px 16px' }} >
                <Grid size={12}>
                    <hr style={m_0} />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ p: 2 }} >
                <Grid size={1} style={flexCenter}>
                    <CheckCircleOutlineIcon style={trackerIconStyle} />
                </Grid>
                <Grid size={11} style={verticalCenter}>
                    <h3 style={pageDetailsTitle}>Admin Review</h3>
                </Grid>
                <Grid size={1}>
                </Grid>
                <Grid size={11}>
                    <Grid container spacing={2}>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <PersonIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Assigned To</div>
                                    <div style={displayValue}>{ticketDetails?.AssignedToName || 'Not assigned'}</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <AccessTimeFilledIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Assigned On</div>
                                    <div style={displayValue}>{ticketDetails?.AssignedOn || 'Not assigned'}</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <BusinessIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Status</div>
                                    <div style={displayValue}><StatusChip status="Approved" /></div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <AccessTimeFilledIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Estimated Date</div>
                                    <div style={displayValue}>2025-10-10</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <CommentIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Comments</div>
                                    <div style={displayValue}>No comments yet</div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ p: '0px 16px' }} >
                <Grid size={12}>
                    <hr style={m_0} />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ p: 2 }} >
                <Grid size={1} style={flexCenter}>
                    <CheckCircleOutlineIcon style={trackerIconStyle} />
                </Grid>
                <Grid size={11} style={verticalCenter}>
                    <h3 style={pageDetailsTitle}>Final Status</h3>
                </Grid>
                <Grid size={1}>
                </Grid>
                <Grid size={11}>
                    <Grid container spacing={2}>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <AccessTimeFilledIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Colmpleted On</div>
                                    <div style={displayValue}>2025-10-06</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <BusinessIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Status</div>
                                    <div style={displayValue}><StatusChip status="Completed" /></div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>

    );
}
