import useTrackCreationForm from '@/app/hooks/useTrackCreationForm';

type TrackField = ReturnType<typeof useTrackCreationForm>;

interface TrackCreationFormProps {
  name: TrackField;
  artist: TrackField;
  text: TrackField;
}

export { type TrackField, type TrackCreationFormProps };
