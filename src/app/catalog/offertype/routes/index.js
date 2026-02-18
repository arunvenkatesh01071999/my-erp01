const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/offer/type",
    schema: schemas.getOfferTypeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getOfferTypeHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/offer/type",
    schema: schemas.postOfferTypeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postOfferTypeHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/offer/type/:oid",
    schema: schemas.putOfferTypeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putOfferTypeHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/offer/type/:oid",
    schema: schemas.deleteOfferTypeSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteOfferTypeHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/offer/type/info/:oid",
    schema: schemas.getOfferTypeInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getOfferTypeInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/offer/type/:page_size/:current_page",
    schema: schemas.getOfferTypePaginateSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getOfferTypePaginateHandler(fastify)
  });
};
