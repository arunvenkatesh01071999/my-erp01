const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/submenu/:company_id/:page_size/:current_page",
    schema: schemas.getSubMenuSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSubMenuHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/submenu/list/:company_id",
    schema: schemas.submenuListSchema,
    preHandler: fastify.authenticate,
    handler: handlers.submenuListHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/submenu",
    schema: schemas.postSubMenuSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postSubMenuHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/submenu/:submenu_id",
    schema: schemas.putSubMenuSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putSubMenuHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/submenu/:submenu_id",
    schema: schemas.deleteSubMenuSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteSubMenuHandler(fastify)
  });
};
