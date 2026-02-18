const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/closing_expences_master",
    preHandler: fastify.authenticate,
    schema: schemas.postClosingExpencesMstSchema,
    handler: handlers.postClosingExpencesMstHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/closing_expences_master/getOne",
    // preHandler: fastify.authenticate,
    // schema: schemas.postClosingExpencesMstSchema,
    handler: handlers.postClosingExpencesMstGetOneHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/closing_expences_master/bank_amount",
    // preHandler: fastify.authenticate,
    // schema: schemas.postClosingExpencesMstSchema,
    handler: handlers.postClosingBankAmountHandler(fastify)
  });

};
