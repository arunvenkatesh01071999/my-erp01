const salesMasterServices = require("../services/salesMasterServices");

function getCustomerDetailsHandler(fastify) {
    const getCustomerDetails = salesMasterServices.getCustomerDetailsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getCustomerDetails({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getCustomerDetailsHandler;
