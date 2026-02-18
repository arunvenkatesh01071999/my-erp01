const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/expences",
    preHandler: fastify.authenticate,
    // schema: schemas.getExpensesReportSchema,
    handler: handlers.postpaymentHandler(fastify)
  });
};
