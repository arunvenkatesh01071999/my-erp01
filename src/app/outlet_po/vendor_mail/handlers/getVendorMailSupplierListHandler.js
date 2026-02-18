const vendorEmailService = require("../services/vendorEmailService.js");

function getVendorMailSupplierListHandler(fastify) {

    const getVendorEmailSupplierListServices = vendorEmailService.getVendorEmailSupplierListServices(fastify);

    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getVendorEmailSupplierListServices({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getVendorMailSupplierListHandler;
