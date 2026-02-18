const planningIssueRepo = require("../repository/fmcgPlanningIssueRepo.js");

const getFinancialYear = (date = new Date()) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month >= 4) {
        return `${year}${year + 1}`;
    } else {
        return `${year - 1}${year}`;
    }
};
function postFmcgPlanningIssueService(fastify) {
    const { postFmcgPlanningIssue, updateStockLedger } = planningIssueRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise1 = postFmcgPlanningIssue.call(knex, {
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
function putFmcgPlanningIssueService(fastify) {
    const { putFmcgPlanningIssue, reduceStockLedger, updateStockLedger } = planningIssueRepo(fastify);
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
        const promise1 = putFmcgPlanningIssue.call(knex, {
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
function getFmcgPlanningIssueService(fastify) {
    const { getFmcgPlanningIssue } = planningIssueRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getFmcgPlanningIssue.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}
function getFmcgPlanningIssueInfoService(fastify) {
    const { getFmcgPlanningIssueInfo } = planningIssueRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getFmcgPlanningIssueInfo.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;
    };
}
function deleteFmcgPlanningIssueInfoService(fastify) {
    const { deleteFmcgPlanningIssueInfo, reduceStockLedger } = planningIssueRepo(fastify);

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
        const response = await deleteFmcgPlanningIssueInfo.call(knex, {
            body, params, logTrace,
            queryString: query
        });
        return response;


    };
}
function getFmcgPlanningIssueDocnoService(fastify) {
    const { getFmcgPlanningIssueDocno } = planningIssueRepo(fastify);

    return async ({ body, params, logTrace, query, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const response = await getFmcgPlanningIssueDocno.call(knex, {
            body,
            params,
            logTrace,
            financialYear
        });
        return response;


    };
}
module.exports = {
    postFmcgPlanningIssueService,
    putFmcgPlanningIssueService,
    getFmcgPlanningIssueService,
    getFmcgPlanningIssueInfoService,
    deleteFmcgPlanningIssueInfoService,
    getFmcgPlanningIssueDocnoService
};
