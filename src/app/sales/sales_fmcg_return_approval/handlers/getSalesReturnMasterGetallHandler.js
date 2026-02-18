const salesServices = require("../services/salesReturnMasterServices");

function getSalesReturnMasterGetallHandler(fastify) {
    const getSalesReturnMaster = salesServices.getSalesReturnMasterGetallService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesReturnMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getSalesReturnMasterGetallHandler;
