const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/fmcg/planning/issue",
    preHandler: fastify.authenticate,
    schema: schemas.postFmcgPlanningIssueSchema,
    handler: handlers.postFmcgPlanningIssueHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/fmcg/planning/issue/:planning_issue_id",
    preHandler: fastify.authenticate,
    schema: schemas.putFmcgPlanningIssueSchema,
    handler: handlers.putFmcgPlanningIssueHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/planning/issue/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getFmcgPlanningIssueSchema,
    handler: handlers.getFmcgPlanningIssueHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/planning/issue/info/:planning_issue_id",
    preHandler: fastify.authenticate,
    schema: schemas.getFmcgPlanningIssueInfoSchema,
    handler: handlers.getFmcgPlanningIssueInfoHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/fmcg/planning/issue/:planning_issue_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteFmcgPlanningIssueInfoSchema,
    handler: handlers.deleteFmcgPlanningIssueInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/fmcg/planning/issue/docno/:wh_id?",
    preHandler: fastify.authenticate,
    schema: schemas.getFmcgPlanningIssueDocnoSchema,
    handler: handlers.getFmcgPlanningIssueDocnoHandler(fastify)
  });

};
