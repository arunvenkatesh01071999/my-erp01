const typedesignRepo = require("../repository/typedesignRepo");

function postTypeDesignService(fastify) {
    const { postTypeDesignSyncDetails } = typedesignRepo(fastify);

    return async ({ params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const { company_id, id } = userDetails;
        const response = await postTypeDesignSyncDetails.call(knex, {
            company_id,
            id
        });
        return response;
    };
}

function getTypeDesignSyncDetailsService(fastify) {
    const { getTypeDesignSync } = typedesignRepo(fastify);
    return async ({ params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = getTypeDesignSync.call(knex, {
            params,
            logTrace
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putTypeDesignSyncDetailsService(fastify) {
    const { putTypeDesignStatusChange } = typedesignRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putTypeDesignStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putTypeDesignStatusService(fastify) {
    const { putTypeDesignFalseStatusChange } = typedesignRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putTypeDesignFalseStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}



module.exports = {
    postTypeDesignService,
    getTypeDesignSyncDetailsService,
    putTypeDesignSyncDetailsService,
    putTypeDesignStatusService
}