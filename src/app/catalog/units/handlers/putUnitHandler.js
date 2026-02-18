const unitServices = require("../services/unitServices");

function putUnitHandler(fastify) {
  const putUnit = unitServices.putUnitService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putUnit({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putUnitHandler;
