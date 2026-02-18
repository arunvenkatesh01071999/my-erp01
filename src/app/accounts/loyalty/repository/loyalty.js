const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { LOYALTY } = require("../commons/constants");

function loyaltyRepo(fastify) {
    async function getLoyalty({ body, params, logTrace }) {
        const knex = this;
        const query = knex(LOYALTY.NAME).where(LOYALTY.COLUMNS.COMPANY_ID, params.company_id);
        logQuery({
            logger: fastify.log,
            query,
            context: "Get Loyalty",
            logTrace
        });

        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Loyalty data found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response[0];
    }
    async function postLoyalty({ params, body, logTrace, userDetails }) {
        const knex = this;
        const created_by = userDetails.id;
        const query = knex(LOYALTY.NAME)
            .where(LOYALTY.COLUMNS.COMPANY_ID, body.company_id);

        const exists_response = await query;

        if (exists_response.length > 0) {
            const query_update = await knex(`${LOYALTY.NAME}`)
                .where(LOYALTY.COLUMNS.COMPANY_ID, body.company_id)
                .update({
                    [LOYALTY.COLUMNS.LOYALTY_AMOUNT]: body.loyalty_amount,
                    [LOYALTY.COLUMNS.LOYALTY_POINTS]: body.loyalty_points,
                    [LOYALTY.COLUMNS.REDEMPTION_AMOUNT]: body.redemption_amount,
                    [LOYALTY.COLUMNS.REDEMPTION_PERCENTAGE]: body.redemption_percentage,
                    [LOYALTY.COLUMNS.UPDATED_AT]: new Date(),
                    [LOYALTY.COLUMNS.UPDATED_BY]: created_by
                });
            const response1 = await query_update;
            if (!response1) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_IMPLEMENTED,
                    message: "Error while creating Loyalty",
                    property: "",
                    code: "NOT_IMPLEMENTED"
                });
            }
            return { success: true };
        } else {
            const query_insert = await knex(`${LOYALTY.NAME}`).insert({
                [LOYALTY.COLUMNS.LOYALTY_AMOUNT]: body.loyalty_amount,
                [LOYALTY.COLUMNS.LOYALTY_POINTS]: body.loyalty_points,
                [LOYALTY.COLUMNS.REDEMPTION_AMOUNT]: body.redemption_amount,
                [LOYALTY.COLUMNS.REDEMPTION_PERCENTAGE]: body.redemption_percentage,
                [LOYALTY.COLUMNS.COMPANY_ID]: body.company_id,
                [LOYALTY.COLUMNS.CREATED_BY]: created_by,
                [LOYALTY.COLUMNS.UPDATED_BY]: created_by
            });
            const response = await query_insert;
            if (!response) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_IMPLEMENTED,
                    message: "Error while creating Loyalty",
                    property: "",
                    code: "NOT_IMPLEMENTED"
                });
            }
            return { success: true };
        }

    }
    return {
        getLoyalty,
        postLoyalty

    };
}

module.exports = loyaltyRepo;
