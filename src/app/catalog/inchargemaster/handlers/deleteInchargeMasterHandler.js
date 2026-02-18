const inchargemasterService = require("../services/inchargemasterService");

function deleteInchargeMasterHandle(fastify) {
  const deleteInchargeMaster = inchargemasterService.deleteInchargeMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteInchargeMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteInchargeMasterHandle;
