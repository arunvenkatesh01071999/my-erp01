const fnvPackingPlanningService = require("../services/fnvPackingPlanningService");

function getPackingPlanningHandler(fastify) {
    const getPackingPlanning = fnvPackingPlanningService.getPackingPlanningService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await getPackingPlanning({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = getPackingPlanningHandler;
