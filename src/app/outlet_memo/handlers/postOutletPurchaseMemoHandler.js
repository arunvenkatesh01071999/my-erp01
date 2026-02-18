const memoService= require("../services/memoService.js");

function postOutletPurchaseMemoHandler(fastify) {
  const postOutletPurchaseMemo = memoService.postOutletPurchaseMemoService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await postOutletPurchaseMemo({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletPurchaseMemoHandler;
