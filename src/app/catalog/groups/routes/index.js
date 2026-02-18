const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/groups",
    schema: schemas.getGroupSchema,
    handler: handlers.getGroupHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/groups",
    schema: schemas.postGroupSchema,
    handler: handlers.postGroupHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/groups/:group_id",
    schema: schemas.putGroupSchema,
    handler: handlers.putGroupHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/groups/:group_id",
    schema: schemas.deleteGroupSchema,
    handler: handlers.deleteGroupHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/groups/info/:group_id",
    schema: schemas.getGroupInfoSchema,
    handler: handlers.getGroupInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/groups/:page_size/:current_page",
    schema: schemas.getGroupPaginateSchema,
    handler: handlers.getGroupPaginateHandler(fastify)
  });
};
