'use client';

import { Headphones, Send } from '@mui/icons-material';
import { Avatar, Button, Grid, TextField, Typography } from '@mui/material';
import Image from 'next/image';

import useTrackDetails from '@/app/hooks/useTrackDetails';
import BackButton from '@/app/components/BackButton/BackButton';
import Loader from '@/app/components/Loader/Loader';
import {
  COMMENT_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
} from '@/app/constants/validation';
import { TrackDetailsViewProps } from '@/app/types/trackDetailsView';

import styles from '../../styles/TrackDetailsView.module.scss';

const TrackDetailsView = ({ id }: Readonly<TrackDetailsViewProps>) => {
  const { track, loading, username, commentText, handleAddComment } =
    useTrackDetails(id);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!track) {
    return null;
  }

  const isCommentValid =
    username.value.trim().length > 0 && commentText.value.trim().length > 0;

  return (
    <div className={styles.page}>
      <BackButton />

      <div className={styles.hero}>
        <Image
          width={240}
          height={240}
          quality={90}
          src={track.picture}
          alt={track.name}
          className={styles.cover}
        />
        <div className={styles.hero_info}>
          <span className={styles.eyebrow}>Track</span>
          <Typography variant="h3" className={styles.track_name}>
            {track.name}
          </Typography>
          <Typography variant="h6" className={styles.track_artist}>
            {track.artist}
          </Typography>
          <div className={styles.listens}>
            <Headphones fontSize="small" />
            <span>{track.listens} listens</span>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <Typography variant="h6" className={styles.section_title}>
          Lyrics
        </Typography>
        <Typography variant="body1" className={styles.lyrics}>
          {track.text}
        </Typography>
      </section>

      <section className={styles.section}>
        <Typography variant="h6" className={styles.section_title}>
          Comments
        </Typography>

        <Grid container className={styles.comment_form}>
          <TextField
            value={username.value}
            onChange={username.onChange}
            label="Your name"
            helperText={`${username.value.length}/${USERNAME_MAX_LENGTH}`}
            slotProps={{ htmlInput: { maxLength: USERNAME_MAX_LENGTH } }}
            fullWidth
          />
          <TextField
            value={commentText.value}
            onChange={commentText.onChange}
            label="Your comment"
            helperText={`${commentText.value.length}/${COMMENT_MAX_LENGTH}`}
            slotProps={{ htmlInput: { maxLength: COMMENT_MAX_LENGTH } }}
            fullWidth
            multiline
            rows={3}
          />
          <Button
            onClick={handleAddComment}
            variant="contained"
            endIcon={<Send />}
            disabled={!isCommentValid}
            className={styles.send_button}
          >
            Send
          </Button>
        </Grid>

        <div className={styles.comment_list}>
          {track.comments.map((comment) => (
            <div key={comment._id} className={styles.comment}>
              <Avatar className={styles.comment_avatar}>
                {comment.username.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <div className={styles.comment_author}>{comment.username}</div>
                <div className={styles.comment_text}>{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TrackDetailsView;
