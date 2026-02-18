const itemServices = require("../services/itemServices");

function postImportExcelHandler(fastify) {
    const postImportExcel = itemServices.postItemDetailsImportService(fastify);

    return async (request, replay) => {
        const { params, body, logTrace, userDetails } = request;
        const response = await postImportExcel({
            params,
            body,
            logTrace,
            userDetails
        })
        return replay.code(200).send(response)
    }
}

module.exports = postImportExcelHandler;