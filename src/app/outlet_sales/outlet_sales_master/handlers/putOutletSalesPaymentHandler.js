const getOutletSalesPaymentServices = require("../services/getOutletSalesMasterServices.js");

function putOutletSalesPaymentHandler(fastify) {
    const putOutletSalesPayment = getOutletSalesPaymentServices.putOutletSalesPaymentService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await putOutletSalesPayment({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putOutletSalesPaymentHandler;
