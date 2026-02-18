const getOutletToOutletTransferReportService = require("../services/getOutletToOutletTransferReportService.js");

function outletToOutletTransferReportHandler(fastify) {
  const getOutletToOutletTransferReport = getOutletToOutletTransferReportService.getOutletToOutletTransferReportService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getOutletToOutletTransferReport({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = outletToOutletTransferReportHandler;
