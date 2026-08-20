describe('$api', () => {
  const originalEnv = process.env.NEXT_PUBLIC_SERVER_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SERVER_URL = originalEnv;
    jest.resetModules();
  });

  it('is configured with the server base URL and credentialed requests', async () => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:5000';
    jest.resetModules();
    const { default: $api } = await import('../http');

    expect($api.defaults.baseURL).toBe('http://localhost:5000');
    expect($api.defaults.withCredentials).toBe(true);
  });
});
