const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/closing/expences/warehouse",
    // preHandler: fastify.authenticate,
    // schema: schemas.closingExpencesReportSchema,
    handler: handlers.closingExpencesWarehouseReportHandler(fastify)
  });
};
