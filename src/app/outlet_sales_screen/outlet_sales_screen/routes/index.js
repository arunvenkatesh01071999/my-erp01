const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/outlet_sales_screen_edit_log",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletSalesEditLogSchema,
    handler: handlers.postOutletSalesEditLogHandler(fastify)
  });


};
