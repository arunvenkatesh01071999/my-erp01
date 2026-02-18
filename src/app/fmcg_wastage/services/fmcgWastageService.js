const fmcgWastageRepo = require("../repository/fmcgWastageRepo.js");

const getFinancialYear = (date = new Date()) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month >= 4) {
        return `${year}${year + 1}`;
    } else {
        return `${year - 1}${year}`;
    }
};
function postWastageService(fastify) {
    const { postWastage, updateStockLedger, updateDneStockLedger } = fmcgWastageRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise1 = postWastage.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        const promise2 = updateStockLedger.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        const promise3 = updateDneStockLedger.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        const [response, response1, response2] = await Promise.all([promise1, promise2, promise3]);
        return response;
    };
}
function putWastageService(fastify) {
    const { putWastage, reduceStockLedger, updateStockLedger, reduceDneStockLedger, updateDneStockLedger } = fmcgWastageRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise4 = await reduceDneStockLedger.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        const promise3 = await reduceStockLedger.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        const promise1 = putWastage.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        const promise2 = updateStockLedger.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        const promise5 = updateDneStockLedger.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });

        const [response, response1, response2] = await Promise.all([promise1, promise2, promise4]);
        return response;
    };
}
function getWastageService(fastify) {
    const { getWastage } = fmcgWastageRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getWastage.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}
function getWastageInfoService(fastify) {
    const { getWastageInfo } = fmcgWastageRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getWastageInfo.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}
function deleteWastageService(fastify) {
    const { deleteWastage, reduceStockLedger, reduceDneStockLedger } = fmcgWastageRepo(fastify);

    return async ({ body, params, logTrace, query, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const response1 = await reduceStockLedger.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        const response2 = await reduceDneStockLedger.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        const response = await deleteWastage.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;


    };
}
function getWastageDocnoService(fastify) {
    const { getWastageDocno } = fmcgWastageRepo(fastify);

    return async ({ body, params, logTrace, query, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const response = await getWastageDocno.call(knex, {
            body,
            params,
            logTrace,
            financialYear
        });
        return response;


    };
}

module.exports = {
    postWastageService,
    putWastageService,
    getWastageService,
    getWastageInfoService,
    deleteWastageService,
    getWastageDocnoService,
};
