import { Card, Grid, Skeleton } from '@mui/material';
import { FC } from 'react';

import styles from '../../styles/AlbumItem.module.scss';

const AlbumItemSkeleton: FC = () => {
  return (
    <Card className={styles.album}>
      <Skeleton variant="rectangular" width={70} height={70} />
      <Grid container className={styles.album_metadata}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Grid>
      <Grid className={styles.album_actions}>
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="circular" width={48} height={48} />
      </Grid>
    </Card>
  );
};

export default AlbumItemSkeleton;
