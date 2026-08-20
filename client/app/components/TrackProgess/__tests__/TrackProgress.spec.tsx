import { fireEvent, render, screen } from '@testing-library/react';

import TrackProgress from '../TrackProgress';

describe('TrackProgress', () => {
  it('renders raw numeric labels by default', () => {
    render(<TrackProgress left={30} right={100} onChange={jest.fn()} />);

    expect(screen.getByText('30 / 100')).toBeInTheDocument();
  });

  it('formats labels as time when formatAsTime is set', () => {
    render(
      <TrackProgress left={65} right={125} onChange={jest.fn()} formatAsTime />,
    );

    expect(screen.getByText('1:05 / 2:05')).toBeInTheDocument();
  });

  it('calls onChange when the range input changes', async () => {
    const onChange = jest.fn();
    render(<TrackProgress left={0} right={100} onChange={onChange} />);

    const input = screen.getByRole('slider');
    fireEvent.change(input, { target: { value: '5' } });

    expect(onChange).toHaveBeenCalled();
  });
});
