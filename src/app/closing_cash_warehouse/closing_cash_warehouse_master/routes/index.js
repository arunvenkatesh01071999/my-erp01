const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/closing_cash_warehouse_master",
    preHandler: fastify.authenticate,
    schema: schemas.postClosingCashWarehouseMstSchema,
    handler: handlers.postClosingCashWarehouseMstHandler(fastify)
  });


};
