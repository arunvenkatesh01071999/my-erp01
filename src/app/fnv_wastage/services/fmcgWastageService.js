const fmcgWastageRepo = require("../repository/fmcgWastageRepo.js");
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");


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
    const { postWastage, updateStockLedger } = fmcgWastageRepo(fastify);
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

        const [response, response1] = await Promise.all([promise1, promise2]);
        return response;
    };
}
function putWastageService(fastify) {
    const { putWastage, reduceStockLedger, updateStockLedger } = fmcgWastageRepo(fastify);
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


        const [response, response1] = await Promise.all([promise1, promise2]);
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
    const { deleteWastage, reduceStockLedger } = fmcgWastageRepo(fastify);

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


function postWastageListService(fastify) {
    const { postWastageList } = fmcgWastageRepo(fastify);

    return async ({ body, params, logTrace, query, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await postWastageList.call(knex, { body, logTrace, });
        //calculation
        console.log(response, "repo res")
        const tray_weight = response.tray_weight;
        const tray_total_weight = tray_weight * body.tray_count;
        const input_weight = Number(body.weight);

        if (input_weight < tray_total_weight) {
            throw CustomError.create({
                httpCode: StatusCodes.BAD_REQUEST,
                message: `Weight cannot be less than total tray weight`,
                property: "",
                code: "BAD_REQUEST"
            });
        }

        const net_weight = body.weight - tray_total_weight;

        const updateResponse = {
            ...response,
            net_weight,
            tray_total_weight,
            tray_count: body.tray_count,
            reason: body.reason,
        }

        return updateResponse;
    };
}
module.exports = {
    postWastageService,
    putWastageService,
    getWastageService,
    getWastageInfoService,
    deleteWastageService,
    getWastageDocnoService,
    postWastageListService
};
