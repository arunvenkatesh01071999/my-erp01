const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/outlet/closing_stocks_temp",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletClosingStocksTempSchema,
    handler: handlers.postOutletClosingStocksTempHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/closing_stocks_temp/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletClosingStocksTempSchema,
    handler: handlers.getOutletClosingStocksTempHandler(fastify)
  });

  fastify.route({
    method: "delete",
    url: "/outlet/closing_stocks_temp/:outlet_id/:id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteOutletClosingStocksTempSchema,
    handler: handlers.deleteOutletClosingStocksTempHandler(fastify)
  });

};
