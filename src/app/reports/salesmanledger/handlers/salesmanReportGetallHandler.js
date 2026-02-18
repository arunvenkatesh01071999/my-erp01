const getSalesmanLedgerServices = require("../services/getSalesmanLedgerServices");

function salesmanReportGetallHandler(fastify) {
  const getSalesmanReportGetall = getSalesmanLedgerServices.getSalesmanReportGetallService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getSalesmanReportGetall({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = salesmanReportGetallHandler;
