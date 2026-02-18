const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/scheme/type",
    schema: schemas.getSchemeTypeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSchemeTypeHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/scheme",
    schema: schemas.postSchemeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postSchemeHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/scheme/:sid",
    schema: schemas.putSchemeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putSchemeHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/scheme/:sid",
    schema: schemas.deleteSchemeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteSchemeHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/scheme/info/:sid",
    schema: schemas.getSchemeInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSchemeInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/scheme/:page_size/:current_page",
    schema: schemas.getSchemePaginateSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSchemePaginateHandler(fastify)
  });
};
