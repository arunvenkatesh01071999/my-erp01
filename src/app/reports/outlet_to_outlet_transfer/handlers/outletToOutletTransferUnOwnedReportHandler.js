const getOutletToOutletTransferReportService = require("../services/getOutletToOutletTransferReportService.js");

function outletToOutletTransferUnOwnedReportHandler(fastify) {
  const getOutletToOutletTransferUnOwnedReport = getOutletToOutletTransferReportService.getOutletToOutletTransferUnOwnedReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getOutletToOutletTransferUnOwnedReport({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = outletToOutletTransferUnOwnedReportHandler;
