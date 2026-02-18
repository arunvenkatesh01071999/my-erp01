const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/inchargegroupmaster",
    preHandler: fastify.authenticate,
    schema: schemas.getGroupMasterSchema,
    handler: handlers.getInchargeGroupMasterHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/inchargegroupmaster",
    preHandler: fastify.authenticate,
    schema: schemas.postGroupMasterSchema,
    handler: handlers.postInchargeGroupMasterHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/inchargegroupmaster/:inchargegroupmaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.putGroupMasterSchema,
    handler: handlers.putInchargeGroupMasterHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/inchargegroupmaster/:inchargegroupmaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteGroupMasterSchema,
    handler: handlers.deleteInchargeGroupMasterHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/inchargegroupmaster/:inchargegroupmaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.getGroupMasterInfoSchema,
    handler: handlers.getInchargeGroupMasterInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/inchargegroupmaster/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getGroupMasterPaginateSchema,
    handler: handlers.getInchargeGroupMasterPaginateHandler(fastify)
  });
};
