jest.mock('../useActions', () => ({
  useActions: jest.fn(),
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
import useCreateAlbum from '../useCreateAlbum';

const mockedUseActions = useActions as jest.Mock;
const mockedApi = $api as jest.Mocked<typeof $api>;
const mockedUseRouter = useRouter as jest.Mock;

const selectFile = (container: HTMLElement, file: File) => {
  const input = container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
};

describe('useCreateAlbum', () => {
  const showAlert = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseActions.mockReturnValue({ showAlert });
    mockedUseRouter.mockReturnValue({ push });
  });

  it('starts at step 0 rendering the album name/author fields', () => {
    const { result } = renderHook(() => useCreateAlbum());

    expect(result.current.activeStep).toBe(0);
    const { container } = render(<>{result.current.renderStepContent()}</>);
    expect(container.querySelectorAll('input').length).toBeGreaterThan(0);
  });

  it('advances and goes back between steps', () => {
    const { result } = renderHook(() => useCreateAlbum());

    act(() => result.current.handleNextStep());
    expect(result.current.activeStep).toBe(1);

    act(() => result.current.handlePrevStep());
    expect(result.current.activeStep).toBe(0);
  });

  it('shows an alert and does not submit when no picture is provided', async () => {
    const { result } = renderHook(() => useCreateAlbum());
    act(() => result.current.handleNextStep());

    await act(async () => {
      await result.current.handleNextStep();
    });

    expect(showAlert).toHaveBeenCalledWith('Picture file is required');
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('submits the album and navigates to /albums on success', async () => {
    mockedApi.post.mockResolvedValue({});
    const { result, rerender } = renderHook(() => useCreateAlbum());
    act(() => result.current.handleNextStep());
    rerender();

    const file = new File(['x'], 'p.jpg', { type: 'image/jpeg' });
    const { container } = render(<>{result.current.renderStepContent()}</>);
    act(() => selectFile(container, file));

    await act(async () => {
      await result.current.handleNextStep();
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/album', expect.any(FormData));
    expect(push).toHaveBeenCalledWith(ROUTES.ALBUMS);
  });

  it('shows an alert and does not navigate when the upload fails', async () => {
    mockedApi.post.mockRejectedValue(new Error('Upload failed'));
    const { result } = renderHook(() => useCreateAlbum());
    act(() => result.current.handleNextStep());

    const file = new File(['x'], 'p.jpg', { type: 'image/jpeg' });
    const { container } = render(<>{result.current.renderStepContent()}</>);
    act(() => selectFile(container, file));

    await act(async () => {
      await result.current.handleNextStep();
    });

    expect(showAlert).toHaveBeenCalledWith('Upload failed');
    expect(push).not.toHaveBeenCalled();
  });
});
