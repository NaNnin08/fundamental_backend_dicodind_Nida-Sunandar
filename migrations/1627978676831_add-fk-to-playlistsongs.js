exports.up = (pgm) => {
  pgm.addConstraint(
    "playlistsongs",
    "fk_playlistsongs.playlist.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE",
  );
  pgm.addConstraint(
    "playlistsongs",
    "fk_playlistsongs.songs.id",
    "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE",
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("playlistsongs", "fk_playlistsongs.playlist.id");
  pgm.dropConstraint("playlistsongs", "fk_playlistsongs.songs.id");
};
