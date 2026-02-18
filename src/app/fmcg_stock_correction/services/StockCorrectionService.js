const StockCorrection = require("../repository/StockCorrection");


function getProductBalanceService(fastify) {
    const { getProductBalance } = StockCorrection(fastify);
    return async ({ params, body, logTrace, userDetails, query }) => {
        const knex = fastify.knexMedical;

        const result = await getProductBalance.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            queryparam: query,

        });
        return result;
    };
}

function postStockCorrectionService(fastify) {
    const { postStockCorrection } = StockCorrection(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const result = await postStockCorrection.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
        });

        return result;
    };
}

module.exports = {
    getProductBalanceService,
    postStockCorrectionService,
};
