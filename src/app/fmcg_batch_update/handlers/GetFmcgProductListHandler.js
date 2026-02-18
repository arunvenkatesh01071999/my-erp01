const fmcgBatchUpdateService = require("../services/fmcgBatchUpdateService");

function GetFmcgProductListHandler(fastify) {
    const GetFmcgProductList = fmcgBatchUpdateService.GetFmcgProductListService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await GetFmcgProductList({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = GetFmcgProductListHandler;
