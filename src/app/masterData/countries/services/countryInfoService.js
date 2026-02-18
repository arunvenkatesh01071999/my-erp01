const countryInfoRepo = require("../repository/countryInfoRepo");

function countryInfoService(fastify) {
  const { getCountryInfo } = countryInfoRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;

    const response = await getCountryInfo.call(knex, {
      logTrace
    });

    return response;
  };
}

module.exports = countryInfoService;
