const QueryString = require("qs");
const LocationCaseQtyRepo = require("../repository/LocationCaseQty");




function postLocationCaseQtyService(fastify) {
    const { postLocationCaseQty } = LocationCaseQtyRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = postLocationCaseQty.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        return response;
    };
}

function getXlImportLogService(fastify) {
    const { getXlImportLogList } = LocationCaseQtyRepo(fastify);

    return async ({ body, params, logTrace, query }) => {
        const knex = fastify.knexMedical;
        const response = await getXlImportLogList.call(knex, {
            body,
            params,
            logTrace,
            queryString: query
        });
        return response;
    };
}



module.exports = {
    postLocationCaseQtyService,
    getXlImportLogService
};
