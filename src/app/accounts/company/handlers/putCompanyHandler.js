const companyServices = require("../services/companyServices");

function putCompanyHandler(fastify) {
  const putCompany = companyServices.putCompanyService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putCompany({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putCompanyHandler;
