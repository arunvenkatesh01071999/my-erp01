const unitServices = require("../services/unitServices");

function postUnitHandler(fastify) {
  const postUnit = unitServices.postUnitService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postUnit({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postUnitHandler;
