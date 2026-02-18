const SalesReturnService = require("../services/SalesReturnService");

function putSalesReturnHandler(fastify) {
    const putSalesReturn = SalesReturnService.putSalesReturnService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await putSalesReturn({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = putSalesReturnHandler;
