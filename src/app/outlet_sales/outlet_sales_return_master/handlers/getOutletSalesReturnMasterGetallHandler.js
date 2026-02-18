const getOutletSalesReturnMasterServices = require("../services/getOutletSalesReturnMasterServices");

function getOutletSalesReturnMasterGetallHandler(fastify) {
    const getOutletSalesReturnGetallMaster = getOutletSalesReturnMasterServices.getOutletSalesReturnMasterGetallService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getOutletSalesReturnGetallMaster({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletSalesReturnMasterGetallHandler;
