const outletMemberServices = require("../services/outletMemberServices.js");

function outletMemberReportHandler(fastify) {
  const getOutletMemberReport = outletMemberServices.getOutletMemberReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getOutletMemberReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = outletMemberReportHandler;
