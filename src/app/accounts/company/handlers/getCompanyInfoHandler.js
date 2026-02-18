const companyServices = require("../services/companyServices");

function getCompanyInfoHandler(fastify) {
  const getCompanyInfo = companyServices.getCompanyInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getCompanyInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getCompanyInfoHandler;
