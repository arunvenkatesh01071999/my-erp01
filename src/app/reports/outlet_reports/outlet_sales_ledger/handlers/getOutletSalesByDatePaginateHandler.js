const getOutletSalesServices = require("../services/getOutletSalesServices");

function getOutletSalesByDatePaginateHandler(fastify) {
    const getOutletSalesPaginateByDate =
        getOutletSalesServices.getOutletSalesPaginateByDateService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getOutletSalesPaginateByDate({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletSalesByDatePaginateHandler;
