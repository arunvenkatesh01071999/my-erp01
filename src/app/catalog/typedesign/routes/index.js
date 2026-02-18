const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "GET",
    url: "/typedesign",
    preHandler: fastify.authenticate,
    schema: schemas.getTypedesignSchema,
    handler: handlers.getTypedesignHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/typedesign/currentDay/:region_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getTypedesignCurrendaySchema,
    handler: handlers.getTypedesignCurrentdayHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/typedesign",
    preHandler: fastify.authenticate,
    schema: schemas.postTypedesignSchema,
    handler: handlers.postTypedesignHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/typedesign/:typedesign_id",
    preHandler: fastify.authenticate,
    schema: schemas.putTypedesignSchema,
    handler: handlers.putTypedesignHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/typedesign/:typedesign_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteTypedesignSchema,
    handler: handlers.deleteTypedesignHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/typedesign/:typedesign_id",
    preHandler: fastify.authenticate,
    schema: schemas.getTypedesignInfoSchema,
    handler: handlers.getTypedesignInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/brand/typedesign/:cat_id/:sub_cat_id/:head_id",
    preHandler: fastify.authenticate,
    schema: schemas.getTypeDesignByCategorySchema,
    handler: handlers.getBrandTypedesignInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/typedesign/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getTypedesignPaginateSchema,
    handler: handlers.getTypedesignPaginateHandler(fastify)
  });
};
