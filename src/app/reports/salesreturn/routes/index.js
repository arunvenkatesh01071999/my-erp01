const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/sales/return",
    preHandler: fastify.authenticate,
    schema: schemas.salesReturnReportSchema,
    handler: handlers.salesReturnReportHandler(fastify)
  });
};
