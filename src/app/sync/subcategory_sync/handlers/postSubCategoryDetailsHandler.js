const subcategoryService = require("../services/subCategorySyncService");

function postSubCategoryDetailsSyncHanlder(fastify) {
    const postSubCategoryDetails = subcategoryService.postSubCategorySyncDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails } = request;
        const response = await postSubCategoryDetails({
            userDetails
        });
        return replay.code(200).send(response);
    }
}

module.exports = postSubCategoryDetailsSyncHanlder;