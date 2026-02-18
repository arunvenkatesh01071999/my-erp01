const getSalesmanLedgerServices = require("../services/getSalesmanLedgerServices");

function salesmanReportGetallNewHandler(fastify) {
  const getSalesmanReportGetallNew = getSalesmanLedgerServices.getSalesmanReportGetallNewService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getSalesmanReportGetallNew({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = salesmanReportGetallNewHandler;
