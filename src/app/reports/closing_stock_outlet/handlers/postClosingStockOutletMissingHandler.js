const getClosingStockOutletServices = require("../services/getClosingStockOutletServices.js");

function postClosingStockOutletMissingHandler(fastify) {
    const postClosingStockOutletMissing = getClosingStockOutletServices.postClosingStockOutletMissingService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postClosingStockOutletMissing({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postClosingStockOutletMissingHandler;
