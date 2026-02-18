const poSettingsPaginateServices = require("../services/getPoSettinigsServices");

function poSettingsPaginateHandler(fastify) {
  const poSettingsPaginate =
    poSettingsPaginateServices.poSettingsPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await poSettingsPaginate({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = poSettingsPaginateHandler;
