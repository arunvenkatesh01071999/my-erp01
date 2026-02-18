const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/fmcg/purchase/return",
    preHandler: fastify.authenticate,
    schema: schemas.postPuchasereturnSchema,
    handler: handlers.postpurchaseReturnHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/fmcg/purchase/return/:purchase_return_id",
    preHandler: fastify.authenticate,
    schema: schemas.putPurchaseReturnSchema,
    handler: handlers.putpurchaseReturnHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/fmcg/purchase/return/:purchase_return_id",
    preHandler: fastify.authenticate,
    schema: schemas.deletePurchaseReturnSchema,
    handler: handlers.deletePurchaseReturnHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/purchase/return/:purchase_return_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseReturnByIdSchema,
    handler: handlers.getPurchaseReturnByIdHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/purchase/return/edit/list",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseReturnEditListSchema,
    handler: handlers.getPurchaseReturnEditListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/return/:supplier_id/:type_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPuchasereturnSchema,
    handler: handlers.getPurchaseReturnDetailsHandler(fastify)
  });


  fastify.route({
    method: "GET",
    url: "/purchase/return/details/list/:purchase_id/:supplier_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseNoDetailsSchema,
    handler: handlers.getPurchaseNoDetailsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/return/list/:from_date/:to_date",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseReturnListSchema,
    handler: handlers.getPurchaseReturnListHandler(fastify)
  });


  fastify.route({
    method: "GET",
    url: "/purchase/fmcg/return/:supplier_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPuchasereturnSchema,
    handler: handlers.getPurchaseBillwiseDetailsHandler(fastify)
  });


  fastify.route({
    method: "GET",
    url: "/generate/purchase/return/number",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseReturnNoSchema,
    handler: handlers.generatePurchaseReturnNoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/return/product/details/:supplier_id",
    preHandler: fastify.authenticate,
    schema: schemas.getProductDetailsBySupplierSchema,
    handler: handlers.getPurchaseReturnBySupplierHanlder(fastify)
  });

};
