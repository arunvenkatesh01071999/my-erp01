const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/outlet_sales_return_master/getall",
    // preHandler: fastify.authenticate,
    // schema: schemas.postSalesReturnMasterSchema,
    handler: handlers.getOutletSalesReturnMasterGetallHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet_sales_return_master/getone",
    // preHandler: fastify.authenticate,
    // schema: schemas.postSalesReturnMasterSchema,
    handler: handlers.getOutletSalesReturnMasterGetOneHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet_sales_return_master/update/bycash/nbill",
    // preHandler: fastify.authenticate,
    schema: schemas.updateOsmBycashBill,
    handler: handlers.updateOsmBycashBillHandler(fastify)
  })

  fastify.route({
    method: "POST",
    url: "/outlet_sales_return_master",
    // preHandler: fastify.authenticate,
    schema: schemas.postSalesReturnMasterSchema,
    handler: handlers.postOutletSalesReturnMasterHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet_sales_return_master/:outlet_id?",
    preHandler: fastify.authenticate,
    schema: schemas.getSalesReturnMasterSchema,
    handler: handlers.getDocNo(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet_sales_return_master/:outletid/:billno",
    // preHandler: fastify.authenticate,
    // schema: schemas.responseSchema,
    handler: handlers.getOutletsalesReturnByOutletId(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet_sales_docno/:outletid",
    // preHandler: fastify.authenticate,
    // schema: schemas.getAllOutletSalesDocnoSchema,
    handler: handlers.getDocNoMaster(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet_sales",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletSalesSchema,
    handler: handlers.getAllOutletSales(fastify)
  });


};
