const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/closing_stock_outlet",
    // preHandler: fastify.authenticate,
    // schema: schemas.postClosingStockOutletSchema,
    handler: handlers.postClosingStockOutletHandler(fastify)
  })

  fastify.route({
    method: "POST",
    url: "/closing_stock_outlet/pending/stocks",
    // preHandler: fastify.authenticate,
    // schema: schemas.postClosingStockOutletSchema,
    handler: handlers.getPendingStockHandler(fastify)
  })

  fastify.route({
    method: "GET",
    url: "/closing_stock_outlet/pending/stocks/:outlet_id/:cat_id/:sub_cat_id",
    // preHandler: fastify.authenticate,
    // schema: schemas.getPendingStockViewNewSchema,
    handler: handlers.getPendingStockViewNewHandler(fastify)
  })

  fastify.route({
    method: "POST",
    url: "/pending/stocks/to/closing/stock/outlet",
    // preHandler: fastify.authenticate,
    // schema: schemas.postClosingStockOutletSchema,
    handler: handlers.postPendingStockToCloshingStockHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/pending/stocks/to/missing/stock/outlet",
    // preHandler: fastify.authenticate,
    // schema: schemas.postClosingStockOutletSchema,
    handler: handlers.postPendingStockToMissingStockHandler(fastify)
  });



};
