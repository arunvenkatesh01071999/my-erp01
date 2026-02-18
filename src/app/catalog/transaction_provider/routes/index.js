const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "GET",
    url: "/transaction_provider/:merchant_key",
    preHandler: fastify.authenticate,
    // schema: schemas.getTransactionProviderKeySchema,
    handler: handlers.getTransactionProviderMerchantKeyHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/transaction_provider",
    preHandler: fastify.authenticate,
    schema: schemas.getTransactionProviderSchema,
    handler: handlers.getTransactionProviderHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/transaction_provider",
    preHandler: fastify.authenticate,
    schema: schemas.postTransactionProviderSchema,
    handler: handlers.postTransactionProviderHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/transaction_provider/:id",
    preHandler: fastify.authenticate,
    schema: schemas.putTransactionProviderSchema,
    handler: handlers.putTransactionProviderHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/transaction_provider/:id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteTransactionProviderSchema,
    handler: handlers.deleteTransactionProviderHandler(fastify)
  });


};
