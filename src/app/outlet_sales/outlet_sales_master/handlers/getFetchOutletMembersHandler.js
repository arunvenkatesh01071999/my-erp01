const getOutletSalesMasterServices = require("../services/getOutletSalesMasterServices");

function getFetchOutletMembersHandler(fastify) {
    const getFetchOutletMembers = getOutletSalesMasterServices.getFetchOutletMembersService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getFetchOutletMembers({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getFetchOutletMembersHandler;
