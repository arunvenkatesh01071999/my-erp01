const getOutletSalesEditLogServices = require("../services/getOutletSalesEditLogServices.js");

function postOutletSalesEditLogHandler(fastify) {
  const postOutletSalesEditLog = getOutletSalesEditLogServices.postOutletSalesEditLogService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutletSalesEditLog({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletSalesEditLogHandler;
