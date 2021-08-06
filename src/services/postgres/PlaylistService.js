const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const playlistId = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist VALUES($1, $2, $3) RETURNING id",
      values: [playlistId, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylist(owner) {
    const query = {
      text: "SELECT playlist.id, playlist.name, users.username FROM playlist JOIN users ON playlist.owner = users.id WHERE playlist.owner = $1",
      values: [owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      const query1 = {
        text: "SELECT playlist.id, playlist.name, users.username FROM playlist JOIN collaborations ON playlist.id = collaborations.playlist_id JOIN users ON users.id = playlist.owner WHERE collaborations.user_id = $1",
        values: [owner],
      };
      const result1 = await this._pool.query(query1);

      return result1.rows;
    }

    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlist WHERE id= $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlist WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(id, owner) {
    try {
      await this.verifyPlaylistOwner(id, owner);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(id, owner);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistService;
