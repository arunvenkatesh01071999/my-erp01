const outletToOutletTransferReportRepo = require("../repository/outletToOutletTransferReportRepo.js");

function getOutletToOutletTransferReportService(fastify) {
  const { outletToOutletTransferReport } = outletToOutletTransferReportRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await outletToOutletTransferReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

function getOutletToOutletTransferUnOwnedReportService(fastify) {
  const { outletToOutletTransferUnOwnedReport } = outletToOutletTransferReportRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await outletToOutletTransferUnOwnedReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getOutletToOutletTransferReportService,
  getOutletToOutletTransferUnOwnedReportService
};
