const PackingEmployeeServices = require("../services/PackingEmployeeServices");

function putPackingEmployeeHandler(fastify) {
  const putPackingEmployee = PackingEmployeeServices.putPackingEmployeeService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putPackingEmployee({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putPackingEmployeeHandler;
