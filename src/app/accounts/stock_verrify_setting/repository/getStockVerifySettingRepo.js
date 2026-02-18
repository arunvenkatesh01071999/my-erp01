const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { StockVerifySetting } = require("../commons/constants");
const { STOCK_VERIFY_SETTING } = require("../../../stock_verify/commons");

function stockVerifySettingRepo(fastify) {
    async function getStockVerifySetting({ body, params, logTrace }) {
        const knex = this;
        const query = knex(STOCK_VERIFY_SETTING.NAME)
        // .where(STOCK_VERIFY_SETTING.COLUMNS.COMPANY_ID, params.company_id);

        logQuery({
            logger: fastify.log,
            query,
            context: "Get StockVerifySetting",
            logTrace
        });

        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "StockVerifySetting data found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response[0];
    }
    async function postStockVerifySetting({ params, body, logTrace, userDetails }) {
        const knex = this;
        const query = knex(STOCK_VERIFY_SETTING.NAME)

        const exists_response = await query;

        if (exists_response.length > 0) {
            const query_update = await knex(`${STOCK_VERIFY_SETTING.NAME}`)
                .update({
                    [STOCK_VERIFY_SETTING.COLUMNS.IS_VERIFY]: body.is_verify,
                });
            const response1 = await query_update;
            if (!response1) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_IMPLEMENTED,
                    message: "Error while creating StockVerifySetting",
                    property: "",
                    code: "NOT_IMPLEMENTED"
                });
            }
            return { success: true };
        } else {
            const query_insert = await knex(`${STOCK_VERIFY_SETTING.NAME}`).insert({
                [STOCK_VERIFY_SETTING.COLUMNS.IS_VERIFY]: body.is_verify,

            });
            const response = await query_insert;

            if (!response) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_IMPLEMENTED,
                    message: "Error while creating StockVerifySetting",
                    property: "",
                    code: "NOT_IMPLEMENTED"
                });
            }
            return { success: true };
        }

    }
    return {
        getStockVerifySetting,
        postStockVerifySetting

    };
}

module.exports = stockVerifySettingRepo;
