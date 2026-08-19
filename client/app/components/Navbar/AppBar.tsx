'use client';

import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';

import { drawerWidth } from '../../constants/navigation';
import { AppBarProps } from '../../types/navbar';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        // Below the `m` breakpoint the drawer overlays content instead of
        // pushing it, so the AppBar must stay full width there.
        '@media (min-width: 768px)': {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
        },
      },
    },
  ],
}));

export default AppBar;
