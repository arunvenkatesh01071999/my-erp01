const WastageMasterServices = require("../services/wastageMasterServices");

function postWastageMasterHandler(fastify) {
  const postWastageMaster = WastageMasterServices.postWastageMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postWastageMaster({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postWastageMasterHandler;
