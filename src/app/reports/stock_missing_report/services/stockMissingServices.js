const stockMissingRepo = require("../repository/stockMissing.js");

function getstockMissingReportService(fastify) {
    const { getstockMissingReport } = stockMissingRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await getstockMissingReport.call(knex, {
            body,
            params,
            logTrace
        });
        return response;
    };
}

function getstockMissingReportNewService(fastify) {
    const { getstockMissingNewReport } = stockMissingRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await getstockMissingNewReport.call(knex, {
            body,
            params,
            logTrace
        });
        return response;
    };
}



module.exports = {
    getstockMissingReportService,
    getstockMissingReportNewService
};
