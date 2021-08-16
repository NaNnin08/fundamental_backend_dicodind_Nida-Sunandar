class ExportsHandler {
  constructor(service, validator, playlistService) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
  }

  async postExportSongsHandler(request, h) {
    try {
      this._validator.validateExportSongsPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;

      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };

      await this._service.sendMessage("export:songs", JSON.stringify(message));

      const response = h.response({
        status: "success",
        message: "Permintaan Anda sedang kami proses",
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = ExportsHandler;
