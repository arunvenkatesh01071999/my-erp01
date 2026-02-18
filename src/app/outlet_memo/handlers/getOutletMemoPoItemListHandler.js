const memoService = require("../services/memoService.js");

function getOutletMemoPoItemListHandler(fastify) {
  const getOutletMemoPoItemList = memoService.getOutletMemoPoItemListService(fastify);

  return async (request, reply) => {
    const {  body, params, logTrace, query,userDetails } = request;
    const response = await getOutletMemoPoItemList({
       body, params, logTrace, query,userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletMemoPoItemListHandler;
