import { render } from '@testing-library/react';

import TrackItemSkeleton from '../TrackItemSkeleton';

describe('TrackItemSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<TrackItemSkeleton />);

    expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(7);
  });
});
