jest.mock('../TrackDetailsView', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => (
    <div data-testid="track-details-view">{id}</div>
  ),
}));
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';

import TrackDetailsContent from '../TrackDetailsContent';

const mockedUseSearchParams = useSearchParams as jest.Mock;

describe('TrackDetailsContent', () => {
  it('passes the id search param to TrackDetailsView', () => {
    mockedUseSearchParams.mockReturnValue(new URLSearchParams({ id: 'id1' }));

    render(<TrackDetailsContent />);

    expect(screen.getByTestId('track-details-view')).toHaveTextContent('id1');
  });

  it('passes an empty id when the search param is missing', () => {
    mockedUseSearchParams.mockReturnValue(new URLSearchParams());

    render(<TrackDetailsContent />);

    expect(screen.getByTestId('track-details-view')).toHaveTextContent('');
  });
});
