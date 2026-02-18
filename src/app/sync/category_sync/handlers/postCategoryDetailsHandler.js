const categoryService = require("../services/categorySyncService");

function postCategoryDetailsSyncHanlder(fastify) {
    const postCategoryDetails = categoryService.postCategorySyncDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails } = request;
        const response = await postCategoryDetails({
            userDetails
        });
        return replay.code(200).send(response);
    }
}

module.exports = postCategoryDetailsSyncHanlder;