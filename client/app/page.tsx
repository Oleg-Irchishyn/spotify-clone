import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';

import styles from './styles/Home.module.scss';

export const metadata: Metadata = {
  title: 'Music Platform',
  description: 'Music Platform. The best tracks are gathered here.',
};

export default function Home() {
  return (
    <main>
      <div className="center">
        <Typography className={styles.title} variant="h1" component="h1">
          Welcome!
        </Typography>
        <Typography className={styles.subtitle} variant="h5" component="h2">
          Best tracks are gathered here!
        </Typography>
      </div>
    </main>
  );
}
