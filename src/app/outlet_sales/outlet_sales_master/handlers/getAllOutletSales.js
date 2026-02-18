const getOutletSalesMasterServices = require("../services/getOutletSalesMasterServices");

function getAllSalesByDocNo(fastify) {
    const getaccountAllMaster = getOutletSalesMasterServices.getAllOutletSalesDocNoService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getaccountAllMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getAllSalesByDocNo;
