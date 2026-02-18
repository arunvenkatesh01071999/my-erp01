const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "GET",
    url: "/reports/outlet_sales/outletwise/currentdate",
    // preHandler: fastify.authenticate,
    schema: schemas.outletSalesCurrentDateDashboardReportSchema,
    handler: handlers.outletSalesOutletWiseCurrentDateReportHandler(fastify)
  })
  fastify.route({
    method: "POST",
    url: "/reports/outlet_sales",
    preHandler: fastify.authenticate,
    schema: schemas.outletSalesReportSchema,
    handler: handlers.outletSalesReportHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/reports/outlet_sales/itemwise",
    preHandler: fastify.authenticate,
    schema: schemas.outletSalesItemWiseReportSchema,
    handler: handlers.outletSalesItemWiseReportHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/reports/outlet_sales/itemwise/breakups",
    preHandler: fastify.authenticate,
    // schema: schemas.outletSalesItemWiseBreakupReportSchema,
    handler: handlers.outletSalesItemWiseBreakupReportHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/reports/outlet_sales/itemwise/breakups/byprodid",
    preHandler: fastify.authenticate,
    schema: schemas.outletSalesItemWiseBreakupReportProdidSchema,
    handler: handlers.outletSalesItemWiseBreakupReportbyprodidHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/reports/outlet_sales/itemwise/alloutlets",
    preHandler: fastify.authenticate,
    schema: schemas.outletSalesItemWiseAllReportSchema,
    handler: handlers.outletSalesItemWiseAllReportHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/reports/outlet_sales/branchwise/alloutlets/new",
    // preHandler: fastify.authenticate,
    // schema: schemas.outletSalesBranchWiseReportSchema,
    handler: handlers.outletSalesBranchWiseAllReportHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/reports/outlet_sales/branchwise/alloutlets/physical/stock/new",
    // preHandler: fastify.authenticate,
    // schema: schemas.outletSalesBranchWisePhysicalStockReportSchema,
    handler: handlers.outletSalesBranchWisePhysicalStockAllReportHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/reports/outlet_sales/groupwise/alloutlets",
    preHandler: fastify.authenticate,
    schema: schemas.outletSalesGroupWiseAllReportSchema,
    handler: handlers.outletSalesGroupWiseAllReportHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/reports/salesoverview/:outletid/:date",
    preHandler: fastify.authenticate,
    schema: schemas.outletSalesOverviewSchema,
    handler: handlers.outletSalesOverviewHandler(fastify)
  })

  fastify.route({
    method: "GET",
    url: "/reports/salesoverview/warehouse:date",
    // preHandler: fastify.authenticate,
    // schema: schemas.outletSalesOverviewSchema,
    handler: handlers.warehouseSalesOverviewHandler(fastify)
  })

};
