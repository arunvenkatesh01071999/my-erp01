const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/sales/receipt",
    preHandler: fastify.authenticate,
    // schema: schemas.salesReceiptReportSchema,
    handler: handlers.salesReceiptReportHandler(fastify)
  });

};
