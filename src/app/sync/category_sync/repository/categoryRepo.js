const axios = require('axios');
const cron = require('node-cron');
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { MAIN_CATEGORY } = require("../commons/constants");

function categoryRepo(fastify) {
    async function postCategorySyncDetails({ company_id, logTrace }) {
        const base_url = process.env.BASE_URL;
        const token = process.env.TOKEN;
        const knex = this;

        // Start a transaction correctly
        const trx = await knex.transaction();
        console.log(company_id, "company_id");

        try {
            // Update category sync status to true
            await axios.put(`${base_url}/sync/category/status/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch categories from API
            const response = await axios.get(`${base_url}/sync/category/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { data } = response;

            // Fetch existing categories from DB within transaction
            const existingCategories = await trx(MAIN_CATEGORY.NAME)
                .select(MAIN_CATEGORY.COLUMNS.ID, MAIN_CATEGORY.COLUMNS.CATEGORY_NAME);

            // Map existing categories by ID instead of category_name
            const existingMap = new Map(existingCategories.map(c => [c.id, c]));

            const inserts = [];
            const updates = [];

            data.forEach(c => {
                const existingCategory = existingMap.get(c.id);

                const categoryData = {
                    [MAIN_CATEGORY.COLUMNS.ID]: c.id,
                    [MAIN_CATEGORY.COLUMNS.CATEGORY_NAME]: c.category_name.trim(),
                    [MAIN_CATEGORY.COLUMNS.CATEGORY_IMAGE]: c.category_image || '',
                    [MAIN_CATEGORY.COLUMNS.IS_ACTIVE]: c.is_active,
                    [MAIN_CATEGORY.COLUMNS.COMPANY_ID]: c.company_id,
                    [MAIN_CATEGORY.COLUMNS.UPDATED_AT]: new Date().toISOString()
                };

                if (existingCategory) {
                    // Update existing category
                    updates.push({ id: c.id, ...categoryData });
                } else {
                    // Insert new category
                    inserts.push({ ...categoryData, [MAIN_CATEGORY.COLUMNS.IS_INSERTED]: true });
                }
            });

            // Perform bulk updates inside the transaction
            if (updates.length) {
                await Promise.all(
                    updates.map(({ id, ...data }) =>
                        trx(MAIN_CATEGORY.NAME).where({ id }).update(data)
                    )
                );
            }

            // Perform bulk insert inside the transaction
            if (inserts.length) {
                await trx(MAIN_CATEGORY.NAME).insert(inserts);
            }

            // Commit transaction
            await trx.commit();

            // Update category sync status to false after sync
            await axios.put(`${base_url}/sync/category/false/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Category sync successful at", new Date().toLocaleTimeString());
            return { success: true };

        } catch (error) {
            await trx.rollback(); // Rollback in case of error
            console.error("Error syncing category details:", error.message);

            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error syncing category details",
                property: '',
                code: "INTERNAL_SERVER_ERROR"
            });
        }
    }

    async function getCategoriesSync({ logTrace }) {
        const knex = this;
        const query = knex(MAIN_CATEGORY.NAME)
            .where(MAIN_CATEGORY.COLUMNS.IS_ACTIVE, true)
            .where(MAIN_CATEGORY.COLUMNS.IS_INSERTED, true)
            .orderBy(MAIN_CATEGORY.COLUMNS.CATEGORY_NAME, "ASC");

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Categories",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Categories not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }

    async function putCategoriesStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(MAIN_CATEGORY.NAME)
            .update({
                [MAIN_CATEGORY.COLUMNS.IS_INSERTED]: true,
                [MAIN_CATEGORY.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update Categories Status",
            logTrace
        });

        await query;
        return { success: true };
    }

    async function putCategoriesFalseStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(MAIN_CATEGORY.NAME)
            .update({
                [MAIN_CATEGORY.COLUMNS.IS_INSERTED]: false,
                [MAIN_CATEGORY.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update Categories Status",
            logTrace
        });

        await query;
        return { success: true };
    }


    return {
        postCategorySyncDetails,
        getCategoriesSync,
        putCategoriesStatusChange,
        putCategoriesFalseStatusChange
    };
}

module.exports = categoryRepo;
