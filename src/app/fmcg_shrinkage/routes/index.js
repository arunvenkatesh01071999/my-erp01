const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/fmcg/shrinkage",
    preHandler: fastify.authenticate,
    schema: schemas.postShrinkageSchema,
    handler: handlers.postShrinkageHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/fmcg/shrinkage/:shrinkage_id",
    preHandler: fastify.authenticate,
    schema: schemas.putShrinkageSchema,
    handler: handlers.putShrinkageHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/shrinkage/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getShrinkageSchema,
    handler: handlers.getShrinkageHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/shrinkage/info/:shrinkage_id",
    preHandler: fastify.authenticate,
    schema: schemas.getShrinkageInfoSchema,
    handler: handlers.getShrinkageInfoHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/fmcg/shrinkage/:shrinkage_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteShrinkageSchema,
    handler: handlers.deleteShrinkageHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/shrinkage/docno/:wh_id?",
    preHandler: fastify.authenticate,
    schema: schemas.getShrinkageDocnoSchema,
    handler: handlers.getShrinkageDocnoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/shrinkage/edit/list",
    preHandler: fastify.authenticate,
    schema: schemas.getShrinkageEditListSchema,
    handler: handlers.getShrinkageEditListHandler(fastify)
  });

};
