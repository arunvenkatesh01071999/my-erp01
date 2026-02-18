const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/cities",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.citiesSchema,
    handler: handlers.getscitiesInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/cities/:pincode",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.getCitiesByPincodeSchema,
    handler: handlers.getCitieByPincodeHandler(fastify)
  });

};
