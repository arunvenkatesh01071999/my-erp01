const headServices = require("../services/headServices");

function deleteHeadHandler(fastify) {
  const deleteHead = headServices.deleteHeadService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteHead({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = deleteHeadHandler;
