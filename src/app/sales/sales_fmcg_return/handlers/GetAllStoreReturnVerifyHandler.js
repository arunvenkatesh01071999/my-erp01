const SalesReturnService = require("../services/SalesReturnService");

function GetAllStoreReturnVerifyHandler(fastify) {
    const GetAllStoreReturnVerify = SalesReturnService.GetAllStoreReturnVerify(fastify);

    return async function (request, reply) {
        const { params, body, logTrace, userDetails, query } = request;
        const response = await GetAllStoreReturnVerify({ params, body, logTrace, userDetails, query });
        return reply.code(200).send(response);
    };
}

module.exports = GetAllStoreReturnVerifyHandler;
