const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {


  fastify.route({
    method: "POST",
    url: "/issue_transfer_temp",
    preHandler: fastify.authenticate,
    schema: schemas.postIssueTransferTempSchema,
    handler: handlers.postIssueTransferTempHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/issue_transfer_temp/cancel",
    preHandler: fastify.authenticate,
    schema: schemas.deleteAllIssueTransferTempSchema,
    handler: handlers.deleteAllIssueTransferTempHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/issue_transfer_temp/delete",
    preHandler: fastify.authenticate,
    schema: schemas.deleteIssueTransferTempSchema,
    handler: handlers.deleteIssueTransferTempHandler(fastify)
  });



  fastify.route({
    method: "POST",
    url: "/issue_transfer_temp_get",
    // preHandler: fastify.authenticate,
    schema: schemas.getIssueTransferTempDetailsSchema,
    handler: handlers.getIssueTransferTempDetailsHandler(fastify)
  });



};
