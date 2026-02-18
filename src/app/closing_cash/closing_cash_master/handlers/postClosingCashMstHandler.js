const getClosingCashMstServices = require("../services/getClosingCashMstServices");

function postClosingCashMstHandler(fastify) {
  const postClosingCashMst = getClosingCashMstServices.postClosingCashMstService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postClosingCashMst({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postClosingCashMstHandler;
