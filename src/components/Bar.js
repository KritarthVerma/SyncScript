import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slider from '@mui/material/Slider';


function Bar(props) {
  const { window,handleLanguageChange,handleFontSizeChange,fontSize,handleThemeChange,theme } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLanguageDialog, setOpenLanguageDialog] = useState(false);
  const [openFontSizeDialog, setOpenFontSizeDialog] = useState(false);
  const [openThemeDialog, setOpenThemeDialog] = useState(false);

  const backgroundColor = `${theme==="dark"?"#1c1e29":"#fff"}`;
  const textColor = `${theme==="dark"?"white":"black"}`;

  const drawerWidth = 150;
  const navItems = [
    { label: 'Language', action: () => handleLanguageClick() },
    { label: 'Font Size', action: () => handleFontSizeClick() },
    { label: 'Theme', action: () => handleThemeClick() },
  ];
   const languages = [
    {label:'C++', value:"cpp"},
    {label:'Python', value:"python"},
    {label:'C', value:"c"},
    {label:'Java', value:"java"},
   ];

  const handleLanguageClick = () => {
    setOpenLanguageDialog(true);
  };

  const handleCloseLanguageDialog = () => {
    setOpenLanguageDialog(false);
  };

  const handleLanguageSelect = (language)=>{
    const event = {
      target : {value:language},
    };
    handleLanguageChange(event);
    handleCloseLanguageDialog()
  }

  const handleFontSizeClick = () => {
    setOpenFontSizeDialog(true);
  };

  const handleCloseFontSizeDialog = () => {
    setOpenFontSizeDialog(false);
  };
  
  const handleThemeClick = () => {
    setOpenThemeDialog(true);
  };

  const handleCloseThemeDialog = () => {
    setOpenThemeDialog(false);
  };

  const handleThemeSelect = (theme) => {
    const event = {
      target : {value:theme},
    }
    handleThemeChange(event);
    handleCloseThemeDialog();
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={item.action}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{
        display: 'flex',
        height:"9vh",
        minHeight:"9vh",
        justifyContent:"center",
        alignItems:"center",
        }}>
      <CssBaseline />
      <AppBar component="nav"
            sx={{width:"100%",
                position:"relative",
                backgroundColor:backgroundColor,
            }}>
        <Toolbar>
          <div className='logo'>
            <img className="logoImage" src='/logo2.png' alt='logo'/>
          </div>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ml:"auto",
                mr: 0,
                display: 'none',
                '@media (max-width: 980px)': {
                    display: 'block',
                },
            }}
          >
            <SettingsIcon sx={{color:textColor}}/>
          </IconButton>
          <Box sx={{width:"80%",
                display: 'flex',
                '@media (max-width: 980px)': {
                    display: 'none',
                },
                justifyContent:"space-evenly"
                }}
            >
            {navItems.map((item) => (
              <Button key={item.label} sx={{color: textColor }} onClick={item.action}>
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/*Side Drawer*/}

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: 'none',
            '@media (max-width: 980px)': {
                display: 'block',
            },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      {/*Dialog for Language Selection*/}

      <Dialog open={openLanguageDialog} onClose={handleCloseLanguageDialog}>
        <DialogTitle>Select Language</DialogTitle>
        <DialogContent>
          <List>
            {languages.map((language) => (
              <ListItem button key={language.label} onClick={() => handleLanguageSelect(language.value)}>
                <ListItemText primary={language.label} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLanguageDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/*Dialog for Font Size Selection*/}

      <Dialog open={openFontSizeDialog} onClose={handleCloseFontSizeDialog}>
        <DialogTitle>Select Font Size</DialogTitle>
        <DialogContent>
          <Slider
            value={fontSize}
            onChange={handleFontSizeChange}
            aria-labelledby="font-size-slider"
            min={10}
            max={36}
            valueLabelDisplay="auto"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFontSizeDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/*Dialog for Theme Selection*/}

      <Dialog open={openThemeDialog} onClose={handleCloseThemeDialog}>
        <DialogTitle>Select Theme</DialogTitle>
        <DialogContent>
          <List>
            <ListItem button onClick={() => handleThemeSelect('dark')}>
              <ListItemText primary="Dark" />
            </ListItem>
            <ListItem button onClick={() => handleThemeSelect('light')}>
              <ListItemText primary="Light" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseThemeDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Bar;
