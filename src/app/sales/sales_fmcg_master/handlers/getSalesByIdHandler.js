const salesMasterServices = require("../services/salesMasterServices");

function getSalesByIdHandler(fastify) {
  const getSalesById = salesMasterServices.getSalesByIdService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getSalesById({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getSalesByIdHandler;
