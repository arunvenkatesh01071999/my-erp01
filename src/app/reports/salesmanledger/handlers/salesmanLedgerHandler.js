const getSalesmanLedgerServices = require("../services/getSalesmanLedgerServices");

function salesmanLedgerHandler(fastify) {
  const getSalesmanLedger = getSalesmanLedgerServices.getSalesmanLedgerService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getSalesmanLedger({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = salesmanLedgerHandler;
