const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/banners",
    schema: schemas.getBannersSchema,
    handler: handlers.getBanners(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/banners",
    schema: schemas.postBannerSchema,
    handler: handlers.postBannerHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/banners/:banner_id",
    schema: schemas.putBannerSchema,
    handler: handlers.putBannerHandler(fastify)
  });
  fastify.route({
    method: "DELETE",
    url: "/banners/:banner_id",
    schema: schemas.deleteBannerSchema,
    handler: handlers.deleteBannerHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/banners/info/:banner_id",
    schema: schemas.bannerInfoSchema,
    handler: handlers.bannerInfoHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/banners/:page_size/:current_page",
    schema: schemas.getBannersPaginateSchema,
    handler: handlers.getBannersPaginateHandler(fastify)
  });
};
