const LocationCaseQtyService = require("../services/LocationCaseQtyService");

function getXlImportLogHandler(fastify) {
    const getReceiptByParty = LocationCaseQtyService.getXlImportLogService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, query } = request;
        const response = await getReceiptByParty({ body, params, logTrace, query });
        return reply.code(200).send(response);
    };
}

module.exports = getXlImportLogHandler;
