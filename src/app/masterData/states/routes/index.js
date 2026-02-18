const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/states",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.statesSchema,
    handler: handlers.getsstatesInfoHandler(fastify)
  });
};
