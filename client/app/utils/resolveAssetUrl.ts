const resolveAssetUrl = (path: string): string =>
  `${process.env.NEXT_PUBLIC_SERVER_URL}/${path}`;

export { resolveAssetUrl };
