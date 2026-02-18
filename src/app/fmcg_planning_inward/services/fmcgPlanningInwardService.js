const planningInwardRepo = require("../repository/fmcgPlanningInwardRepo.js");

const getFinancialYear = (date = new Date()) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month >= 4) {
        return `${year}${year + 1}`;
    } else {
        return `${year - 1}${year}`;
    }
};
function postFmcgPlanningInwardService(fastify) {
    const { postFmcgPlanningInward, updateStockLedger } = planningInwardRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise1 = postFmcgPlanningInward.call(knex, {
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
function putFmcgPlanningInwardService(fastify) {
    const { putFmcgPlanningInward, reduceStockLedger, updateStockLedger } = planningInwardRepo(fastify);
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
        const promise1 = putFmcgPlanningInward.call(knex, {
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
function getFmcgPlanningInwardService(fastify) {
    const { getFmcgPlanningInward } = planningInwardRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getFmcgPlanningInward.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}
function getFmcgPlanningInwardInfoService(fastify) {
    const { getFmcgPlanningInwardInfo } = planningInwardRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getFmcgPlanningInwardInfo.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}
function deleteFmcgPlanningInwardInfoService(fastify) {
    const { deleteFmcgPlanningInwardInfo, reduceStockLedger } = planningInwardRepo(fastify);

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
        const response = await deleteFmcgPlanningInwardInfo.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;


    };
}
function getFmcgPlanningInwardDocnoService(fastify) {
    const { getFmcgPlanningInwardDocno } = planningInwardRepo(fastify);

    return async ({ body, params, logTrace, query, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const response = await getFmcgPlanningInwardDocno.call(knex, {
            body,
            params,
            logTrace,
            financialYear
        });
        return response;


    };
}
module.exports = {
    postFmcgPlanningInwardService,
    putFmcgPlanningInwardService,
    getFmcgPlanningInwardService,
    getFmcgPlanningInwardInfoService,
    deleteFmcgPlanningInwardInfoService,
    getFmcgPlanningInwardDocnoService
};
