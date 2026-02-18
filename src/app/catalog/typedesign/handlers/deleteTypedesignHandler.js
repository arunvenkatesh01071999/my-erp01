const typedesignServices = require("../services/typedesignServices");

function deleteTypedesignHandler(fastify) {
  const deleteTypedesign = typedesignServices.deleteTypedesignService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteTypedesign({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteTypedesignHandler;
