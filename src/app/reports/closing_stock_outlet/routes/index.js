const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/reports/closing/stock/outlet",
    // preHandler: fastify.authenticate,
    schema: schemas.postClosingStockOutletSchema,
    handler: handlers.postClosingStockOutletHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/reports/closing/stock/warehouse",
    // preHandler: fastify.authenticate,
    schema: schemas.postClosingStockWarehouseSchema,
    handler: handlers.postClosingStockWarehouseHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/reports/closing/stock/outlet/missing",
    // preHandler: fastify.authenticate,
    // schema: schemas.postClosingStockOutletSchema,
    handler: handlers.postClosingStockOutletMissingHandler(fastify)
  });

};
