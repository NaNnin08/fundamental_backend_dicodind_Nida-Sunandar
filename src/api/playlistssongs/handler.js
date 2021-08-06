const ClientError = require("../../exceptions/ClientError");

class PlaylistsongsHandler {
  constructor(service, playlistService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.postPlaylistsongsHandler = this.postPlaylistsongsHandler.bind(this);
    this.getSongsFromPlaylistHandler =
      this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongsFromPlaylistHandler =
      this.deleteSongsFromPlaylistHandler.bind(this);
  }

  async postPlaylistsongsHandler(request, h) {
    try {
      this._validator.validatePlaylistsongsPayload(request.payload);
      const { playlistId: id } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistAccess(id, credentialId);

      await this._service.addSongsToPlaylist({ id, songId });

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan ke playlist",
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getSongsFromPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { playlistId: id } = request.params;

      await this._playlistService.verifyPlaylistAccess(id, credentialId);

      const songs = await this._service.getSongFromPlaylist(id);

      return {
        status: "success",
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteSongsFromPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistsongsPayload(request.payload);
      const { playlistId: id } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistAccess(id, credentialId);
      await this._service.deleteSongFromPlaylist(id, songId);

      return {
        status: "success",
        message: "Lagu behasil dihapus dari playlist",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistsongsHandler;
