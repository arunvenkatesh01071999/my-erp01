const wareHouseServices = require("../services/wareHouseServices");

function getCompanyByIdHandler(fastify) {
  const getCompanyById = wareHouseServices.getCompanyDetailsByIdService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query, userDetails } = request;
    const response = await getCompanyById({ body, params, logTrace, query, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getCompanyByIdHandler;
