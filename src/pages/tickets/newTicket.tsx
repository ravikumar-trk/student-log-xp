import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useStyles } from '../../theme/styles';
import { useNavigate } from 'react-router-dom';
import RoutePaths from "../../utils/routes";

const NewTicket = () => {
    const { pageDetailsTitle, newTicketCards, newTicketCardTitle, newTicketCardItem, newTicketHr } = useStyles();
    const navigate = useNavigate();


    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
                <h3 style={pageDetailsTitle}>New Ticket</h3>
            </Grid>
            <Grid size={12}>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <Box sx={newTicketCards}>
                            <Box component="p" sx={newTicketCardTitle}>Users</Box>
                            <Box component="hr" sx={newTicketHr} />
                            <div>
                                <Box component="p" sx={newTicketCardItem} onClick={() => navigate(RoutePaths.AddUser)}>Add Users</Box>
                                <Box component="p" sx={newTicketCardItem} onClick={() => navigate(RoutePaths.EditUser)}>Edit Users</Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid size={4}>
                        <Box sx={newTicketCards}>
                            <Box component="p" sx={newTicketCardTitle}>Schools</Box>
                            <Box component="hr" sx={newTicketHr} />
                            <div>
                                <Box component="p" sx={newTicketCardItem} onClick={() => navigate(RoutePaths.AddSchool)}>Add Schools</Box>
                                <Box component="p" sx={newTicketCardItem} onClick={() => navigate(RoutePaths.EditSchool)}>Edit Schools</Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid size={4}>
                        <Box sx={newTicketCards}>
                            <Box component="p" sx={newTicketCardTitle}>Students</Box>
                            <Box component="hr" sx={newTicketHr} />
                            <div>
                                <Box component="p" sx={newTicketCardItem} onClick={() => navigate(RoutePaths.AddStudent)}>Add Students</Box>
                                <Box component="p" sx={newTicketCardItem} onClick={() => navigate(RoutePaths.EditStudent)}>Edit Students</Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid size={4}>
                        <Box sx={newTicketCards}>
                            <Box component="p" sx={newTicketCardTitle}>Upload Excel</Box>
                            <Box component="hr" sx={newTicketHr} />
                            <div>
                                <Box component="p" sx={newTicketCardItem} onClick={() => navigate(RoutePaths.UploadExcel)}>Upload Excel</Box>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default NewTicket;