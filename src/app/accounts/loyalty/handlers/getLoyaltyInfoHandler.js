const loyaltyServices = require("../services/loyaltyServices");

function getLoyaltyInfoHandler(fastify) {
    const getLoyalty = loyaltyServices.getLoyaltyService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getLoyalty({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getLoyaltyInfoHandler;