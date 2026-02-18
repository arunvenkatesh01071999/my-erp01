const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/expences/with_expences_details",//1
    // preHandler: fastify.authenticate,
    // schema: schemas.postExpenceSchema,
    handler: handlers.postExpencesWithExpencesDetails(fastify)
  })

  fastify.route({
    method: "POST",
    url: "/expences/with_expences_details/delete",//1
    // preHandler: fastify.authenticate,
    // schema: schemas.postExpenceSchema,
    handler: handlers.deleteExpencesWithExpencesDetails(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/expences",
    preHandler: fastify.authenticate,
    // schema: schemas.postExpenceSchema,
    handler: handlers.postExpences(fastify)
  });



  fastify.route({
    method: "GET",
    url: "/expences/docno/:warehouse_id?",
    // preHandler: fastify.authenticate,
    // schema: schemas.getExpenceDocnoSchema,
    handler: handlers.getExpences(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/expences/:from_date/:to_date",
    preHandler: fastify.authenticate,
    schema: schemas.getAllExpenceSchema,
    handler: handlers.getAllExpences(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/expences/with_expences_details_get",//2
    preHandler: fastify.authenticate,
    // schema: schemas.getAllExpenceSchema,
    handler: handlers.getAllExpencesExpencesDetails(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/expences/:id",
    preHandler: fastify.authenticate,
    schema: schemas.putExpenceSchema,
    handler: handlers.updateExpences(fastify)
  });




};
