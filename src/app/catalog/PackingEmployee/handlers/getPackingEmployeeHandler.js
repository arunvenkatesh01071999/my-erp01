const PackingEmployeeServices = require("../services/PackingEmployeeServices");

function getPackingEmployeeHandler(fastify) {
  const getPackingEmployee = PackingEmployeeServices.getPackingEmployeeService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getPackingEmployee({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getPackingEmployeeHandler;
