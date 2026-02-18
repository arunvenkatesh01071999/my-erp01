const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {


  fastify.route({
    method: "POST",
    url: "/warehouse/closing_stock_temp",
    preHandler: fastify.authenticate,
    schema: schemas.postClosingStockTempWSchema,
    handler: handlers.postClosingStockTempWHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/warehouse/closing_stock_temp/cancel",
    preHandler: fastify.authenticate,
    schema: schemas.deleteAllClosingStockTempWSchema,
    handler: handlers.deleteAllClosingStockTempWHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/warehouse/closing_stock_temp/delete",
    preHandler: fastify.authenticate,
    schema: schemas.deleteClosingStockTempWSchema,
    handler: handlers.deleteClosingStockTempWHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/warehouse/closing_stock_count",
    preHandler: fastify.authenticate,
    schema: schemas.postClosingStockCountWSchema,
    handler: handlers.postClosingStockCountWHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/warehouse/closing_stock_temp_details",
    preHandler: fastify.authenticate,
    schema: schemas.getClosingStockTempDetailsWSchema,
    handler: handlers.getClosingStockTempDetailsWHandler(fastify)
  });



};
