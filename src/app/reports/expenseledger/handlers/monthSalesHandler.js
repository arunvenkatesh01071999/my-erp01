const getExpenceLedgerServices = require("../services/salesServices");

function monthExpenceLedgerHandler(fastify) {
  const getSalesByMonth = getExpenceLedgerServices.getexpenceLedgerByMonthService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getSalesByMonth({
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
