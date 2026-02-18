const subcategoryService = require("../services/subCategorySyncService");

function putSubCategoryStatusHanlder(fastify) {
    const putSubCategoryDetails = subcategoryService.putSubCategoryStatusService(fastify);

    return async (request, replay) => {
        const { params, logTarce, body } = request;
        const response = await putSubCategoryDetails({
            params,
            logTarce,
            body
        });
        return replay.code(200).send(response);
    }
}

module.exports = putSubCategoryStatusHanlder;