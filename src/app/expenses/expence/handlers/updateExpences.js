const expenceServices = require("../services/expenceServices");

function updateExpencesHandler(fastify) {
  const updateExpences = expenceServices.updateExpencesService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await updateExpences({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = updateExpencesHandler;
