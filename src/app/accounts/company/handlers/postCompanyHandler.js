const companyServices = require("../services/companyServices");

function postCompanyHandler(fastify) {
  const postCompany = companyServices.postCompanyService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postCompany({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postCompanyHandler;
