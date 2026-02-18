const categoryRepo = require("../repository/categoryRepo");
const cron = require('node-cron');
const axios = require('axios');
function postCategorySyncDetailsService(fastify) {
    const { postCategorySyncDetails } = categoryRepo(fastify);

    return async ({ params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const company_id = userDetails.company_id;
        const response = await postCategorySyncDetails.call(knex, {
            company_id
        });
        return response;
    };
}

function getCategorySyncDetailsService(fastify) {
    const { getCategoriesSync } = categoryRepo(fastify);
    return async ({ params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = getCategoriesSync.call(knex, {
            params,
            logTrace
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putCategorySyncDetailsService(fastify) {
    const { putCategoriesStatusChange } = categoryRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putCategoriesStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putCategoryStatusService(fastify) {
    const { putCategoriesFalseStatusChange } = categoryRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putCategoriesFalseStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

// const base_url = process.env.LOCAL_URL;
// const token = process.env.TOKEN;

// if (!base_url || !token) {
//     console.error("Missing environment variables: LOCAL_URL or TOKEN");
//     process.exit(1);
// }

// const syncCategories = async () => {
//     console.log("Running category sync at", new Date().toLocaleTimeString());

//     const endpoints = [
//         { name: "Category", url: "/sync/category/details" },
//         { name: "Subcategory", url: "/sync/subcategory/details" },
//         { name: "Heads", url: "/sync/heads/details" },
//         { name: "TypeDesign", url: "/sync/typedesign/details" },
//         { name: "Units", url: "/sync/units/details" },
//         { name: "Items", url: "/sync/items/details" }
//     ];

//     const requests = endpoints.map(({ name, url }) =>
//         axios.post(`${base_url}${url}`, {}, { headers: { Authorization: `Bearer ${token}` } })
//             .then(response => ({ name, status: "fulfilled", data: response.data }))
//             .catch(error => ({ name, status: "rejected", error: error.response?.data || error.message }))
//     );

//     const results = await Promise.allSettled(requests);

//     results.forEach(({ status, value }) => {
//         if (status === "fulfilled") {
//             console.log(`${value.name} sync completed successfully:`, value.data);
//         } else {
//             console.error(`Error syncing ${value.name}:`, value.error);
//         }
//     });
// };

// // Runs every 1 minute
// setInterval(syncCategories, 60 * 1000);

// console.log("Scheduler initialized.");




module.exports = {
    postCategorySyncDetailsService,
    getCategorySyncDetailsService,
    putCategorySyncDetailsService,
    putCategoryStatusService
}