const salesServices = require("../services/salesReturnMasterServices");

function getSalesMissingBarcode(fastify) {
    const getSalesMissingBarcode = salesServices.getSalesMissingBarcodeService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesMissingBarcode({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getSalesMissingBarcode;


