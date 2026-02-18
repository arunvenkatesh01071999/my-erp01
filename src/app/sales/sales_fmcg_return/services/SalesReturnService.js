const salesReturn = require("../repository/salesReturn");

const getFinancialYear = (date = new Date()) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month >= 4) {
        return `${year}_${year + 1}`;
    } else {
        return `${year - 1}_${year}`;
    }
};


function GetAllDirectSales(fastify) {
    const { GetAllDirectSales } = salesReturn(fastify);
    return async ({ params, body, logTrace, userDetails, query }) => {
        const knex = fastify.knexMedical;
        const response = await GetAllDirectSales.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            queryString: query
        });
        return response;
    };
}

function GetAllBillWiseSales(fastify) {
    const { GetAllBillWiseSales } = salesReturn(fastify);
    return async ({ params, body, logTrace, userDetails, query }) => {
        const knex = fastify.knexMedical;
        const response = await GetAllBillWiseSales.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            queryString: query
        });
        return response;
    };
}

function GetAllStoreReturnVerify(fastify) {
    const { GetAllStoreReturnVerify } = salesReturn(fastify);
    return async ({ params, body, logTrace, userDetails, query }) => {
        const knex = fastify.knexMedical;
        const response = await GetAllStoreReturnVerify.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            queryString: query
        });
        return response;
    };
}

function postSalesReturnService(fastify) {
    const { postSalesReturnRepo } = salesReturn(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();

        const response = postSalesReturnRepo.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        return response;
    };
}

function putSalesReturnService(fastify) {
    const { putSalesReturnRepo } = salesReturn(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();

        const response = putSalesReturnRepo.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        return response;
    };
}

function generateSaleReturnNoService(fastify) {
    const { generatSalesReturnDocno } = salesReturn(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();

        const response = generatSalesReturnDocno.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        return response;
    };
}

function GetAllSalesReturn(fastify) {
    const { getAllSalesReturn } = salesReturn(fastify);
    return async ({ params, body, logTrace, userDetails, query }) => {
        const knex = fastify.knexMedical;
        const response = await getAllSalesReturn.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            queryString: query
        });
        return response;
    };
}

function GetByIdSalesReturn(fastify) {
    const { getSalesReturnById } = salesReturn(fastify);
    return async ({ params, body, logTrace, userDetails, query }) => {
        const knex = fastify.knexMedical;
        const response = await getSalesReturnById.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            queryString: query
        });
        return response;
    };
}


module.exports = {
    GetAllDirectSales,
    GetAllBillWiseSales,
    GetAllStoreReturnVerify,
    postSalesReturnService,
    putSalesReturnService,
    generateSaleReturnNoService,
    GetAllSalesReturn,
    GetByIdSalesReturn
};