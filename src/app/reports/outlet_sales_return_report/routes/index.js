const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/outlet_sales/return",
    // preHandler: fastify.authenticate,
    schema: schemas.outletSalesReturnReportSchema,
    handler: handlers.outletSalesReturnReportHandler(fastify)
  });
};
