const groupServices = require("../services/groupServices");

function getGroupPaginateHandler(fastify) {
  const getGroupPaginate = groupServices.getGroupPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getGroupPaginate({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getGroupPaginateHandler;
