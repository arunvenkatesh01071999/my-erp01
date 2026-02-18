const fmcgReceipeRepo = require("../repository/fmcgReceipeRepo.js");

const getFinancialYear = (date = new Date()) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month >= 4) {
        return `${year}${year + 1}`;
    } else {
        return `${year - 1}${year}`;
    }
};
function postReceipeService(fastify) {
    const { postReceipe } = fmcgReceipeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const promise1 = postReceipe.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });

        const [response] = await Promise.all([promise1]);
        return response;
    };
}
function putReceipeService(fastify) {
    const { putReceipe } = fmcgReceipeRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();

        const promise1 = putReceipe.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });


        const [response] = await Promise.all([promise1]);
        return response;
    };
}
function getReceipeService(fastify) {
    const { getReceipe } = fmcgReceipeRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getReceipe.call(knex, {
            body,
            params,
            logTrace,
            queryString: query
        });
        return response;
    };
}
function getReceipeInfoService(fastify) {
    const { getReceipeInfo } = fmcgReceipeRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getReceipeInfo.call(knex, {
            body,
            params,
            logTrace,
            queryString: query
        });
        return response;
    };
}
function deleteReceipeService(fastify) {
    const { deleteReceipe } = fmcgReceipeRepo(fastify);

    return async ({ body, params, logTrace, query, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const response = await deleteReceipe.call(knex, {
            body,
            params,
            logTrace,
            queryString: query
        });
        return response;


    };
}
function getReceipeDocnoService(fastify) {
    const { getReceipeDocno } = fmcgReceipeRepo(fastify);

    return async ({ body, params, logTrace, query, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();
        const response = await getReceipeDocno.call(knex, {
            body,
            params,
            logTrace,
            financialYear
        });
        return response;


    };
}
module.exports = {
    postReceipeService,
    putReceipeService,
    getReceipeService,
    getReceipeInfoService,
    deleteReceipeService,
    getReceipeDocnoService
};
