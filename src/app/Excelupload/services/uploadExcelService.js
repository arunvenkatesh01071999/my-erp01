const uploadExcelRepo = require("../repository/excelmport")

function postExcelImportService(fastify) {
    const { uploadExcelData } = uploadExcelRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await uploadExcelData.call(knex, {
            body,
            params,
            logTrace,
            query
        });
        return response;
    };
}

module.exports = {
    postExcelImportService
};

