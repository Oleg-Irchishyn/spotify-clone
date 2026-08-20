import { render } from '@testing-library/react';

import AlbumItemSkeleton from '../AlbumItemSkeleton';

describe('AlbumItemSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<AlbumItemSkeleton />);

    expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(5);
  });
});
