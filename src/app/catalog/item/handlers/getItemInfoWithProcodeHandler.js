const itemServices = require("../services/itemServices");

function getItemInfoWithProcodeHandler(fastify) {
  const getItemInfoWithProcode = itemServices.getItemInfoWithProcodeService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getItemInfoWithProcode({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getItemInfoWithProcodeHandler;
