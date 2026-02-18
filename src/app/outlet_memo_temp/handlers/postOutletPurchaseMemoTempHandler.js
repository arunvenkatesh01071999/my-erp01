const memoTempService = require("../services/memoTempService.js");

function postOutletPurchaseMemoTempHandler(fastify) {
  const postOutletPurchaseMemoTemp = memoTempService.postOutletPurchaseMemoTempService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await postOutletPurchaseMemoTemp({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletPurchaseMemoTempHandler;
