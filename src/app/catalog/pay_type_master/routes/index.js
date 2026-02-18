const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "GET",
    url: "/pay_type_master/:pay_type_key",
    preHandler: fastify.authenticate,
    // schema: schemas.getPayTypeMasterSchema,
    handler: handlers.getPayTypeMasterKeyHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/pay_type_master/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getPayTypeMasterPaginateSchema,
    handler: handlers.getPayTypeMasterHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/pay_type_master",
    preHandler: fastify.authenticate,
    schema: schemas.postPayTypeMasterSchema,
    handler: handlers.postPayTypeMasterHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/pay_type_master/:id",
    preHandler: fastify.authenticate,
    schema: schemas.putPayTypeMasterSchema,
    handler: handlers.putPayTypeMasterHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/pay_type_master/:id",
    preHandler: fastify.authenticate,
    schema: schemas.deletePayTypeMasterSchema,
    handler: handlers.deletePayTypeMasterHandler(fastify)
  });


};
