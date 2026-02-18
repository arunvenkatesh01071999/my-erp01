const postSubAccountsService = require("../services/postSubAccountsService");

function getSubAccountsPaginateHandler(fastify) {
  const getSubAccountsPaginate =
    postSubAccountsService.getSubAccountsPaginateService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, query } = request;
    const response = await getSubAccountsPaginate({ params, body, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getSubAccountsPaginateHandler;
