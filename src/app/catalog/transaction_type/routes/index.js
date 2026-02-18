const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/transaction_type",
    preHandler: fastify.authenticate,
    // schema: schemas.getTransactionTypeSchema,
    handler: handlers.getTransactionTypeHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/transaction_type",
    preHandler: fastify.authenticate,
    // schema: schemas.postTransactionTypeSchema,
    handler: handlers.postTransactionTypeHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/transaction_type/:id",
    preHandler: fastify.authenticate,
    // schema: schemas.putTransactionTypeSchema,
    handler: handlers.putTransactionTypeHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/transaction_type/:id",
    preHandler: fastify.authenticate,
    // schema: schemas.deleteTransactionTypeSchema,
    handler: handlers.deleteTransactionTypeHandler(fastify)
  });


};
