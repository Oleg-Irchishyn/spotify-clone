'use client';

import { Box, Button, Card, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import useTracks from '../hooks/useTracks';
import TrackList from '../components/TrackList/TrackList';

export default function TracksPage() {
  const { tracks, handleTrackUpload } = useTracks();
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
          <TrackList tracks={tracks} />
        </Card>
      </Grid>
    </div>
  );
}
