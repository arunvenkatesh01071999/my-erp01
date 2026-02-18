const getPoSettinigsServices = require("../services/getPoSettinigsServices");

function poSettingsFlagHandler(fastify) {
  const poSettingsFlag = getPoSettinigsServices.poSettingsFlagService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await poSettingsFlag({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = poSettingsFlagHandler;
