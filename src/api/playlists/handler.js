class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist({
        name,
        owner: credentialId,
      });

      const response = h.response({
        status: "success",
        message: "Playlist berhasil ditambahkan",
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getPlaylistHandler(request) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._service.getPlaylist(credentialId);
      return {
        status: "success",
        data: {
          playlists,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deletePlaylistByIdHandler(request) {
    try {
      const { playlistId: id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistById(id);

      return {
        status: "success",
        message: "Playlist berhasil dihapus",
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = PlaylistHandler;
