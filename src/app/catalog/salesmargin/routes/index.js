const schemas = require("../schemas");
const handlers = require("../handlers");
module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: `/sales/margin/get/product/details`,
    preHandler: fastify.authenticate,
    schema: schemas.getSalesMarginListSchema,
    handler: handlers.getSaleMarginHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/sales/margin",
    preHandler: fastify.authenticate,
    schema: schemas.postSalesMarginSchema,
    handler: handlers.postSalesMarginHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/sales/margin/new",
    schema: schemas.postSalesMarginNewSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postSalesMarginNewHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/sales/margin/new/get/product/details",
    preHandler: fastify.authenticate,
    schema: schemas.getSalesMarginNewDetailsSchema,
    handler: handlers.getSaleMarginNewDetailsHandler(fastify)
  });



  // fastify.route({
  //   method: "DELETE",
  //   url: "/supplier/:supplier_id",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.deleteSupplierSchema,
  //   handler: handlers.deleteSupplierHandler(fastify)
  // });



  // fastify.route({
  //   method: "GET",
  //   url: "/supplier/:page_size/:current_page/:search?",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.getSupplierPaginateSchema,
  //   handler: handlers.getSupplierPaginateHandler(fastify)
  // });

  // fastify.route({
  //   method: "GET",
  //   url: "/supplier/mapping/product",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.getSupplierByProductSchema,
  //   handler: handlers.getSupplierByProductsHandler(fastify)
  // });
};
