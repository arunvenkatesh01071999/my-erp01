const stockVerifySettingRepo = require("../repository/getStockVerifySettingRepo");

function getStockVerifySettingService(fastify) {
    const { getStockVerifySetting } = stockVerifySettingRepo(fastify);

    return async ({ params, body, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await getStockVerifySetting.call(knex, {
            params,
            body,
            logTrace
        });
        return response;
    };
}
function postStockVerifySettingService(fastify) {
    const { postStockVerifySetting } = stockVerifySettingRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = postStockVerifySetting.call(knex, {
            params,
            body,
            logTrace,
            userDetails
        });
        const [response] = await Promise.all([promise1]);
        return response;
    };
}


module.exports = {
    getStockVerifySettingService,
    postStockVerifySettingService,

};
