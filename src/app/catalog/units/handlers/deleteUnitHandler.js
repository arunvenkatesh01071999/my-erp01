const unitServices = require("../services/unitServices");

function deleteUnitHandler(fastify) {
  const deleteUnit = unitServices.deleteUnitService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteUnit({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteUnitHandler;
