const salesReturnApproval = require("../repository/salesReturnApproval");


const getFinancialYear = (date = new Date()) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month >= 4) {
        return `${year}_${year + 1}`;
    } else {
        return `${year - 1}_${year}`;
    }
};


function UpdateSalesReturnApprovalService(fastify) {
    const { UpdateSalesReturnApproval } = salesReturnApproval(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();

        const response = UpdateSalesReturnApproval.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        return response;
    };
}

function generateSaleReturnApprovalNoService(fastify) {
    const { generatSalesReturnApprovalDocno } = salesReturnApproval(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();

        const response = generatSalesReturnApprovalDocno.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });
        return response;
    };
}

function GetAllsalesReturnApproval(fastify) {
    const { getAllSalesReturnApproval } = salesReturnApproval(fastify);
    return async ({ params, body, logTrace, userDetails, query }) => {
        const knex = fastify.knexMedical;
        const response = await getAllSalesReturnApproval.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            queryString: query
        });
        return response;
    };
}

function GetByIdsalesReturnApproval(fastify) {
    const { getSalesReturnApprovalById } = salesReturnApproval(fastify);
    return async ({ params, body, logTrace, userDetails, query }) => {
        const knex = fastify.knexMedical;
        const response = await getSalesReturnApprovalById.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            queryString: query
        });
        return response;
    };
}

function ReverseSalesReturnApprovalService(fastify) {
    const { ReverseSalesReturnApproval } = salesReturnApproval(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const financialYear = getFinancialYear();

        const response = ReverseSalesReturnApproval.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
            financialYear
        });

        return response;
    };
}


module.exports = {
    UpdateSalesReturnApprovalService,
    generateSaleReturnApprovalNoService,
    GetAllsalesReturnApproval,
    GetByIdsalesReturnApproval,
    ReverseSalesReturnApprovalService
};