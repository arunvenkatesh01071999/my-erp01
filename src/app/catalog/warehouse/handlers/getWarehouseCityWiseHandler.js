const wareHouseServices = require("../services/wareHouseServices");

function getWarehouseCityWiseHandler(fastify) {
    const getWarehouseCityWise = wareHouseServices.getWarehouseCityWiseService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getWarehouseCityWise({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getWarehouseCityWiseHandler;
