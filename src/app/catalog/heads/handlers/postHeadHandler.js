const headServices = require("../services/headServices");

function postHeadHandler(fastify) {
  const postHead = headServices.postHeadService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postHead({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postHeadHandler;
