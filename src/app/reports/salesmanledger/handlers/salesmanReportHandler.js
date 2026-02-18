const getSalesmanLedgerServices = require("../services/getSalesmanLedgerServices");

function salesmanReportHandler(fastify) {
  const getSalesmanReport = getSalesmanLedgerServices.getSalesmanReportService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getSalesmanReport({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = salesmanReportHandler;
