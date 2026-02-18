const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/fmcg/sales",
    preHandler: fastify.authenticate,
    schema: schemas.postSalesMasterSchema,
    handler: handlers.postSalesMasterHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/fmcg/sales/:sale_id",
    preHandler: fastify.authenticate,
    schema: schemas.putSalesMasterSchema,
    handler: handlers.putSalesHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/sales/edit/list",
    preHandler: fastify.authenticate,
    schema: schemas.getSalesEditListSchema,
    handler: handlers.getSalesEditListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/fmcg/sales/:sale_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSalesMasterByIdSchema,
    handler: handlers.getSalesByIdHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/fmcg/sales/:sale_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteSalesMasterSchema,
    handler: handlers.deleteSalesMasterHandler(fastify)
  });


  fastify.route({
    method: "GET",
    url: "/sales/doc/no",
    preHandler: fastify.authenticate,
    schema: schemas.getSalenoSchema,
    handler: handlers.generateSaleNoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/sales/customer/mapping/product/list/:customer_id/:type_id",
    preHandler: fastify.authenticate,
    schema: schemas.getCustomerMappingSchema,
    handler: handlers.getCustomerMappingHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/sales/customer/list",
    preHandler: fastify.authenticate,
    schema: schemas.getCustomerDetailsSchema,
    handler: handlers.getCustomerDetailsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/sales/product/details/:customer_id",
    preHandler: fastify.authenticate,
    schema: schemas.getProductDetailsSchema,
    handler: handlers.getProductDetailsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/sales/export/pending/list",
    preHandler: fastify.authenticate,
    schema: schemas.getExportPendingSchema,
    handler: handlers.getExportPendingListHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/sales/export/pending/:sale_id",
    preHandler: fastify.authenticate,
    schema: schemas.putExportPendingSchema,
    handler: handlers.putExportPendingListHandler(fastify)
  });

};
