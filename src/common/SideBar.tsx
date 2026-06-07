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
                { text: 'Students List', path: '/students' },
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
            page: 'Reports', icon: <SummarizeIcon />,
            pages: [
                { text: 'Reports', path: '/reports' },
            ]
        },
        {
            page: 'Settings', icon: <SettingsIcon />,
            pages: [
                { text: 'Settings', path: '/settings' },
            ]
        },
    ];
    const [selected, setSelected] = useState('Dashboard');

    const navigateTo = (text: string) => {
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
                {menuItems.map(({ page, icon }) => (
                    <ListItem key={page} disablePadding sx={selected === page ? { backgroundColor: primaryColor.lightColor } : {}}>
                        <ListItemButton
                            selected={selected === page}
                            onClick={() => navigateTo(page)}
                            sx={selected === page ? {
                                '& .MuiListItemIcon-root': { color: '#fff' },
                                '&:hover': { backgroundColor: primaryColor.color },
                            } : {}}
                        >
                            <ListItemIcon
                                style={{
                                    color: getTextColor(selected === page),
                                    minWidth: '45px',
                                }}
                            >
                                {icon}
                            </ListItemIcon>
                            <ListItemText
                                sx={{
                                    color: getTextColor(selected === page),
                                    fontSize: '20px !important',
                                    fontWeight: '600 !important',
                                }}
                                primary={page}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SideBar;

