import { render } from '@testing-library/react';

import Loader from '../Loader';

describe('Loader', () => {
  it('renders a progress spinner inline by default', () => {
    const { container } = render(<Loader />);

    expect(container.querySelector('.MuiCircularProgress-root')).not.toBeNull();
  });

  it('renders full-screen when requested', () => {
    const { container } = render(<Loader fullScreen />);

    expect(container.firstElementChild).toHaveClass(/full_screen/);
  });
});
