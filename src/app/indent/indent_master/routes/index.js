const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  // it's work
  fastify.route({
    method: "POST",
    url: "/indent/order",
    preHandler: fastify.authenticate,
    schema: schemas.postIndentOrderProductSchema,
    handler: handlers.postIndentOrderProductHandler(fastify)
  });

  // it's work
  fastify.route({
    method: "GET",
    url: "/indent/order/doc_no",
    preHandler: fastify.authenticate,
    schema: schemas.getIndentOrderProductIndentNoSchema,
    handler: handlers.getIndentOrderProductIndentNoHandler(fastify)
  });

 // it's inprogress
  fastify.route({
    method: "GET",
    url: "/indent/order/min/stock/:page_size/:current_page/:outlet_id",
    // preHandler: fastify.authenticate,
    schema: schemas.getIndentOrderProductMinStockSchema,
    handler: handlers.getIndentOrderProductMinStockHandler(fastify)
  });

   // it's work
  fastify.route({
    method: "GET",
    url: "/indent/order/details/:indent_no",
    preHandler: fastify.authenticate,
    schema: schemas.getIndentOrderProductDetailsSchema,
    handler: handlers.getIndentOrderProductDetailsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/indent/order/details/list/all",
    preHandler: fastify.authenticate,
    schema: schemas.getIndentOrderProductDetailsAllSchema,
    handler: handlers.getIndentOrderProductDetailsAllHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/indent/order/sales/based/:page_size/:current_page/:outlet_id/:from_date",
    // preHandler: fastify.authenticate,
    // schema: schemas.getIndentOrderProductMinStockSchema,
    handler: handlers.getIndentOrderProductSalesBasedHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/indent/order/wharehouse/outlet/list/:wh_id",
    preHandler: fastify.authenticate,
    schema: schemas.getIndentOrderWarehouseOutletlistSchema,
    handler: handlers.getIndentOrderWarehouseOutletListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/indent/order/outlet/wharehouse/list/:outlet_id",
    // preHandler: fastify.authenticate,
    schema: schemas.getIndentOrderOutletWarehouseListSchema,
    handler: handlers.getIndentOrderOutletWarehouseListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/indent/order/details/:wh_id/:outlet_id/:indent",
    preHandler: fastify.authenticate,
    schema: schemas.getIndentOrderDetailsSchema,
    handler: handlers.getIndentOrderDetailsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/indent/order/itemDetails/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getItemIndentOrderSchema,
    handler: handlers.getItemForIndentorderHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/indent/details/:date/:companyid/:wh_id/:outlet_id/:indent_no?",
    preHandler: fastify.authenticate,
    schema: schemas.getIndentDetailsSchema,
    handler: handlers.getIndentDetailsHandler(fastify)
  });

};
