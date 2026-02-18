const categoryService = require("../services/categorySyncService");

function putCategoryDetailsSyncHanlder(fastify) {
    const putCategoryDetails = categoryService.putCategorySyncDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce, body } = request;
        const response = await putCategoryDetails({
            params,
            logTarce,
            body
        });
        return replay.code(200).send(response);
    }
}

module.exports = putCategoryDetailsSyncHanlder;