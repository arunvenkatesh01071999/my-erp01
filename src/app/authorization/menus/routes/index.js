const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/menu/:company_id/:page_size/:current_page",
    schema: schemas.getMenuSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getMenuHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/menu/list/:company_id",
    schema: schemas.menuListSchema,
    preHandler: fastify.authenticate,
    handler: handlers.menuListHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/menu",
    schema: schemas.postMenuSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postMenuHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/menu/:menu_id",
    schema: schemas.putMenuSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putMenuHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/menu/:menu_id",
    schema: schemas.deleteMenuSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteMenuHandler(fastify)
  });
};
