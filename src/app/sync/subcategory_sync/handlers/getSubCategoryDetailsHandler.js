const subcategoryService = require("../services/subCategorySyncService");

function getSubCategoryDetailsSyncHanlder(fastify) {
    const getSubCategoryDetails = subcategoryService.getSubCategorySyncDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce } = request;
        const response = await getSubCategoryDetails({
            params,
            logTarce
        });
        return replay.code(200).send(response);
    }
}

module.exports = getSubCategoryDetailsSyncHanlder;