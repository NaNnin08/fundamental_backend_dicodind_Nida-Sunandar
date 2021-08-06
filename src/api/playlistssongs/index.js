const PlaylistsongsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistsongs",
  version: "1.0.0",
  register: async (server, { service, playlistService, validator }) => {
    const playlistsongsHandler = new PlaylistsongsHandler(
      service,
      playlistService,
      validator,
    );
    server.route(routes(playlistsongsHandler));
  },
};
