const groupServices = require("../services/groupServices");

function getGroupInfoHandler(fastify) {
  const getGroupInfo = groupServices.getGroupInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getGroupInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getGroupInfoHandler;
