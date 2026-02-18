const axios = require('axios');
const cron = require('node-cron');
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { HEADS, TYPEDESIGN } = require("../commons/constants");


function typedesignRepo(fastify) {
    async function postTypeDesignSyncDetails({ company_id, id, logTrace }) {
        const base_url = process.env.BASE_URL;
        const token = process.env.TOKEN;
        const knex = this;

        // Start a transaction
        const trx = await knex.transaction();

        try {
            // Update sync status to true
            await axios.put(`${base_url}/sync/typedesign/status/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch heads from API
            const response = await axios.get(`${base_url}/sync/typedesign/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { data } = response;
            // Fetch existing typedesign from DB within transaction
            const existingTypeDesign = await trx(TYPEDESIGN.NAME)
                .select(TYPEDESIGN.COLUMNS.ID, TYPEDESIGN.COLUMNS.TYPE_NAME);

            // Map existing typedesign by ID instead of name
            const existingMap = new Map(existingTypeDesign.map(c => [c.id, c]));

            const inserts = [];
            const updates = [];

            data.forEach(c => {
                const existingTypeDesign = existingMap.get(c.id);

                const typeDesignData = {
                    [TYPEDESIGN.COLUMNS.ID]: c.id,
                    [TYPEDESIGN.COLUMNS.TYPE_NAME]: c.type_name.trim(),
                    [TYPEDESIGN.COLUMNS.IS_ACTIVE]: c.is_active,
                    [TYPEDESIGN.COLUMNS.COMPANY_ID]: c.company_id,
                    [TYPEDESIGN.COLUMNS.UPDATED_BY]: id,
                    [TYPEDESIGN.COLUMNS.UPDATED_AT]: new Date().toISOString()
                };

                if (existingTypeDesign) {
                    // Update existing typedesign
                    updates.push({ id: c.id, ...typeDesignData });
                } else {
                    // Insert new typedesign
                    inserts.push({ ...typeDesignData, [TYPEDESIGN.COLUMNS.IS_INSERTED]: true });
                }
            });

            // Perform bulk updates inside the transaction
            if (updates.length) {
                await Promise.all(
                    updates.map(({ id, ...data }) =>
                        trx(TYPEDESIGN.NAME).where({ id }).update(data)
                    )
                );
            }

            // Perform bulk insert inside the transaction
            if (inserts.length) {
                await trx(TYPEDESIGN.NAME).insert(inserts);
            }

            // Commit transaction
            await trx.commit();

            // Update sync status to false after sync
            await axios.put(`${base_url}/sync/typedesign/false/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("TypeDesign sync successful at", new Date().toLocaleTimeString());
            return { success: true };

        } catch (error) {
            await trx.rollback(); // Rollback in case of error
            console.error("Error syncing typedesign details:", error.message);

            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error syncing typedesign details",
                property: '',
                code: "INTERNAL_SERVER_ERROR"
            });
        }
    }


    async function getTypeDesignSync({ logTrace }) {
        const knex = this;
        const query = knex(TYPEDESIGN.NAME)
            .where(TYPEDESIGN.COLUMNS.IS_ACTIVE, true)
            .where(TYPEDESIGN.COLUMNS.IS_INSERTED, true)
            .orderBy(TYPEDESIGN.COLUMNS.TYPE_NAME, "ASC");

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Type Design",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Type Design not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }

    async function putTypeDesignStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(TYPEDESIGN.NAME)
            .update({
                [TYPEDESIGN.COLUMNS.IS_INSERTED]: true,
                [TYPEDESIGN.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update TypeDesign Status",
            logTrace
        });

        await query;
        return { success: true };
    }

    async function putTypeDesignFalseStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(TYPEDESIGN.NAME)
            .update({
                [TYPEDESIGN.COLUMNS.IS_INSERTED]: false,
                [TYPEDESIGN.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update Type Design Status",
            logTrace
        });

        await query;
        return { success: true };
    }


    return {
        postTypeDesignSyncDetails,
        getTypeDesignSync,
        putTypeDesignStatusChange,
        putTypeDesignFalseStatusChange
    };
}

module.exports = typedesignRepo;
