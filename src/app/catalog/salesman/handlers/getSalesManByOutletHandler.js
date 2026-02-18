const SalesManServices = require("../services/salesManServices");

function getSalesManByOutletHandler(fastify) {
    const getSalesManByOutlet = SalesManServices.getSalesManByOutletService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getSalesManByOutlet({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getSalesManByOutletHandler;
