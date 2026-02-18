const allPackingIssueServices = require("../services/allPackingIssueServices");

function getPackingIssuePdfHandler(fastify) {
  const getPackingIssuePdf = allPackingIssueServices.getPackingIssuePdfService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPackingIssuePdf({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPackingIssuePdfHandler;
