const unitRepo = require("../repository/unitRepo");

function postUnitsService(fastify) {
    const { postUnitSyncDetails } = unitRepo(fastify);

    return async ({ params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const { company_id, id } = userDetails;
        const response = await postUnitSyncDetails.call(knex, {
            company_id,
            id
        });
        return response;
    };
}

function getUnitSyncDetailsService(fastify) {
    const { getUnitsSync } = unitRepo(fastify);
    return async ({ params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = getUnitsSync.call(knex, {
            params,
            logTrace
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putUnitsSyncDetailsService(fastify) {
    const { putUnitStatusChange } = unitRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putUnitStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putUnitsStatusService(fastify) {
    const { putUnitsFalseStatusChange } = unitRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putUnitsFalseStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}



module.exports = {
    postUnitsService,
    getUnitSyncDetailsService,
    putUnitsSyncDetailsService,
    putUnitsStatusService
}