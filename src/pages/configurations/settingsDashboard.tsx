import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useStyles } from '../../theme/styles';
import { useNavigate } from 'react-router-dom';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import RoutePaths from "../../utils/routes";

const ConfigurationsDashboard = () => {
    const { pageDetailsTitle, configurationsCards, configurationsCardItemStyle, configurationsCardIconStyle } = useStyles();
    const navigate = useNavigate();


    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
                <h3 style={pageDetailsTitle}>Configurations</h3>
            </Grid>
            <Grid size={12}>
                <Grid container spacing={2}>
                    <Grid size={12} onClick={() => navigate(RoutePaths.ConfigureClasses)}>
                        <Box sx={configurationsCards}>
                            <Box component="p" sx={configurationsCardItemStyle}>Configure Classes</Box>
                            <ArrowRightAltIcon sx={configurationsCardIconStyle} />
                        </Box>
                    </Grid>
                    <Grid size={12} onClick={() => navigate(RoutePaths.Holidays)}>
                        <Box sx={configurationsCards}>
                            <Box component="p" sx={configurationsCardItemStyle}>Configure Holidays</Box>
                            <ArrowRightAltIcon sx={configurationsCardIconStyle} />
                        </Box>
                    </Grid>
                    <Grid size={12} onClick={() => navigate(RoutePaths.Subjects)}>
                        <Box sx={configurationsCards}>
                            <Box component="p" sx={configurationsCardItemStyle}>Subjects</Box>
                            <ArrowRightAltIcon sx={configurationsCardIconStyle} />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ConfigurationsDashboard;