const getPurchaseServices = require("../services/getPurchaseServices");

function getPurchaseByDatePaginateHandler(fastify) {
    const getPurchasePaginateByDate =
        getPurchaseServices.getPurchasePaginateByDateService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getPurchasePaginateByDate({
            body,
            params,
            query,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = getPurchaseByDatePaginateHandler;
