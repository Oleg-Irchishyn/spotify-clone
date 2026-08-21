const ROUTES = {
  HOME: '/',
  TRACKS: '/tracks',
  ALBUMS: '/albums',
  CONTRIBUTORS: '/contributors',
  TRACK_UPLOAD: '/tracks/create',
  TRACK_DETAILS: (id: string) => `/tracks/details?id=${id}`,
  ALBUM_UPLOAD: '/albums/create',
};

export { ROUTES };
