const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/fmcg/purchase",
    preHandler: fastify.authenticate,
    schema: schemas.postPurchaseDetailsSchema,
    handler: handlers.postpurchaseHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/fmcg/purchase/:purchase_id",
    preHandler: fastify.authenticate,
    schema: schemas.putPurchaseDetailsSchema,
    handler: handlers.putPurchaseDetailsHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/fmcg/purchase/:purchase_id",
    preHandler: fastify.authenticate,
    schema: schemas.deletePurchaseMasterSchema,
    handler: handlers.deletePurchaseDetailsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/purchase/edit/list",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseEditListSchema,
    handler: handlers.getPurchaseGrnEditListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/purchase/:purchase_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseByIdSchema,
    handler: handlers.getPurchaseByIdHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/generate/purchase/no",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchasenoSchema,
    handler: handlers.generatePurchasenoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/grn/:pono/:invoice_no",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchase,
    handler: handlers.getPurchaseGrnHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/grn/details/list/:supplier_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPOGrnSchema,
    handler: handlers.getPurchaseGrnListHandler(fastify)
  });
};


