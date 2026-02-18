const inchargemasterService = require("../services/inchargemasterService");

function putTypedesignHandler(fastify) {
  const putTypedesign = inchargemasterService.putInchargeMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putTypedesign({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putTypedesignHandler;
