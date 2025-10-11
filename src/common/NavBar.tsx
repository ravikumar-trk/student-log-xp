import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Drawer, ToggleButtonGroup, ToggleButton, Box } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { darkModeTextColor, themeColors } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setTheme, setPrimaryColor, setSkin } from '../features/theme/themeSlice';
import { useStyles } from '../theme/styles';


const NavBar: React.FC = () => {
  const { themeBoxStyle, navTitleStyle, themeSectionStyle, themeDrawerTitleStyle, appBarStyles, navIconButtonStyle, navIconStyle, toggleButtonStyle, themeColorBoxStyle, themeColorButtonsStyle, skinDefaultButtonStyle, skinBorderedButtonStyle, themeModeCardStyle, themeModeIconsStyle, themeModeTextStyle } = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const primaryColor = useAppSelector((state) => state.theme.primaryColor);
  const mode = useAppSelector((state) => state.theme.mode);
  const skin = useAppSelector((state) => state.theme.skin);

  const dispatch = useAppDispatch();

  // Placeholder handlers for UI
  const handlePrimaryColorChange = (color: string, lightColor: string) => {
    dispatch(setPrimaryColor({ color, lightColor }));
  };

  const handleThemeModeChange = (_: any, value: 'light' | 'dark') => {
    if (value) {
      dispatch(setTheme(value));
    }
  };

  const handleSkinChange = (_: any, value: 'default' | 'bordered') => {
    if (value) {
      dispatch(setSkin(value));
    }
  };

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <AppBar
      position="static"
      sx={appBarStyles}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" style={navTitleStyle} component="div">
          Student Log
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <IconButton style={navIconButtonStyle} onClick={handleDrawerOpen}>
            <PaletteIcon style={navIconStyle} />
          </IconButton>
          <IconButton style={navIconButtonStyle} >
            <PersonIcon style={navIconStyle} />
          </IconButton>
          <Avatar alt="Profile" src="/profile.png" />
        </div>
      </Toolbar>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose} >
        <Box sx={themeBoxStyle} >
          <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', pb: 2, mb: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography style={themeSectionStyle}>
              Theming
            </Typography>
            <IconButton aria-label="close drawer" onClick={handleDrawerClose} sx={{ ml: 1 }}>
              <CloseIcon style={{ color: mode === 'dark' ? darkModeTextColor : '#000' }} />
            </IconButton>
          </Box>
          <Typography variant="body2" style={themeDrawerTitleStyle}>
            Primary Color
          </Typography>
          <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: "16px" }}>
            {themeColors.map(({ color, lightColor }, i) => (
              <Box
                key={color}
                sx={themeColorBoxStyle(color)}
                onClick={() => handlePrimaryColorChange(color, lightColor)}
              >
                <IconButton
                  key={color}
                  sx={themeColorButtonsStyle(color)}
                >
                  {primaryColor.color === color && <PaletteIcon sx={{ color: '#000' }} />}
                </IconButton>
              </Box>
            ))}
          </Box>
          <Typography variant="body2" style={themeDrawerTitleStyle} >
            Theme
          </Typography>
          <Box sx={{ display: 'flex', gap: "24px", mb: 4 }}>
            <Box
              onClick={() => handleThemeModeChange(null, 'light')}
              sx={themeModeCardStyle(mode === 'light')}
            >
              <LightModeIcon sx={themeModeIconsStyle("light")} />
              <Typography variant="body2" sx={themeModeTextStyle("light")}>Light</Typography>
            </Box>
            <Box
              onClick={() => handleThemeModeChange(null, 'dark')}
              sx={themeModeCardStyle(mode === 'dark')}
            >
              <DarkModeIcon sx={themeModeIconsStyle("dark")} />
              <Typography variant="body2" sx={themeModeTextStyle("dark")}>Dark</Typography>
            </Box>
          </Box>
          <Typography variant="body2" style={themeDrawerTitleStyle}>
            Skins
          </Typography>
          <Box sx={{ display: 'flex', gap: "24px", mb: 4 }}>
            <Box
              onClick={() => handleSkinChange(null, 'default')}
              sx={themeModeCardStyle(skin === 'default')}
            >
              <Box sx={skinDefaultButtonStyle} />
              <Typography variant="body2" sx={themeModeTextStyle("default")}>Default</Typography>
            </Box>
            <Box
              onClick={() => handleSkinChange(null, 'bordered')}
              sx={themeModeCardStyle(skin === 'bordered')}
            >
              <Box sx={skinBorderedButtonStyle} />
              <Typography variant="body2" sx={themeModeTextStyle("bordered")}>Bordered</Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default NavBar;
