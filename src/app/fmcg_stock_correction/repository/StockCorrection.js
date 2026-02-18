const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { STOCKLEDGER, DNE_STOCK_LEDGER, CLOSINGSTOCK } = require("../commons/constants");
const { ITEM } = require("../../catalog/item/commons/constants");

function fmcgPackingPlanningRepo(fastify) {

    async function postStockCorrection({ params, body, userDetails }) {
        const knex = this;
        const { stock_type } = params;
        return knex.transaction(async trx => {
            const now = new Date();

            for (const data of body) {
                // Check for existing entry with same prodid & docdate
                const existing = await trx(CLOSINGSTOCK.NAME)
                    .where({
                        [CLOSINGSTOCK.COLUMNS.PRODID]: data.prodid,
                        [CLOSINGSTOCK.COLUMNS.DOCDATE]: data.docdate
                    })
                    .first();

                if (existing) {
                    throw CustomError.create({
                        httpCode: StatusCodes.CONFLICT,
                        message: `Stock correction already exists for product ID ${data.prodid} on ${data.docdate}`,
                        property: "",
                        code: "ALREADY_EXISTS"
                    });
                }

                // Check max date for this prodid
                const maxDateEntry = await trx(CLOSINGSTOCK.NAME)
                    .where({ [CLOSINGSTOCK.COLUMNS.PRODID]: data.prodid })
                    .max(`${CLOSINGSTOCK.COLUMNS.DOCDATE} as maxDate`)
                    .first();

                if (maxDateEntry?.maxDate && new Date(data.docdate) <= new Date(maxDateEntry.maxDate)) {
                    throw CustomError.create({
                        httpCode: StatusCodes.BAD_REQUEST,
                        message: `New correction date (${data.docdate}) must be after last entry date (${maxDateEntry.maxDate}) for product ID ${data.prodid}`,
                        property: "",
                        code: "INVALID_DATE"
                    });
                }

                // Insert into closing_stock
                const [inserted] = await trx(CLOSINGSTOCK.NAME)
                    .returning(CLOSINGSTOCK.COLUMNS.ID)
                    .insert({
                        [CLOSINGSTOCK.COLUMNS.DOCDATE]: data.docdate,
                        [CLOSINGSTOCK.COLUMNS.PRODID]: data.prodid,
                        [CLOSINGSTOCK.COLUMNS.PHYSICAL_QTY]: data.physical_qty,
                        [CLOSINGSTOCK.COLUMNS.COMPUTER_QTY]: data.computer_qty,
                        [CLOSINGSTOCK.COLUMNS.PURCHASE_RATE]: data.purchase_rate,
                        [CLOSINGSTOCK.COLUMNS.SALES_RATE]: data.sales_rate,
                        [CLOSINGSTOCK.COLUMNS.MRP]: data.mrp,
                        [CLOSINGSTOCK.COLUMNS.COMPANY_ID]: userDetails.company_id,
                        [CLOSINGSTOCK.COLUMNS.CREATED_AT]: now,
                        [CLOSINGSTOCK.COLUMNS.CREATED_BY]: userDetails.id
                    });

                const correctionQty = Number(data.physical_qty) - Number(data.computer_qty);

                if (stock_type == "stock") {
                    // Insert into StockLedger
                    await trx(STOCKLEDGER.NAME).insert({
                        [STOCKLEDGER.COLUMNS.DATE]: data.docdate,
                        [STOCKLEDGER.COLUMNS.PROD_ID]: data.prodid,
                        [STOCKLEDGER.COLUMNS.STK_CORRECT_QTY]: correctionQty,
                        [STOCKLEDGER.COLUMNS.STK_CORRECT_FLAG]: 1,
                        [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                        [STOCKLEDGER.COLUMNS.CREATED_AT]: now,
                        [STOCKLEDGER.COLUMNS.COMPANY_ID]: userDetails.company_id
                    });
                }

                if (stock_type == "dnE") {
                    // Insert into DnEStockLedger
                    await trx(DNE_STOCK_LEDGER.NAME).insert({
                        [DNE_STOCK_LEDGER.COLUMNS.DL_DATE]: data.docdate,
                        [DNE_STOCK_LEDGER.COLUMNS.DL_ITEMS]: data.prodid,
                        [DNE_STOCK_LEDGER.COLUMNS.DL_STK_CORR_QTY]: correctionQty,
                        [DNE_STOCK_LEDGER.COLUMNS.DL_STK_CORR_FLAG]: 1,
                        [DNE_STOCK_LEDGER.COLUMNS.DL_SC_DATE]: data.docdate,
                        [DNE_STOCK_LEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                        [DNE_STOCK_LEDGER.COLUMNS.CREATED_AT]: now
                    });
                }

                // Product Balance Stock Add
                await trx(ITEM.NAME)
                    .where({ [ITEM.COLUMNS.ID]: data.prodid })
                    .increment(ITEM.COLUMNS.BALANCE, correctionQty);

            }

            return { success: true };
        });
    }

    async function getProductBalance({ params, body, logTrace, userDetails, queryparam }) {
        const knex = this;

        const productCodes = body.map(item => item.product_code);

        const items = await knex
            .select([
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.BATCH_ITEM}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE} as purchase_rate`,
                `${ITEM.NAME}.${ITEM.COLUMNS.SALE_RATE} as sale_rate`,
                `${ITEM.NAME}.${ITEM.COLUMNS.MRP} as mrp`,
                `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE}`
            ])
            .from(`${ITEM.NAME}`)
            .whereIn(ITEM.COLUMNS.PRODUCT_CODE, productCodes);

        if (!items.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "No item data found for the provided product codes.",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const resultWithPhysicalQty = items.map(item => {
            const match = body.find(p => p.product_code == item.pro_code);
            console.log(match, "match value")
            return {
                ...item,
                physical_qty: match.physical_qty
            };
        });

        return resultWithPhysicalQty;
    }


    return {
        postStockCorrection,
        getProductBalance
    };
}

module.exports = fmcgPackingPlanningRepo;
