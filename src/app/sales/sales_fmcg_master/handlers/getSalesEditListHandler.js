const salesMasterServices = require("../services/salesMasterServices");

function getSalesEditListHandler(fastify) {
  const getSalesEditList = salesMasterServices.getSalesEditListService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getSalesEditList({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getSalesEditListHandler;
