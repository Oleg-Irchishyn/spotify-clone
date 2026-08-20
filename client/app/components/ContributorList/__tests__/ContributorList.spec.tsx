import { render, screen } from '@testing-library/react';

import { IContributor } from '@/app/types/contributor';

import ContributorList from '../ContributorList';

const contributors: IContributor[] = [
  { _id: '1', email: 'a@test.com', name: 'A', isActivated: true },
  { _id: '2', email: 'b@test.com', name: 'B', isActivated: true },
];

describe('ContributorList', () => {
  it('renders one item per contributor', () => {
    render(<ContributorList contributors={contributors} />);

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('renders nothing when the list is empty', () => {
    const { container } = render(<ContributorList contributors={[]} />);

    expect(container.querySelectorAll('.MuiCard-root')).toHaveLength(0);
  });
});
