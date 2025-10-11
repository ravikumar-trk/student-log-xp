
import Grid from '@mui/material/Grid';
import { useStyles } from '../../theme/styles';
import blueLogo from '../../assets/rubiks_trsprnt_bg.png'
import whiteLogo from '../../assets/rubiks_transparenr_white.png'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import Chip from '../../common/chip';

const AccountTab = () => {
    const { accountTabStyles, accountTabImageDiv, accountTabLogo, displayTitle, displayValue } = useStyles();
    const primaryColor = useAppSelector((state) => state.theme.primaryColor);
    const mode = useAppSelector((state) => state.theme.mode);
    const skin = useAppSelector((state) => state.theme.skin);

    const selectedLogo = mode === "dark" ? whiteLogo : blueLogo;

    return (
        <Grid container spacing={2} style={accountTabStyles}>
            <Grid size={4} style={accountTabImageDiv}>
                <img src={selectedLogo} style={accountTabLogo} />
            </Grid>
            <Grid size={8} style={{ paddingLeft: 24 }}>
                <Grid container spacing={2}>
                    <Grid size={4} style={{ marginBottom: 10 }}>
                        <div style={displayTitle}>Name</div>
                        <div style={displayValue}>Rubiks</div>
                    </Grid>
                    <Grid size={4}>
                        <div style={displayTitle}>Email</div>
                        <div style={displayValue}>rubiks@example.com</div>
                    </Grid>
                    <Grid size={4}>
                        <div style={displayTitle}>Registered On</div>
                        <div style={displayValue}>2022-01-01</div>
                    </Grid>
                    <Grid size={4}>
                        <div style={displayTitle}>Plan</div>
                        <div style={displayValue}><Chip status='gold' /></div>
                    </Grid>
                    <Grid size={4}>
                        <div style={displayTitle}>Schools</div>
                        <div style={displayValue}>5</div>
                    </Grid>
                    <Grid size={4}>
                        <div style={displayTitle}>Users</div>
                        <div style={displayValue}>10</div>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default AccountTab;