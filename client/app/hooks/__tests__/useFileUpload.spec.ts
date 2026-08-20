import { act, renderHook } from '@testing-library/react';
import { ChangeEvent } from 'react';

import useFileUpload from '../useFileUpload';

describe('useFileUpload', () => {
  it('calls setFile with the selected file', () => {
    const setFile = jest.fn();
    const { result } = renderHook(() => useFileUpload(setFile));
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.handleChange({
        target: { files: [file] },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(setFile).toHaveBeenCalledWith(file);
  });

  it('does nothing when no file is selected', () => {
    const setFile = jest.fn();
    const { result } = renderHook(() => useFileUpload(setFile));

    act(() => {
      result.current.handleChange({
        target: { files: [] },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(setFile).not.toHaveBeenCalled();
  });
});
