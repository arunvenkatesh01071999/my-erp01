const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/closing/cash/warehouse",
    // preHandler: fastify.authenticate,
    // schema: schemas.closingCashReportSchema,
    handler: handlers.closingCashWarehouseReportHandler(fastify)
  });


};
