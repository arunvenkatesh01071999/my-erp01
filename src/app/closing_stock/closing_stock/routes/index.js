const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/closing_stock",
    preHandler: fastify.authenticate,
    schema: schemas.postClosingStockSchema,
    handler: handlers.postClosingStockHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/closing_stock_temp",
    // preHandler: fastify.authenticate,
    // schema: schemas.postClosingStockTempSchema,
    handler: handlers.postClosingStockTempHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/closing_stock_temp/cancel",
    // preHandler: fastify.authenticate,
    schema: schemas.deleteAllClosingStockTempSchema,
    handler: handlers.deleteAllClosingStockTempHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/closing_stock_outlet/delete",
    preHandler: fastify.authenticate,
    schema: schemas.deleteAllClosingStockOutletSchema,
    handler: handlers.deleteAllClosingStockOutletHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/closing_stock_outlet/missing/stock/delete",
    preHandler: fastify.authenticate,
    schema: schemas.deleteAllMissigStockSchema,
    handler: handlers.deleteAllMissingStockHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/closing_stock_temp/delete",
    preHandler: fastify.authenticate,
    schema: schemas.deleteClosingStockTempSchema,
    handler: handlers.deleteClosingStockTempHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/closing_stock_count",
    // preHandler: fastify.authenticate,
    schema: schemas.postClosingStockCountSchema,
    handler: handlers.postClosingStockCountHandler(fastify)
  });


  fastify.route({
    method: "POST",
    url: "/outlet/available_stock_count",
    // preHandler: fastify.authenticate,
    schema: schemas.postAvailableStockCountSchema,
    handler: handlers.postAvailableStockCountHandler(fastify)
  })

  fastify.route({
    method: "POST",
    url: "/outlet/closing_stock_temp_details",
    // preHandler: fastify.authenticate,
    // schema: schemas.getClosingStockTempDetailsSchema,
    handler: handlers.getClosingStockTempDetailsHandler(fastify)
  });



};
