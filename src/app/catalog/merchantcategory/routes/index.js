const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/merchantcategory",
    preHandler: fastify.authenticate,
    schema: schemas.getMerchantCategorySchema,
    handler: handlers.getMerchantCategoryHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/merchantcategory",
    preHandler: fastify.authenticate,
    schema: schemas.postMerchantCategorySchema,
    handler: handlers.postMerchantCategoryHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/merchantcategory/:merchantcategory_id",
    preHandler: fastify.authenticate,
    schema: schemas.putMerchantCategorySchema,
    handler: handlers.putMerchantCategoryHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/merchantcategory/:merchantcategory_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteMerchantCategorySchema,
    handler: handlers.deleteMerchantCategoryHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/merchantcategory/:merchantcategory_id",
    preHandler: fastify.authenticate,
    schema: schemas.getMerchantCategoryInfoSchema,
    handler: handlers.getMerchantCategoryInfoHandler(fastify)
  });

  // fastify.route({
  //   method: "GET",
  //   url: "/brand/typedesign/:cat_id/:sub_cat_id/:head_id",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.getTypeDesignByCategorySchema,
  //   handler: handlers.getBrandTypedesignInfoHandler(fastify)
  // });

  fastify.route({
    method: "GET",
    url: "/merchantcategory/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getMerchantCategoryPaginateSchema,
    handler: handlers.getMerchantCategoryPaginateHandler(fastify)
  });
};
