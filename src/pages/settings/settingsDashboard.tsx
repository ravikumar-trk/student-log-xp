import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useStyles } from '../../theme/styles';
import { useNavigate } from 'react-router-dom';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import RoutePaths from "../../utils/routes";

const SettingsDashboard = () => {
    const { pageDetailsTitle, settingsCards, settingsCardItemStyle, settingsCardIconStyle } = useStyles();
    const navigate = useNavigate();


    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
                <h3 style={pageDetailsTitle}>Settings</h3>
            </Grid>
            <Grid size={12}>
                <Grid container spacing={2}>
                    <Grid size={12} onClick={() => navigate(RoutePaths.ConfigureClasses)}>
                        <Box sx={settingsCards}>
                            <Box component="p" sx={settingsCardItemStyle}>Configure Classes</Box>
                            <ArrowRightAltIcon sx={settingsCardIconStyle} />
                        </Box>
                    </Grid>
                    <Grid size={12} onClick={() => navigate(RoutePaths.Holidays)}>
                        <Box sx={settingsCards}>
                            <Box component="p" sx={settingsCardItemStyle}>Configure Holidays</Box>
                            <ArrowRightAltIcon sx={settingsCardIconStyle} />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SettingsDashboard;