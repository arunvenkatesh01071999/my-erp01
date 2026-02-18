const allPackingIssueServices = require("../services/allPackingIssueServices");

function getPackingInwardDocnoHandler(fastify) {
  const getPackingInwardDocno = allPackingIssueServices.getPackingInwardDocnoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await getPackingInwardDocno({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getPackingInwardDocnoHandler;
