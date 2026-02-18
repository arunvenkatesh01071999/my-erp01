const stateInfoRepo = require("../repository/stateInfoRepo");

function stateInfoService(fastify) {
  const { getStateInfo } = stateInfoRepo(fastify);

  return async ({ body, logTrace }) => {
    const knex = fastify.knexMedical;

    const response = await getStateInfo.call(knex, {
      country_id: body.country_id,
      logTrace
    });

    return response;
  };
}

module.exports = stateInfoService;
