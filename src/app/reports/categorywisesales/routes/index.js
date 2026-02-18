const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/reports/category",
    preHandler: fastify.authenticate,
    schema: schemas.getItemPaginateSchema,
    handler: handlers.getItemPaginateHandler(fastify)
  });
};
