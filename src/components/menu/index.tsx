import {
  BikeScooter as BikeScooterIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Group as GroupIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import {
  AppBarProps as MuiAppBarProps, Avatar, Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Toolbar,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NextLink from 'next/link';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/auth-context';
import { stringAvatar } from '../../utils/theme';
import { AppBar, DrawerHeader, Main } from './styles';

export const drawerWidth = 240;

export type AppBarProps = MuiAppBarProps & {
  open?: boolean;
  theme?: Theme;
};

const MENU_ITEMS = [
  { icon: GroupIcon, title: 'Users', link: '/users', role: 'manager' },
  { icon: BikeScooterIcon, title: 'Bikes', link: '/bikes', role: 'manager' },
  { icon: BookmarkBorderIcon, title: 'Rentals', link: '/rentals', role: 'user' },
];

export const Menu: React.FC = ({ children }) => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" noWrap component="div">
              Bike Rentals
            </Typography>

            {user && <Avatar {...stringAvatar(user?.name)} />}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
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
        <Divider />
        <List>
          {MENU_ITEMS.filter(m => m.role === user.role).map(({ title, icon: Icon, link }, index) => (
            <NextLink href={link} key={index}>
              <ListItem button>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItem>
            </NextLink>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open} theme={theme}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};
