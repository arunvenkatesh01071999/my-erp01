const companyServices = require("../services/companyServices");

function getCompanyDetailsHandler(fastify) {
  const getCompanyDetails = companyServices.getCompanyDetailsService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getCompanyDetails({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getCompanyDetailsHandler;
