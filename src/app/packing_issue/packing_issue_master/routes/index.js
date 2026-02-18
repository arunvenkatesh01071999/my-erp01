const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/packing/issue",
    preHandler: fastify.authenticate,
    schema: schemas.postPackingIssueSchema,
    handler: handlers.postPackingIssueHandler(fastify)
  })

  fastify.route({
    method: "GET",
    url: "/packing/issue/docno",
    preHandler: fastify.authenticate,
    schema: schemas.getPackingIssueDocnoSchema,
    handler: handlers.getPackingIssueDocnoHandler(fastify)
  })

  fastify.route({
    method: "POST",
    url: "/packing/issue/pdf",
    preHandler: fastify.authenticate,
    schema: schemas.getPackingIssuePdfSchema,
    handler: handlers.getPackingIssuePdfHandler(fastify)
  })

  fastify.route({
    method: "POST",
    url: "/packing/inward",
    preHandler: fastify.authenticate,
    schema: schemas.postPackingInwardSchema,
    handler: handlers.postPackingInwardHandler(fastify)
  })

  fastify.route({
    method: "GET",
    url: "/packing/inward/docno",
    preHandler: fastify.authenticate,
    schema: schemas.getPackingInwardDocnoSchema,
    handler: handlers.getPackingInwardDocnoHandler(fastify)
  })

  fastify.route({
    method: "GET",
    url: "/packing/inward/:docno",
    preHandler: fastify.authenticate,
    schema: schemas.getPackingInwardSchema,
    handler: handlers.getPackingInwardHandler(fastify)
  })
};
