import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EditFieldConfig } from '@/app/types/editForm';

import EditForm from '../EditForm';

describe('EditForm', () => {
  it('renders a text field with helperText driven by maxLength', () => {
    const fields: EditFieldConfig[] = [
      {
        type: 'text',
        name: 'name',
        label: 'Track Name',
        value: 'hello',
        onChange: jest.fn(),
        maxLength: 30,
      },
    ];

    render(
      <EditForm fields={fields} onSubmit={jest.fn()} onCancel={jest.fn()} />,
    );

    expect(screen.getByLabelText('Track Name')).toHaveValue('hello');
    expect(screen.getByText('5/30')).toBeInTheDocument();
  });

  it('renders a select field with its options', async () => {
    const onChange = jest.fn();
    const fields: EditFieldConfig[] = [
      {
        type: 'select',
        name: 'album',
        label: 'Album',
        value: '',
        onChange,
        options: [
          { value: '', label: 'None' },
          { value: 'a1', label: 'Album 1' },
        ],
      },
    ];

    render(
      <EditForm fields={fields} onSubmit={jest.fn()} onCancel={jest.fn()} />,
    );

    await userEvent.click(screen.getByLabelText('Album'));
    await userEvent.click(await screen.findByText('Album 1'));

    expect(onChange).toHaveBeenCalled();
  });

  it('renders a file field with its label as button text', () => {
    const fields: EditFieldConfig[] = [
      {
        type: 'file',
        name: 'picture',
        label: 'Change Image',
        accept: 'image/*',
        file: undefined,
        setFile: jest.fn(),
      },
    ];

    render(
      <EditForm fields={fields} onSubmit={jest.fn()} onCancel={jest.fn()} />,
    );

    expect(
      screen.getByRole('button', { name: 'Change Image' }),
    ).toBeInTheDocument();
  });

  it('calls onSubmit when the form is submitted', () => {
    const onSubmit = jest.fn((e) => e.preventDefault());
    const { container } = render(
      <EditForm fields={[]} onSubmit={onSubmit} onCancel={jest.fn()} />,
    );

    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = jest.fn();
    render(<EditForm fields={[]} onSubmit={jest.fn()} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalled();
  });

  it('disables the Save button when isSaveDisabled is true', () => {
    render(
      <EditForm
        fields={[]}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        isSaveDisabled
      />,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('enables the Save button when isSaveDisabled is false', () => {
    render(
      <EditForm
        fields={[]}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        isSaveDisabled={false}
      />,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('renders a multiline text field with the given row count', () => {
    const fields: EditFieldConfig[] = [
      {
        type: 'text',
        name: 'text',
        label: 'Lyrics',
        value: '',
        onChange: jest.fn(),
        multiline: true,
        rows: 3,
      },
    ];

    render(
      <EditForm fields={fields} onSubmit={jest.fn()} onCancel={jest.fn()} />,
    );

    expect(screen.getByLabelText('Lyrics').tagName).toBe('TEXTAREA');
  });
});
