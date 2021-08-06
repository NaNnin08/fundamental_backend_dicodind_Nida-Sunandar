const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists/{playlistId}/songs",
    handler: handler.postPlaylistsongsHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{playlistId}/songs",
    handler: handler.getSongsFromPlaylistHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{playlistId}/songs",
    handler: handler.deleteSongsFromPlaylistHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
];

module.exports = routes;
