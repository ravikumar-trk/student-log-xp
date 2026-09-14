import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SummarizeIcon from '@mui/icons-material/Summarize';
import TuneIcon from '@mui/icons-material/Tune';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useAppSelector } from '../hooks/reduxHooks';
import { useStyles } from '../theme/styles';
import { useNavigate, useLocation } from 'react-router-dom';

const SideBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const primaryColor = useAppSelector((state) => state.theme.primaryColor);
    const { sidebarStyles, getTextColor } = useStyles();
    const menuItems = [
        { page: 'Dashboard', icon: <DashboardIcon /> },
        {
            page: 'Account', icon: <AccountCircleIcon />,
            pages: [
                { text: 'Account', path: '/account' },
            ]
        },
        {
            page: 'Students', icon: <SchoolIcon />,
            pages: [
                { text: 'Students', path: '/students' },
            ]
        },
        {
            page: 'Tickets', icon: <FactCheckIcon />,
            pages: [
                { text: 'Ticket List', path: '/tickets' },
                { text: 'New Ticket', path: '/tickets/new' },
                { text: 'Ticket Details', path: '/ticket-details' },
            ]
        },
        {
            page: 'Daily-Work', icon: <AssignmentIcon />,
            pages: [
                { text: 'Daily Work', path: '/daily-work' },
                { text: 'Assign Work', path: '/daily-work/assign' },
                { text: 'Submissions', path: '/daily-work/submissions' },
            ]
        },
        {
            page: 'Attendance', icon: <HowToRegIcon />,
            pages: [
                { text: 'Attendance', path: '/attendance' },
                { text: 'History', path: '/attendance/history' },
                { text: 'Manual Entry', path: '/attendance/manual' },
            ]
        },
        {
            page: 'Reports', icon: <SummarizeIcon />,
            pages: [
                { text: 'Reports', path: '/reports' },
            ]
        },
        {
            page: 'Configurations', icon: <TuneIcon />,
            pages: [
                { text: 'Configurations', path: '/configurations' },
            ]
        },
    ];
    const [selected, setSelected] = useState('Dashboard');

    const navigateTo = (text: string) => {
        debugger
        setSelected(text);
        navigate(`/${text.toLowerCase()}`);
    }

    const getCurrentPage = (pathname: string) => {
        return (
            menuItems.find(menu =>
                menu.pages?.some(page => page.path === pathname)
            )?.page || ""
        );
    };

    useEffect(() => {
        const currentPage = getCurrentPage(location.pathname);
        if (currentPage) {
            setSelected(currentPage);
        } else {
            setSelected('Dashboard');
        }
    }, [location]);

    return (
        <Box sx={sidebarStyles}>
            <List sx={{ p: 0 }}>
                {menuItems.map(item => (
                    <ListItem key={item.page} disablePadding sx={selected === item.page ? { backgroundColor: primaryColor.lightColor } : {}}>
                        <ListItemButton
                            selected={selected === item.page}
                            onClick={() => navigateTo(item.page)}
                            sx={selected === item.page ? {
                                '& .MuiListItemIcon-root': { color: '#fff' },
                                '&:hover': { backgroundColor: primaryColor.color },
                            } : {}}
                        >
                            <ListItemIcon
                                style={{
                                    color: getTextColor(selected === item.page),
                                    minWidth: '45px',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                sx={{
                                    color: getTextColor(selected === item.page),
                                    fontSize: '20px !important',
                                    fontWeight: '600 !important',
                                }}
                                primary={item.page}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SideBar;

