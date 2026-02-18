const outletMemberRepo = require("../repository/outletMember.js");

function getOutletMemberReportService(fastify) {
  const { getOutletMemberReport } = outletMemberRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletMemberReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

function getOutletMemberWithOutletSalesMstReportService(fastify) {
  const { getOutletMemberWithOutletSalesMstReport } = outletMemberRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletMemberWithOutletSalesMstReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

module.exports = {
  getOutletMemberReportService,
  getOutletMemberWithOutletSalesMstReportService
};
