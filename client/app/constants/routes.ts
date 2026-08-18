const ROUTES = {
  HOME: '/',
  TRACKS: '/tracks',
  ALBUMS: '/albums',
  TRACK_UPLOAD: '/tracks/create',
  TRACK_DETAILS: (id: string) => `/tracks/${id}`,
  ALBUM_UPLOAD: '/albums/create',
};

export { ROUTES };
