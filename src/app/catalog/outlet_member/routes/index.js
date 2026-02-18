const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/outlet/member",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletMemberSchema,
    handler: handlers.getOutletMemberHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/member",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletMemberSchema,
    handler: handlers.postOutletMemberHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/member/:id",
    schema: schemas.putOutletMemberSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putOutletMemberHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/outlet/member/:id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteOutletMemberSchema,
    handler: handlers.deleteOutletMemberHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/member/:id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletMemberInfoSchema,
    handler: handlers.getOutletMemberInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/member/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletMemberPaginateSchema,
    handler: handlers.getOutletMemberPaginateHandler(fastify)
  });
};
