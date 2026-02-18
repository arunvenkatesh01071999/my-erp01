const allPackingIssueServices = require("../services/allPackingIssueServices");

function postPackingIssueHandler(fastify) {
  const postPackingIssue = allPackingIssueServices.postPackingIssueService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPackingIssue({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPackingIssueHandler;
