const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/subcategories",
    schema: schemas.getSubCategorySchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSubCategoryHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/subcategories",
    schema: schemas.postSubCategorySchema,
    preHandler: fastify.authenticate,
    handler: handlers.postSubCategoryHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/subcategories/:subcategory_id",
    schema: schemas.putSubCategorySchema,
    preHandler: fastify.authenticate,
    handler: handlers.putSubCategoryHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/subcategories/:subcategory_id",
    schema: schemas.deleteSubCategorySchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteSubCategoryHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/subcategories/info/:subcategory_id",
    schema: schemas.getSubCategoryInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSubCategoryInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/categories/subcategories/info/:category_id",
    schema: schemas.getSubcategoryByCategorySchema,
    preHandler: fastify.authenticate,
    handler: handlers.getCategorySubCategoryInfoHandler(fastify)
  })
  fastify.route({
    method: "GET",
    url: "/subcategories/:page_size/:current_page",
    schema: schemas.getSubCategoryPaginateSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getSubCategoryPaginateHandler(fastify)
  });
  // fastify.route({
  //   method: "PATCH",
  //   url: "/categories/:category_id/images",
  //   schema: schemas.patchCategoryImageSchema,
  //   handler: handlers.patchCategoryImage(fastify)
  // });
};
