const wareHouseServices = require("../services/wareHouseServices");

function getRegionHandler(fastify) {
    const getRegionService = wareHouseServices.getRegionService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getRegionService({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getRegionHandler;
