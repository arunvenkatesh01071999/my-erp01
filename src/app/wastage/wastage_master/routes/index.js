const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/wastage_master",
    preHandler: fastify.authenticate,
    schema: schemas.postWastageMasterSchema,
    handler: handlers.postWastageMasterHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/wastage/fetch/docno",
    preHandler: fastify.authenticate,
    schema: schemas.getPaymentDocnoSchema,
    handler: handlers.getWastageHandler(fastify)
  });

};
