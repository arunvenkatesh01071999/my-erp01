const getPoSettinigsServices = require("../services/getPoSettinigsServices");

function mbqPoSettingsHandler(fastify) {
  const mbqPoSettings = getPoSettinigsServices.mbqPoSettingsService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await mbqPoSettings({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = mbqPoSettingsHandler;
