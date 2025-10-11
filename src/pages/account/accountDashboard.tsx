import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useStyles } from '../../theme/styles';
import AccountTab from './accountTab';
import SchoolTab from './schoolTab';
import UserTab from './userTab';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
    );
}

export default function accountDashboard() {
    const { tabDividerStyles, tabTitleStyles, tabTitleSelectedStyles, tabIndicatorColor } = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={tabDividerStyles}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    sx={{
                        '& .MuiTabs-indicator': { ...tabIndicatorColor },
                    }}
                >
                    <Tab label="Account" id="account-tab" sx={value === 0 ? tabTitleSelectedStyles : tabTitleStyles} />
                    <Tab label="Schools" id="schools-tab" sx={value === 1 ? tabTitleSelectedStyles : tabTitleStyles} />
                    <Tab label="Users" id="users-tab" sx={value === 2 ? tabTitleSelectedStyles : tabTitleStyles} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <AccountTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <SchoolTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <UserTab />
            </CustomTabPanel>
        </Box>
    );
}
