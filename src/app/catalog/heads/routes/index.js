const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/Head",
    preHandler: fastify.authenticate,
    schema: schemas.getHeadSchema,
    handler: handlers.getHeadHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/Head",
    preHandler: fastify.authenticate,
    schema: schemas.postHeadSchema,
    handler: handlers.postHeadHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/Head/:head_id",
    preHandler: fastify.authenticate,
    schema: schemas.putHeadSchema,
    handler: handlers.putHeadHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/Head/:head_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteHeadSchema,
    handler: handlers.deleteHeadHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/Head/:head_id",
    preHandler: fastify.authenticate,
    schema: schemas.getHeadInfoSchema,
    handler: handlers.getHeadInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/Head/brand/info/:cat_id/:sub_cat_id",
    preHandler: fastify.authenticate,
    schema: schemas.getHeadByCategorySchema,
    handler: handlers.getHeadBrandInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/Head/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getHeadPaginateSchema,
    handler: handlers.getHeadPaginateHandler(fastify)
  });
};
