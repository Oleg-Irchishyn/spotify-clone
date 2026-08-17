'use client';

import { Box, Button, Card, Grid, Pagination } from '@mui/material';
import Typography from '@mui/material/Typography';

import useTracks from '@/app/hooks/useTracks';
import Search from '@/app/components/Search/Search';
import TrackList from '@/app/components/TrackList/TrackList';

const TracksView = () => {
  const { tracks, handleTrackUpload, page, pageCount, handlePageChange } =
    useTracks();
  return (
    <div>
      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
        <Card sx={{ width: 900 }}>
          <Box sx={{ p: 3 }}>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 'bold' }} variant="h3">
                Tracklist
              </Typography>
              <Button onClick={handleTrackUpload} variant="contained">
                Upload
              </Button>
            </Grid>
          </Box>
          <Search />
          <TrackList tracks={tracks} />
          <Grid
            sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
            />
          </Grid>
        </Card>
      </Grid>
    </div>
  );
};

export default TracksView;
