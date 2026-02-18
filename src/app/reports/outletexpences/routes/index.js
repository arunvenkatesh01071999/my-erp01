const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/outletexpences/:outlet_id/:expenses_name?",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletExpensesReportSchema,
    handler: handlers.postOutletExpencesReportHandler(fastify)
  });
};
