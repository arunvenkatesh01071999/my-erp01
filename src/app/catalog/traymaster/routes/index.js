const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/traymaster",
    preHandler: fastify.authenticate,
    schema: schemas.getTrayMasterSchema,
    handler: handlers.getTrayMasterHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/traymaster",
    preHandler: fastify.authenticate,
    schema: schemas.postTrayMasterSchema,
    handler: handlers.postTrayMasterHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/traymaster/:traymaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.putTrayMasterSchema,
    handler: handlers.putTrayMasterHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/traymaster/:traymaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteTrayMasterSchema,
    handler: handlers.deleteTrayMasterHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/traymaster/:traymaster_id",
    preHandler: fastify.authenticate,
    schema: schemas.getTrayMasterInfoSchema,
    handler: handlers.getTrayMasterInfoHandler(fastify)
  });

  // fastify.route({
  //   method: "GET",
  //   url: "/brand/typedesign/:cat_id/:sub_cat_id/:head_id",
  //   preHandler: fastify.authenticate,
  //   schema: schemas.getTypeDesignByCategorySchema,
  //   handler: handlers.getBrandTypedesignInfoHandler(fastify)
  // });

  fastify.route({
    method: "GET",
    url: "/traymaster/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getTrayMasterPaginateSchema,
    handler: handlers.getTrayMasterPaginateHandler(fastify)
  });
};
