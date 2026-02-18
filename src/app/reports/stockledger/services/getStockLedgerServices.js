const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const stockRepo = require("../repository/stock");


function getStockLedgerService(fastify) {
    const { getStockLedger } = stockRepo(fastify);

    return async ({ body, params, query, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await getStockLedger.call(knex, {
            body,
            params,
            logTrace
        });

        // Add the "balance" field to each item in the response
        response.forEach(item => {
            item.balance = item.pur_rate * (item.openqty + item.closing);
        });
        return response;
    };
}




module.exports = {
    getStockLedgerService
};
