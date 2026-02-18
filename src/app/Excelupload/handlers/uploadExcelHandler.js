const uploadExcelService = require("../services/uploadExcelService");

function uploadExcelHandler(fastify) {
    const uploadExcel = uploadExcelService.postExcelImportService(fastify);

    return async (request, reply) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await uploadExcel({ params, body, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = uploadExcelHandler;
