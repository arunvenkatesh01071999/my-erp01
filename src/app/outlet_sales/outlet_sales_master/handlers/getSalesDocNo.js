const getOutletSalesMasterServices = require("../services/getOutletSalesMasterServices");

function getSalesByDocNo(fastify) {
    const getaccountMaster = getOutletSalesMasterServices.getOutletSalesDocNoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getaccountMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getSalesByDocNo;
