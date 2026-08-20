jest.mock('../useActions', () => ({
  useActions: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';
import { ChangeEvent, FormEvent } from 'react';

import { IAlbum } from '@/app/types/albums';

import { useActions } from '../useActions';
import useEditAlbum from '../useEditAlbum';

const mockedUseActions = useActions as jest.Mock;

const change = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe('useEditAlbum', () => {
  const album: IAlbum = {
    _id: 'id1',
    name: 'A',
    author: 'B',
    picture: 'p.jpg',
  };
  const updateAlbum = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseActions.mockReturnValue({ updateAlbum });
  });

  it('initializes fields from the album and is not dirty', () => {
    const { result } = renderHook(() => useEditAlbum(album, onClose));

    expect(result.current.name.value).toBe('A');
    expect(result.current.author.value).toBe('B');
    expect(result.current.isDirty).toBe(false);
  });

  it('becomes dirty when the name changes', () => {
    const { result } = renderHook(() => useEditAlbum(album, onClose));

    act(() => result.current.name.onChange(change('New name')));

    expect(result.current.isDirty).toBe(true);
  });

  it('becomes dirty when a picture is selected', () => {
    const { result } = renderHook(() => useEditAlbum(album, onClose));
    const file = new File(['x'], 'p.jpg');

    act(() => result.current.setPicture(file));

    expect(result.current.isDirty).toBe(true);
  });

  it('handleSubmit updates the album with a FormData payload and closes', () => {
    const { result } = renderHook(() => useEditAlbum(album, onClose));

    act(() => result.current.name.onChange(change('New name')));

    const preventDefault = jest.fn();
    act(() => {
      result.current.handleSubmit({ preventDefault } as unknown as FormEvent);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(updateAlbum).toHaveBeenCalledWith('id1', expect.any(FormData));
    const formData = updateAlbum.mock.calls[0][1] as FormData;
    expect(formData.get('name')).toBe('New name');
    expect(formData.get('author')).toBe('B');
    expect(onClose).toHaveBeenCalled();
  });

  it('includes the picture in the FormData when one was selected', () => {
    const { result } = renderHook(() => useEditAlbum(album, onClose));
    const file = new File(['x'], 'p.jpg');

    act(() => result.current.setPicture(file));
    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent);
    });

    const formData = updateAlbum.mock.calls[0][1] as FormData;
    expect(formData.get('picture')).toBe(file);
  });
});
