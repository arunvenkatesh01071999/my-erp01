const loyaltyServices = require("../services/loyaltyServices");

function postLoyaltyHandler(fastify) {
    const postLoyalty = loyaltyServices.postLoyaltyService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await postLoyalty({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postLoyaltyHandler;
