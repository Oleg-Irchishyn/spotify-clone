jest.mock('@/app/components/TrackDetailsView/TrackDetailsView', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => (
    <div data-testid="track-details-view">{id}</div>
  ),
}));

import { render, screen } from '@testing-library/react';

import TrackDetailsPage, { generateMetadata } from '../page';

const params = Promise.resolve({ id: 'id1' });
const searchParams = Promise.resolve({});

describe('Track details page', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('renders TrackDetailsView with the resolved id', async () => {
    const element = await TrackDetailsPage({ params, searchParams });

    render(element);

    expect(screen.getByTestId('track-details-view')).toHaveTextContent('id1');
  });

  it('generateMetadata returns the track name/artist on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ name: 'Song', artist: 'Artist', text: 'Lyrics' }),
    }) as unknown as typeof fetch;

    const metadata = await generateMetadata({ params, searchParams });

    expect(metadata).toEqual({
      title: 'Music Platform - Song - Artist',
      description: 'Lyrics',
    });
  });

  it('generateMetadata falls back to a "not found" title on a non-ok response', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const metadata = await generateMetadata({ params, searchParams });

    expect(metadata).toEqual({ title: 'Track not found - Music Platform' });
  });

  it('generateMetadata falls back to a generic title when the request throws', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('Network fail')) as unknown as typeof fetch;

    const metadata = await generateMetadata({ params, searchParams });

    expect(metadata).toEqual({ title: 'Music Platform' });
  });
});
