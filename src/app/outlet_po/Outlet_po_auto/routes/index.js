const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/generate/outlet/auto/purchase/order/pono/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPoSchema,
    handler: handlers.getOutletPoPonoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/auto/purchase/order/currentday/:vendor_id/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrderProductSchema,
    handler: handlers.getProductBySupplierHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/auto/purchase/order/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletPurchaseOrderSchema,
    handler: handlers.postOutletpohandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/auto/purchase/order/temp/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletPurchaseOrderTempSchema,
    handler: handlers.postOutletpoTemphandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/auto/purchase/order/final/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletPurchaseOrderFinalSchema,
    handler: handlers.postOutletpoFinalhandler(fastify)
  });


  // fastify.route({
  //   method: "GET",
  //   url: "/outlet/auto/purchase/order/unapproved/list/:company_id/:region_id/:outlet_id",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.getOutletPurchaseOrderApprovedListSchema,
  //   handler: handlers.getOutletPurchaseOrderUnApprovedListHandler(fastify)
  // });

  fastify.route({
    method: "POST",
    url: "/outlet/auto/purchase/order/unapproved/list/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseOrderApprovedListSchema,
    handler: handlers.getOutletPurchaseOrderUnApprovedListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/auto/purchase/order/approved/item/:po_no/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseOrderApprovedPonoSchema,
    handler: handlers.getOutletPurchaseOrderApprovedItemHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/outlet/auto/purchase/order/delete/:po_no/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteOutletPurchaseOrderProductSchema,
    handler: handlers.deleteOutletPurchaseOrderProductHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/auto/purchase/order/update/:po_no/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.putOutletPurchaseOrderProductsSchema,
    handler: handlers.putOutletPurchaseOrderProductHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/autopogenerate/currentday/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getautogeneratepoSchema,
    handler: handlers.getautogeneratepohandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/autopo/brandcompany/:outlet_id/:supplier_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getAutoPoBrandCompanySchema,
    handler: handlers.getAutoPoBrandCompanyhandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/dsd/po/status/list",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletDsdPoStatusListSchema,
    handler: handlers.getOutletDsdPoStatusListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/dsd/po/status/list/with/email",
    handler: handlers.getOutletDsdPoStatusListWithEmailHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/dsd/po/send/back/finance",
    preHandler: fastify.authenticate,
    schema: schemas.updateOutletDsdPoSendBackToFinanceSchema,
    handler: handlers.updateOutletDsdPoSendBackToFinanceHandler(fastify)
  });

};

