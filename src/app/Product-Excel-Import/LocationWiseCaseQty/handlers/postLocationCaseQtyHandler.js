const LocationCaseQtyServices = require("../services/LocationCaseQtyService");

function postLocationCaseQtyHandler(fastify) {
    const postLocationCaseQty = LocationCaseQtyServices.postLocationCaseQtyService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postLocationCaseQty({
            params,
            body,
            logTrace,
            userDetails
        });
        return reply.code(200).send(response);
    };
}

module.exports = postLocationCaseQtyHandler;
