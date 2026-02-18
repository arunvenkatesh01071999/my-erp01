const getOutletSalesReturnMasterServices = require("../services/getOutletSalesReturnMasterServices");

function getsalesDocNoHandler(fastify) {
    const getaccountMaster = getOutletSalesReturnMasterServices.getOutletSalesDetailsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getaccountMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getsalesDocNoHandler;