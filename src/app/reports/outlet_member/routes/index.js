const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/reports/outlet_member/:page_size/:current_page/:search?",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletMemberSchema,
    handler: handlers.outletMemberReportHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/reports/outlet_member/outlet_sales_mst/:page_size/:current_page/:search?",
    // preHandler: fastify.authenticate,
    // schema: schemas.getOutletMemberWithOutletSalesMstSchema,
    handler: handlers.outletMemberWithOutletSalesMstReportHandler(fastify)
  });

};
