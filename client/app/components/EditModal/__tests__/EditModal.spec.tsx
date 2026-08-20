import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditModal from '../EditModal';

describe('EditModal', () => {
  it('renders the title and children when open', () => {
    render(
      <EditModal title="Edit Track" isOpen onClose={jest.fn()}>
        <div>form content</div>
      </EditModal>,
    );

    expect(screen.getByText('Edit Track')).toBeInTheDocument();
    expect(screen.getByText('form content')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    render(
      <EditModal title="Edit Track" isOpen={false} onClose={jest.fn()}>
        <div>form content</div>
      </EditModal>,
    );

    expect(screen.queryByText('form content')).not.toBeInTheDocument();
  });

  it('stops the click from propagating past the modal content', async () => {
    const onOutsideClick = jest.fn();
    render(
      <div onClick={onOutsideClick}>
        <EditModal title="Edit Track" isOpen onClose={jest.fn()}>
          <div>form content</div>
        </EditModal>
      </div>,
    );

    await userEvent.click(screen.getByText('form content'));

    expect(onOutsideClick).not.toHaveBeenCalled();
  });
});
