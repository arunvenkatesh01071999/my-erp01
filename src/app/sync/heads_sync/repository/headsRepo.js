const axios = require('axios');
const cron = require('node-cron');
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { HEADS } = require("../commons/constants");


function headsRepo(fastify) {
    async function postHeadsSyncDetails({ company_id, id, logTrace }) {
        const base_url = process.env.BASE_URL;
        const token = process.env.TOKEN;
        const knex = this;

        // Start a transaction
        const trx = await knex.transaction();

        try {
            // Update sync status to true
            await axios.put(`${base_url}/sync/heads/status/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch heads from API
            const response = await axios.get(`${base_url}/sync/heads/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { data } = response;
            // Fetch existing heads from DB within transaction
            const existingHeads = await trx(HEADS.NAME)
                .select(HEADS.COLUMNS.ID, HEADS.COLUMNS.CATEOGORY_NAME);

            // Map existing heads by ID instead of name
            const existingMap = new Map(existingHeads.map(c => [c.id, c]));

            const inserts = [];
            const updates = [];

            data.forEach(c => {
                const existingHeads = existingMap.get(c.id);

                const headsData = {
                    [HEADS.COLUMNS.ID]: c.id,
                    [HEADS.COLUMNS.CATEOGORY_NAME]: c.cateogory_name.trim(),
                    [HEADS.COLUMNS.IS_ACTIVE]: c.is_active,
                    [HEADS.COLUMNS.COMPANY_ID]: c.company_id,
                    [HEADS.COLUMNS.UPDATED_BY]: id,
                    [HEADS.COLUMNS.UPDATED_AT]: new Date().toISOString()
                };

                if (existingHeads) {
                    // Update existing heads
                    updates.push({ id: c.id, ...headsData });
                } else {
                    // Insert new heads
                    inserts.push({ ...headsData, [HEADS.COLUMNS.IS_INSERTED]: true });
                }
            });

            // Perform bulk updates inside the transaction
            if (updates.length) {
                await Promise.all(
                    updates.map(({ id, ...data }) =>
                        trx(HEADS.NAME).where({ id }).update(data)
                    )
                );
            }

            // Perform bulk insert inside the transaction
            if (inserts.length) {
                await trx(HEADS.NAME).insert(inserts);
            }

            // Commit transaction
            await trx.commit();

            // Update sync status to false after sync
            await axios.put(`${base_url}/sync/heads/false/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Heads sync successful at", new Date().toLocaleTimeString());
            return { success: true };

        } catch (error) {
            await trx.rollback(); // Rollback in case of error
            console.error("Error syncing heads details:", error.message);

            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error syncing heads details",
                property: '',
                code: "INTERNAL_SERVER_ERROR"
            });
        }
    }


    async function getHeadsSync({ logTrace }) {
        const knex = this;
        const query = knex(HEADS.NAME)
            .where(HEADS.COLUMNS.IS_ACTIVE, true)
            .where(HEADS.COLUMNS.IS_INSERTED, true)
            .orderBy(HEADS.COLUMNS.CATEOGORY_NAME, "ASC");

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Heads",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Heads not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }

    async function putHeadsStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(HEADS.NAME)
            .update({
                [HEADS.COLUMNS.IS_INSERTED]: true,
                [HEADS.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update Heads Status",
            logTrace
        });

        await query;
        return { success: true };
    }

    async function putHeadsFalseStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(HEADS.NAME)
            .update({
                [HEADS.COLUMNS.IS_INSERTED]: false,
                [HEADS.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update Heads Status",
            logTrace
        });

        await query;
        return { success: true };
    }


    return {
        postHeadsSyncDetails,
        getHeadsSync,
        putHeadsStatusChange,
        putHeadsFalseStatusChange
    };
}

module.exports = headsRepo;
