import { fireEvent, render, screen } from '@testing-library/react';

import FileUpload from '../FileUpload';

describe('FileUpload', () => {
  it('renders its children as the visible trigger', () => {
    render(
      <FileUpload setFile={jest.fn()} accept="image/*">
        <button type="button">Upload Image</button>
      </FileUpload>,
    );

    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  it('applies the accept attribute to the hidden file input', () => {
    const { container } = render(
      <FileUpload setFile={jest.fn()} accept="audio/*">
        <span>Upload Audio</span>
      </FileUpload>,
    );

    expect(container.querySelector('input[type="file"]')).toHaveAttribute(
      'accept',
      'audio/*',
    );
  });

  it('calls setFile with the selected file', () => {
    const setFile = jest.fn();
    const { container } = render(
      <FileUpload setFile={setFile} accept="image/*">
        <span>Upload</span>
      </FileUpload>,
    );
    const file = new File(['x'], 'p.jpg', { type: 'image/jpeg' });
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(setFile).toHaveBeenCalledWith(file);
  });
});
