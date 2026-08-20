import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ConfirmDialog from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders the title and description when open', () => {
    render(
      <ConfirmDialog
        open
        title="Delete track"
        description="Are you sure?"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(screen.getByText('Delete track')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('renders nothing visible when closed', () => {
    render(
      <ConfirmDialog
        open={false}
        title="Delete track"
        description="Are you sure?"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(screen.queryByText('Delete track')).not.toBeInTheDocument();
  });

  it('defaults the confirm button label to "Delete"', () => {
    render(
      <ConfirmDialog
        open
        title="t"
        description="d"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('uses a custom confirm label when given', () => {
    render(
      <ConfirmDialog
        open
        title="t"
        description="d"
        confirmLabel="Log out"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  });

  it('calls onConfirm when the confirm button is clicked', async () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmDialog
        open
        title="t"
        description="d"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        open
        title="t"
        description="d"
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalled();
  });
});
