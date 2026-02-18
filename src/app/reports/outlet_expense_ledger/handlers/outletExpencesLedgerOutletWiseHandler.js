const outletExpencesLedger = require("../services/outletExpensesLedgerService");

function outletExpencesLedgerOutletWiseHandler(fastify) {
  const outletExpencesLedgerOutletWise = outletExpencesLedger.outletExpencesLedgerOutletWiseService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await outletExpencesLedgerOutletWise({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = outletExpencesLedgerOutletWiseHandler;
