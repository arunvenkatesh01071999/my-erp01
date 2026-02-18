const stateInfoRepo = require("../repository/stateInfoRepo");

function stateDeliveryService(fastify) {
  const { stateDelivery } = stateInfoRepo(fastify);

  return async ({ body, logTrace }) => {
    const knex = fastify.knexMedical;

    const response = await stateDelivery.call(knex, {
      body,
      logTrace
    });

    return response;
  };
}

module.exports = stateDeliveryService;
