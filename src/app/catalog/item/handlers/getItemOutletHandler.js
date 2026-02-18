const itemServices = require("../services/itemServices");

function getItemOutletHandler(fastify) {
    const getItemOutlet = itemServices.getItemOutletService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getItemOutlet({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getItemOutletHandler;
