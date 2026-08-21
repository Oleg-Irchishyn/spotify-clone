import { Box, Grid } from '@mui/material';
import { FC } from 'react';

import { AlbumListProps } from '@/app/types/albumList';

import AlbumItem from '../AlbumItem/AlbumItem';
import AlbumItemSkeleton from '../AlbumItemSkeleton/AlbumItemSkeleton';
import styles from '../../styles/AlbumList.module.scss';

const AlbumList: FC<Readonly<AlbumListProps>> = ({ albums, loading }) => {
  const skeletonCount = albums.length || 1;

  return (
    <Grid container className={styles.list_container}>
      <Box className={styles.list_box}>
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <AlbumItemSkeleton key={index} />
            ))
          : albums.map((album) => <AlbumItem key={album._id} album={album} />)}
      </Box>
    </Grid>
  );
};

export default AlbumList;
