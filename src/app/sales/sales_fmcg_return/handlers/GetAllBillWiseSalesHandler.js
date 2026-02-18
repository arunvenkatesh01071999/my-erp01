const SalesReturnService = require("../services/SalesReturnService");

function getAllBillWiseSalesHandler(fastify) {
    const AllBillWiseSales = SalesReturnService.GetAllBillWiseSales(fastify);

    return async function (request, reply) {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await AllBillWiseSales({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getAllBillWiseSalesHandler;
