const categoryService = require("../services/categorySyncService");

function putCategoryStatusHanlder(fastify) {
    const putCategoryDetails = categoryService.putCategoryStatusService(fastify);

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

module.exports = putCategoryStatusHanlder;