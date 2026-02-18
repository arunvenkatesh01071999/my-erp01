const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/dashboard/outlet/sales/overall",
    // preHandler: fastify.authenticate,
    // schema: schemas.postOutletSalesMasterSchema,
    handler: handlers.getDashboardOutletSalesHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/dashboard/stock/cat/report",
    // preHandler: fastify.authenticate,
    // schema: schemas.postOutletSalesMasterSchema,
    handler: handlers.getDashboardStockCatReportHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/dashboard/outletwise/cat/sales/report",
    // preHandler: fastify.authenticate,
    // schema: schemas.postOutletSalesMasterSchema,
    handler: handlers.getDashboardOutletwiseCatSalesReportHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/dashboard/api",
    // preHandler: fastify.authenticate,
    // schema: schemas.postOutletSalesMasterSchema,
    handler: handlers.getDashboardApiHandler(fastify)
  });

};
