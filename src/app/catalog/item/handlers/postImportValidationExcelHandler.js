const itemServices = require("../services/itemServices");

function postImportValidationExcelHandler(fastify) {
    const postImportValidationExcel = itemServices.postItemImportValidationService(fastify);

    return async (request, replay) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postImportValidationExcel({
            params,
            body,
            logTrace,
            userDetails
        })
        return replay.code(200).send(response)
    }
}

module.exports = postImportValidationExcelHandler;