const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/outlet_sales_master",
    // preHandler: fastify.authenticate,
    // schema: schemas.postOutletSalesMasterSchema,
    handler: handlers.postOutletSalesMasterHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/outlet_sales_payment",
    preHandler: fastify.authenticate,
    schema: schemas.putOutletSalesPaymentSchema,
    handler: handlers.putOutletSalesPaymentHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet_sales_master_get",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletSalesMasterSchema,
    handler: handlers.getOutletSalesMasterHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet_sales_master/:outlet_id?",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletSalesDocno,
    handler: handlers.getOutletSalesDocNo(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/fetch_outlet_member",
    preHandler: fastify.authenticate,
    // schema: schemas.getOutletSalesDocno,
    handler: handlers.getFetchOutletMembersHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet_sales_master/getall",
    // preHandler: fastify.authenticate,
    // schema: schemas.getOutletSalesDocno,
    handler: handlers.getAllOutletSales(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet_sales_master/delete",
    preHandler: fastify.authenticate,
    schema: schemas.deleteOutletSalesSchema,
    handler: handlers.deleteOutletSales(fastify)
  });

};
