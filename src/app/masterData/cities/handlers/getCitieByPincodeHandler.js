const cityInfoService = require("../services/cityInfoService");

function getCitieByPincodeHandler(fastify) {
  const getCitieByPincode = cityInfoService.getCitieByPincodeService(fastify);
  return async (request, reply) => {
    const { body, logTrace, params} = request;
    const response = await getCitieByPincode({ body, logTrace, params});
    return reply.code(200).send(response);
  };
}

module.exports = getCitieByPincodeHandler;
