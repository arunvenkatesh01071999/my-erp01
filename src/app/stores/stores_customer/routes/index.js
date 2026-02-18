const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/stores/customer",
    preHandler: fastify.authenticate,
    schema: schemas.postStoreCustomerSchema,
    handler: handlers.postStoreCustomerHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/stores/customer/update/:customer_id",
    preHandler: fastify.authenticate,
    schema: schemas.putStoreCustomerSchema,
    handler: handlers.putStoreCustomerHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/stores/customer/delete/:customer_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteCustomerSchema,
    handler: handlers.deleteCustomerHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/stores/customer/:customer_id",
    preHandler: fastify.authenticate,
    schema: schemas.getCustomerInfoSchema,
    handler: handlers.getCustomerInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/stores/customer/list",
    preHandler: fastify.authenticate,
    schema: schemas.getCustomerSchema,
    handler: handlers.getCustomerHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/stores/customer/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getCustomerPaginateSchema,
    handler: handlers.getCustomerPaginateHandler(fastify)
  });
};
