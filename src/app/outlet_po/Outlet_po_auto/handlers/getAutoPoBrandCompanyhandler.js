const outletPurchaseOrderServices = require("../services/OutletPoService.js");

function getAutoPoBrandCompanyhandler(fastify) {
    const getAutoPoBrandCompany =
        outletPurchaseOrderServices.getAutoPoBrandCompanyService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getAutoPoBrandCompany({
            params,
            body,
            logTrace,
            userDetails,
            query
        });
        return reply.code(200).send(response);
    };
}

module.exports = getAutoPoBrandCompanyhandler;
