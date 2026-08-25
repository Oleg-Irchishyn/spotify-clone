jest.mock('../useActions', () => ({
  useActions: jest.fn(),
}));
jest.mock('../useTypedSelector', () => ({
  useTypedSelector: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';
import { ChangeEvent, FormEvent } from 'react';

import { ITrack } from '@/app/types/tracks';

import { useActions } from '../useActions';
import useEditTrack from '../useEditTrack';
import { useTypedSelector } from '../useTypedSelector';

const mockedUseActions = useActions as jest.Mock;
const mockedUseTypedSelector = useTypedSelector as unknown as jest.Mock;

const change = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe('useEditTrack', () => {
  const track: ITrack = {
    _id: 'id1',
    name: 'Track',
    artist: 'Artist',
    text: 'Lyrics',
    listens: 0,
    audio: 'audio.mp3',
    picture: 'picture.jpg',
    comments: [],
    album: 'album1',
  };
  const updateTrack = jest.fn();
  const fetchAlbums = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseActions.mockReturnValue({ updateTrack, fetchAlbums });
    mockedUseTypedSelector.mockImplementation((selector) =>
      selector({ albums: { albums: [{ _id: 'album1', name: 'A' }] } }),
    );
  });

  it('fetches albums on mount', () => {
    renderHook(() => useEditTrack(track, onClose));

    expect(fetchAlbums).toHaveBeenCalledWith('', 100, 0);
  });

  it('initializes fields from the track and is not dirty', () => {
    const { result } = renderHook(() => useEditTrack(track, onClose));

    expect(result.current.name.value).toBe('Track');
    expect(result.current.albumId).toBe('album1');
    expect(result.current.isDirty).toBe(false);
  });

  it('defaults albumId to an empty string when the track has none', () => {
    const { result } = renderHook(() =>
      useEditTrack({ ...track, album: undefined }, onClose),
    );

    expect(result.current.albumId).toBe('');
  });

  it('becomes dirty when the album selection changes', () => {
    const { result } = renderHook(() => useEditTrack(track, onClose));

    act(() => result.current.handleAlbumChange(change('')));

    expect(result.current.isDirty).toBe(true);
  });

  it('handleSubmit updates the track with a FormData payload and closes', async () => {
    const { result } = renderHook(() => useEditTrack(track, onClose));

    act(() => result.current.name.onChange(change('New name')));

    await act(() =>
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent),
    );

    expect(updateTrack).toHaveBeenCalledWith('id1', expect.any(FormData));
    const formData = updateTrack.mock.calls[0][1] as FormData;
    expect(formData.get('name')).toBe('New name');
    expect(formData.get('album')).toBe('album1');
    expect(onClose).toHaveBeenCalled();
    expect(result.current.isSaving).toBe(false);
  });

  it('omits the album field when cleared', () => {
    const { result } = renderHook(() => useEditTrack(track, onClose));

    act(() => result.current.handleAlbumChange(change('')));
    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent);
    });

    const formData = updateTrack.mock.calls[0][1] as FormData;
    expect(formData.get('album')).toBeNull();
  });

  it('includes picture/audio files in the FormData when selected', () => {
    const { result } = renderHook(() => useEditTrack(track, onClose));
    const picture = new File(['x'], 'p.jpg');
    const audio = new File(['x'], 'a.mp3');

    act(() => result.current.setPicture(picture));
    act(() => result.current.setAudio(audio));
    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent);
    });

    const formData = updateTrack.mock.calls[0][1] as FormData;
    expect(formData.get('picture')).toBe(picture);
    expect(formData.get('audio')).toBe(audio);
  });
});
