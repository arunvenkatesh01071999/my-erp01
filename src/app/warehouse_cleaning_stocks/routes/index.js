const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/warehouse/cleaning/stocks",
    preHandler: fastify.authenticate,
    schema: schemas.postWarehouseCleaningStockSchema,
    handler: handlers.postWarehouseCleaningStockHandler(fastify)
  });

  
};
