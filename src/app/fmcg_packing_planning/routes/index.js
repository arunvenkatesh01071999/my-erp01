const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/fmcg/packing/planning",
    preHandler: fastify.authenticate,
    schema: schemas.postPackingPlanningSchema,
    handler: handlers.postPackingPlanningHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/packing/planning/docno",
    preHandler: fastify.authenticate,
    schema: schemas.getPackingPlanningDocnoSchema,
    handler: handlers.getPackingPlanningDocnoHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/fmcg/packing/planning/:planning_id",
    preHandler: fastify.authenticate,
    schema: schemas.updatePackingPlanningSchema,
    handler: handlers.updatePackingPlanningHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/packing/planning/grn/list/:product_id",
    preHandler: fastify.authenticate,
    schema: schemas.getGrnByProductIdSchema,
    handler: handlers.getGrnByProductHandler(fastify)
  });


  fastify.route({
    method: "GET",
    url: "/fmcg/packing/planning/parent/item/list",
    preHandler: fastify.authenticate,
    schema: schemas.getParentProductSchema,
    handler: handlers.getParentItemHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/packing/planning/child/item/:product_code",
    preHandler: fastify.authenticate,
    schema: schemas.getChildProductSchema,
    handler: handlers.getChildItemHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/packing/planning",
    preHandler: fastify.authenticate,
    schema: schemas.getAllPackingPlanningSchema,
    handler: handlers.getAllPackingPlanningHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/packing/planning/:id",
    preHandler: fastify.authenticate,
    schema: schemas.getPackingPlanningByIdSchema,
    handler: handlers.getPackingPlanningByIdHandler(fastify)
  });

};
