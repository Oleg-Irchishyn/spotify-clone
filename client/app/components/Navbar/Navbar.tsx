'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import useNavbar from '@/app/hooks/useNavbar';
import LogoutButton from '@/app/components/LogoutButton/LogoutButton';
import ThemeToggle from '@/app/components/ThemeToggle/ThemeToggle';

import AppBar from './AppBar';
import DrawerHeader from './DrawerHeader';
import styles from '../../styles/Navbar.module.scss';

export default function Navbar() {
  const {
    theme,
    open,
    drawerRef,
    menuItems,
    isMenuItemActive,
    handleSelectMenuItem,
    handleDrawerOpen,
    handleDrawerClose,
  } = useNavbar();

  return (
    <Box className={styles.root}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={`${styles.menu_button} ${open ? styles.menu_button_hidden : ''}`}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Music Platform
          </Typography>
          <ThemeToggle />
          <LogoutButton />
        </Toolbar>
      </AppBar>
      <Drawer
        ref={drawerRef}
        className={styles.drawer}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          {menuItems.map(({ text, href, icon: Icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                selected={isMenuItemActive(href)}
                onClick={() => {
                  handleSelectMenuItem(href);
                }}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
