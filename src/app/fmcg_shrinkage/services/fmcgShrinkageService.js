const fmcgShrinkageRepo = require("../repository/fmcgShrinkageRepo.js");

const getFinancialYear = (date = new Date()) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month >= 4) {
        return `${year}${year + 1}`;
    } else {
        return `${year - 1}${year}`;
    }
};
function postShrinkageService(fastify) {
    const { postShrinkage, updateStockLedger } = fmcgShrinkageRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise1 = postShrinkage.call(knex, {
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

        const [response, response1] = await Promise.all([promise1, promise2]);
        return response;
    };
}
function putShrinkageService(fastify) {
    const { putShrinkage, reduceStockLedger, updateStockLedger } = fmcgShrinkageRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();

        const promise3 = await reduceStockLedger.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        const promise1 = putShrinkage.call(knex, {
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


        const [response, response1] = await Promise.all([promise1, promise2]);
        return response;
    };
}
function getShrinkageService(fastify) {
    const { getShrinkage } = fmcgShrinkageRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getShrinkage.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}
function getShrinkageInfoService(fastify) {
    const { getShrinkageInfo } = fmcgShrinkageRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getShrinkageInfo.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}
function deleteShrinkageService(fastify) {
    const { deleteShrinkage, reduceStockLedger } = fmcgShrinkageRepo(fastify);

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

        const response = await deleteShrinkage.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;


    };
}
function getShrinkageDocnoService(fastify) {
    const { getShrinkageDocno } = fmcgShrinkageRepo(fastify);

    return async ({ body, params, logTrace, query, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const response = await getShrinkageDocno.call(knex, {
            body,
            params,
            logTrace,
            financialYear
        });
        return response;


    };
}

function getShrinkageEditListService(fastify) {
    const { getShrinkageEditListRepo } = fmcgShrinkageRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getShrinkageEditListRepo.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}

module.exports = {
    postShrinkageService,
    putShrinkageService,
    getShrinkageService,
    getShrinkageInfoService,
    deleteShrinkageService,
    getShrinkageDocnoService,
    getShrinkageEditListService
};
