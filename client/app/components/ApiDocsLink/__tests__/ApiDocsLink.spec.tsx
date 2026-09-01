import { render, screen } from '@testing-library/react';

import ApiDocsLink from '../ApiDocsLink';

describe('ApiDocsLink', () => {
  it('links to the server-hosted Swagger docs, opened in a new tab', () => {
    render(<ApiDocsLink />);

    const link = screen.getByRole('link', { name: 'API docs' });
    expect(link).toHaveAttribute(
      'href',
      `${process.env.NEXT_PUBLIC_SERVER_URL}/docs`,
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
