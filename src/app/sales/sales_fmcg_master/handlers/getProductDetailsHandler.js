const salesMasterServices = require("../services/salesMasterServices");

function getCustomerMappingHandler(fastify) {
    const getCustomerMapping = salesMasterServices.getProductDetailsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query } = request;
        const response = await getCustomerMapping({ body, params, logTrace, query });
        return reply.code(200).send(response);
    };
}

module.exports = getCustomerMappingHandler;
