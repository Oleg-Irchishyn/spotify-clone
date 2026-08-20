jest.mock('@/app/hooks/useContributors', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/app/components/ContributorList/ContributorList', () => ({
  __esModule: true,
  default: ({ contributors }: { contributors: unknown[] }) => (
    <div data-testid="contributor-list">{contributors.length} contributors</div>
  ),
}));

import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import useContributors from '@/app/hooks/useContributors';

import ContributorsView from '../ContributorsView';

const mockedUseContributors = useContributors as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseRouter.mockReturnValue({ back: jest.fn() });
});

describe('ContributorsView', () => {
  it('shows a loader while loading', () => {
    mockedUseContributors.mockReturnValue({
      contributors: [],
      loading: true,
      error: '',
    });

    const { container } = render(<ContributorsView />);

    expect(container.querySelector('.MuiCircularProgress-root')).not.toBeNull();
  });

  it('shows the contributor list once loaded', () => {
    mockedUseContributors.mockReturnValue({
      contributors: [
        { _id: '1', email: 'a@test.com', name: 'A', isActivated: true },
      ],
      loading: false,
      error: '',
    });

    render(<ContributorsView />);

    expect(screen.getByTestId('contributor-list')).toHaveTextContent(
      '1 contributors',
    );
  });

  it('shows the empty state when there are no contributors', () => {
    mockedUseContributors.mockReturnValue({
      contributors: [],
      loading: false,
      error: '',
    });

    render(<ContributorsView />);

    expect(screen.getByText('No contributors found.')).toBeInTheDocument();
  });

  it('shows the empty state on error even without loading', () => {
    mockedUseContributors.mockReturnValue({
      contributors: [],
      loading: false,
      error: 'Server error',
    });

    render(<ContributorsView />);

    expect(screen.getByText('No contributors found.')).toBeInTheDocument();
  });
});
