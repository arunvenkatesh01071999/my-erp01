const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/warehouse/expense",
    preHandler: fastify.authenticate,
    schema: schemas.postWarehouseExpenseSchema,
    handler: handlers.postWarehouseExpenseHandler(fastify)
  })

  fastify.route({
    method: "DELETE",
    url: "/warehouse/expense/:expense_mst_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteWarehouseExpenseSchema,
    handler: handlers.deleteWarehouseExpenseHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouse/expense/docno/:warehouse_id",
    preHandler: fastify.authenticate,
    schema: schemas.getWarehouseExpenseDocnoSchema,
    handler: handlers.getWarehouseExpenseDocnoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouse/expense/:from_date/:to_date/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getWarehouseExpenseDatewiseSchema,
    handler: handlers.getWarehouseExpenseDatewiseHandler(fastify)
  });

};
