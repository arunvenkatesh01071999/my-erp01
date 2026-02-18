const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/closing/cash",
    preHandler: fastify.authenticate,
    // schema: schemas.closingCashReportSchema,
    handler: handlers.closingCashReportHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/reports/closing/cash/getOne",
    // preHandler: fastify.authenticate,
    // schema: schemas.closingCashReportSchema,
    handler: handlers.getOneClosingCashReportHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/reports/email/cashclose",
    handler: handlers.closingCashEmailHandler(fastify)
  });
};
