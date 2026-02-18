const memoService = require("../services/memoService.js");

function getOutletPurchaseMemoDetailsHandler(fastify) {
  const getOutletPurchaseMemoDetails = memoService.getOutletPurchaseMemoDetailsService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getOutletPurchaseMemoDetails({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchaseMemoDetailsHandler;
