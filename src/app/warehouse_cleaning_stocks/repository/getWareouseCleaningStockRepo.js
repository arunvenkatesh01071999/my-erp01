const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { WAREHOUSE_CLEANING_STOCK_DETAILS, WAREHOUSE_CLEANING_STOCK_MASTER } = require("../../warehouse_cleaning_stocks/commons/constants");


function getWareouseCleaningStockRepo(fastify) {

    async function postWareouseCleaningStockRepo({ params, body, logTrace, userDetails }) {
        const knex = this;
        const trx = await knex.transaction();

        try {
            const warehouseId = body.warehouse_id;
 
            /* ---------- GET NEXT DOC NO ---------- */
            const lastDocno = await trx(WAREHOUSE_CLEANING_STOCK_MASTER.NAME)
                .select(WAREHOUSE_CLEANING_STOCK_MASTER.COLUMNS.DOC_NO)
                .where(WAREHOUSE_CLEANING_STOCK_MASTER.COLUMNS.WAREHOUSE_ID, warehouseId)
                .orderBy(WAREHOUSE_CLEANING_STOCK_MASTER.COLUMNS.ID, "desc")
                  .first();

            const nextDocNo = Number(lastDocno?.doc_no || 0) + 1;

            /* ---------- MASTER INSERT ---------- */
            const [masterRow] = await trx(WAREHOUSE_CLEANING_STOCK_MASTER.NAME)
                .insert({
                    [WAREHOUSE_CLEANING_STOCK_MASTER.COLUMNS.DOC_NO]: nextDocNo,
                    [WAREHOUSE_CLEANING_STOCK_MASTER.COLUMNS.DOC_DATE]: new Date(),
                    [WAREHOUSE_CLEANING_STOCK_MASTER.COLUMNS.WAREHOUSE_ID]: warehouseId,
                    [WAREHOUSE_CLEANING_STOCK_MASTER.COLUMNS.TOTAL_CLEANED_STOCK]: body.total_cleaned_stock,
                    [WAREHOUSE_CLEANING_STOCK_MASTER.COLUMNS.CREATED_BY]: userDetails?.id
                })
                .returning(WAREHOUSE_CLEANING_STOCK_MASTER.COLUMNS.ID);

                const masterId = masterRow.id;

            /* ---------- DETAILS BULK INSERT ---------- */
            if (
                Array.isArray(body.warehouse_cleaning_stock_details) &&
                body.warehouse_cleaning_stock_details.length
            ) {
                const detailRows = body.warehouse_cleaning_stock_details.map(d => ({
                    [WAREHOUSE_CLEANING_STOCK_DETAILS.COLUMNS.WC_MST_ID]: masterId,
                    [WAREHOUSE_CLEANING_STOCK_DETAILS.COLUMNS.WAREHOUSE_ID]: warehouseId,
                    [WAREHOUSE_CLEANING_STOCK_DETAILS.COLUMNS.PRODUCT_ID]: d.product_id,
                    [WAREHOUSE_CLEANING_STOCK_DETAILS.COLUMNS.PRODUCT_CODE]: d.product_code,
                    [WAREHOUSE_CLEANING_STOCK_DETAILS.COLUMNS.TOTAL_STOCK]: d.total_stock,
                    [WAREHOUSE_CLEANING_STOCK_DETAILS.COLUMNS.PICKED_CLEANING_STOCK]: d.picked_cleaning_stock,
                    [WAREHOUSE_CLEANING_STOCK_DETAILS.COLUMNS.WASTAGE_STOCK]: d.wastage_stock,
                    [WAREHOUSE_CLEANING_STOCK_DETAILS.COLUMNS.CLEANING_STOCK]: d.cleaning_stock,
                    [WAREHOUSE_CLEANING_STOCK_DETAILS.COLUMNS.CREATED_BY]: userDetails?.id,
                    [WAREHOUSE_CLEANING_STOCK_DETAILS.COLUMNS.CREATED_AT]: new Date()
                }));

                    await trx(WAREHOUSE_CLEANING_STOCK_DETAILS.NAME).insert(detailRows);
            }

            await trx.commit();

            return {
                success: true,
                message: "Warehouse cleaning stock saved successfully",
                docNo: nextDocNo,
                masterId
            };

        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }


    return {
        postWareouseCleaningStockRepo
    };
}
module.exports = getWareouseCleaningStockRepo

