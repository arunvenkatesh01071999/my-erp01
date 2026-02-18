const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/accountmaster",
    schema: schemas.getAccountMasterSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getAccountMasterHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/accountmaster",
    preHandler: fastify.authenticate,
    schema: schemas.postAccountMasterSchema,
    handler: handlers.postAccountMasterHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/accountmaster/:acc_id",
    preHandler: fastify.authenticate,
    schema: schemas.putAccountMasterSchema,
    handler: handlers.putAccountMasterHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/accountmaster/:acc_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteAccountMasterSchema,
    handler: handlers.deleteAccountMasterHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/accountmaster/:acc_id",
    preHandler: fastify.authenticate,
    schema: schemas.getAccountMasterInfoSchema,
    handler: handlers.getAccountMasterInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/accountmaster/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getAccountMasterPaginateSchema,
    handler: handlers.getAccountMasterPaginateHandler(fastify)
  });
};
