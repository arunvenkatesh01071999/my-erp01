const outletExpenceLedgerServices = require("../services/outletExpensesLedgerService");

function monthExpenceLedgerHandler(fastify) {
  const getOutletExpenceLedger = outletExpenceLedgerServices.getOutletExpenceLedgerByMonthService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getOutletExpenceLedger({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = monthExpenceLedgerHandler;
