const getExpenceLedgerServices = require("../services/salesServices");

function getExpenceLedgerByDatePaginateHandler(fastify) {
    const getSalesPaginateByDate =
        getExpenceLedgerServices.getexpenceLedgerPaginateByDateService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getSalesPaginateByDate({
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
