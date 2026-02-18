const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/clearance_sales",
    preHandler: fastify.authenticate,
    handler: handlers.postClearanceSalesProductHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/clearance_sales/info/:from_date/:to_date/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getClearanceSalesProductInfoSchema,
    handler: handlers.getClearanceSalesProductInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/clearance_sales/info/:doc_no/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getClearanceSalesProductByDocnoSchema,
    handler: handlers.getClearanceSalesProductByDocnoHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/clearance_sales/info/:doc_no/:outlet_id",
    preHandler: fastify.authenticate,
    handler: handlers.putClearanceSalesProductHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/clearance_sales/info/:doc_no/:outlet_id",
    schema: schemas.deleteClearanceSalesProductSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteClearanceSalesProductHandler(fastify)
  });




};
