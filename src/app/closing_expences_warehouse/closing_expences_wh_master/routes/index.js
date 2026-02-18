const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/closing_expences_wh_master",
    preHandler: fastify.authenticate,
    schema: schemas.postClosingExpencesWhMstSchema,
    handler: handlers.postClosingExpencesWhMstHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/closing_expences_wh_master/getOne",
    // preHandler: fastify.authenticate,
    // schema: schemas.postClosingExpencesMstSchema,
    handler: handlers.postClosingExpencesMstGetOneHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/closing_expences_wh_master/bank_amount",
    // preHandler: fastify.authenticate,
    // schema: schemas.postClosingExpencesMstSchema,
    handler: handlers.postClosingBankAmountHandler(fastify)
  });

};
