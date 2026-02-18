const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/wallet_trnasfer_master",
    preHandler: fastify.authenticate,
    schema: schemas.postWalletTransferMstSchema,
    handler: handlers.postWalletTransferMstHandler(fastify)
  });


};
