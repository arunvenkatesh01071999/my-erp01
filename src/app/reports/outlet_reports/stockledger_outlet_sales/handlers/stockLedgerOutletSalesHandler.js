const getStockLedgerOutletSalesServices = require("../services/getStockLedgerOutletSalesServices");

function stockLedgerOutletSalesHandler(fastify) {
    const getStockOutletSalesLedger =
        getStockLedgerOutletSalesServices.getStockLedgerOutletSalesService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getStockOutletSalesLedger({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = stockLedgerOutletSalesHandler;
