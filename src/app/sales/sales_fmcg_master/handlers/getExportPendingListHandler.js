const salesMasterServices = require("../services/salesMasterServices");

function getExportPendingListHandler(fastify) {
    const getExportPendingList = salesMasterServices.getExportPendingListService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query, userDetails } = request;
        const response = await getExportPendingList({ body, params, logTrace, query, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getExportPendingListHandler;
