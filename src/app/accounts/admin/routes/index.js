const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/users",
    schema: schemas.postAdminUserSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postAdminUserHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/users/:user_id/:company_id",
    schema: schemas.putAdminUserSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putAdminUserHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/users/:company_id/:user_id",
    schema: schemas.deleteAdminUserSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteAdminUserHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/users/:company_id/:page_size/:current_page",
    schema: schemas.getAdminUserSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getAdminUserHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/users/info/:company_id",
    schema: schemas.adminUserInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.adminUserInfoHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/users/login",
    schema: schemas.adminLoginSchema,
    handler: handlers.adminLoginHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/users/logout",
    schema: schemas.adminLogoutSchema,
    preHandler: fastify.authenticate,
    handler: handlers.adminLogoutHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/users/list/:company_id",
    schema: schemas.getAdminUserListSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getAdminUserListHandler(fastify)
  });

    fastify.route({
    method: "GET",
    url: "/users/info",
    schema: schemas.userInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.userInfoHandler(fastify)
  });

};
