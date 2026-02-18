const SalesReturnService = require("../services/SalesReturnService");

function getAllDirectSalesHandler(fastify) {
    const AllDirectSalesList = SalesReturnService.GetAllDirectSales(fastify);

    return async function (request, reply) {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await AllDirectSalesList({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getAllDirectSalesHandler;
