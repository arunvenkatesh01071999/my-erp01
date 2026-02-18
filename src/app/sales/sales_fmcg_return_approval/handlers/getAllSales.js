const salesServices = require("../services/salesReturnMasterServices");

function getsalesDocNoHandler(fastify) {
    const getaccountMaster = salesServices.getSalesDetailsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getaccountMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getsalesDocNoHandler;