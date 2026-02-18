const outletExpenceLedgerServices = require("../services/outletExpensesLedgerService");

function getExpenceLedgerByDatePaginateHandler(fastify) {
    const outletExpenceLedgerByDate =
        outletExpenceLedgerServices.outletExpenceLedgerByDateService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await outletExpenceLedgerByDate({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = getExpenceLedgerByDatePaginateHandler;
