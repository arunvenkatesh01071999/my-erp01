const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/role/:company_id/:page_size/:current_page",
    schema: schemas.getRoleSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.getRoleHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/role/info/:role_id/:company_id",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.getRoleInfoSchema,
    handler: handlers.getRoleInfoHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/role",
    schema: schemas.postRoleSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.postRoleHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/role/:role_id/:company_id",
    schema: schemas.putRoleSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.putRoleHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/role/:role_id/:company_id",
    schema: schemas.deleteRoleSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.deleteRoleHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/role/list/:company_id/:warehouse_type",
    schema: schemas.getRoleListSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.getRoleListHandler(fastify)
  });
};
