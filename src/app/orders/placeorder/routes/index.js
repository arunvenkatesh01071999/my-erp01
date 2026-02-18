const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/orders/place",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.placeOrderSchema,
    handler: handlers.placeOrderHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/orders/:page_size/:current_page",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.getOrderSchema,
    handler: handlers.getOrderHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/orders/:order_id",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.getOrderByIdSchema,
    handler: handlers.getOrderByIdHandler(fastify)
  });
};
 