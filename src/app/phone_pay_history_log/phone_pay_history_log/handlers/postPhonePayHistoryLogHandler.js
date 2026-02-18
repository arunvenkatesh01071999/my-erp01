const getPhonePayHistoryLogServices = require("../services/getPhonePayHistoryLogServices.js");

function postPhonePayHistoryLogHandler(fastify) {
  const postPhonePayHistoryLog = getPhonePayHistoryLogServices.postPhonePayHistoryLogService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPhonePayHistoryLog({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPhonePayHistoryLogHandler;
