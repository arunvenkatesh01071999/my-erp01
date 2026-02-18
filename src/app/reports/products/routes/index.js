const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/reports/item/:head/:type/:category/:subcategory/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getItemPaginateSchema,
    handler: handlers.getItemPaginateHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/reports/item/stock/value",
    // preHandler: fastify.authenticate,
    schema: schemas.getStockValueSchema,
    handler: handlers.getStockValueHandler(fastify)
  });

};

