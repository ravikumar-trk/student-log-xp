import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useStyles } from '../../theme/styles';
import { useNavigate } from 'react-router-dom';
import { AddUser, AddSchool, AddStudent } from "../../utils/routes";

const NewTicket = () => {
    const { ticketDetailsTitle, newTicketCards, newTicketCardTitle, newTicketCardItem, newTicketHr } = useStyles();
    const navigate = useNavigate();


    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
                <h3 style={ticketDetailsTitle}>New Ticket</h3>
            </Grid>
            <Grid size={12}>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <Box sx={newTicketCards}>
                            <Box component="p" sx={newTicketCardTitle}>Users</Box>
                            <Box component="hr" sx={newTicketHr} />
                            <div>
                                <Box component="p" sx={newTicketCardItem} onClick={() => navigate(AddUser)}>Add Users</Box>
                                <Box component="p" sx={newTicketCardItem}>Edit Users</Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid size={4}>
                        <Box sx={newTicketCards}>
                            <Box component="p" sx={newTicketCardTitle}>Schools</Box>
                            <Box component="hr" sx={newTicketHr} />
                            <div>
                                <Box component="p" sx={newTicketCardItem} onClick={() => navigate(AddSchool)}>Add Schools</Box>
                                <Box component="p" sx={newTicketCardItem}>Edit Schools</Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid size={4}>
                        <Box sx={newTicketCards}>
                            <Box component="p" sx={newTicketCardTitle}>Students</Box>
                            <Box component="hr" sx={newTicketHr} />
                            <div>
                                <Box component="p" sx={newTicketCardItem} onClick={() => navigate(AddStudent)}>Add Students</Box>
                                <Box component="p" sx={newTicketCardItem}>Edit Students</Box>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default NewTicket;