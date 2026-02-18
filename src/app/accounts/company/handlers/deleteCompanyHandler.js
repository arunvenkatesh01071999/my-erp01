const companyServices = require("../services/companyServices");

function deleteCompanyHandler(fastify) {
  const deleteCompany = companyServices.deleteCompanyService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteCompany({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteCompanyHandler;
