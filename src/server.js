const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const songs = require("./api/songs");
const SongsService = require("./services/postgres/SongsService");
const SongsValidator = require("./validator/songs");
const users = require("./api/users");
const UserService = require("./services/postgres/UserService");
const UsersValidator = require("./validator/users");
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const AuthenticationsValidator = require("./validator/authentications");
const TokenManager = require("./tokenize/TokenManager");
const playlists = require("./api/playlists");
const PlaylistServces = require("./services/postgres/PlaylistService");
const PlaylistValidator = require("./validator/playlist");
const playlistsongs = require("./api/playlistssongs");
const PlaylistsongsSevices = require("./services/postgres/PlaylistSongService");
const PlaylistsongValidator = require("./validator/playlistsongs");
const colab = require("./api/collaborations");
const ColabServices = require("./services/postgres/CollaborationsService");
const ColabValidator = require("./validator/collaborations");

require("dotenv").config();

const init = async () => {
  const songsServices = new SongsService();
  const usersServices = new UserService();
  const authenticationsServices = new AuthenticationsService();
  const colabServices = new ColabServices();
  const playlistServices = new PlaylistServces(colabServices);
  const playlistsongsServices = new PlaylistsongsSevices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsServices,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersServices,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsServices,
        usersServices,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistServices,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: playlistsongs,
      options: {
        service: playlistsongsServices,
        playlistService: playlistServices,
        validator: PlaylistsongValidator,
      },
    },
    {
      plugin: colab,
      options: {
        collaborationsService: colabServices,
        playlistService: playlistServices,
        validator: ColabValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
