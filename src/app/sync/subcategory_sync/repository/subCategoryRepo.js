const axios = require('axios');
const cron = require('node-cron');
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { MAIN_CATEGORY } = require("../commons/constants");
const { SUB_CATEGORY } = require('../../subcategory_sync/commons/constants');

function categoryRepo(fastify) {
    async function postSubCategorySyncDetails({ company_id, logTrace }) {
        const base_url = process.env.BASE_URL;
        const token = process.env.TOKEN;
        const knex = this;

        // Start a transaction
        const trx = await knex.transaction();

        try {
            // Update sync status to true
            await axios.put(`${base_url}/sync/subcategory/status/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch subcategories from API
            const response = await axios.get(`${base_url}/sync/subcategory/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { data } = response;

            // Fetch existing subcategories from DB within transaction
            const existingSubCategories = await trx(SUB_CATEGORY.NAME)
                .select(SUB_CATEGORY.COLUMNS.ID, SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME);

            // Map existing subcategories by ID instead of name
            const existingMap = new Map(existingSubCategories.map(c => [c.id, c]));

            const inserts = [];
            const updates = [];

            data.forEach(c => {
                const existingSubCategory = existingMap.get(c.id);

                const subcategoryData = {
                    [SUB_CATEGORY.COLUMNS.ID]: c.id,
                    [SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME]: c.subcategory_name.trim(),
                    [SUB_CATEGORY.COLUMNS.SUBCATEGORY_IMAGE]: c.subcategory_image || '',
                    [SUB_CATEGORY.COLUMNS.IS_ACTIVE]: c.is_active,
                    [SUB_CATEGORY.COLUMNS.COMPANY_ID]: c.company_id,
                    [SUB_CATEGORY.COLUMNS.CATEGORY_ID]: c.category_id,
                    [SUB_CATEGORY.COLUMNS.UPDATED_AT]: new Date().toISOString()
                };

                if (existingSubCategory) {
                    // Update existing subcategory
                    updates.push({ id: c.id, ...subcategoryData });
                } else {
                    // Insert new subcategory
                    inserts.push({ ...subcategoryData, [SUB_CATEGORY.COLUMNS.IS_INSERTED]: true });
                }
            });

            // Perform bulk updates inside the transaction
            if (updates.length) {
                await Promise.all(
                    updates.map(({ id, ...data }) =>
                        trx(SUB_CATEGORY.NAME).where({ id }).update(data)
                    )
                );
            }

            // Perform bulk insert inside the transaction
            if (inserts.length) {
                await trx(SUB_CATEGORY.NAME).insert(inserts);
            }

            // Commit transaction
            await trx.commit();

            // Update sync status to false after sync
            await axios.put(`${base_url}/sync/subcategory/false/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("SubCategory sync successful at", new Date().toLocaleTimeString());
            return { success: true };

        } catch (error) {
            await trx.rollback(); // Rollback in case of error
            console.error("Error syncing subcategory details:", error.message);

            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error syncing subcategory details",
                property: '',
                code: "INTERNAL_SERVER_ERROR"
            });
        }
    }


    async function getSubCategoriesSync({ logTrace }) {
        const knex = this;
        // Construct the query
        const query = knex(SUB_CATEGORY.NAME)
            .select([
                `${SUB_CATEGORY.NAME}.*`, // Select all subcategory columns
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as category_name` // Alias for category name
            ])
            .leftJoin(
                `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`, // Correct alias for main_category
                `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.CATEGORY_ID}`,
                `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
            )
            .where(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.IS_ACTIVE}`, true)
            .where(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.IS_INSERTED}`, true)
            .orderBy(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`, "ASC");

        logQuery({
            logger: fastify.log,
            query,
            context: "Get SubCategories",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "SubCategories not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }

    async function putSubCategoriesStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(SUB_CATEGORY.NAME)
            .update({
                [SUB_CATEGORY.COLUMNS.IS_INSERTED]: true,
                [SUB_CATEGORY.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update SubCategories Status",
            logTrace
        });

        await query;
        return { success: true };
    }

    async function putSubCategoriesFalseStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(SUB_CATEGORY.NAME)
            .update({
                [SUB_CATEGORY.COLUMNS.IS_INSERTED]: false,
                [SUB_CATEGORY.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update SubCategories Status",
            logTrace
        });

        await query;
        return { success: true };
    }


    return {
        postSubCategorySyncDetails,
        getSubCategoriesSync,
        putSubCategoriesStatusChange,
        putSubCategoriesFalseStatusChange
    };
}

module.exports = categoryRepo;
