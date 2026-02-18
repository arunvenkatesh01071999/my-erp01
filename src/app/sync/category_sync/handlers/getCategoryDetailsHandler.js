const categoryService = require("../services/categorySyncService");

function getCategoryDetailsSyncHanlder(fastify) {
    const getCategoryDetails = categoryService.getCategorySyncDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce } = request;
        const response = await getCategoryDetails({
            params,
            logTarce
        });
        return replay.code(200).send(response);
    }
}

module.exports = getCategoryDetailsSyncHanlder;