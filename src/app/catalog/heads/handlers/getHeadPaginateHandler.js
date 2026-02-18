const headServices = require("../services/headServices");

function getHeadPaginateHandler(fastify) {
  const getHeadPaginate = headServices.getHeadPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getHeadPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getHeadPaginateHandler;
