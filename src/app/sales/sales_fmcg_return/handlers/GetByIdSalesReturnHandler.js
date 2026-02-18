const SalesReturnService = require("../services/SalesReturnService");

function getByIdSalesReturnHandler(fastify) {
    const getByIdSalesReturn = SalesReturnService.GetByIdSalesReturn(fastify);

    return async function (request, reply) {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getByIdSalesReturn({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getByIdSalesReturnHandler;
