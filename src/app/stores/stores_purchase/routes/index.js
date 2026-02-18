const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/stores/po/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.postStoresPOSchema,
    handler: handlers.postStoresPOHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/stores/po/unapproved/:from_date/:to_date/:approved/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getStoresUnApprovedPurchaseOrderProductSchema,
    handler: handlers.getStorePoUnApprovedProductHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/stores/po/approved/item/:pono/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getStorePurchaseOrderApprovedPonoSchema,
    handler: handlers.getStorePurchaseOrderApprovedItemHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/stores/po/update/:po_no/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.putStorePurchaseOrderProductsSchema,
    handler: handlers.putStorePurchaseOrderProductHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/stores/po/unapproved/product/update/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.putStoresUnApprovedPoProductSchema,
    handler: handlers.putStoresPoUnApprovedProductHandler(fastify)
  });


  fastify.route({
    method: "POST",
    url: "/stores/purchase/po",
    preHandler: fastify.authenticate,
    schema: schemas.postStorePoPurchaseSchema,
    handler: handlers.postStorePoPurchaseHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/stores/purchase/manual",
    preHandler: fastify.authenticate,
    schema: schemas.postStoreManualPurchaseSchema,
    handler: handlers.postStoreManualPurchaseHandler(fastify)
  });


  fastify.route({
    method: "POST",
    url: "/store/purchase/return",
    preHandler: fastify.authenticate,
    schema: schemas.postStorePurchaseReturnSchema,
    handler: handlers.postStorepurchaseReturnHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/store/purchase/return/:purchase_return_id",
    preHandler: fastify.authenticate,
    schema: schemas.putStorePurchaseReturnSchema,
    handler: handlers.putStorePurchaseReturnHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/store/purchase/return/:purchase_return_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteStorePurchaseReturnSchema,
    handler: handlers.deleteStorePurchaseReturnHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/store/purchase/return/:purchase_return_id",
    preHandler: fastify.authenticate,
    schema: schemas.getStorePurchaseReturnByIdSchema,
    handler: handlers.getStorePurchaseReturnByIdHandler(fastify)
  });


};
