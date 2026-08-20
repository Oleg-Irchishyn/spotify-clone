jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

import BackButton from '../BackButton';

const mockedUseRouter = useRouter as jest.Mock;

describe('BackButton', () => {
  it('navigates back when clicked', async () => {
    const back = jest.fn();
    mockedUseRouter.mockReturnValue({ back });
    render(<BackButton />);

    await userEvent.click(screen.getByRole('button', { name: 'go back' }));

    expect(back).toHaveBeenCalled();
  });
});
