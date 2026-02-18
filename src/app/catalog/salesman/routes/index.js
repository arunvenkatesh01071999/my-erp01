const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "GET",
    url: "/SalesMan/outlet_mapping",
    // preHandler: fastify.authenticate,
    // schema: schemas.getSalesManSchema,
    handler: handlers.getSalesManOutletMappingHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/SalesMan",
    preHandler: fastify.authenticate,
    schema: schemas.getSalesManSchema,
    handler: handlers.getSalesManHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/SalesMan",
    preHandler: fastify.authenticate,
    // schema: schemas.postSalesManSchema,
    handler: handlers.postSalesManHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/SalesMan/outlet_mapping",
    // preHandler: fastify.authenticate,
    // schema: schemas.postSalesManSchema,
    handler: handlers.postSalesManOutletMappingHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/SalesMan/:SalesMan_id",
    preHandler: fastify.authenticate,
    // schema: schemas.putSalesManSchema,
    handler: handlers.putSalesManHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/SalesMan/outlet_mapping/:SalesMan_id",
    // preHandler: fastify.authenticate,
    // schema: schemas.putSalesManSchema,
    handler: handlers.putSalesManOutletMappingHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/SalesMan/:SalesMan_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteSalesManSchema,
    handler: handlers.deleteSalesManHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/SalesMan/:SalesMan_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSalesManInfoSchema,
    handler: handlers.getSalesManInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/SalesMan/outlet_mapping/:SalesMan_id",
    // preHandler: fastify.authenticate,
    // schema: schemas.getSalesManInfoSchema,
    handler: handlers.getSalesManInfoOutletMappingOneHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/SalesMan/outlet_mapping/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getSalesManInfoOutletMapSchema,
    handler: handlers.getSalesManInfoOutletMappingOnePaginateHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/SalesMan/:page_size/:current_page/:search?",
    preHandler: fastify.authenticate,
    schema: schemas.getSalesManPaginateSchema,
    handler: handlers.getSalesManPaginateHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/SalesMan/outlets/:outlet_id",
    // preHandler: fastify.authenticate,
    schema: schemas.getSalesManByOutletSchema,
    handler: handlers.getSalesManByOutletHandler(fastify)
  });


};
