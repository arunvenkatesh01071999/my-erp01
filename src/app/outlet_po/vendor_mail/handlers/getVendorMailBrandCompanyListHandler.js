const vendorEmailService = require("../services/vendorEmailService.js");

function getVendorMailBrandCompanyListHandler(fastify) {

    const getVendorMailBrandCompanyListServices = vendorEmailService.getVendorMailBrandCompanyListServices(fastify);

    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getVendorMailBrandCompanyListServices({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getVendorMailBrandCompanyListHandler;
