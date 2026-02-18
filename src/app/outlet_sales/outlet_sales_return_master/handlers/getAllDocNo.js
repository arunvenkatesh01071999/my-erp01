const getOutletSalesReturnMasterServices = require("../services/getOutletSalesReturnMasterServices");

function getsalesDocNo(fastify) {
    const getaccountMaster = getOutletSalesReturnMasterServices.getOutletSalesDetailsDocNoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getaccountMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getsalesDocNo;