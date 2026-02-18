const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/receipt",
    preHandler: fastify.authenticate,
    schema: schemas.postReceiptSchema,
    handler: handlers.postreceiptHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/receipt/:partyid",
    preHandler: fastify.authenticate,
    schema: schemas.getReceiptByPartySchema,
    handler: handlers.getReceiptByPartyHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/receipt/fetch/docno",
    preHandler: fastify.authenticate,
    schema: schemas.getReceiptDocnoSchema,
    handler: handlers.getReceiptDocnoHandler(fastify)
  });

};

