const indentOrderServices = require("../services/indentOrderServices.js");

function getIndentOrderProductIndentNoHandler(fastify) {
  const getIndentOrderProductIndentNo = indentOrderServices.getIndentOrderProductIndentNoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getIndentOrderProductIndentNo({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getIndentOrderProductIndentNoHandler;
