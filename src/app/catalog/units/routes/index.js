const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/units",
    schema: schemas.getUnitSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getUnitHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/units",
    schema: schemas.postUnitSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postUnitHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/units/:unit_id",
    schema: schemas.putUnitSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putUnitHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/units/:unit_id",
    schema: schemas.deleteUnitSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteUnitHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/units/info/:unit_id",
    schema: schemas.getUnitInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getUnitInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/units/:page_size/:current_page",
    schema: schemas.getUnitPaginateSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getUnitPaginateHandler(fastify)
  });
};
