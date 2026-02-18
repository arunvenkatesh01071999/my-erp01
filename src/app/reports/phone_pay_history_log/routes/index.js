const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/phone_pay_history_log/:page_size/:current_page/:search?",
    preHandler: fastify.authenticate,
    // schema: schemas.phonePayHistoryLogSchema,
    handler: handlers.phonePayHistoryLogReportHandler(fastify)
  });
};
