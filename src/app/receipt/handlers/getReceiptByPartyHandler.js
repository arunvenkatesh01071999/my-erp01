const receiptServices = require("../services/receiptServices");

function getReceiptByPartyHandler(fastify) {
    const getReceiptByParty = receiptServices.getReceiptByPartyService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getReceiptByParty({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getReceiptByPartyHandler;
