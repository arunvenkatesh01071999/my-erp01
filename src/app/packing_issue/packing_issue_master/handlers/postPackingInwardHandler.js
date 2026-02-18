const allPackingIssueServices = require("../services/allPackingIssueServices");

function postPackingInwardHandler(fastify) {
  const postPackingInward = allPackingIssueServices.postPackingInwardService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postPackingInward({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPackingInwardHandler;
