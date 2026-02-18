const SalesReturnService = require("../services/SalesReturnService");

function postSalesReturnHandler(fastify) {
    const postSalesReturn = SalesReturnService.postSalesReturnService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postSalesReturn({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = postSalesReturnHandler;
