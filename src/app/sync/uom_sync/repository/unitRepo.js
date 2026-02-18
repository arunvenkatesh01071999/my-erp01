const axios = require('axios');
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { UNITS } = require("../commons/constants");


function unitsRepo(fastify) {
    async function postUnitSyncDetails({ company_id, id, logTrace }) {
        const base_url = process.env.BASE_URL;
        const token = process.env.TOKEN;
        const knex = this;

        // Start a transaction
        const trx = await knex.transaction();

        try {
            // Update sync status to true
            await axios.put(`${base_url}/sync/units/status/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch heads from API
            const response = await axios.get(`${base_url}/sync/units/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { data } = response;
            // Fetch existing units from DB within transaction
            const existingUnits = await trx(UNITS.NAME)
                .select(UNITS.COLUMNS.ID, UNITS.COLUMNS.UNITS_SHORT_NAME, UNITS.COLUMNS.UNITS_LONG_NAME);

            // Map existing units by ID instead of name
            const existingMap = new Map(existingUnits.map(c => [c.id, c]));

            const inserts = [];
            const updates = [];

            data.forEach(c => {
                const existingUnits = existingMap.get(c.id);

                const unitsData = {
                    [UNITS.COLUMNS.ID]: c.id,
                    [UNITS.COLUMNS.UNITS_SHORT_NAME]: c.units_short_name.trim(),
                    [UNITS.COLUMNS.UNITS_LONG_NAME]: c.units_long_name.trim(),
                    [UNITS.COLUMNS.IS_ACTIVE]: c.is_active,
                    [UNITS.COLUMNS.COMPANY_ID]: c.company_id,
                    [UNITS.COLUMNS.UPDATED_AT]: new Date().toISOString()
                };

                if (existingUnits) {
                    // Update existing units
                    updates.push({ id: c.id, ...unitsData });
                } else {
                    // Insert new units
                    inserts.push({ ...unitsData, [UNITS.COLUMNS.IS_INSERTED]: true });
                }
            });

            // Perform bulk updates inside the transaction
            if (updates.length) {
                await Promise.all(
                    updates.map(({ id, ...data }) =>
                        trx(UNITS.NAME).where({ id }).update(data)
                    )
                );
            }

            // Perform bulk insert inside the transaction
            if (inserts.length) {
                await trx(UNITS.NAME).insert(inserts);
            }

            // Commit transaction
            await trx.commit();

            // Update sync status to false after sync
            await axios.put(`${base_url}/sync/units/false/change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Units sync successful at", new Date().toLocaleTimeString());
            return { success: true };

        } catch (error) {
            await trx.rollback(); // Rollback in case of error
            console.error("Error syncing units details:", error.message);

            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error syncing units details",
                property: '',
                code: "INTERNAL_SERVER_ERROR"
            });
        }
    }


    async function getUnitsSync({ logTrace }) {
        const knex = this;
        const query = knex(UNITS.NAME)
            .where(UNITS.COLUMNS.IS_ACTIVE, true)
            .where(UNITS.COLUMNS.IS_INSERTED, true)
            .orderBy(UNITS.COLUMNS.UNITS_SHORT_NAME, "ASC");

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Units",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Units not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }

    async function putUnitStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(UNITS.NAME)
            .update({
                [UNITS.COLUMNS.IS_INSERTED]: true,
                [UNITS.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update units Status",
            logTrace
        });

        await query;
        return { success: true };
    }

    async function putUnitsFalseStatusChange({ logTrace }) {
        const knex = this;
        const query = knex(UNITS.NAME)
            .update({
                [UNITS.COLUMNS.IS_INSERTED]: false,
                [UNITS.COLUMNS.UPDATED_AT]: new Date().toISOString()
            });

        logQuery({
            logger: fastify.log,
            query,
            context: "Update Type Units",
            logTrace
        });

        await query;
        return { success: true };
    }


    return {
        postUnitSyncDetails,
        getUnitsSync,
        putUnitStatusChange,
        putUnitsFalseStatusChange
    };
}

module.exports = unitsRepo;
