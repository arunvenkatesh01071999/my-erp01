const PackingEmployeeServices = require("../services/PackingEmployeeServices");

function postPackingEmployeeHandler(fastify) {
  const postPackingEmployee = PackingEmployeeServices.postPackingEmployeeService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPackingEmployee({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPackingEmployeeHandler;
