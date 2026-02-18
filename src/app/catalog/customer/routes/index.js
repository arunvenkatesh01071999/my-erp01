const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/customer",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierSchema,
    handler: handlers.getCustomerHandler(fastify)
  });

  // fastify.route({
  //   method: "POST",
  //   url: "/supplier",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.postSupplierSchema,
  //   handler: handlers.postSupplierHandler(fastify)
  // });

  // fastify.route({
  //   method: "PUT",
  //   url: "/supplier/:supplier_id",
  //   schema: schemas.putSupplierSchema,
  //   preHandler: fastify.authenticate,
  //   handler: handlers.putSupplierHandler(fastify)
  // });

  // fastify.route({
  //   method: "DELETE",
  //   url: "/supplier/:supplier_id",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.deleteSupplierSchema,
  //   handler: handlers.deleteSupplierHandler(fastify)
  // });

  // fastify.route({
  //   method: "GET",
  //   url: "/supplier/:supplier_id",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.getSupplierInfoSchema,
  //   handler: handlers.getSupplierInfoHandler(fastify)
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
