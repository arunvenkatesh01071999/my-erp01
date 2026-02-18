const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/payment",
    preHandler: fastify.authenticate,
    // schema: schemas.paymentReportSchema,
    handler: handlers.postpaymentHandler(fastify)
  });
};
