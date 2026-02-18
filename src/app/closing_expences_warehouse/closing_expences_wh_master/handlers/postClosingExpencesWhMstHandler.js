const getClosingExpencesWhMstServices = require("../services/getClosingExpencesWhMstServices.js");

function postClosingExpencesWhMstHandler(fastify) {
  const postClosingExpencesWhMst = getClosingExpencesWhMstServices.postClosingExpencesWhMstService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postClosingExpencesWhMst({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postClosingExpencesWhMstHandler;
