const fnvPackingPlanningService = require("../services/fnvPackingPlanningService");

function getGrnByProductHandler(fastify) {
    const listGrnByProductByParentId = fnvPackingPlanningService.listGrnByProductByParentIdService(fastify);

    return async function (request, reply) {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await listGrnByProductByParentId({
            params,
            body,
            logTrace,
            userDetails,
            query
        });
        return reply.code(200).send(response);
    };
}

module.exports = getGrnByProductHandler;
