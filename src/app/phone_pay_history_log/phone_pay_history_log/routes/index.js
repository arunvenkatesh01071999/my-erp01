const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/phone_pay_history_log",
    preHandler: fastify.authenticate,
    schema: schemas.postPhonePayHistoryLogSchema,
    handler: handlers.postPhonePayHistoryLogHandler(fastify)
  });


};
