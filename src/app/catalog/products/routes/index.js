const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/products/:page_size/:current_page/:search?",
    schema: schemas.getProductSchema,
    handler: handlers.getProductHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/pricebyvariants",
    // schema: schemas.getProductSchema,
    handler: handlers.priceByVariantsHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/products",
    schema: schemas.postProductSchema,
    handler: handlers.postProductHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/products/:product_id",
    schema: schemas.putProductSchema,
    handler: handlers.putProductHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/products/:product_id",
    schema: schemas.deleteProductSchema,
    handler: handlers.deleteProductHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/products/detail/:product_code",
    schema: schemas.getProductDetailSchema,
    handler: handlers.getProductDetailHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/subcategories/count",
    schema: schemas.subCategoryCountSchema,
    handler: handlers.subCategoryCountHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/products/subcategory/:subcategory_id/:page_size/:current_page",
    schema: schemas.getProductBySubCategorySchema,
    handler: handlers.getProductBySubCategoryHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/products/category/:category_id/:page_size/:current_page",
    schema: schemas.getProductByCategorySchema,
    handler: handlers.getProductByCategoryHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/products/brands/:brand_id/:page_size/:current_page",
    schema: schemas.getProductByBrandSchema,
    handler: handlers.getProductByBrandHandler(fastify)
  });
};
