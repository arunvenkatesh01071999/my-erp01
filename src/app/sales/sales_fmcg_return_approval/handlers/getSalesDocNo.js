const salesServices = require("../services/salesReturnMasterServices");

function getSalesByDocNo(fastify) {
    const getaccountMaster = salesServices.getSalesReturnByDocNoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getaccountMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getSalesByDocNo;
