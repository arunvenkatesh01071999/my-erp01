const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/outlet_expences/with_outlet_expences_details/delete",
    // preHandler: fastify.authenticate,
    // schema: schemas.postExpenceSchema,
    handler: handlers.deleteOutletExpencesWithOutletExpencesDetails(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet_expences/with_outlet_expences_details",
    // preHandler: fastify.authenticate,
    // schema: schemas.postExpenceSchema,
    handler: handlers.postOutletExpencesWithOutletExpencesDetails(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet_expences",
    preHandler: fastify.authenticate,
    schema: schemas.postExpenceSchema,
    handler: handlers.postoutletExpences(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet_expences/:outlet_id?",
    preHandler: fastify.authenticate,
    // schema: schemas.postExpenceSchema,
    handler: handlers.getOutletExpences(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet_expences/:from_date/:to_date/:outlet_id?",
    preHandler: fastify.authenticate,
    // schema: schemas.postExpenceSchema,
    handler: handlers.getAllOutletExpences(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet_expences/with_outlet_expences_details_get",
    // preHandler: fastify.authenticate,
    // schema: schemas.postExpenceSchema,
    handler: handlers.getAllOutletExpencesWithOutletExpencesDetails(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet_expences/:id",
    preHandler: fastify.authenticate,
    // schema: schemas.putAccountMasterSchema,
    handler: handlers.updateOutletExpences(fastify)
  });

};
