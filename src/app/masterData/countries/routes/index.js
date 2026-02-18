const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/countries",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.countriesSchema,
    handler: handlers.getscountriesInfoHandler(fastify)
  });
};
