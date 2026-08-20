import Album from '@mui/icons-material/Album';
import Group from '@mui/icons-material/Group';
import Home from '@mui/icons-material/Home';
import MusicNote from '@mui/icons-material/MusicNote';

import { ROUTES } from './routes';

export const drawerWidth = 240;

export const menuItems = [
  { text: 'Main', href: ROUTES.HOME, icon: Home },
  { text: 'Tracklist', href: ROUTES.TRACKS, icon: MusicNote },
  { text: 'Album lists', href: ROUTES.ALBUMS, icon: Album },
  { text: 'Contributors', href: ROUTES.CONTRIBUTORS, icon: Group },
];
