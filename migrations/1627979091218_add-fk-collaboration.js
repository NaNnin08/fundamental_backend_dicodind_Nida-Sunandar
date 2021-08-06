/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    "collaborations",
    "fk_collaborations.playlist.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE",
  );
  pgm.addConstraint(
    "collaborations",
    "fk_collaborations.users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE",
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("collaborations", "fk_collaborations.playlist.id");
  pgm.dropConstraint("collaborations", "fk_collaborations.user.id");
};
