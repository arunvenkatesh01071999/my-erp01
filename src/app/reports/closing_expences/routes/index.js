const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/closing/expences",
    preHandler: fastify.authenticate,
    // schema: schemas.closingExpencesReportSchema,
    handler: handlers.closingExpencesReportHandler(fastify)
  });
};
