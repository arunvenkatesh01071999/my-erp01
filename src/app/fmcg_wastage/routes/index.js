const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/fmcg/wastage",
    preHandler: fastify.authenticate,
    schema: schemas.postWastageSchema,
    handler: handlers.postWastageHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/fmcg/wastage/:wastage_id",
    preHandler: fastify.authenticate,
    schema: schemas.putWastageSchema,
    handler: handlers.putWastageHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/wastage/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getWastageSchema,
    handler: handlers.getWastageHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/wastage/info/:wastage_id",
    preHandler: fastify.authenticate,
    schema: schemas.getWastageInfoSchema,
    handler: handlers.getWastageInfoHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/fmcg/wastage/:wastage_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteWastageSchema,
    handler: handlers.deleteWastageHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/wastage/docno/:wh_id?",
    preHandler: fastify.authenticate,
    schema: schemas.getWastageDocnoSchema,
    handler: handlers.getWastageDocnoHandler(fastify)
  });

};
