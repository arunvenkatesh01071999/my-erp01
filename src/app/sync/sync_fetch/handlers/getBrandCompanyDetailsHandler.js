const syncfetchService = require("../services/syncfetchService");

function getBrandCompanyDetailsHandler(fastify) {
    const getBrandCompanyDetails = syncfetchService.getBrandCompanyDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce, body, query } = request;
        const response = await getBrandCompanyDetails({
            params,
            logTarce,
            body,
            query
        });
        return replay.code(200).send(response);
    }
}

module.exports = getBrandCompanyDetailsHandler;