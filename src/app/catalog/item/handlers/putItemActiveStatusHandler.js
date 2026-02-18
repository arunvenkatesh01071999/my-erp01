const itemServices = require("../services/itemServices");

function putItemActiveStatusHandler(fastify) {
  const putItemActiveStatus = itemServices.putItemActiveStatusService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putItemActiveStatus({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putItemActiveStatusHandler;
