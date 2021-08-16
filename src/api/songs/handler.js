class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongsHandler = this.postSongsHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongsByIdHandler = this.getSongsByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongsHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id, title, year, performer, genre, duration } = request.payload;

      const songId = await this._service.saveSong({
        id,
        title,
        year,
        performer,
        genre,
        duration,
      });

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan",
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getSongsHandler() {
    try {
      const songs = await this._service.getSongs();
      return {
        status: "success",
        data: {
          songs,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async getSongsByIdHandler(request) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return {
        status: "success",
        data: {
          song,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async putSongByIdHandler(request) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, performer, genre, duration } = request.payload;
      const { id } = request.params;

      await this._service.editSongsById(id, {
        title,
        year,
        performer,
        genre,
        duration,
      });

      return {
        status: "success",
        message: "Lagu berhasil diperbarui",
      };
    } catch (error) {
      return error;
    }
  }

  async deleteSongByIdHandler(request) {
    try {
      const { id } = request.params;
      await this._service.deleteSongsById(id);

      return {
        status: "success",
        message: "Lagu berhasil dihapus",
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = SongsHandler;
