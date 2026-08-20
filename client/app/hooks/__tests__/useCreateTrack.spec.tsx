jest.mock('../useActions', () => ({
  useActions: jest.fn(),
}));
jest.mock('../useTypedSelector', () => ({
  useTypedSelector: jest.fn(),
}));
jest.mock('@/app/lib/http', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

import { act, fireEvent, render, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import $api from '@/app/lib/http';
import { ROUTES } from '@/app/constants/routes';

import { useActions } from '../useActions';
import useCreateTrack from '../useCreateTrack';
import { useTypedSelector } from '../useTypedSelector';

const mockedUseActions = useActions as jest.Mock;
const mockedUseTypedSelector = useTypedSelector as unknown as jest.Mock;
const mockedApi = $api as jest.Mocked<typeof $api>;
const mockedUseRouter = useRouter as jest.Mock;

const selectFile = (container: HTMLElement, file: File) => {
  const input = container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
};

describe('useCreateTrack', () => {
  const showAlert = jest.fn();
  const fetchAlbums = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseActions.mockReturnValue({ showAlert, fetchAlbums });
    mockedUseTypedSelector.mockImplementation((selector) =>
      selector({ albums: { albums: [] } }),
    );
    mockedUseRouter.mockReturnValue({ push });
  });

  it('fetches albums on mount', () => {
    renderHook(() => useCreateTrack());

    expect(fetchAlbums).toHaveBeenCalledWith('', 100, 0);
  });

  it('starts at step 0 rendering the track fields', () => {
    const { result } = renderHook(() => useCreateTrack());

    expect(result.current.activeStep).toBe(0);
    const { container } = render(<>{result.current.renderStepContent()}</>);
    expect(container.querySelectorAll('input').length).toBeGreaterThan(0);
  });

  it('advances through all three steps and back', () => {
    const { result } = renderHook(() => useCreateTrack());

    act(() => result.current.handleNextStep());
    expect(result.current.activeStep).toBe(1);
    act(() => result.current.handleNextStep());
    expect(result.current.activeStep).toBe(2);

    act(() => result.current.handlePrevStep());
    expect(result.current.activeStep).toBe(1);
  });

  it('shows an alert and does not submit when files are missing', async () => {
    const { result } = renderHook(() => useCreateTrack());
    act(() => result.current.handleNextStep());
    act(() => result.current.handleNextStep());

    await act(async () => {
      await result.current.handleNextStep();
    });

    expect(showAlert).toHaveBeenCalledWith(
      'Picture and audio files are required',
    );
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('submits the track and navigates to /tracks on success', async () => {
    mockedApi.post.mockResolvedValue({});
    const { result } = renderHook(() => useCreateTrack());
    act(() => result.current.handleNextStep());

    const picture = new File(['x'], 'p.jpg', { type: 'image/jpeg' });
    const { container: pictureStep } = render(
      <>{result.current.renderStepContent()}</>,
    );
    act(() => selectFile(pictureStep, picture));
    act(() => result.current.handleNextStep());

    const audio = new File(['x'], 'a.mp3', { type: 'audio/mpeg' });
    const { container: audioStep } = render(
      <>{result.current.renderStepContent()}</>,
    );
    act(() => selectFile(audioStep, audio));

    await act(async () => {
      await result.current.handleNextStep();
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/tracks',
      expect.any(FormData),
    );
    expect(push).toHaveBeenCalledWith(ROUTES.TRACKS);
  });

  it('shows an alert and does not navigate when the upload fails', async () => {
    mockedApi.post.mockRejectedValue(new Error('Upload failed'));
    const { result } = renderHook(() => useCreateTrack());
    act(() => result.current.handleNextStep());

    const picture = new File(['x'], 'p.jpg', { type: 'image/jpeg' });
    const { container: pictureStep } = render(
      <>{result.current.renderStepContent()}</>,
    );
    act(() => selectFile(pictureStep, picture));
    act(() => result.current.handleNextStep());

    const audio = new File(['x'], 'a.mp3', { type: 'audio/mpeg' });
    const { container: audioStep } = render(
      <>{result.current.renderStepContent()}</>,
    );
    act(() => selectFile(audioStep, audio));

    await act(async () => {
      await result.current.handleNextStep();
    });

    expect(showAlert).toHaveBeenCalledWith('Upload failed');
    expect(push).not.toHaveBeenCalled();
  });
});
