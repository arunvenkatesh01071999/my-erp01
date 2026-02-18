const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

  fastify.route({
    method: "POST",
    url: "/promotions",
    schema: schemas.postPromotionsSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postPromotionsHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/promotions/:pid",
    schema: schemas.putPromotionsSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putPromotionsHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/promotions/:pid",
    schema: schemas.deletePromotionsSchema,
    preHandler: fastify.authenticate,
    handler: handlers.deletePromotionsHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/promotions/info/:pid",
    schema: schemas.getPromotionsInfoSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getPromotionsInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/promotions/:page_size/:current_page",
    schema: schemas.getPromotionsPaginateSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getPromotionsPaginateHandler(fastify)
  });
};
