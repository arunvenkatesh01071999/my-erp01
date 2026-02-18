const syncfetchService = require("../services/syncfetchService");

function getBrandCompanyEditDetailsHandler(fastify) {
    const getBrandCompanyEditDetails = syncfetchService.getBrandCompanyEditDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails, params} = request;
        const response = await getBrandCompanyEditDetails({
            userDetails,
            params
        });
        return replay.code(200).send(response);
    }
}

module.exports = getBrandCompanyEditDetailsHandler;