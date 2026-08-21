import axios from 'axios';
import { useEffect, useState } from 'react';

import { useActions } from './useActions';
import useAuth from './useAuth';
import useInput from './useInput';
import { extractErrorMessage } from '../utils/extractErrorMessage';
import { resolveAssetUrl } from '../utils/resolveAssetUrl';
import $api from '../lib/http';
import { IComment, ITrack } from '../types/tracks';

const useTrackDetails = (trackId: string) => {
  const { showAlert } = useActions();
  const { user, isActivated } = useAuth();

  const [track, setTrack] = useState<ITrack>();
  const [loading, setLoading] = useState(true);

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
        const message = extractErrorMessage(error);
        showAlert(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadTrackDetails();

    return () => {
      controller.abort();
    };
  }, [trackId, showAlert]);

  const handleAddComment = async () => {
    if (!track) {
      return;
    }

    try {
      const { data } = await $api.post<IComment>('/tracks/comment', {
        username: isActivated && user ? user.name : username.value,
        text: commentText.value,
        trackId: track._id,
      });

      setTrack((prev) =>
        prev ? { ...prev, comments: [...prev.comments, data] } : prev,
      );
      username.reset();
      commentText.reset();
    } catch (error) {
      const message = extractErrorMessage(error);
      showAlert(message);
    }
  };

  return {
    track,
    loading,
    isActivated,
    username,
    commentText,
    handleAddComment,
  };
};

export default useTrackDetails;
