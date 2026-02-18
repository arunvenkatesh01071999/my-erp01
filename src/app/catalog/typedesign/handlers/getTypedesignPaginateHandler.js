const typedesignServices = require("../services/typedesignServices");

function getTypedesignPaginateHandler(fastify) {
  const getTypedesignPaginate = typedesignServices.getTypedesignPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getTypedesignPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getTypedesignPaginateHandler;
