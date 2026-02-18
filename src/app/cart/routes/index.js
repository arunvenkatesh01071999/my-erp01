const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/cart",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.cartOperationsSchema,
    handler: handlers.cartOperations(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/cart/count",
    preHandler: fastify.authenticate,
    schema: schemas.fetchCartCountSchema,
    handler: handlers.fetchCartCountHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/cart/clear",
    preHandler: fastify.authenticate,
    schema: schemas.clearCartSchema,
    handler: handlers.clearCartHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/cart",
    preHandler: fastify.authenticate,
    schema: schemas.getCartSchema,
    handler: handlers.getCartHandler(fastify)
  });
};
