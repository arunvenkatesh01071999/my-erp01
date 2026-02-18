const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/generate/purchase/order/pono/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrderPonoSchema,
    handler: handlers.getPurchaseOrderPonoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/order/:vendor_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrderProductSchema,
    handler: handlers.getProductBySupplierHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/fmcg/purchase/order/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.postPurchaseOrderProductSchema,
    handler: handlers.postPurchaseOrderProductHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/purchase/order/fmcg/update/:po_no/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.putPurchaseOrderProductsSchema,
    handler: handlers.putPurchaseOrderProductHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/purchase/order/delete/:po_no/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.deletePurchaseOrderSchema,
    handler: handlers.deletePurchaseOrderProductHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/order/unapproved/:from_date/:to_date/:approved/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getUnApprovedPurchaseOrderProductSchema,
    handler: handlers.getPoUnApprovedProductHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/order/approved/item/:pono/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrderApprovedPonoSchema,
    handler: handlers.getPurchaseOrderApprovedItemHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/order/approved/list/:vendor_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrderPonoListSchema,
    handler: handlers.getPurchaseOrderApprovedPonoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/order/expiry/:vendor_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getProductExpiryBySuppierSchema,
    handler: handlers.getProductExpiryBySupplierHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/order/unapproved/list/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrderApprovedListSchema,
    handler: handlers.getPurchaseOrderUnApprovedListHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/purchase/order/unapproved/product/update/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.putUnApprovedPoProductSchema,
    handler: handlers.putPoUnApprovedProductHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/purchase/order/setting",
    preHandler: fastify.authenticate,
    schema: schemas.putPoSettingHandler,
    handler: handlers.putPoSettingHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/purchase/order/setting",
    preHandler: fastify.authenticate,
    handler: handlers.getPoSettingHandler(fastify)
  });

};
