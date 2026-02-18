const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/warehouse/payment",
    preHandler: fastify.authenticate,
    schema: schemas.postWarehousePaymentSchema,
    handler: handlers.postWarehousePaymentHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouse/payment/outstanding/bill/supplier/list/:warehouse_id",
    preHandler: fastify.authenticate,
    schema: schemas.getWareousePaymentOutstandingBillSupplierlistSchema,
    handler: handlers.getWareousePaymentOutstandingBillSupplierlistHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouse/payment/outstanding/supplier/details/:supplier_id",
    preHandler: fastify.authenticate,
    schema: schemas.getWareousePaymentOutstandingBillSupplierDetailsSchema,
    handler: handlers.getWareousePaymentOutstandingBillSupplierlDetailsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/warehouse/payment/outstanding/bill/list/:warehouse_id/:supplier_id/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getWareousePaymentOutstandingBillListSchema,
    handler: handlers.getWareousePaymentOutstandingBillListHandler(fastify)
  });

};
