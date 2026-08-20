jest.mock('@/app/hooks/useTypedSelector', () => ({
  useTypedSelector: jest.fn(),
}));

import { render, screen } from '@testing-library/react';

import { useTypedSelector } from '@/app/hooks/useTypedSelector';

import ContentArea from '../ContentArea';

const mockedUseTypedSelector = useTypedSelector as unknown as jest.Mock;

describe('ContentArea', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the children', () => {
    mockedUseTypedSelector.mockReturnValue(null);

    render(
      <ContentArea>
        <div data-testid="page-content" />
      </ContentArea>,
    );

    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('does not reserve extra bottom space when no track is active', () => {
    mockedUseTypedSelector.mockReturnValue(null);

    const { container } = render(
      <ContentArea>
        <div />
      </ContentArea>,
    );

    expect(container.firstChild).toHaveClass('content_container');
    expect(container.firstChild).not.toHaveClass(
      'content_container_with_player',
    );
  });

  it('reserves extra bottom space for the fixed player when a track is active', () => {
    mockedUseTypedSelector.mockReturnValue({ _id: 'id1', name: 'Track' });

    const { container } = render(
      <ContentArea>
        <div />
      </ContentArea>,
    );

    expect(container.firstChild).toHaveClass('content_container_with_player');
  });
});
