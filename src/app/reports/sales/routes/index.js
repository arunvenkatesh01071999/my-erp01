const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/sales",
    preHandler: fastify.authenticate,
    schema: schemas.salesReportSchema,
    handler: handlers.salesReportHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/reports/sales/itemwise",
    preHandler: fastify.authenticate,
    schema: schemas.salesItemWiseReportSchema,
    handler: handlers.salesItemWiseReportHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/reports/sales/itemwise/breakups",
    preHandler: fastify.authenticate,
    schema: schemas.salesItemWiseBreakupReportSchema,
    handler: handlers.salesItemWiseBreakupReportHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/reports/sales/itemwise/breakups/byprodid",
    preHandler: fastify.authenticate,
    schema: schemas.salesItemWiseBreakupReportProdidSchema,
    handler: handlers.salesItemWiseBreakupReportbyprodidHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/reports/sales/itemwise/alloutlets",
    preHandler: fastify.authenticate,
    schema: schemas.salesItemWiseAllReportSchema,
    handler: handlers.salesItemWiseAllReportHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/reports/sales/groupwise/alloutlets",
    preHandler: fastify.authenticate,
    schema: schemas.salesGroupWiseAllReportSchema,
    handler: handlers.salesGroupWiseAllReportHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/reports/sales/outlet_type",
    preHandler: fastify.authenticate,
    schema: schemas.getSalesOutletTypeReportSchema,
    handler: handlers.salesOutletTypeReportHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/reports/sales/transfer",
    preHandler: fastify.authenticate,
    schema: schemas.getSalesTransferReportSchema,
    handler: handlers.salesTransferReportHandler(fastify)
  });
};
