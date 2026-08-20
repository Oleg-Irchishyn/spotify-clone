import { render, screen } from '@testing-library/react';

import ContributorItem from '../ContributorItem';

describe('ContributorItem', () => {
  it("renders the contributor's name", () => {
    render(
      <ContributorItem
        contributor={{
          _id: '1',
          email: 'a@test.com',
          name: 'A Contributor',
          isActivated: true,
        }}
      />,
    );

    expect(screen.getByText('A Contributor')).toBeInTheDocument();
  });
});
