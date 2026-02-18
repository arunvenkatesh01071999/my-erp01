const memoTempService = require("../services/memoTempService.js");

function getAllOutletPurchaseMemoTempHandler(fastify) {
  const getAllOutletPurchaseMemoTemp = memoTempService.getAllOutletPurchaseMemoTempService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getAllOutletPurchaseMemoTemp({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getAllOutletPurchaseMemoTempHandler;
