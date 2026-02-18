const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/reason/:page_size/:current_page",
    schema: schemas.getReasonPaginationSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getReasonPaginationHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/reason",
    schema: schemas.getReasonSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getReasonHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/reason",
    schema: schemas.postReasonSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postReasonHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/reason/:reason_id",
    schema: schemas.putReasonSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putReasonHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/reason/:reason_id",
    schema: schemas.deleteReasonSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteReasonHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/reason/info/:reason_id",
    schema: schemas.getReasonInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getReasonInfoHandler(fastify)
  });
};
