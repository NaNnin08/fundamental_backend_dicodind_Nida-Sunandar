const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistsongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSongsToPlaylist({ id: playlistId, songId, credentialId }) {
    const id = `playlistsongs-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }

    await this._cacheService.delete(`songs:${credentialId}`);
  }

  async getSongFromPlaylist(id, credentialId) {
    try {
      // mendapatkan catatan dari cache
      const result = await this._cacheService.get(`songs:${credentialId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: "SELECT songs.id, songs.title, songs.performer FROM songs JOIN playlistsongs ON songs.id = playlistsongs.song_id WHERE playlistsongs.playlist_id = $1",
        values: [id],
      };
      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError("Songs tidak ditemukan");
      }

      await this._cacheService.set(
        `songs:${credentialId}`,
        JSON.stringify(result.rows),
      );

      return result.rows;
    }
  }

  async deleteSongFromPlaylist(id, songId, credentialId) {
    const query = {
      text: "DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [id, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }

    await this._cacheService.delete(`songs:${credentialId}`);
  }
}

module.exports = PlaylistsongsService;
