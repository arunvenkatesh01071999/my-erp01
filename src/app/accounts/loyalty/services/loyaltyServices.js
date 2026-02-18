const loyaltyRepo = require("../repository/loyalty");

function getLoyaltyService(fastify) {
    const { getLoyalty } = loyaltyRepo(fastify);

    return async ({ params, body, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await getLoyalty.call(knex, {
            params,
            body,
            logTrace
        });
        return response;
    };
}
function postLoyaltyService(fastify) {
    const { postLoyalty } = loyaltyRepo(fastify);
    return async ({ params, body, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;

        const promise1 = postLoyalty.call(knex, {
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
    getLoyaltyService,
    postLoyaltyService,

};
