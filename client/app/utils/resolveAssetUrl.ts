const resolveAssetUrl = (path: string): string =>
  /^https?:\/\//.test(path)
    ? path
    : `${process.env.NEXT_PUBLIC_SERVER_URL}/${path}`;

export { resolveAssetUrl };
