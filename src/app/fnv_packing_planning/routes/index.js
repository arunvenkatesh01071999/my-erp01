const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/fnv/packing/planning/parent/item/list",
    preHandler: fastify.authenticate,
    schema: schemas.getParentProductSchema,
    handler: handlers.getParentItemHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fnv/packing/planning/child/item/:parent_id",
    preHandler: fastify.authenticate,
    schema: schemas.getChildProductSchema,
    handler: handlers.getChildItemHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fnv/packing/planning/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getAllPackingPlanningSchema,
    handler: handlers.getAllPackingPlanningHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fnv/packing/planning/:id",
    preHandler: fastify.authenticate,
    schema: schemas.getPackingPlanningByIdSchema,
    handler: handlers.getPackingPlanningByIdHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/fnv/packing/planning",
    preHandler: fastify.authenticate,
    schema: schemas.postPackingPlanningSchema,
    handler: handlers.postPackingPlanningHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/fnv/packing/planning/:id",
    preHandler: fastify.authenticate,
    schema: schemas.updatePackingPlanningSchema,
    handler: handlers.updatePackingPlanningHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fnv/packing/planning/docno",
    preHandler: fastify.authenticate,
    schema: schemas.getPackingPlanningDocnoSchema,
    handler: handlers.getPackingPlanningDocnoHandler(fastify)
  });
};
