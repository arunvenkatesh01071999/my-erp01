const memoService = require("../services/memoService.js");

function getOutletMemoSupplierListHandler(fastify) {
  const getOutletMemoSupplierList = memoService.getOutletMemoSupplierListService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getOutletMemoSupplierList({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletMemoSupplierListHandler;
