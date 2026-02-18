const countryInfoService = require("../services/countryInfoService");

function getscountriesInfoHandler(fastify) {
  const countryInfo = countryInfoService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await countryInfo({ logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getscountriesInfoHandler;
