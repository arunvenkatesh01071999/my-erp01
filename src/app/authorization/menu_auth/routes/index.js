const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/menuauth/list/:company_id/:user_id/:warehouse_type",
    schema: schemas.menuAuthListSchema,
    preHandler: fastify.authenticate,
    handler: handlers.menuAuthListHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/menuauth",
    schema: schemas.postMenuAuthSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postMenuAuthHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/role/permission/:page_size/:current_page",
    schema: schemas.getRolePermissionPaginationSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getRolePermissionPaginationHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/role/permission/:user_id",
    schema: schemas.getRolePermissionListSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getRolePermissionHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/role/permission/:user_id",
    schema: schemas.putMenuAuthSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putRolePermissionHandler(fastify)
  });
};
