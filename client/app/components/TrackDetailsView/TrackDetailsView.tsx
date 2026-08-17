'use client';

import useTrackDetails from '@/app/hooks/useTrackDetails';
import { Button, Grid, TextField, Typography } from '@mui/material';
import Image from 'next/image';

interface TrackDetailsViewProps {
  id: string;
}

const TrackDetailsView = ({ id }: Readonly<TrackDetailsViewProps>) => {
  const { track, handleRedirectToTracks, username, commentText, handleAddComment } =
    useTrackDetails(id);

  if (!track) {
    return null;
  }

  return (
    <div>
      Track {id}
      <Button size="medium" variant="outlined" onClick={handleRedirectToTracks}>
        Back to Tracks
      </Button>
      <Grid container sx={{ margin: '20px 0' }}>
        <Image width={200} height={200} src={track.picture} alt={track.name} />
        <div style={{ marginLeft: '30px' }}>
          <Typography variant="h6">Track name: {track.name}</Typography>
          <Typography variant="h6">Artist: {track.artist}</Typography>
          <Typography variant="h6">Number of listens: {track.listens}</Typography>
        </div>
      </Grid>
      <Typography variant="h6">TrackLyrics</Typography>
      <Typography variant="body1">{track.text}</Typography>
      <Typography variant="h6">Comments</Typography>
      <Grid container>
        <TextField value={username.value} onChange={username.onChange} label="Your name" fullWidth />
        <TextField
          value={commentText.value}
          onChange={commentText.onChange}
          label="Your comment"
          fullWidth
          multiline
          rows={4}
        />
        <Button onClick={handleAddComment}>Send</Button>
      </Grid>
      <div>
        {track.comments.map((comment) => (
          <div key={comment._id}>
            <div>Author:{comment.username}</div>
            <div>Comment: {comment.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackDetailsView;
