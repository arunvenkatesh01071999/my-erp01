const offerMasterServices = require("../services/offerMasterServices");

function postOfferMasterExcelHandler(fastify) {
    const postOfferMasterExcel = offerMasterServices.postOfferMasterExcelService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postOfferMasterExcel({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postOfferMasterExcelHandler;
