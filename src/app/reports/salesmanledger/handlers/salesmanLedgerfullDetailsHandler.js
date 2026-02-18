const getSalesmanLedgerServices = require("../services/getSalesmanLedgerServices");

function salesmanLedgerfullDetailsHandler(fastify) {
  const getSalesmanLedgerFulldetails = getSalesmanLedgerServices.getSalesmanLedgerFulldetailsService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getSalesmanLedgerFulldetails({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = salesmanLedgerfullDetailsHandler;
