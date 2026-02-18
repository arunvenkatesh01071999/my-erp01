const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/purchase/grn/fmcg",
    preHandler: fastify.authenticate,
    schema: schemas.postPurchaseGrnFmcgProductSchema,
    handler: handlers.postPurchaseGrnFmcgProductHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/purchase/grn/fmcg/:grn_id",
    preHandler: fastify.authenticate,
    schema: schemas.putPurchaseGrnFmcgProductSchema,
    handler: handlers.putPurchaseGrnFmcgProductHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/purchase/grn/fmcg/:grn_id",
    preHandler: fastify.authenticate,
    schema: schemas.deletePurchaseGrnFmcgProductSchema,
    handler: handlers.deletePurchaseGrnFmcgProductHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/grn/unapproved/list",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseGrnApprovedListSchema,
    handler: handlers.getPurchaseGrnListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/generate/grn/no",
    preHandler: fastify.authenticate,
    schema: schemas.generateGrnNoSchema,
    handler: handlers.generatePurchaseGrnNoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/grn/approved/po/:pono",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrderApprovedPonoSchema,
    handler: handlers.getPurchaseOrderApprovedPoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/grn/fmcg/:grn_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseGrnByIdSchema,
    handler: handlers.getPurchaseGrnByIdHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/purchase/grn/fv",
    preHandler: fastify.authenticate,
    schema: schemas.postPurchaseFVGrnProductSchema,
    handler: handlers.postPurchaseGrnFvProductHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/purchase/grn/fv/details/:product_code",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseFVGrnProductSchema,
    handler: handlers.getPurchaseGrnFvProductHandler(fastify)
  });

};
