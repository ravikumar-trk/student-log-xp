
import Grid from '@mui/material/Grid';
import { useStyles } from '../../theme/styles';
import blueLogo from '../../assets/images/rubiks_trsprnt_bg.png'
import whiteLogo from '../../assets/images/rubiks_transparenr_white.png'
import { useAppSelector } from '../../hooks/reduxHooks';
import Chip from '../../common/chip';
import { IconButton } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useEffect, useState } from 'react';
import masterServices from '../../services/masterSerices';
import type { AccountModel } from '../../models/AccountModel';


const AccountTab = () => {
    const { accountTabStyles, accountTabImageDiv, accountTabLogo, displayTitle, displayValue, navIconButtonStyle, navIconStyle } = useStyles();
    const primaryColor = useAppSelector((state) => state.theme.primaryColor);
    const mode = useAppSelector((state) => state.theme.mode);
    const skin = useAppSelector((state) => state.theme.skin);
    const [account, setAccount] = useState<AccountModel | null>(null);

    const getAccountDetailsAPI = async () => {
        try {
            const res: any = await masterServices.getAccountDetails(2);
            const data: AccountModel | null = res?.data?.Data[0] ?? null;
            setAccount(data);
        } catch (err: any) {
            console.error(err?.message ?? err);
            alert(err?.message ?? 'Failed to fetch account details');
        }
    }

    useEffect(() => {
        getAccountDetailsAPI();
    }, []);

    const selectedLogo = mode === "dark" ? whiteLogo : blueLogo;

    return (
        <Grid container spacing={2} style={accountTabStyles}>
            <Grid size={3} style={accountTabImageDiv}>
                <img src={selectedLogo} style={accountTabLogo} />
            </Grid>
            <Grid size={9} style={{ paddingLeft: 24 }}>
                <Grid container spacing={2}>
                    <Grid size={4} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <IconButton style={navIconButtonStyle}>
                                <BusinessIcon style={navIconStyle} />
                            </IconButton>
                            <div>
                                <div style={displayTitle}>Name</div>
                                <div style={displayValue}>{account?.AccountName ?? '-'}</div>
                            </div>
                        </div>
                    </Grid>
                    <Grid size={4} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <IconButton style={navIconButtonStyle}>
                                <EmailIcon style={navIconStyle} />
                            </IconButton>
                            <div>
                                <div style={displayTitle}>Email</div>
                                <div style={displayValue}>{account?.Email ?? '-'}</div>
                            </div>
                        </div>
                    </Grid>
                    <Grid size={4} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <IconButton style={navIconButtonStyle}>
                                <AccessTimeFilledIcon style={navIconStyle} />
                            </IconButton>
                            <div>
                                <div style={displayTitle}>Registered On</div>
                                <div style={displayValue}>{account?.CreatedOn ?? '-'}</div>
                            </div>
                        </div>
                    </Grid>
                    <Grid size={4} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <IconButton style={navIconButtonStyle}>
                                <AnalyticsIcon style={navIconStyle} />
                            </IconButton>
                            <div>
                                <div style={displayTitle}>Plan</div>
                                <div style={displayValue}><Chip status='glod' /></div>
                            </div>
                        </div>
                    </Grid>
                    <Grid size={4} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <IconButton style={navIconButtonStyle}>
                                <SchoolIcon style={navIconStyle} />
                            </IconButton>
                            <div>
                                <div style={displayTitle}>Schools</div>
                                <div style={displayValue}>{account?.Schools ?? '-'}</div>
                            </div>
                        </div>
                    </Grid>
                    <Grid size={4} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <IconButton style={navIconButtonStyle}>
                                <GroupIcon style={navIconStyle} />
                            </IconButton>
                            <div>
                                <div style={displayTitle}>Users</div>
                                <div style={displayValue}>{account?.Users ?? '-'}</div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default AccountTab;