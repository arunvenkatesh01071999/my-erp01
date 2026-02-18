const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/generate/docno/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.generateOutletPurchaseDocnoSchema,
    handler: handlers.generateOutletPurchaseDocnoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/outlet/list/:region_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseOutletListSchema,
    handler: handlers.getOutletPurchaseOutletListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/supplier/list/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseSupplierListSchema,
    handler: handlers.getOutletPurchaseSupplierListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/po/list/:outlet_id/:supplier_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchasePoListSchema,
    handler: handlers.getOutletPurchasePoListHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase/items/list",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseItemListSchema,
    handler: handlers.getOutletPurchaseItemListHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletBasedPurchaseSchema,
    handler: handlers.postOutletPurchaseHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase/manual",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletBasedManualPurchaseSchema,
    handler: handlers.postOutletManualPurchaseHandler(fastify)
  });


  fastify.route({
    method: "PUT",
    url: "/outlet/purchase/order/grn",
    // preHandler: fastify.authenticate,
    // schema: schemas.createOutletPurchaseGrnSchema,
    handler: handlers.updateOutletPurchaseOrderGrnHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/get/grn/details/:grn_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletGrnByIdSchema,
    handler: handlers.getOutletGrnByIdHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase/return",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletPurchaseReturnSchema,
    handler: handlers.postOutletPurchaseReturnHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/details/:outlet_id/:doc_no",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseDetailsSchema,
    handler: handlers.getOutletPurchaseDetailsHandler(fastify)
  });

};
