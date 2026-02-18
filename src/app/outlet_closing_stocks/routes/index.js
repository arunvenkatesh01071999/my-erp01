const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/outlet_closing_stocks",
    preHandler: fastify.authenticate,
    // schema: schemas.postOutletClosingStocksSchema,
    handler: handlers.postOutletClosingStocksHandler(fastify)
  })
};
