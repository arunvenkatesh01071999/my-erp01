const { PURCHASE_BATCH_DETAILS } = require("../commons/constants");
const { ITEM } = require("../../catalog/item/commons/constants");
const { UNITS } = require("../../catalog/units/commons/constants");


function fmcgBatchUpdateRepo(fastify) {

    // async function UpdatePurchaseBatchDetails({ params, body, logTrace, userDetails }) {
    //     const knex = this;
    //     return knex.transaction(async trx => {

    //         async function batchInsertData(tableName, data, chunkSize = 50) {
    //             for (let i = 0; i < data.length; i += chunkSize) {
    //                 await trx(tableName).insert(data.slice(i, i + chunkSize));
    //             }
    //         }

    //         const formattedBatchData = body.map(item => ({
    //             [PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: 0,
    //             [PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: item.product_id,
    //             [PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO]: item.batch_no,
    //             [PURCHASE_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE]: item.manufacture_date || null,
    //             [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE]: item.expiry_value || 0,
    //             [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_ID]: item.expiry_type || 1,
    //             [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_DATE]: item.expiry_date || null,
    //             [PURCHASE_BATCH_DETAILS.COLUMNS.COMPANY_ID]: userDetails.company_id,
    //         }));

    //         await batchInsertData(PURCHASE_BATCH_DETAILS.NAME, formattedBatchData);

    //         return { success: true };
    //     });
    // }

    async function UpdatePurchaseBatchDetails({ params, body, logTrace, userDetails }) {
        const knex = this;
        return knex.transaction(async trx => {

            async function batchInsertData(tableName, data, chunkSize = 50) {
                for (let i = 0; i < data.length; i += chunkSize) {
                    await trx(tableName)
                        .insert(data.slice(i, i + chunkSize))
                        .onConflict([
                            PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID,
                            PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID,
                            PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO
                        ])
                        .merge(); // <-- This performs update on conflict
                }
            }

            const formattedBatchData = body.map(item => ({
                [PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: 0,
                [PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: item.product_id,
                [PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO]: item.batch_no,
                [PURCHASE_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE]: item.manufacture_date || null,
                [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE]: item.expiry_value || 0,
                [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_ID]: item.expiry_type || 1,
                [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_DATE]: item.expiry_date || null,
                [PURCHASE_BATCH_DETAILS.COLUMNS.COMPANY_ID]: userDetails.company_id,
            }));

            await batchInsertData(PURCHASE_BATCH_DETAILS.NAME, formattedBatchData);

            return { success: true };
        });
    }


    async function getfmcgProductList({ params, body, logTrace }) {
        const knex = this;

        const query = await knex
            .select([
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`
            ])
            .from(ITEM.NAME)
            .leftJoin(
                UNITS.NAME,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
            )
            .where(ITEM.COLUMNS.TYPE_ID, 1); // Corrected this line

        if (!query.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "No item data found for the provided product codes.",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return query;
    }




    return {
        UpdatePurchaseBatchDetails,
        getfmcgProductList
    };
}

module.exports = fmcgBatchUpdateRepo;