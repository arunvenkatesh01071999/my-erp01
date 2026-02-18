const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/fmcg/planning/inward",
    preHandler: fastify.authenticate,
    schema: schemas.postFmcgPlanningInwardSchema,
    handler: handlers.postFmcgPlanningInwardHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/fmcg/planning/inward/:planning_inward_id",
    preHandler: fastify.authenticate,
    schema: schemas.putFmcgPlanningInwardSchema,
    handler: handlers.putFmcgPlanningInwardHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/planning/inward/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getFmcgPlanningInwardSchema,
    handler: handlers.getFmcgPlanningInwardHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/planning/inward/info/:planning_inward_id",
    preHandler: fastify.authenticate,
    schema: schemas.getFmcgPlanningInwardInfoSchema,
    handler: handlers.getFmcgPlanningInwardInfoHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/fmcg/planning/inward/:planning_inward_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteFmcgPlanningInwardInfoSchema,
    handler: handlers.deleteFmcgPlanningInwardInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/planning/inward/docno/:wh_id?",
    preHandler: fastify.authenticate,
    schema: schemas.getFmcgPlanningInwardDocnoSchema,
    handler: handlers.getFmcgPlanningInwardDocnoHandler(fastify)
  });

};
