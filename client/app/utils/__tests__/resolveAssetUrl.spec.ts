describe('resolveAssetUrl', () => {
  const originalEnv = process.env.NEXT_PUBLIC_SERVER_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SERVER_URL = originalEnv;
    jest.resetModules();
  });

  it('prefixes the path with the server URL', async () => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:5000';
    jest.resetModules();
    const { resolveAssetUrl } = await import('../resolveAssetUrl');

    expect(resolveAssetUrl('image/1.jpg')).toBe(
      'http://localhost:5000/image/1.jpg',
    );
  });
});
