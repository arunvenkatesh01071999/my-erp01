const outletWastageRepo = require("../repository/outletWastageRepo.js");

const getFinancialYear = (date = new Date()) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month >= 4) {
        return `${year}${year + 1}`;
    } else {
        return `${year - 1}${year}`;
    }
};
function postOutletWastageService(fastify) {
    const { postOutletWastage } = outletWastageRepo(fastify);
    // const { postOutletWastage, updateStockLedger, updateDneStockLedger } = outletWastageRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise1 = postOutletWastage.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        // const promise2 = updateStockLedger.call(knex, {
        //     params,
        //     body,
        //     logTrace,
        //     userDetails,
        //     financialYear
        // });
        // const promise3 = updateDneStockLedger.call(knex, {
        //     params,
        //     body,
        //     logTrace,
        //     userDetails,
        //     financialYear
        // });
        // const [response, response1, response2] = await Promise.all([promise1, promise2, promise3]);
        const [response] = await Promise.all([promise1]);

        return response;
    };
}
function putOutletWastageService(fastify) {
    const { putWastage, reduceStockLedger, updateStockLedger, reduceDneStockLedger, updateDneStockLedger } = outletWastageRepo(fastify);
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
function getOutletWastageService(fastify) {
    const { getOutletWastage } = outletWastageRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getOutletWastage.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}
function getOutletWastageInfoService(fastify) {
    const { getOutletWastageInfo } = outletWastageRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getOutletWastageInfo.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}
function deleteOutletWastageService(fastify) {
    // const { deleteOutletWastage, reduceStockLedger, reduceDneStockLedger } = outletWastageRepo(fastify);
    const { deleteOutletWastage } = outletWastageRepo(fastify);

    return async ({ body, params, logTrace, query, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        // const response1 = await reduceStockLedger.call(knex, {
        //     params,
        //     body,
        //     logTrace,
        //     userDetails,
        //     financialYear
        // });
        // const response2 = await reduceDneStockLedger.call(knex, {
        //     params,
        //     body,
        //     logTrace,
        //     userDetails,
        //     financialYear
        // });
        const response = await deleteOutletWastage.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;


    };
}
function getOutletWastageDocnoService(fastify) {
    const { getWastageDocno } = outletWastageRepo(fastify);

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
    postOutletWastageService,
    putOutletWastageService,
    getOutletWastageService,
    getOutletWastageInfoService,
    deleteOutletWastageService,
    getOutletWastageDocnoService,
};
