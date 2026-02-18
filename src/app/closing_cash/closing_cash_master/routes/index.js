const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/closing_cash_master",
    preHandler: fastify.authenticate,
    schema: schemas.postClosingCashMstSchema,
    handler: handlers.postClosingCashMstHandler(fastify)
  });


};
