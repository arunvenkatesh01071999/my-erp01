const getStockLedgerServices = require("../services/getStockLedgerServices");

function stockLedgerHandler(fastify) {
    const getStockLedger =
        getStockLedgerServices.getStockLedgerService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getStockLedger({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = stockLedgerHandler;
