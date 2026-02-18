const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/receipe",
    preHandler: fastify.authenticate,
    schema: schemas.postReceipeSchema,
    handler: handlers.postReceipeHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/receipe/:receipe_id",
    preHandler: fastify.authenticate,
    schema: schemas.putReceipeSchema,
    handler: handlers.putReceipeHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/receipe/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getReceipeSchema,
    handler: handlers.getReceipeHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/receipe/info/:receipe_id",
    preHandler: fastify.authenticate,
    schema: schemas.getReceipeInfoSchema,
    handler: handlers.getReceipeInfoHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/receipe/:receipe_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteReceipeSchema,
    handler: handlers.deleteReceipeHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/receipe/docno/:wh_id?",
    preHandler: fastify.authenticate,
    schema: schemas.getReceipeDocnoSchema,
    handler: handlers.getReceipeDocnoHandler(fastify)
  });

};
