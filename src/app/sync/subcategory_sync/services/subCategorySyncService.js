const subcategoryRepo = require("../repository/subCategoryRepo");


function postSubCategorySyncDetailsService(fastify) {
    const { postSubCategorySyncDetails } = subcategoryRepo(fastify);

    return async ({ params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const company_id = userDetails.company_id;
        const response = await postSubCategorySyncDetails.call(knex, {
            company_id
        });
        return response;
    };
}

function getSubCategorySyncDetailsService(fastify) {
    const { getSubCategoriesSync } = subcategoryRepo(fastify);
    return async ({ params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = getSubCategoriesSync.call(knex, {
            params,
            logTrace
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putSubCategorySyncDetailsService(fastify) {
    const { putSubCategoriesStatusChange } = subcategoryRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putSubCategoriesStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

function putSubCategoryStatusService(fastify) {
    const { putSubCategoriesFalseStatusChange } = subcategoryRepo(fastify);
    return async ({ params, logTrace, body }) => {
        const knex = fastify.knexMedical;
        const promise1 = putSubCategoriesFalseStatusChange.call(knex, {
            params,
            logTrace,
            body
        });
        const [response] = await Promise.all([promise1]);
        return response;
    }
}

// cron.schedule('* * * * * *', async () => { // Runs every 5 seconds
//     const base_url = process.env.LOCAL_URL;
//     const token = process.env.TOKEN;

//     console.log(base_url, token, "values");
//     console.log("Running category sync at", new Date().toLocaleTimeString());

//     try {
//         const response = await axios.post(`${base_url}/sync/category/details`, {}, {
//             headers: { Authorization: `Bearer ${token}` }
//         });

//         console.log("Category sync completed successfully", response.data);
//     } catch (error) {
//         console.error("Error during category sync:", error.response ? error.response.data : error.message);
//     }
// });

// console.log("Category Scheduler initialized.");

module.exports = {
    postSubCategorySyncDetailsService,
    getSubCategorySyncDetailsService,
    putSubCategorySyncDetailsService,
    putSubCategoryStatusService
}