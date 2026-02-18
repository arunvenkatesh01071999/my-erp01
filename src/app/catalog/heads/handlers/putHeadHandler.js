const headServices = require("../services/headServices");

function putHeadHandler(fastify) {
  const putHead = headServices.putHeadService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await putHead({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putHeadHandler;
