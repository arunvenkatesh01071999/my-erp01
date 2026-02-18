const bannerRepo = require("../repository/banner");

function getBannersService(fastify) {
  const { getBanners } = bannerRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getBanners.call(knex, {
      logTrace
    });
    return response;
  };
}
function getBannersPaginateService(fastify) {
  const { getBannersPaginate } = bannerRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getBannersPaginate.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}
function postBannerService(fastify) {
  const { postBanner } = bannerRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const promise1 = postBanner.call(knex, {
      params,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function putBannerService(fastify) {
  const { putBanner } = bannerRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { banner_id } = params;
    const promise1 = putBanner.call(knex, {
      banner_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function deleteBannerService(fastify) {
  const { deleteBanner } = bannerRepo(fastify);
  return async ({ params, body, logTrace }) => {
    const knex = fastify.knexMedical;
    const { banner_id } = params;
    const promise1 = deleteBanner.call(knex, {
      banner_id,
      body,
      logTrace
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getBannersInfoService(fastify) {
  const { getBannersInfo } = bannerRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getBannersInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getBannersService,
  postBannerService,
  putBannerService,
  deleteBannerService,
  getBannersInfoService,
  getBannersPaginateService
};
