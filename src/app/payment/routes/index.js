const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/payment",
    preHandler: fastify.authenticate,
    schema: schemas.postPaymentSchema,
    handler: handlers.postpaymentHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/payment/:partyid",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseByPartySchema,
    handler: handlers.getPurchaseBYId(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/payment/fetch/docno",
    preHandler: fastify.authenticate,
    schema: schemas.getPaymentDocnoSchema,
    handler: handlers.getPaymentDocnoHandler(fastify)
  });

};

