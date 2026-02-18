const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/categories",
    schema: schemas.getCategorySchema,
    preHandler: fastify.authenticate,
    handler: handlers.getCategoryHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/categories",
    schema: schemas.postCategorySchema,
    preHandler: fastify.authenticate,
    handler: handlers.postCategoryHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/categories/:category_id",
    schema: schemas.putCategorySchema,
    preHandler: fastify.authenticate,
    handler: handlers.putCategoryHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/categories/:category_id",
    schema: schemas.deleteCategorySchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteCategoryHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/categories/info/:category_id",
    schema: schemas.getCategoryInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getCategoryInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/categories/:page_size/:current_page",
    schema: schemas.getCategoryPaginateSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getCategoryPaginateHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/home/categories",
    schema: schemas.getHomeCategorySchema,
    preHandler: fastify.authenticate,
    handler: handlers.getHomeCategoryHandler(fastify)
  });

  // fastify.route({
  //   method: "PATCH",
  //   url: "/categories/:category_id/images",
  //   schema: schemas.patchCategoryImageSchema,
  //   handler: handlers.patchCategoryImage(fastify)
  // });
};
