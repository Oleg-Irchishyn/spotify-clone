import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useActions } from './useActions';
import useInput from './useInput';
import { resolveAssetUrl } from '../utils/resolveAssetUrl';
import $api from '../lib/http';
import { ROUTES } from '../constants/routes';
import { IComment, ITrack } from '../types/tracks';

const useTrackDetails = (trackId: string) => {
  const router = useRouter();
  const { showAlert } = useActions();

  const [track, setTrack] = useState<ITrack>();

  const username = useInput('');
  const commentText = useInput('');

  useEffect(() => {
    const controller = new AbortController();

    const loadTrackDetails = async () => {
      try {
        const { data } = await $api.get<ITrack>(`/tracks/${trackId}`, {
          signal: controller.signal,
        });
        setTrack({
          ...data,
          picture: resolveAssetUrl(data.picture),
          audio: resolveAssetUrl(data.audio),
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        const message = error instanceof Error ? error.message : 'Server error';
        showAlert(message);
      }
    };

    loadTrackDetails();

    return () => {
      controller.abort();
    };
  }, [trackId, showAlert]);

  const handleRedirectToTracks = () => {
    router.push(ROUTES.TRACKS);
  };

  const handleAddComment = async () => {
    if (!track) {
      return;
    }

    try {
      const { data } = await $api.post<IComment>('/tracks/comment', {
        username: username.value,
        text: commentText.value,
        trackId: track._id,
      });

      setTrack((prev) =>
        prev ? { ...prev, comments: [...prev.comments, data] } : prev,
      );
      username.reset();
      commentText.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      showAlert(message);
    }
  };

  return {
    handleRedirectToTracks,
    track,
    username,
    commentText,
    handleAddComment,
  };
};

export default useTrackDetails;
