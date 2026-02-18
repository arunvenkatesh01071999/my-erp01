const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/inchargemaster",
    preHandler: fastify.authenticate,
    schema: schemas.getInchargeMasterSchema,
    handler: handlers.getInchargeMasterHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/inchargemaster",
    preHandler: fastify.authenticate,
    schema: schemas.postInchargeMasterSchema,
    handler: handlers.postInchargeMasterHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/inchargemaster/:inchargemaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.putInchargeMasterSchema,
    handler: handlers.putInchargeMasterHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/inchargemaster/:inchargemaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteInchargeMasterSchema,
    handler: handlers.deleteInchargeMasterHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/inchargemaster/:inchargemaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.getInchargeMasterInfoSchema,
    handler: handlers.getInchargeMasterInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/inchargemaster/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getInchargeMasterPaginateSchema,
    handler: handlers.getInchargeMasterPaginateHandler(fastify)
  });
};
