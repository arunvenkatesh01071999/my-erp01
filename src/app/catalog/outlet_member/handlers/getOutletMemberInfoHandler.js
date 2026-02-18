const OutletMemberServices = require("../services/OutletMemberService");

function getOutletMemberInfoHandler(fastify) {
  const getWareHouseInfo = OutletMemberServices.getOutletMemberInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getWareHouseInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletMemberInfoHandler;
