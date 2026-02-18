const PackingEmployeeServices = require("../services/PackingEmployeeServices");

function getPackingEmployeeInfoHandler(fastify) {
  const getPackingEmployeeInfo = PackingEmployeeServices.getPackingEmployeeInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getPackingEmployeeInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getPackingEmployeeInfoHandler;
