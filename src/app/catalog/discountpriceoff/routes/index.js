const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/price/offer",
    schema: schemas.postPriceOffSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postPriceOffHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/price/offer/:pid",
    schema: schemas.putPriceOffSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putPriceOffHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/price/offer/:id",
    schema: schemas.deleteOfferMasterSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deleteOfferMasterHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/price/offer/info/:id",
    schema: schemas.getOfferMasterInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getOfferMasterInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/price/offer/:page_size/:current_page",
    schema: schemas.getOfferMasterPaginateSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getOfferMasterPaginateHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/price/offer/excel",
    schema: schemas.postPriceOffExcelSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postPriceOffExcelHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/price/offer/excel",
    preHandler: fastify.authenticate,
    handler: handlers.putPriceOffExcelHandler(fastify)
  });


};
