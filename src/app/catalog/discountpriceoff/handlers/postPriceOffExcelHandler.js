const offerMasterServices = require("../services/priceOfferServices");

function postPriceOffExcelHandler(fastify) {
    const postPriceOffExcel = offerMasterServices.postOfferMasterExcelService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postPriceOffExcel({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postPriceOffExcelHandler;
