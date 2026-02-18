const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/outlet/wastage",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletWastageSchema,
    handler: handlers.postOutletWastageHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/outlet/wastage/:wastage_id",
    preHandler: fastify.authenticate,
    schema: schemas.putOutletWastageSchema,
    handler: handlers.putOutletWastageHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/outlet/wastage/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletWastageSchema,
    handler: handlers.getOutletWastageHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/outlet/wastage/info/:wastage_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletWastageInfoSchema,
    handler: handlers.getOutletWastageInfoHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/outlet/wastage/:wastage_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteOutletWastageSchema,
    handler: handlers.deleteOutletWastageHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/outlet/wastage/docno/:wastage_id?",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletWastageDocnoSchema,
    handler: handlers.getOutletWastageDocnoHandler(fastify)
  });

};
