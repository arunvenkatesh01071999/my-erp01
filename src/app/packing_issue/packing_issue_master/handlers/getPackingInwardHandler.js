const allPackingIssueServices = require("../services/allPackingIssueServices");

function getPackingInwardHandler(fastify) {
  const getPackingInward = allPackingIssueServices.getPackingInwardService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPackingInward({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPackingInwardHandler;
