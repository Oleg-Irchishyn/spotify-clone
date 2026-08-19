'use client';

import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';

import useMounted from '@/app/hooks/useMounted';

import styles from '../../styles/ThemeToggle.module.scss';

const ThemeToggle = () => {
  const { mode, setMode } = useColorScheme();
  const mounted = useMounted();

  const handleToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return <IconButton aria-label="toggle theme" disabled />;
  }

  return (
    <IconButton
      aria-label="toggle theme"
      onClick={handleToggle}
      color="inherit"
      className={styles.toggle_button}
    >
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default ThemeToggle;
