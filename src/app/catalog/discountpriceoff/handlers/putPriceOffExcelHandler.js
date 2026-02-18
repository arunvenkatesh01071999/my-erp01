const offerMasterServices = require("../services/priceOfferServices");

function putPriceOffExcelHandler(fastify) {
    const putOfferMasterExcelService = offerMasterServices.putOfferMasterExcelService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await putOfferMasterExcelService({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = putPriceOffExcelHandler;
