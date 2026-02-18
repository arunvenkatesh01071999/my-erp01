const barcodeConfigServices = require("../services/barcodeConfigServices");

function postEntryCheckHandler(fastify) {
    const postEntryCheck = barcodeConfigServices.postEntryCheckService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await postEntryCheck({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postEntryCheckHandler;
