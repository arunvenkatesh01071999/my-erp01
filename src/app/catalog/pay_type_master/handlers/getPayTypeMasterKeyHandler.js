const getPayTypeMasterService = require("../services/getPayTypeMasterService");

function getPayTypeMasterKeyHandler(fastify) {
    const getPayTypeMaster = getPayTypeMasterService.getPayTypeMasterService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getPayTypeMaster({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getPayTypeMasterKeyHandler;
