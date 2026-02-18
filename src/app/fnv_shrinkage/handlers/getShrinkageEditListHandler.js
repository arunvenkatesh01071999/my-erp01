const fnvShrinkageService = require("../services/fnvShrinkageService");

function getShrinkageEditListHandler(fastify) {
  const getShrinkageEditList = fnvShrinkageService.getShrinkageEditListService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, query } = request;
    const response = await getShrinkageEditList({ params, body, logTrace, userDetails, query });
    return reply.code(200).send(response);
  };
}

module.exports = getShrinkageEditListHandler;
