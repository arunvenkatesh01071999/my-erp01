const salesMasterServices = require("../services/salesMasterServices");

function puttExportPendingListHandler(fastify) {
    const puttExportPendingList = salesMasterServices.putExportPendingListService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await puttExportPendingList({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = puttExportPendingListHandler;
