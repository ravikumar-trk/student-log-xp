import Grid from '@mui/material/Grid';
import { useStyles } from '../../theme/styles';
import { IconButton } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CommentIcon from '@mui/icons-material/Comment';
import DescriptionIcon from '@mui/icons-material/Description';
import Chip from '../../common/chip';

export default function ticketDetails() {
    const { m_0, flexCenter, verticalCenter, ticketDetailsTitle, trackerIconStyle, displayTitle, displayValue } = useStyles();

    return (
        <>
            <Grid container spacing={2} sx={{ p: 2 }} >
                <Grid size={12}>
                    <h3 style={ticketDetailsTitle}>Login failure for user - TCK-001</h3>
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
                    <h3 style={ticketDetailsTitle}>Request Ticket Details</h3>
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
                                    <div style={displayValue}>Greenwood High School</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <PriorityHighIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Priority</div>
                                    <div style={displayValue}><Chip status="Critical" /></div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <BusinessIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Status</div>
                                    <div style={displayValue}><Chip status="Reviewed" /></div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <PersonIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Requested By</div>
                                    <div style={displayValue}>Ravi Kumar</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <AccessTimeFilledIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Requested On</div>
                                    <div style={displayValue}>2025-10-06</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <EmailIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Requested User Email</div>
                                    <div style={displayValue}>ravi.kumar@example.com</div>
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
                    <h3 style={ticketDetailsTitle}>Admin Review</h3>
                </Grid>
                <Grid size={1}>
                </Grid>
                <Grid size={11}>
                    <Grid container spacing={2}>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <PersonIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Reviewed By</div>
                                    <div style={displayValue}>Ravi Kumar</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <AccessTimeFilledIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Reviewed On</div>
                                    <div style={displayValue}>2025-10-06</div>
                                </div>
                            </div>
                        </Grid>
                        <Grid size={4} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <BusinessIcon style={trackerIconStyle} />
                                <div>
                                    <div style={displayTitle}>Status</div>
                                    <div style={displayValue}><Chip status="Approved" /></div>
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
                    <h3 style={ticketDetailsTitle}>Final Status</h3>
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
                                    <div style={displayValue}><Chip status="Completed" /></div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>

    );
}
