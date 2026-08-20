'use client';

import { Box, Button, Card, Chip, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

import useTracks from '@/app/hooks/useTracks';
import BackButton from '@/app/components/BackButton/BackButton';
import EmptyState from '@/app/components/EmptyState/EmptyState';
import Search from '@/app/components/Search/Search';
import TrackList from '@/app/components/TrackList/TrackList';
import TracksPagination from '@/app/components/TracksPagination/TracksPagination';

import styles from '../../styles/TracksView.module.scss';

const TracksView = () => {
  const {
    tracks,
    loading,
    error,
    isActivated,
    handleTrackUpload,
    query,
    handleSearch,
    page,
    pageCount,
    handlePageChange,
    activeAlbum,
    handleClearActiveAlbum,
  } = useTracks();

  const showEmptyState = !loading && (tracks.length === 0 || !!error);

  return (
    <div>
      <BackButton />
      <Grid container spacing={2} className={styles.view_container}>
        <Card className={styles.view_card}>
          <Box className={styles.header_box}>
            <Grid container className={styles.header_row}>
              <Typography className={styles.title} variant="h3">
                Tracklist
              </Typography>
              {!showEmptyState && isActivated && (
                <Button onClick={handleTrackUpload} variant="contained">
                  Upload
                </Button>
              )}
            </Grid>
            {activeAlbum && (
              <Chip
                label={`Album: ${activeAlbum.name}`}
                onDelete={handleClearActiveAlbum}
                className={styles.active_album_chip}
              />
            )}
          </Box>
          {showEmptyState ? (
            <EmptyState message="No tracks found." />
          ) : (
            <>
              <Search query={query} onChange={handleSearch} />
              <TrackList tracks={tracks} loading={loading} />
              <TracksPagination
                page={page}
                pageCount={pageCount}
                onChange={handlePageChange}
              />
            </>
          )}
        </Card>
      </Grid>
    </div>
  );
};

export default TracksView;
