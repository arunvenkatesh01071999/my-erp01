const getOutletSalesServices = require("../services/getOutletSalesMasterServices.js");

function deletetOutletSalesHandler(fastify) {
    const deleteOutletSales = getOutletSalesServices.deleteOutletSalesService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await deleteOutletSales({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deletetOutletSalesHandler;
