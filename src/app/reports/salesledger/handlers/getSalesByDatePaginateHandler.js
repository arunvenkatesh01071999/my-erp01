const getSalesServices = require("../services/getSalesServices");

function getSalesByDatePaginateHandler(fastify) {
    const getSalesPaginateByDate =
        getSalesServices.getSalesPaginateByDateService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getSalesPaginateByDate({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = getSalesByDatePaginateHandler;
