const getClosingExpencesMstServices = require("../services/getClosingExpencesMstServices");

function postClosingBankAmountHandler(fastify) {
  const postClosingExpencesMst = getClosingExpencesMstServices.postClosingExpencesMstService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postClosingExpencesMst({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postClosingBankAmountHandler;
