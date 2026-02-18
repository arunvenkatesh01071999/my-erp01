const PackingEmployeeServices = require("../services/PackingEmployeeServices");

function deletePackingEmployeeHandler(fastify) {
  const deletePackingEmployee = PackingEmployeeServices.deletePackingEmployeeService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deletePackingEmployee({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deletePackingEmployeeHandler;
