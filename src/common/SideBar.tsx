import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SummarizeIcon from '@mui/icons-material/Summarize';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAppSelector } from '../hooks/reduxHooks';
import { useStyles } from '../theme/styles';
import { useNavigate, useLocation } from 'react-router-dom';

const SideBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const primaryColor = useAppSelector((state) => state.theme.primaryColor);
    const { sidebarStyles, getTextColor } = useStyles();
    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon /> },
        { text: 'Account', icon: <AccountCircleIcon /> },
        { text: 'Students', icon: <SchoolIcon /> },
        { text: 'Tickets', icon: <FactCheckIcon /> },
        { text: 'Reports', icon: <SummarizeIcon /> },
        { text: 'Settings', icon: <SettingsIcon /> },
    ];
    const [selected, setSelected] = useState('Dashboard');

    const navigateTo = (text: string) => {
        setSelected(text);
        navigate(`/${text.toLowerCase()}`);
    }
    useEffect(() => {
        const path = location.pathname.split('/')[1];
        const currentItem = menuItems.find(item => item.text.toLowerCase() === path);
        if (currentItem) {
            setSelected(currentItem.text);
        } else {
            setSelected('Dashboard');
        }
    }, [location]);

    return (
        <Box sx={sidebarStyles}>
            <List sx={{ p: 0 }}>
                {menuItems.map(({ text, icon }) => (
                    <ListItem key={text} disablePadding sx={selected === text ? { backgroundColor: primaryColor.lightColor } : {}}>
                        <ListItemButton
                            selected={selected === text}
                            onClick={() => navigateTo(text)}
                            sx={selected === text ? {
                                '& .MuiListItemIcon-root': { color: '#fff' },
                                '&:hover': { backgroundColor: primaryColor.color },
                            } : {}}
                        >
                            <ListItemIcon
                                style={{
                                    color: getTextColor(selected === text),
                                    minWidth: '45px',
                                }}
                            >
                                {icon}
                            </ListItemIcon>
                            <ListItemText
                                sx={{
                                    color: getTextColor(selected === text),
                                    fontSize: '20px !important',
                                    fontWeight: '600 !important',
                                }}
                                primary={text}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SideBar;

