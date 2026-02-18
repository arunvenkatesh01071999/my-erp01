const itemRepo = require("../repository/itemRepo");

function postItemService(fastify) {
    const { postItemSyncDetails } = itemRepo(fastify);

    return async ({ params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const { company_id, id } = userDetails;
        const response = await postItemSyncDetails.call(knex, {
            company_id,
            id
        });
        return response;
    };
}

function getItemSyncDetailsService(fastify) {
    const { getItemSync } = itemRepo(fastify);
    return async ({ params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = getItemSync.call(knex, {
            params,
            logTrace
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putitemSyncDetailsService(fastify) {
    const { putItemStatusChange } = itemRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putItemStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putitemStatusService(fastify) {
    const { putItemFalseStatusChange } = itemRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putItemFalseStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}



module.exports = {
    postItemService,
    getItemSyncDetailsService,
    putitemSyncDetailsService,
    putitemStatusService
}