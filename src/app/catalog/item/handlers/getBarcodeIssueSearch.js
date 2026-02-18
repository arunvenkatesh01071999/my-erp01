const ItemServices = require("../services/itemServices");

function getBarcodeIssueSearch(fastify) {
    const getBarcodeIssueSearch = ItemServices.getBarcodeIssueSearchService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await getBarcodeIssueSearch({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = getBarcodeIssueSearch;
