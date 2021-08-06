const Joi = require("joi");

const PlaylistsongsPayloadSchema = Joi.object({
  songId: Joi.string()
    .pattern(/^(Song)/)
    .required(),
});

module.exports = { PlaylistsongsPayloadSchema };
