const memoTempService = require("../services/memoTempService.js");

function getOutletPurchaseMemoProductTempHandler(fastify) {
  const  getOutletPurchaseMemoProductTemp = memoTempService.getOutletPurchaseMemoProductTempService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await  getOutletPurchaseMemoProductTemp({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchaseMemoProductTempHandler;
