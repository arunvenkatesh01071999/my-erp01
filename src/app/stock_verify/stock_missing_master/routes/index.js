const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/stock_missing_master",
    // preHandler: fastify.authenticate,
    // schema: schemas.postStockMissingMstSchema,
    handler: handlers.postStockMissingMstHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/stock_scan",
    // preHandler: fastify.authenticate,
    // schema: schemas.postStockScanSchema,
    handler: handlers.postStockScanHandler(fastify)
  });




};
