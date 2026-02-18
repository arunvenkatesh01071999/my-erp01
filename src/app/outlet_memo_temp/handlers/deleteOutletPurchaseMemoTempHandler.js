const memoTempService = require("../services/memoTempService.js");

function deleteOutletPurchaseMemoTempHandler(fastify) {
  const deleteOutletPurchaseMemoTemp = memoTempService.deleteOutletPurchaseMemoTempService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await deleteOutletPurchaseMemoTemp({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = deleteOutletPurchaseMemoTempHandler;
