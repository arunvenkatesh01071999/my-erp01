const offerMasterServices = require("../services/offerMasterServices");

function getSchemeTypeHandler(fastify) {
    const getSchemeType = offerMasterServices.getSchemeTypeService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query } = request;
        const response = await getSchemeType({ body, params, logTrace, query });
        return reply.code(200).send(response);
    };
}

module.exports = getSchemeTypeHandler;
