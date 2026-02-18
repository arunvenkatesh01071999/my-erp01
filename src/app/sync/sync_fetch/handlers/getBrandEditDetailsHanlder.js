const syncfetchService = require("../services/syncfetchService");

function getBrandEditDetailsHandler(fastify) {
    const getBrandEditDetails = syncfetchService.getBrandEditDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails, params} = request;
        const response = await getBrandEditDetails({
            userDetails,
            params
        });
        return replay.code(200).send(response);
    }
}

module.exports = getBrandEditDetailsHandler;