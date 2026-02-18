const receiptServices = require("../services/receiptServices");

function getReceiptDocnoHandler(fastify) {
    const getReceiptDocno = receiptServices.getReceiptDocnoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getReceiptDocno({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getReceiptDocnoHandler;
