const companyServices = require("../services/companyServices");

function getCompanyHandler(fastify) {
  const getCompany = companyServices.getCompanyService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getCompany({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getCompanyHandler;
