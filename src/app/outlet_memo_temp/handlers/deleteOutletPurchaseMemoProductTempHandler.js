const memoTempService = require("../services/memoTempService.js");

function deleteOutletPurchaseMemoProductTempHandler(fastify) {
  const deleteOutletPurchaseMemoProductTemp = memoTempService.deleteOutletPurchaseMemoProductTempService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await deleteOutletPurchaseMemoProductTemp({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = deleteOutletPurchaseMemoProductTempHandler;
