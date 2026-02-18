const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/outlet_to_outlet_transfer",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletToOutletTransferMasterSchema,
    handler: handlers.postOutletToOutletTransferMasterHandler(fastify)
  })

  fastify.route({
    method: "POST",
    url: "/outlet_to_outlet_transfer/change/isowned",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletToOutletTransferIsOwnedSchema,
    handler: handlers.postOutletToOutletTransferIsOwnedMasterHandler(fastify)
  });

};
