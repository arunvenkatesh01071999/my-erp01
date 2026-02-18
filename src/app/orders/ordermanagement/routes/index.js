const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/admin/orders",
    schema: schemas.getOrderSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getOrderHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/admin/orders/:page_size/:current_page/:status?",
    schema: schemas.getOrderPaginateSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.getOrderPaginateHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/admin/orders/info/:order_id",
    schema: schemas.getOrderByIdSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.getOrderByIdHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/admin/orders/status/count",
    schema: schemas.orderStatusCountSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.orderStatusCountHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/admin/orders/status",
    schema: schemas.orderStatusChangeSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.orderStatusChangeHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/admin/orders/year/sales/:year",
    schema: schemas.orderYearSalesSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.orderYearSalesHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/admin/orders/month/sales/:year/:month",
    schema: schemas.orderMonthSalesSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.orderMonthSalesHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/admin/orders/sales/:page_size/:current_page/:date",
    schema: schemas.getOrderByDatePaginateSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.getOrderByDatePaginateHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/admin/orders/items/sales/:page_size/:current_page",
    schema: schemas.orderItemsSalesSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.orderItemsSalesHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/admin/orders/category/sales/:page_size/:current_page",
    schema: schemas.orderCategorySalesSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.orderCategorySalesHandler(fastify)
  });
};
