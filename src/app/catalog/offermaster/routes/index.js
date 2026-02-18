const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/offer/master",
    schema: schemas.postOfferMasterSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postOfferMasterHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/offer/master/:oid",
    schema: schemas.putOfferMasterSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putOfferMasterHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/offer/master/:oid",
    schema: schemas.deleteOfferMasterSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteOfferMasterHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/offer/master/info/:oid",
    schema: schemas.getOfferMasterInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getOfferMasterInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/offer/master/:page_size/:current_page",
    schema: schemas.getOfferMasterPaginateSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getOfferMasterPaginateHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/offer/master/excel",
    schema: schemas.postOfferMasterExcelSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postOfferMasterExcelHandler(fastify)
  });
};
