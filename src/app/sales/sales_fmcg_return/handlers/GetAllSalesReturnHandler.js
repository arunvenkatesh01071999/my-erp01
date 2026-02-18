const SalesReturnService = require("../services/SalesReturnService");

function getAllSalesReturnHandler(fastify) {
    const getAllSalesReturn = SalesReturnService.GetAllSalesReturn(fastify);

    return async function (request, reply) {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getAllSalesReturn({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getAllSalesReturnHandler;
