'use client';

import { Box, Button, Card, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

import useAlbums from '@/app/hooks/useAlbums';
import AlbumList from '@/app/components/AlbumList/AlbumList';
import AlbumsPagination from '@/app/components/AlbumsPagination/AlbumsPagination';
import Search from '@/app/components/Search/Search';

import styles from '../../styles/AlbumsView.module.scss';

const AlbumsView = () => {
  const {
    albums,
    loading,
    handleAlbumUpload,
    query,
    handleSearch,
    page,
    pageCount,
    handlePageChange,
  } = useAlbums();

  return (
    <div>
      <Grid container spacing={2} className={styles.view_container}>
        <Card className={styles.view_card}>
          <Box className={styles.header_box}>
            <Grid container className={styles.header_row}>
              <Typography className={styles.title} variant="h3">
                Album lists
              </Typography>
              <Button onClick={handleAlbumUpload} variant="contained">
                Upload
              </Button>
            </Grid>
          </Box>
          <Search
            query={query}
            onChange={handleSearch}
            placeholder="Search Albums..."
          />
          <AlbumList albums={albums} loading={loading} />
          <AlbumsPagination
            page={page}
            pageCount={pageCount}
            onChange={handlePageChange}
          />
        </Card>
      </Grid>
    </div>
  );
};

export default AlbumsView;
