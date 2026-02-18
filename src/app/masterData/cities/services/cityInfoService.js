const cityInfoRepo = require("../repository/cityInfoRepo");

function cityInfoService(fastify) {
  const { getCityInfo } = cityInfoRepo(fastify);

  return async ({ body, logTrace }) => {
    const knex = fastify.knexMedical;

    const response = await getCityInfo.call(knex, {
      state_id: body.state_id,
      logTrace
    });

    return response;
  };
}

function getCitieByPincodeService(fastify) {
  const { getCityByPincodeRepo } = cityInfoRepo(fastify);

  return async ({ body, logTrace, params}) => {
    const knex = fastify.knexMedical;
    const {pincode} = params;
    const response = await getCityByPincodeRepo.call(knex, {
      pincode,
      logTrace
    });

    return response;
  };
}

module.exports = {
  cityInfoService,
  getCitieByPincodeService
};
