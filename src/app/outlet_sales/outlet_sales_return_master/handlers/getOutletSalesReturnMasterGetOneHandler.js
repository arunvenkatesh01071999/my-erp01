const getOutletSalesReturnMasterServices = require("../services/getOutletSalesReturnMasterServices");

function getOutletSalesReturnMasterGetOneHandler(fastify) {
    const getOutletSalesReturnGetOneMaster = getOutletSalesReturnMasterServices.getOutletSalesReturnMasterGetOneService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await getOutletSalesReturnGetOneMaster({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletSalesReturnMasterGetOneHandler;
