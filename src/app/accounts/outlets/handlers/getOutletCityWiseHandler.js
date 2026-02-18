const outletServices = require("../services/outletServices");

function getOutletCityWiseHandler(fastify) {
    const getOutletCityWise = outletServices.getOutletCityWiseService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query } = request;
        const response = await getOutletCityWise({ body, params, logTrace, query });
        return reply.code(200).send(response);
    };
}

module.exports = getOutletCityWiseHandler;
