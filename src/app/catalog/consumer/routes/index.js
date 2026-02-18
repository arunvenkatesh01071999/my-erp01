const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/Consumer",
    preHandler: fastify.authenticate,
    schema: schemas.getConsumerSchema,
    handler: handlers.getConsumerHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/Consumer",
    schema: schemas.postConsumerSchema,
    handler: handlers.postConsumerHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/Consumer/:consumer_id",
    preHandler: fastify.authenticate,
    schema: schemas.putConsumerSchema,
    handler: handlers.putConsumerHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/Consumer/:consumer_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteConsumerSchema,
    handler: handlers.deleteConsumerHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/Consumer/:consumer_id",
    preHandler: fastify.authenticate,
    schema: schemas.getConsumerInfoSchema,
    handler: handlers.getConsumerInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/Consumer/:page_size/:current_page/:search?",
    preHandler: fastify.authenticate,
    schema: schemas.getConsumerPaginateSchema,
    handler: handlers.getConsumerPaginateHandler(fastify)
  });
};
