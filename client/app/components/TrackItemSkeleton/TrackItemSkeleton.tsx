import { Card, Grid, Skeleton } from '@mui/material';
import { FC } from 'react';

import styles from '../../styles/TrackItem.module.scss';

const TrackItemSkeleton: FC = () => {
  return (
    <Card className={styles.track}>
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton variant="rectangular" width={70} height={70} />
      <Grid container className={styles.track_metadata}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Grid>
      <Grid className={styles.track_actions}>
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="circular" width={48} height={48} />
      </Grid>
    </Card>
  );
};

export default TrackItemSkeleton;
