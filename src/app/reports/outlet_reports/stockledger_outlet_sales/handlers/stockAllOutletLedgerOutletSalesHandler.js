const getStockLedgerOutletSalesServices = require("../services/getStockLedgerOutletSalesServices");

function stockAllOutletLedgerOutletSalesHandler(fastify) {
    const stockAllOutletLedgerOutletSales =
        getStockLedgerOutletSalesServices.stockAllOutletLedgeOutletSalesService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await stockAllOutletLedgerOutletSales({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = stockAllOutletLedgerOutletSalesHandler;
