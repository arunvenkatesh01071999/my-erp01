const syncfetchService = require("../services/syncfetchService");

function getMechantCategoryEditDetailsHandler(fastify) {
    const getMechantCategoryEditDetails = syncfetchService.getMerchantCategoryEditDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails, params} = request;
        const response = await getMechantCategoryEditDetails({
            userDetails,
            params
        });
        return replay.code(200).send(response);
    }
}

module.exports = getMechantCategoryEditDetailsHandler;