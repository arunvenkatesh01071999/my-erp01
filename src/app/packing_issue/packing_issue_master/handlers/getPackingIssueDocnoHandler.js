const allPackingIssueServices = require("../services/allPackingIssueServices");

function getPackingIssueDocnoHandler(fastify) {
  const getPackingIssueDocno = allPackingIssueServices.getPackingIssueDocnoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPackingIssueDocno({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPackingIssueDocnoHandler;
