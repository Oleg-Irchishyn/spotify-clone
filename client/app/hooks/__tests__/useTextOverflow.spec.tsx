import { render } from '@testing-library/react';

import useTextOverflow from '../useTextOverflow';

const TestComponent = ({ text }: { text: string }) => {
  const { ref, isOverflowing } = useTextOverflow<HTMLDivElement>(text);

  return (
    <div ref={ref} data-testid="el">
      {isOverflowing ? 'overflow' : 'fit'}
    </div>
  );
};

describe('useTextOverflow', () => {
  let ResizeObserverMock: jest.Mock;

  beforeEach(() => {
    ResizeObserverMock = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
    (global as unknown as { ResizeObserver: unknown }).ResizeObserver =
      ResizeObserverMock;
  });

  it('reports overflow when scrollWidth exceeds clientWidth', () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 100,
    });

    const { getByTestId } = render(<TestComponent text="hello" />);

    expect(getByTestId('el')).toHaveTextContent('overflow');
  });

  it('reports no overflow when content fits', () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 100,
    });

    const { getByTestId } = render(<TestComponent text="hello" />);

    expect(getByTestId('el')).toHaveTextContent('fit');
  });

  it('observes the element and disconnects the observer on unmount', () => {
    const observe = jest.fn();
    const disconnect = jest.fn();
    ResizeObserverMock.mockImplementation(() => ({ observe, disconnect }));

    const { unmount } = render(<TestComponent text="hello" />);

    expect(observe).toHaveBeenCalled();

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
