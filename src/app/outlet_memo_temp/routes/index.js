const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/outlet/purchase/memo/temp",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletPurchaseMemoTempSchema,
    handler: handlers.postOutletPurchaseMemoTempHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/memo/temp/:supplier_id/:outlet_id/:pono",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseMemoTempSchema,
    handler: handlers.getOutletPurchaseMemoTempHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/memo/temp/all/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getAllOutletPurchaseMemoTempSchema,
    handler: handlers.getAllOutletPurchaseMemoTempHandler(fastify)
  });

  fastify.route({
    method: "delete",
    url: "/outlet/purchase/memo/temp/:supplier_id/:outlet_id/:pono",
    preHandler: fastify.authenticate,
    schema: schemas.deleteOutletPurchaseMemoTempSchema,
    handler: handlers.deleteOutletPurchaseMemoTempHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/memo/product/temp/:supplier_id/:outlet_id/:pono/:product_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseMemoProductTempSchema,
    handler: handlers.getOutletPurchaseMemoProductTempHandler(fastify)
  });

  fastify.route({
    method: "delete",
    url: "/outlet/purchase/memo/product/temp/:supplier_id/:outlet_id/:pono/:product_id/:batch_no",
    preHandler: fastify.authenticate,
    schema: schemas.deleteOutletPurchaseMemoProductTempSchema,
    handler: handlers.deleteOutletPurchaseMemoProductTempHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/memo/summary/temp/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getAllOutletPurchaseMemoSummaryTempSchema,
    handler: handlers.getAllOutletPurchaseMemoSummaryTempHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase/memo/temp/report",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseMemoTempReportSchema,
    handler: handlers.getOutletPurchaseMemoTempReportHandler(fastify)
  });

};
