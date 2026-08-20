/**
 * @jest-environment node
 */
import Icon, { contentType, size } from '../icon';

describe('Icon', () => {
  it('declares a 32x32 png favicon', () => {
    expect(size).toEqual({ width: 32, height: 32 });
    expect(contentType).toBe('image/png');
  });

  it('generates an image response without throwing', () => {
    const response = Icon();

    expect(response).toBeDefined();
    expect(response.headers.get('content-type')).toBe('image/png');
  });
});
