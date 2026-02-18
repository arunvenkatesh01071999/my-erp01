const memoSerevice = require("../services/memoService.js");

function getOutletMemoPoNoListHandler(fastify) {
  const getOutletMemoPoNoList = memoSerevice.getOutletMemoPoNoListService(fastify);

  return async (request, reply) => {
    const { params, logTrace ,body,userDetails} = request;
    const response = await getOutletMemoPoNoList({
      params,
      logTrace,
      body,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletMemoPoNoListHandler;
