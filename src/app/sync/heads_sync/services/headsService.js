const headsRepo = require("../repository/headsRepo");
const cron = require('node-cron');
const axios = require('axios');


function postHeadsService(fastify) {
    const { postHeadsSyncDetails } = headsRepo(fastify);

    return async ({ params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const { company_id, id } = userDetails;
        const response = await postHeadsSyncDetails.call(knex, {
            company_id,
            id
        });
        return response;
    };
}

function getHeadsSyncDetailsService(fastify) {
    const { getHeadsSync } = headsRepo(fastify);
    return async ({ params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = getHeadsSync.call(knex, {
            params,
            logTrace
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putHeadsSyncDetailsService(fastify) {
    const { putHeadsStatusChange } = headsRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putHeadsStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putHeadsStatusService(fastify) {
    const { putHeadsFalseStatusChange } = headsRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putHeadsFalseStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}



module.exports = {
    postHeadsService,
    getHeadsSyncDetailsService,
    putHeadsSyncDetailsService,
    putHeadsStatusService
}