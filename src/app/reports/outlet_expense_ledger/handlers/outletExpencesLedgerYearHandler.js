const outletExpencesLedger = require("../services/outletExpensesLedgerService");

function outletExpencesLedgerYearHandler(fastify) {
  const getoutletExpencesLedgerYear = outletExpencesLedger.outletExpencesLedgerYearService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getoutletExpencesLedgerYear({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = outletExpencesLedgerYearHandler;
