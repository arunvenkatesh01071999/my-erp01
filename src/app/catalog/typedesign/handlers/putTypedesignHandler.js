const typedesignServices = require("../services/typedesignServices");

function putTypedesignHandler(fastify) {
  const putTypedesign = typedesignServices.putTypedesignService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await putTypedesign({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putTypedesignHandler;
