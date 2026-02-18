const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const {
    OUTLET_PURCHASE_MASTER,
    OUTLET_PURCHASE_DETAILS,
    OUTLET_PURCHASE_BATCH_DETAILS,
    OUTLET_PURCHASE_GRN_FREE_ITEM_DETAILS,
    OUTLET_PARTY_LEDGER,
    OUTLET_PURCHASE_RETURN_MASTER,
    OUTLET_PURCHASE_RETURN_DETAILS,
    OUTLET_DEBIT_NOTE_MASTER,
    OUTLET_DEBIT_NOTE_DETAILS,
    SETTING
} = require("../commons/constants")
const { OUTLET_PURCHASE_MEMO_MASTER, OUTLET_PURCHASE_MEMO_DETAILS, OUTLET_PURCHASE_MEMO_BATCH_DETAILS } = require("../../outlet_memo/commons/constants")
const { OUTLETS } = require("../../accounts/outlets/commons/constants");
const { SUPPLIER } = require("../../catalog/item/commons/constants")
const { STATES, CITIES, COUNTRIES } = require("../../masterData/commons/constants");
const { OUTLET_STOCK_LEDGER } = require("../../dashboard/outlet_sales/commons/constants")
const { OUTLET_PRODUCT_MAPPING, ITEM, TYPEDESIGN } = require("../../catalog/commons")
const { UNITS } = require("../../catalog/units/commons/constants");
const _ = require('lodash');
const { OUTLET_PO_MASTER, OUTLET_PO_DETAILS } = require("../../outlet_po/Outlet_po_manual/commons/constants");
const { SUPPLIER_OUTLET_MAPPING } = require("../../catalog/supplier/commons/constants");
const { REGION } = require("../../catalog/warehouse/commons/constants");



function OutletRepo(fastify) {

    async function generateOutletPurchaseDocnoRepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;

        const { company_id, outlet_id } = params;
        const query = knex(OUTLET_PURCHASE_MASTER.NAME)
            .returning("id")
            .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.FINANCIAL_YEAR}`, financialYear)
            .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.COMPANY_ID}`, company_id)
            .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`, outlet_id)
            .orderBy(OUTLET_PURCHASE_MASTER.COLUMNS.ID, 'desc')
            .limit(1);
        logQuery({
            logger: fastify.log,
            query,
            context: "Get Outlet Purchase Order Master",
            logTrace
        });
        const response = await query;
        if (response.length === 0) {
            return { Docno: "1" };
        }
        const docno = Number(response[0].docno);
        const Docno = `${docno + 1}`;
        return { Docno };
    }

    async function getOutletPurchaseSupplierListRepo({ params, logTrace }) {
        const knex = this;
        const { outlet_id } = params;

        const query = knex
            .distinct([
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as add3`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as add4`,
                `${STATES.NAME}.${STATES.COLUMNS.NAME} as supplier_state_name`,
                `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as supplier_city_name`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as supplier_country_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE} as supplier_balance`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN} as supplier_gstin`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE} as supplier_mobile_no`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO} as supplier_bank_ac_no`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE} as gst_type`,

            ])
            .from(`${OUTLET_PURCHASE_MASTER.NAME} as ${OUTLET_PURCHASE_MASTER.NAME}`)
            .innerJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .innerJoin(
                `${STATES.NAME} as ${STATES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
                `${STATES.NAME}.${STATES.COLUMNS.ID}`
            )
            .innerJoin(
                `${CITIES.NAME} as ${CITIES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
                `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
            )
            .innerJoin(
                `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
                `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
            )
            .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`, Number(outlet_id))
            .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE}`, Boolean(true))
            .orderBy(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`, "desc");

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Outlet Grn Suppliers list",
            logTrace
        });

        const response = await query;

        if (!response || response.length == 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `get outlet grn suppliers list`,
                property: "",
                code: "NOT_FOUND"
            });
        }

        return response;
    }

    async function getOutletPurchasePoListRepo({ params, logTrace }) {
        const knex = this;
        const { outlet_id, supplier_id } = params;

        const query = knex
            .select([
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PONO} as pono`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PODATE} as podate`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO} as memo_no`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCDATE} as memo_date`,
            ])
            .from(`${OUTLET_PURCHASE_MASTER.NAME} as ${OUTLET_PURCHASE_MASTER.NAME}`)
            .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`, Number(outlet_id))
            .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID}`, Number(supplier_id))
            // .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.IS_GRN_COMPLETE}`, false)
            .orderBy(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ID}`, "asc");

        logQuery({
            logger: fastify.log,
            query,
            context: "Get grn purchase order number list",
            logTrace
        });

        const response = await query;

        if (response.length == 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Grn supplier purchase order number not found `,
                property: "",
                code: "NOT_FOUND"
            });
        }

        return response;
    }

    async function getOutletPurchaseItemListRepo({ body }) {
        const knex = this;



        //-----------------------------------------
        // STEP 1: Validate all memo_no belong to same PO
        //-----------------------------------------
        const memoNos = body.map(x => x.memo_no);

        const memoPoRows = await knex(OUTLET_PURCHASE_MASTER.NAME)
            .select("*")
            .whereIn("id", memoNos);

        if (memoPoRows.length !== memoNos.length) {
            throw CustomError.create({
                httpCode: 400,
                message: "Invalid memo numbers provided"
            });
        }

        const uniquePO = [...new Set(memoPoRows.map(x =>
            x[OUTLET_PURCHASE_MASTER.COLUMNS.PONO]
        ))];

        if (uniquePO.length > 1) {
            throw CustomError.create({
                httpCode: 400,
                message: "All memo numbers must belong to the same PO"
            });
        }

        const finalPO = uniquePO[0];

        //-----------------------------------------
        // STEP 2: Fetch and Group Memo-wise
        //-----------------------------------------

        const responseItems = [];

        for (const memo of body) {
            console.log(memo, "memo");


            //-----------------------------------------
            // GET master memo info
            //-----------------------------------------
            const master = await knex(`${OUTLET_PURCHASE_MASTER.NAME} as ${OUTLET_PURCHASE_MASTER.NAME}`)
                .select([
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO} as memo_no`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ID}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.GRAND_TOTAL_AMT}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.SUB_TOTAL_AMT}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_NO}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_DATE}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_ORDER_QTY}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_RECEIVED_QTY}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.REMARK}`,
                    // `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.RETURN_AMOUNT}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.RETURN_REMARK}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DISCOUNT}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OTHER_CHARGES}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_GST_AMT}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_IGST_AMT}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ADVANCE}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_CESS_AMT}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PRODUCT_TYPE}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TCS}`,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ROFF}`
                ])
                .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO}`, memo.memo_no)
                .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PONO}`, memo.pono)
                .first();

            //-----------------------------------------
            // GET memo items
            //-----------------------------------------
            const items = await knex(`${OUTLET_PURCHASE_DETAILS.NAME} as ${OUTLET_PURCHASE_DETAILS.NAME}`)
                .select([
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID} as product_id`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_CODE} as product_code`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.BARCODE}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.HSN_CODE}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.DISCOUNT}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.DISCOUNT_AMOUNT}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE_RATE}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.AMOUNT}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.ACCEPTED_MARGIN}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.SALE_RATE}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.GST}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.GST_AMOUNT}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.IGST}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.IGST_AMOUNT}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.CGST}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.SGST}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.CESS}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.CESS_AMOUNT}`,
                    // `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.ORDER_QTY} as order_qty`,
                    // `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.RECIVED_QTY} as recived_qty`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.MRP}`,
                    `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MRP} as po_mrp`,
                    `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.UOM_ID}`,
                    `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                    `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as pro_name`,
                    `${ITEM.NAME}.${ITEM.COLUMNS.MARGIN}`,
                    `${ITEM.NAME}.${ITEM.COLUMNS.SALES_MARGIN}`
                ])
                .join(ITEM.NAME,
                    `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PROD_ID}`)
                .join(UNITS.NAME,
                    `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.UOM_ID}`)
                .join(OUTLET_PO_DETAILS.NAME,
                    `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID}`)
                .where(`${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.DOCNO}`, memo.memo_no)
                .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, memo.pono);


            //-----------------------------------------
            // GET batch rows
            //-----------------------------------------
            const batchRows = await knex(OUTLET_PURCHASE_BATCH_DETAILS.NAME)
                .where(OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.OUTLET_PURCHASE_MASTER_ID, Number(master?.id));

            //-----------------------------------------
            // MERGE BATCH DETAILS
            //-----------------------------------------
            const mergedItems = items.map(item => {
                const relatedBatches = batchRows.filter(
                    b => b.product_id == item.product_id && b.mrp == item.mrp
                );

                return {
                    ...item,
                    batch_details: relatedBatches.map(b => ({
                        batch_no: b.batch_no,
                        mrp: b.mrp,
                        qty: b.qty,
                        expiry_date: b.expiry_date,
                        manufacture_date: b.manufacture_date
                    }))
                };
            });

            //-----------------------------------------
            // PUSH MEMO-WISE GROUPED RESULT
            //-----------------------------------------
            responseItems.push({
                memo_no: master?.memo_no || 0,
                grand_total_amt: master?.grand_total_amt || 0,
                sub_total_amt: master?.sub_total_amt || 0,
                invoice_no: master?.invoice_no || 0,
                invoice_date: master?.invoice_date || 0,
                total_order_qty: master?.total_order_qty || 0,
                total_received_qty: master?.total_received_qty || 0,
                remark: master?.remark || 0,
                return_mount: master?.return_amount || 0,
                retrun_remark: master?.return_remark || 0,
                discount: master?.discount || 0,
                roff: master?.roff || 0,
                other_charges: master?.other_charges || 0,
                total_gst_amt: master?.total_gst_amt || 0,
                total_igst_amt: master?.total_igst_amt || 0,
                total_cess_amt: master?.total_cess_amt || 0,
                advance: master?.advance || 0,
                tcs: master?.tcs || 0,
                items: mergedItems
            });
        }

        //-----------------------------------------
        // FINAL RETURN (MEMO-WISE LIST)
        //-----------------------------------------
        return responseItems;
    }

    async function postOutletPurchaseRepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;
        const trx = await knex.transaction();

        try {
            // Step 1: get Supplier Details
            const supplierDetails = await knex(SUPPLIER.NAME)
                .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
                .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
                .first()

            const { gst_type } = supplierDetails;

            const outletSupplierDetails = await knex(SUPPLIER_OUTLET_MAPPING.NAME)
                .select(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.TDS_BALANCE}`)
                .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, body.supplier_id)
                .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
                .first()

            const { tds_balance } = outletSupplierDetails;

            let tdsPercentage = 0;
            const outletSettingDetails = await knex(SETTING.NAME)
                .select(
                    `${SETTING.NAME}.${SETTING.COLUMNS.ST_TCS_TURN_OVER}`,
                    `${SETTING.NAME}.${SETTING.COLUMNS.ST_TCS_PER}`
                )
                .first()

            const { st_tcs_turn_over, st_tcs_per } = outletSettingDetails;

            if (Number(tds_balance) > Number(st_tcs_turn_over)) {
                tdsPercentage = st_tcs_per;
            }

            // Step 2: Insert into `PURCHASE_MST` (Purchase Master)
            const [purchaseResponse] = await trx(`${OUTLET_PURCHASE_MASTER.NAME}`)
                .returning("id")
                .insert({
                    [OUTLET_PURCHASE_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.DOCDATE]: new Date(),
                    [OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_DATE]: body.invoice_date || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.CUSTOMER_TYPE]: Number(gst_type) || 1,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PONO]: body.pono || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PODATE]: body.podate || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.MEMO_NO]: body.memo_no || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.MEMO_DATE]: body.memo_date || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_DEBIT_NOTE_AMOUNT]: body.total_debit_note_amount || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.STATUS]: 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.MEMO_INVOICE_AMT]: body.memo_invoice_amt || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_ITEMS]: body.total_items,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.ROFF]: body.roff,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.FRIGHT_CHARGES]: body.fright_charges || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.OTHER_CHARGES]: body.other_charges || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.ADVANCE]: body.advance || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.TCS]: body.tcs || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PRODUCT_TYPE]: 1,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.REMARK]: body.remark || " ",
                    [OUTLET_PURCHASE_MASTER.COLUMNS.RETURN_REMARK]: 1,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE]: body.purchase || false,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.WAREHOUSE_ID]: body.wh_id || 1,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.CREATED_AT]: new Date(),
                    [OUTLET_PURCHASE_MASTER.COLUMNS.CREATED_BY]: userDetails.id
                });

            const purchase_id = purchaseResponse.id;
            const docno = `${purchase_id}`;

            // Step 3: Update `PURCHASE_MST` to add the generated document number
            await trx(`${OUTLET_PURCHASE_MASTER.NAME}`)
                .where(`${OUTLET_PURCHASE_MASTER.COLUMNS.ID}`, purchase_id)
                .update({ [OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO]: docno });

            let subTotalAmount = 0;
            let totalGstAmount = 0;
            let totalIgstAmount = 0;
            let totalCessAmount = 0;
            let totalReturnAmount = 0;
            let totalDiscountAmount = Number(body.discount) || 0;
            let grandTotalAmount = 0;
            let tdsAmount = 0;
            let totalOrderQty = 0;
            let totalReceivedQty = 0;
            let totalReturnQty = 0;
            // Step 4: Insert Outlet Purchase Grn Details
            if (Array.isArray(body.outlet_purchase_details) && body.outlet_purchase_details.length > 0) {
                const allPurchaseDetailsData = [];
                for (const element of body.outlet_purchase_details) {
                    const product_id = Number(element.product_id) || 0;
                    const product_code = String(element.product_code) || 0;
                    const po_no = String(body.pono); // 🔑 important
                    const supplierId = Number(body.supplier_id) || 0;
                    const outletId = Number(body.outlet_id) || 0;

                    const productDetails = await trx(`${OUTLET_PURCHASE_MEMO_DETAILS.NAME}`)
                        .select([
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.UOM_ID}`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CAT_ID} AS category_id`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SUB_CAT_ID} AS sub_category_id`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.HEAD_ID} AS brand_id`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.TYPE_DESIGN_ID} AS brand_company_id`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.BARCODE}`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PURCHASE_RATE} AS pur_rate`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.HSN_CODE} AS hsn`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SALE_RATE} AS sale_rate`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.ACCEPTED_MARGIN}`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.DISCOUNT}`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CESS}`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.GST}`,
                            `${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.TYPE_ID}`
                        ])
                        .where(OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PO_NO, po_no)
                        .andWhere(OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PROD_ID, product_id)
                        .andWhere(OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_ID, outletId)
                        .andWhere(OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SUPPLIER_ID, supplierId)
                        .first();


                    if (!productDetails) {
                        throw CustomError.create({
                            httpCode: StatusCodes.NOT_FOUND,
                            message: `No product mapping found for product_id ${element.product_id}`,
                            property: "",
                            code: "NOT_FOUND"
                        });
                    }

                    const mrp = Number(element.mrp) || 0;
                    const purchaseRate = Number(element.purchase_rate) || 0;
                    const orderQty = Number(element.orderQty) || 0;
                    const receivedQty = Number(element.qty) || 0;
                    const returnQty = Number(element.return_qty) || 0;
                    const freeQty = Number(element.free_qty) || 0;
                    const gst = Number(element.gst) || 0;
                    const cess = Number(element.cess) || 0;


                    // ---- CORRECT CALCULATIONS ----
                    const amount = purchaseRate * receivedQty;

                    const gstAmount = Number(gst_type) === 1
                        ? amount * gst / 100
                        : 0;

                    const igstAmount = Number(gst_type) === 2
                        ? amount * gst / 100
                        : 0;

                    const cessAmount = amount * cess / 100;


                    const returnAmount = purchaseRate * returnQty;

                    // ---- TOTALS ----
                    subTotalAmount += amount;
                    totalGstAmount += gstAmount;
                    totalIgstAmount += igstAmount;
                    totalCessAmount += cessAmount;
                    totalReturnAmount += returnAmount;
                    totalOrderQty += orderQty;
                    totalReceivedQty += receivedQty;
                    totalReturnQty += returnQty;

                    allPurchaseDetailsData.push({
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID]: purchase_id,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.DOCNO]: docno,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.DOCDATE]: new Date(),
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.PO_NO]: po_no,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.COMPANY_ID]: body.company_id || 1,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SUPPLIER_ID]: supplierId,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_ID]: outletId,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID]: product_id,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_CODE]: product_code || '',
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.HSN_CODE]: element.hsn,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SUB_CATEGORY_ID]: productDetails.sub_category_id || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CATEGORY_ID]: productDetails.category_id || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.HEAD_ID]: productDetails.brand_id || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.TYPE_DESIGN_ID]: productDetails.brand_company_id || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.UOM_ID]: productDetails.uom_id || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.BARCODE]: productDetails.barcode || '',

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.QTY]: receivedQty || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_QTY]: returnQty,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.FREE_QTY]: freeQty,


                        [OUTLET_PURCHASE_DETAILS.COLUMNS.TEMP_RECEIVED_QTY]: receivedQty,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.TEMP_GRN_RETURN_QTY]: returnQty,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.MRP]: mrp,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SALE_RATE]: mrp,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE_RATE]: purchaseRate,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.ACCEPTED_MARGIN]: Number(productDetails.accepted_margin) || 0,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.AMOUNT]: amount,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_AMOUNT]: returnAmount,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.DISCOUNT]: 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.DISCOUNT_AMOUNT]: 0,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.GST]: Number(body.gst_type) === 1 ? gst : 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.GST_AMOUNT]: gstAmount,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CGST]: Number(body.gst_type) === 1 ? gst / 2 : 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SGST]: Number(body.gst_type) === 1 ? gst / 2 : 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.IGST]: Number(body.gst_type) === 2 ? gst : 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.IGST_AMOUNT]: igstAmount,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CESS]: cess,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SELF_LIFE_EXPIRY_DAYS]: Number(element.self_life_qty) || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE]: body.purchase || false,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CREATED_AT]: new Date()
                    });
                };

                tdsAmount = (subTotalAmount * tdsPercentage) / 100;

                const totalBeforeRoundOff =
                    subTotalAmount +
                    totalGstAmount +
                    totalIgstAmount +
                    totalReturnAmount +
                    totalCessAmount -
                    totalDiscountAmount -
                    tdsAmount;

                const roundedTotal = Math.round(totalBeforeRoundOff);
                const roundOff = Number((roundedTotal - totalBeforeRoundOff).toFixed(2));

                const grandTotalAmount = roundedTotal;

                await trx(OUTLET_PURCHASE_MASTER.NAME)
                    .where(OUTLET_PURCHASE_MASTER.COLUMNS.ID, purchase_id)
                    .update({
                        [OUTLET_PURCHASE_MASTER.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmount,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TDS_PERCENTAGE]: tdsPercentage,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_TDS_AMOUNT]: tdsAmount,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.ROFF]: roundOff,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotalAmount,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_RETURN_AMT]: totalReturnAmount,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? Number(totalGstAmount) : 0,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? Number(totalIgstAmount) : 0,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_CESS_AMT]: totalCessAmount || 0,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.DISCOUNT]: totalDiscountAmount,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_ORDER_QTY]: totalOrderQty || 0,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_RECEIVED_QTY]: totalReceivedQty || 0,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_RETURN_QTY]: totalReturnQty || 0
                    });

                if (allPurchaseDetailsData.length > 0) {
                    await trx.batchInsert(OUTLET_PURCHASE_DETAILS.NAME, allPurchaseDetailsData, 1000);
                }
            }

            /* Step 5: Update Outlet Purchase Batch Details */
            if (Array.isArray(body.outlet_purchase_details)) {

                const purchaseGrnChunks = _.chunk(body.outlet_purchase_details, 500);

                for (const grnChunk of purchaseGrnChunks) {

                    for (const element of grnChunk) {

                        if (!Array.isArray(element.outlet_purchase_batch_details)) continue;

                        const batchDetailsData = [];

                        for (const element1 of element.outlet_purchase_batch_details) {

                            // ----------- CHECK IF BATCH ALREADY EXISTS ----------
                            const existingBatchDetails = await trx(OUTLET_PURCHASE_MEMO_BATCH_DETAILS.NAME)
                                .where({
                                    [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                                    [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.BATCH_NO]: String(element1.batch_no)
                                })
                                .first();

                            // ----------- INSERT DATA (NO existingBatchDetails) ----------
                            batchDetailsData.push({
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.OUTLET_PURCHASE_MASTER_ID]: purchase_id,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_CODE]: String(element.product_code),
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO]: String(element1.batch_no),
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.QTY]: Number(element1.qty) || 0,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.MRP]: Number(element1.mrp) || 0,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.SELF_LIFE_EXPIRY_DAYS]: Number(element1.self_life_qty) || 0,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.RETURN_QTY]: Number(element1.return_qty) || 0,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.COMPANY_ID]: body.company_id || 1,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE]: existingBatchDetails.manufacture_date || '',
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_ID]: existingBatchDetails.expiry_id || 0,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE]: existingBatchDetails.expiry_value || 0,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_DATE]: existingBatchDetails.expiry_date || '',
                            });
                        }

                        // ----------- INSERT IN CHUNKS -----------
                        if (batchDetailsData.length > 0) {
                            await trx.batchInsert(
                                OUTLET_PURCHASE_BATCH_DETAILS.NAME,
                                batchDetailsData,
                                500
                            );
                        }
                    }
                }
            }

            // Step 6: Update Outlet Purchase Item Stock
            if (_.isArray(body.outlet_purchase_details)) {
                await Promise.all(
                    _.map(body.outlet_purchase_details, async (element) => {
                        const receivedQty = parseFloat(element.qty) || 0;
                        const freeQty = parseFloat(element.free_qty) || 0;
                        const mrp = parseFloat(element.mrp) || 0;
                        const purchase_rate = parseFloat(element.purchase_rate) || 0;
                        const gst = parseFloat(element.gst) || 0;
                        const cess = parseFloat(element.cess) || 0;
                        const hsn = parseFloat(element.hsn) || 0;
                        const sale_rate = parseFloat(element.sale_rate) || 0;
                        const accepted_margin = parseFloat(element.accepted_margin) || 0;
                        const totalReturnQty = parseFloat(element.return_qty) || 0;
                        const totalQty = receivedQty + freeQty;
                        const updateData = {
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: trx.raw(
                                `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} + ? - ?`,
                                [totalQty, totalReturnQty]
                            ),
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.MRP]: mrp,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_RATE]: purchase_rate,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.GST]: gst,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.CESS]: cess,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.HSN]: hsn,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE]: sale_rate,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_MARGIN]: accepted_margin
                        };
                        await trx(OUTLET_PRODUCT_MAPPING.NAME)
                            .where(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID, element.product_id)
                            .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
                            .update(updateData)
                    })
                );
            }

            // Step 7: Insert or Update Stock Ledger
            if (Array.isArray(body.outlet_purchase_details)) {
                await Promise.all(body.outlet_purchase_details.map(async (element) => {
                    const receivedQty = parseFloat(element.qty) || 0;
                    const freeQty = parseFloat(element.free_qty) || 0;
                    const returnQty = parseFloat(element.return_qty) || 0;
                    const totalQty = receivedQty + freeQty + returnQty;

                    // Check if stock already exists for the product and date
                    const existingStock = await trx(OUTLET_STOCK_LEDGER.NAME)
                        .where({
                            [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.product_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: new Date()
                        })
                        .first();

                    if (existingStock) {
                        console.log(existingStock, "existing stock")

                        const grnDetails = await knex(OUTLET_PURCHASE_DETAILS.NAME)
                            .select(
                                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.QTY}`,
                                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_QTY}`)
                            .where(OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID, purchase_id)
                            .where(OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID, element.product_id)
                            .first()

                        const tempGrnQty = parseFloat(grnDetails?.qty) || 0;
                        const tempGrnReturnQty = parseFloat(grnDetails?.return_qty) || 0;
                        // If stock exists, update the purchase quantity
                        await trx(OUTLET_STOCK_LEDGER.NAME)
                            .where({
                                [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.product_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: new Date()
                            })
                            .update({
                                [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_QTY]: trx.raw(
                                    `${OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_QTY} + ? `,
                                    [tempGrnQty]
                                ),

                                [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY]: trx.raw(
                                    `${OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY} + ? `,
                                    [tempGrnReturnQty]
                                ),
                                [OUTLET_STOCK_LEDGER.COLUMNS.UPDATED_AT]: new Date(),
                                [OUTLET_STOCK_LEDGER.COLUMNS.UPDATED_BY]: userDetails.id
                            });

                    } else {
                        console.log("new stock");

                        // If stock does not exist, insert a new record
                        await trx(OUTLET_STOCK_LEDGER.NAME).insert({
                            [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: new Date(),
                            [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.product_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_QTY]: totalQty,
                            [OUTLET_STOCK_LEDGER.COLUMNS.WH_ID]: body.wh_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY]: returnQty,
                            [OUTLET_STOCK_LEDGER.COLUMNS.COMPANY_ID]: body.company_id || 1,
                            [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_AT]: new Date() // Ensure date is valid
                        });
                    }
                }));
            }

            // Step 8: Update Supplier Balance
            const supplier = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
                .select(
                    SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE,
                    SUPPLIER_OUTLET_MAPPING.COLUMNS.TDS_BALANCE
                )
                .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, body.supplier_id)
                .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
                .first();

            console.log("Fetched Supplier Balance:", supplier);

            const returnTotalAmount = body.return_amount > 0 ? body.return_amount : 0;
            const currentBalance = parseFloat(supplier?.balance || 0);
            const currentTdsBalance = parseFloat(supplier?.tds_balance || 0);
            const newBalance = currentBalance + grandTotalAmount - returnTotalAmount;
            const newTdsBalance = currentTdsBalance + subTotalAmount;

            console.log("Current Balance:", currentBalance);
            console.log("Grand Total Amount:", grandTotalAmount);
            console.log("Return Total Amount:", returnTotalAmount);
            console.log("New Balance:", newBalance);

            console.log("current Tds Balance:", currentTdsBalance);
            console.log("New TDS Balance:", newTdsBalance);

            if (!isNaN(newBalance)) {
                await trx(SUPPLIER_OUTLET_MAPPING.NAME)
                    .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, body.supplier_id)
                    .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
                    .update({
                        [SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE]: newBalance,
                        [SUPPLIER_OUTLET_MAPPING.COLUMNS.TDS_BALANCE]: newTdsBalance
                    });

                console.log("Supplier balance updated successfully");
            }

            // Step 9: Update GRN NO Stock
            if (body.invoice_no && body.supplier_id && body.pono) {
                await trx(OUTLET_PURCHASE_MASTER.NAME)
                    .where(OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_NO, body.invoice_no)
                    .where(OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID, body.supplier_id)
                    .where(OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID, body.outlet_id)
                    .where(OUTLET_PURCHASE_MASTER.COLUMNS.PONO, body.pono)
                    .update({
                        [OUTLET_PURCHASE_MASTER.COLUMNS.STATUS]: purchase_id,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE]: true
                    });
            }

            // Step 10: Insert Party Ledger
            // If stock does not exist, insert a new record
            await trx(OUTLET_PARTY_LEDGER.NAME).insert({
                [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: purchase_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "E",
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
                [OUTLET_PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
                [OUTLET_PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
                [OUTLET_PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: 0,
                [OUTLET_PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: grandTotalAmount,
                [OUTLET_PARTY_LEDGER.COLUMNS.REMARKS]: `Outlet Purchase No (${docno})`,
                [OUTLET_PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'S',
                [OUTLET_PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
                [OUTLET_PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
            });


            // Step 11: Mark Purchase Order Memo as Expired (if applicable)
            const existingPO = await trx(OUTLET_PURCHASE_MEMO_MASTER.NAME)
                .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO, body.pono)
                .first();

            if (existingPO) {
                await trx(`${OUTLET_PURCHASE_MEMO_MASTER.NAME} `)
                    .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO, body.pono)
                    .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID, body.outlet_id)
                    .update({
                        [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IS_GRN_COMPLETE]: true,
                        [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.GRN_NO]: purchase_id
                    });
                await trx(`${OUTLET_PURCHASE_MEMO_DETAILS.NAME} `)
                    .where(OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PO_NO, body.pono)
                    .where(OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_ID, body.outlet_id)
                    .update({
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.IS_GRN_COMPLETE]: true,
                        [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.RECEIVED_GRN_QTY]: body.total_received_qty
                    });

                await trx(`${OUTLET_PO_MASTER.NAME} `)
                    .where(OUTLET_PO_MASTER.COLUMNS.PO_NO, body.pono)
                    .where(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, body.outlet_id)
                    .update({
                        [OUTLET_PO_MASTER.COLUMNS.IS_GRN_APPROVAL]: true
                    });
            }

            let isReturnAdded = false;
            let returnSubTotalAmount = 0;
            let returnTotalGstAmount = 0;
            let returnTotalCessAmount = 0;
            let retrunGrandTotalAmount = 0;

            if ((body.purchase_return === true) && (Number(totalReturnQty) > 0)) {
                isReturnAdded = true;

                // STEP 12: INSERT PURCHASE RETURN MASTER
                const [response] = await trx(OUTLET_PURCHASE_RETURN_MASTER.NAME)
                    .returning("id")
                    .insert({
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.DOC_DATE]: new Date(),
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || " ",
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_DATE]: body.invoice_date || new Date(),
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.PO_NO]: body.pono || "",
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.PO_DATE]: body.po_date || new Date(),
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.MEMO_NO]: body.memo_no || "",
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.MEMO_DATE]: body.memo_date || new Date(),
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.PURCHASE_NO]: docno,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.PURCHASE_DATE]: new Date(),
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id || 1,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.RETURN_TYPE]: body.return_type || 1,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.REMARK]: body.remark || " ",
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY]: 0,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EINVOICE_NO]: 0,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.VERIFY]: 0,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.VERIFY_USER_ID]: 0,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_NO]: 0,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_NO]: 0,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_DATE]: new Date(),
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_VALID_DATE]: new Date(),
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_PATH]: "",
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_INVOICE_PATH]: "",
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.AK_DATE]: new Date(),
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.AKNO]: 0,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EFFECT_DATE]: new Date(),
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.IRNNO]: 0,
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.CREATED_AT]: new Date(),
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
                    });

                const outlet_purchase_return_mst_id = response.id;
                const purchaseReturnDocno = String(outlet_purchase_return_mst_id);

                // STEP 2: UPDATE DOC NO
                await trx(OUTLET_PURCHASE_RETURN_MASTER.NAME)
                    .where(OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.ID, outlet_purchase_return_mst_id)
                    .update({
                        [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.DOC_NO]: purchaseReturnDocno,
                    });

                // STEP 3: INSERT PURCHASE RETURN DETAILS
                if (_.isArray(body.outlet_purchase_details) && body.outlet_purchase_details.length > 0) {
                    const purchaseReturnDetailsData = [];

                    for (const element of body.outlet_purchase_details) {
                        const accepted_qty = Number(element.qty) || 0;
                        const returnQty = Number(element.return_qty) || 0;
                        const purchaseRate = Number(element.purchase_rate) || 0;
                        const gstPer = Number(element.gst) || 0;
                        const cess = Number(element.cess) || 0;
                        const mrp = parseFloat(element.mrp) || 0;

                        if (returnQty <= 0) continue;

                        // ✅ Only one batch per product
                        const element1 = element.outlet_purchase_batch_details?.[0];
                        if (!element1) continue;

                        const existingBatchDetails1 = await trx(OUTLET_PURCHASE_MEMO_BATCH_DETAILS.NAME)
                            .where({
                                [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                                [OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.BATCH_NO]: String(element1.batch_no),
                            })
                            .first();

                        const amount = purchaseRate * returnQty;

                        const gstAmount =
                            Number(body.gst_type) === 1 ? (amount * gstPer) / 100 : 0;

                        const igstAmount =
                            Number(body.gst_type) === 2 ? (amount * gstPer) / 100 : 0;

                        const cessAmount = (amount * cess) / 100;

                        returnSubTotalAmount += amount;
                        returnTotalGstAmount += gstAmount + igstAmount;
                        returnTotalCessAmount += cessAmount;

                        purchaseReturnDetailsData.push({
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.OUTLET_PURCHASE_RETURN_MST_ID]: outlet_purchase_return_mst_id,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.DOC_NO]: purchaseReturnDocno,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.DOC_DATE]: new Date(),
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.PO_NO]: body.pono || "",
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.PO_DATE]: body.po_date || new Date(),
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.MEMO_NO]: body.memo_no || "",
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.MEMO_DATE]: body.memo_date || new Date(),
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.PRODUCT_CODE]: element.product_code,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.BATCH_NO]: String(element1.batch_no),
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.EXPIRY_DATE]: existingBatchDetails1?.expiry_date || new Date(),
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.ACCEPTED_QTY]: accepted_qty,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_QTY]: returnQty,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.RATE]: purchaseRate,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.MRP]: mrp,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.AMOUNT]: amount,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.GST]: Number(body.gst_type) === 1 ? gstPer : 0,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.CGST]: Number(body.gst_type) === 1 ? gstPer / 2 : 0,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.SGST]: Number(body.gst_type) === 1 ? gstPer / 2 : 0,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.IGST]: Number(body.gst_type) === 2 ? gstPer : 0,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.GST_AMOUNT]: gstAmount,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.IGST_AMOUNT]: igstAmount,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.CESS]: cess,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.REASON]: element.reason || 16,
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.CREATED_AT]: new Date(),
                            [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
                        });
                    }

                    const retrnTotalBeforeRoundOff =
                        returnSubTotalAmount + returnTotalGstAmount + returnTotalCessAmount;

                    const roundedTotal = Math.round(retrnTotalBeforeRoundOff);
                    const roundOff = roundedTotal - retrnTotalBeforeRoundOff;
                    retrunGrandTotalAmount = retrnTotalBeforeRoundOff + roundOff;

                    await trx(OUTLET_PURCHASE_RETURN_MASTER.NAME)
                        .where(OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.ID, outlet_purchase_return_mst_id)
                        .update({
                            [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.GRAND_TOTAL_AMT]: retrunGrandTotalAmount,
                            [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.SUB_TOTAL_AMT]: returnSubTotalAmount,
                            [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_GST_AMT]:
                                Number(body.gst_type) === 1 ? returnTotalGstAmount : 0,
                            [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMT]:
                                Number(body.gst_type) === 2 ? returnTotalGstAmount : 0,
                            [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_CESS_AMT]: returnTotalCessAmount,
                            [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.ROFF]: roundOff,
                            [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_PURCHASE_NO]: body.po_no,
                            [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_ITEMS]: 0
                        });

                    if (purchaseReturnDetailsData.length > 0) {
                        await trx.batchInsert(
                            OUTLET_PURCHASE_RETURN_DETAILS.NAME,
                            purchaseReturnDetailsData,
                            1000
                        );
                    }
                }

                // Step 10: Insert Party Ledger
                await trx(OUTLET_PARTY_LEDGER.NAME).insert({
                    [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: outlet_purchase_return_mst_id,
                    [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
                    [OUTLET_PARTY_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
                    [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
                    [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "PR",
                    [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
                    [OUTLET_PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
                    [OUTLET_PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
                    [OUTLET_PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: retrunGrandTotalAmount,
                    [OUTLET_PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: 0,
                    [OUTLET_PARTY_LEDGER.COLUMNS.REMARKS]: `Outlet Purchase Retrun No (${docno})`,
                    [OUTLET_PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'S',
                    [OUTLET_PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
                    [OUTLET_PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                    [OUTLET_PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
                });
            }


            if ((body.is_debit_note === true) && Number(body.total_debit_note_amount) > 0) {

                // STEP 12: INSERT PURCHASE RETURN MASTER
                const [response] = await trx(OUTLET_DEBIT_NOTE_MASTER.NAME)
                    .returning("id")
                    .insert({
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DOC_DATE]: new Date(),
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.PURCHASE_DOC_NO]: docno,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.PURCHASE_DOC_DATE]: new Date(),
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.COMPANY_ID]: body.company_id || 1,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.TOTAL_INVOICE_AMOUNT]: body.memo_invoice_amt || 0,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.PURCHASE_TOTAL_AMT]: body.grand_total_amt || 0,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.TOTAL_DEBIT_NOTE_AMOUNT]: body.total_debit_note_amount || 0,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.REMARK]: body.remark || 'DEBIT NOTE',
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.IS_ACTIVE]: true,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.CREATED_AT]: new Date(),
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
                    });

                const debitNoteMasterId = response.id;
                const debitNoteMasterDocno = String(debitNoteMasterId);

                // STEP 2: UPDATE DOC NO
                await trx(OUTLET_DEBIT_NOTE_MASTER.NAME)
                    .where(OUTLET_DEBIT_NOTE_MASTER.COLUMNS.ID, debitNoteMasterId)
                    .update({
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DOC_NO]: debitNoteMasterDocno
                    });

                // STEP 3: DEBIT NOTE AMOUNT (ONLY MRP MISMATCH)
                if (_.isArray(body.outlet_purchase_details) && body.outlet_purchase_details.length > 0) {

                    const debitNoteDetailsData = [];

                    for (const element of body.outlet_purchase_details) {

                        // ✅ ONLY MRP mismatch
                        if (Boolean(element.mrp_mismatch_flag) === true) {
                            const qty = Number(element.qty) || 0;
                            const purchaseRate = Number(element.purchase_rate) || 0;
                            const mrp = Number(element.mrp) || 0;
                            const amount = purchaseRate * qty;

                            debitNoteDetailsData.push({
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.OUTLET_DEBIT_NOTE_MST_ID]: debitNoteMasterId,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.PRODUCT_CODE]: element.product_code,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.QTY]: qty,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.RATE]: purchaseRate,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.MRP]: mrp,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.AMOUNT]: amount,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.REASON]: element.reason || 16,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.CREATED_AT]: new Date(),
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
                            });
                        }
                    }

                    // ✅ Insert ONLY ONCE
                    if (debitNoteDetailsData.length > 0) {
                        await trx.batchInsert(
                            OUTLET_DEBIT_NOTE_DETAILS.NAME,
                            debitNoteDetailsData,
                            1000
                        );
                    }
                }


            }

            await trx.commit();

            // Final response
            return {
                success: true,
                docno,
                return: isReturnAdded // ✅ true if at least one return was inserted
            };

        } catch (error) {
            await trx.rollback();
            console.error("Transaction Failed:", error);

            if (error?._code === 404 || error?._code === 400) {
                throw error;
            }
            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Outlet Purchase transaction failed.",
                property: "",
                code: "OUTLET_PURCHASE_GENERATION_FAILED",
            });
        }

    }

    async function getOutletGrnByIdRepo({ params, logTrace }) {
        const knex = this;
        const { grn_id } = params;

        try {
            /* ---------------------------------
               1. GRN MASTER
            ----------------------------------*/
            const grnMaster = await knex(OUTLET_PURCHASE_MASTER.NAME)
                .select(
                    `${OUTLET_PURCHASE_MASTER.NAME}.*`,
                    `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} AS outlet_name`,
                    `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} AS supplier_name`,
                    `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE} AS supplier_code`
                )
                .leftJoin(
                    OUTLETS.NAME,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`,
                    `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
                )
                .leftJoin(
                    SUPPLIER.NAME,
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID}`,
                    `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
                )
                .leftJoin(SUPPLIER_OUTLET_MAPPING.NAME, function () {
                    this.on(
                        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
                        "=",
                        `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID}`
                    ).andOn(
                        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
                        "=",
                        `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`
                    );
                })
                .where(
                    `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ID}`,
                    grn_id
                )
                .first();

            if (!grnMaster) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: `GRN Master not found for id ${grn_id}`,
                    code: "NOT_FOUND"
                });
            }

            /* ---------------------------------
               2. GRN DETAILS (PRODUCT LEVEL)
            ----------------------------------*/
            const grnDetails = await knex(OUTLET_PURCHASE_DETAILS.NAME)
                .select(
                    `${OUTLET_PURCHASE_DETAILS.NAME}.*`,
                    `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} AS prod_name`,
                    `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} AS brand_company_name`
                )
                .leftJoin(
                    ITEM.NAME,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID}`,
                    `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                )
                .leftJoin(
                    TYPEDESIGN.NAME,
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.TYPE_DESIGN_ID}`,
                    `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
                )
                .where(
                    `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID}`,
                    grn_id
                );

            /* ---------------------------------
               3. GRN BATCH DETAILS
               KEY = grn_id + product_id
            ----------------------------------*/
            const grnBatchDetails = await knex(OUTLET_PURCHASE_BATCH_DETAILS.NAME)
                .where(
                    `${OUTLET_PURCHASE_BATCH_DETAILS.NAME}.${OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.OUTLET_PURCHASE_MASTER_ID}`,
                    grn_id
                );

            /* ---------------------------------
               4. GROUP BATCHES BY PRODUCT_ID
            ----------------------------------*/
            const batchMap = {};

            for (const batch of grnBatchDetails) {
                const productId = batch.product_id;

                if (!batchMap[productId]) {
                    batchMap[productId] = [];
                }

                batchMap[productId].push(batch);
            }

            /* ---------------------------------
               5. MERGE BATCHES INTO DETAILS
            ----------------------------------*/
            const mergedGrnDetails = grnDetails.map(detail => ({
                ...detail,
                outlet_grn_batch_details: batchMap[detail.prod_id] || []
            }));

            /* ---------------------------------
               6. FREE ITEM DETAILS
            ----------------------------------*/
            const grnFreeItemDetails = await knex(
                OUTLET_PURCHASE_GRN_FREE_ITEM_DETAILS.NAME
            ).where(
                `${OUTLET_PURCHASE_GRN_FREE_ITEM_DETAILS.NAME}.${OUTLET_PURCHASE_GRN_FREE_ITEM_DETAILS.COLUMNS.OUTLET_PURCHASE_GRN_MST_ID}`,
                grn_id
            );

            /* ---------------------------------
               7. FINAL RESPONSE
            ----------------------------------*/
            return {
                ...grnMaster,
                outlet_grn_details: mergedGrnDetails,
                outlet_grn_free_item_details: grnFreeItemDetails
            };

        } catch (error) {
            throw error;
        }
    }

    async function getOutletPurchaseOutletListRepo({ params, logTrace }) {
        const knex = this;
        const { region_id } = params;

        const query = knex
            .distinct([
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as id`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
            ])
            .from(`${OUTLET_PURCHASE_MASTER.NAME} as ${OUTLET_PURCHASE_MASTER.NAME}`)
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, Boolean(true))
            .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE}`, Boolean(true))
            .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`, Number(region_id))
            .orderBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`, "asc");


        logQuery({
            logger: fastify.log,
            query,
            context: "Get Outlet list",
            logTrace
        });

        const response = await query;
        if (!response || response.length == 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Outlets not found`,
                property: "",
                code: "NOT_FOUND"
            });
        }
        return response;
    }

    async function postOutletPurchaseReturnRepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;

        // Start a transaction
        const trx = await knex.transaction();
        try {
            // Step 1: Available Outlet Product Balance Check
            if (_.isArray(body.outlet_purchase_return_details) && body.outlet_purchase_return_details.length > 0) {
                await Promise.all(
                    body.outlet_purchase_return_details.map(async (element) => {
                        const stockDetails = await trx(OUTLET_PRODUCT_MAPPING.NAME)
                            .select(
                                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK}`,
                                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`
                            )
                            .leftJoin(
                                ITEM.NAME,
                                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`,
                                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                            )
                            .where(
                                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`,
                                Number(element.product_id)
                            )
                            .andWhere(
                                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
                                Number(body.outlet_id)
                            )
                            .first();

                        const balance = parseFloat(stockDetails?.balance_stock) || 0;
                        const productName = String(stockDetails?.pro_name);
                        const returnQty = parseFloat(element.return_qty) || 0;
                        const returnFreeQty = parseFloat(element.return_free_qty) || 0;
                        const totalReturnQty = returnQty + returnFreeQty;
                        if (balance < totalReturnQty) {
                            throw CustomError.create({
                                httpCode: StatusCodes.NOT_FOUND,
                                message: `Stock (${balance}) is less than return qty (${totalReturnQty}) for Product Name ${productName}`,
                                property: "balance",
                                code: "STOCK_MISMATCHED"
                            });
                        }

                    })
                );
            }

            // Step 2: Get Supplier Gst_Type
            const supplierDetails = await knex(SUPPLIER.NAME)
                .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
                .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
                .first()

            const { gst_type } = supplierDetails;

            // Step 3: Insert into Outlet Purchase Return Master and retrieve the inserted ID
            const [response] = await trx(`${OUTLET_PURCHASE_RETURN_MASTER.NAME}`)
                .returning("id")
                .insert({
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.DOC_DATE]: new Date(),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || " ",
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_DATE]: body.invoice_date || new Date(),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.PO_NO]: body.po_no || '',
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.PO_DATE]: body.po_date || new Date(),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.MEMO_NO]: body.memo_no || '',
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.MEMO_DATE]: body.memo_date || new Date(),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id || 1,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.SUB_TOTAL_AMT]: body.total_amount,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.ROFF]: body.roff,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.RETURN_TYPE]: body.type || 1,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? Number(body.igst) : 0,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? Number(body.igst) : 0,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.cess_amt || 0,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.REMARK]: body.remark || " ",
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY]: 0,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_TYPE]: 0,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_DATE]: new Date(),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_VALID_DATE]: new Date(),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_PATH]: "",
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.AK_DATE]: new Date(),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.AKNO]: 0,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.EFFECT_DATE]: new Date(),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.IRNNO]: 0,
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.CREATED_AT]: new Date().toISOString(),
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
                });

            const outlet_purchase_return_mst_id = response.id;
            const docno = `${outlet_purchase_return_mst_id}`;

            // Step 4: Update DOCNO in Outlet Purchase Return Master
            await trx(`${OUTLET_PURCHASE_RETURN_MASTER.NAME}`)
                .where(OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.ID, outlet_purchase_return_mst_id)
                .update({
                    [OUTLET_PURCHASE_RETURN_MASTER.COLUMNS.DOC_NO]: docno
                });

            // Step 5: Insert into Outlet Purchase Return Details
            if (_.isArray(body.outlet_purchase_return_details) && body.outlet_purchase_return_details.length > 0) {
                const purchaseReturnDetailsData = _.map(body.outlet_purchase_return_details, (element) => ({
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.OPR_MST_ID]: outlet_purchase_return_mst_id,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.DOC_NO]: docno,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.DOC_DATE]: new Date(),
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.PRODUCT_CODE]: element.product_code,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.BATCH_NO]: String(element.batch_no) || '',
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.EXPIRY_DATE]: element.expiry_date || new Date(),
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.ACCEPTED_QTY]: element.accepted_qty,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.ACCEPTED_FREE_QTY]: element.accepted_free_qty,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_QTY]: element.return_qty,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.GRN_RETURN_QTY]: element.return_qty,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY]: element.return_free_qty,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.DIS_PER]: element.discount_percentage,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.DIS_AMT]: element.discount_amount,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.RATE]: element.rate,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.AMOUNT]: element.amount || 0,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id || 1,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.WH_ID]: body.wh_id || 1,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.MRP]: element.mrp,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.GST]: (Number(gst_type) === 2) ? Number(element.igst) : 0,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.CGST]: (Number(gst_type) === 2) ? Number(element.igst) / 2 : 0,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.SGST]: (Number(gst_type) === 2) ? Number(element.igst) / 2 : 0,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.GST_AMOUNT]: (Number(gst_type) === 2) ? Number(element.rate) * Number(element.igst) * Number(element.return_qty) / 100 : 0,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.IGST]: (Number(gst_type) === 1) ? Number(element.igst) : 0,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.IGST_AMOUNT]: (Number(gst_type) === 1) ? Number(element.rate) * Number(element.igst) * Number(element.return_qty) / 100 : 0,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.CESS]: element.cess || 0,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.CESS_AMT]: element.cess_amt || 0,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.REASON]: element.reason,
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.CREATED_AT]: new Date(),
                    [OUTLET_PURCHASE_RETURN_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
                }));

                // Batch insert in chunks of 1000 records
                if (purchaseReturnDetailsData.length > 0) {
                    await trx.batchInsert(OUTLET_PURCHASE_RETURN_DETAILS.NAME, purchaseReturnDetailsData, 1000);
                }
            }

            // Step 6: Update Outlet Supplier Balance
            const supplier = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
                .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE)
                .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, body.supplier_id)
                .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
                .first();

            const grandTotalAmount = body.grand_total > 0 ? body.grand_total : 0;
            const currentBalance = parseFloat(supplier.balance || 0);
            const newBalance = currentBalance - grandTotalAmount;

            if (!isNaN(newBalance)) {
                const som = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
                    .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, body.supplier_id)
                    .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
                    .update({ [SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE]: newBalance });
                console.log(som, "som");


            }


            // Step 7: Update Outlet Stock Ledger
            if (_.isArray(body.outlet_purchase_return_details)) {
                await Promise.all(
                    body.outlet_purchase_return_details.map(async (element) => {
                        const returnQty = parseFloat(element.return_qty) || 0;
                        const returnFreeQty = parseFloat(element.return_free_qty) || 0;
                        const totalReturnQty = returnQty + returnFreeQty;
                        const condition = {
                            [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.product_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: body.docdate,
                        };

                        const existingStock = await trx(OUTLET_STOCK_LEDGER.NAME).where(condition).first();

                        if (existingStock) {
                            // Update existing stock record
                            await trx(OUTLET_STOCK_LEDGER.NAME)
                                .where(condition)
                                .update({
                                    [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY]: trx.raw(
                                        `${OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY} + ?`,
                                        [totalReturnQty]
                                    ),
                                    [OUTLET_STOCK_LEDGER.COLUMNS.UPDATED_BY]: userDetails.id,
                                    [OUTLET_STOCK_LEDGER.COLUMNS.UPDATED_AT]: new Date()
                                });
                        } else {
                            // Insert new stock record
                            await trx(OUTLET_STOCK_LEDGER.NAME).insert({
                                [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: new Date(),
                                [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.product_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY]: totalReturnQty,
                                [OUTLET_STOCK_LEDGER.COLUMNS.COMPANY_ID]: body.company_id || 1,
                                [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id || 1,
                                [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_AT]: new Date()
                            });
                        }
                    })
                );
            }

            // Step 8: Update Item Balance
            if (_.isArray(body.outlet_purchase_return_details)) {
                for (const element of body.outlet_purchase_return_details) {
                    const returnQty = parseFloat(element.return_qty) || 0;
                    const returnFreeQty = parseFloat(element.return_free_qty) || 0;

                    await trx(OUTLET_PRODUCT_MAPPING.NAME)
                        .where(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID, element.product_id)
                        .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
                        .update({
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: trx.raw(
                                `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} - ? - ?`,
                                [returnQty, returnFreeQty]
                            ),
                        });
                }
            }


            // Step 10: Insert Party Ledger
            await trx(OUTLET_PARTY_LEDGER.NAME).insert({
                [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: outlet_purchase_return_mst_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "PR",
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
                [OUTLET_PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
                [OUTLET_PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
                [OUTLET_PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: body.grand_total,
                [OUTLET_PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: 0,
                [OUTLET_PARTY_LEDGER.COLUMNS.REMARKS]: `Purchase Retrun No (${docno})`,
                [OUTLET_PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'S',
                [OUTLET_PARTY_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id || 1,
                [OUTLET_PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
                [OUTLET_PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id || 1,
                [OUTLET_PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
            });

            // Commit the transaction
            await trx.commit();
            return { success: true, docno: docno };
        } catch (error) {
            await trx.rollback();
            console.error("Transaction Failed:", error);
            if (error?._code === 404) {
                throw error;
            }

            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Purchase Return transaction failed.",
                property: "",
                code: "TRANSACTION_FAILED"
            });
        }
    }

    async function getOutletPurchaseDetailsRepo({ params, body }) {
        const knex = this;
        const { doc_no, outlet_id } = params;

        const regionDetails = await knex
            .select(
                `${REGION.NAME}.${REGION.COLUMNS.ID}`,
                `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME}`,
            )
            .from(`${OUTLET_PURCHASE_MASTER.NAME} as ${OUTLET_PURCHASE_MASTER.NAME}`)
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .leftJoin(
                `${REGION.NAME} as ${REGION.NAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`,
                `${REGION.NAME}.${REGION.COLUMNS.ID}`
            )
            .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO}`, String(doc_no))
            .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`, Number(outlet_id))
            .first();


        if (!regionDetails) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Region details not found for outlet ${outlet_id}`,
                property: "outlet_id",
                code: "NOT_FOUND"
            });
        }



        const outletDetails = await knex
            .select(
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as id`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
            )
            .from(`${OUTLET_PURCHASE_MASTER.NAME} as ${OUTLET_PURCHASE_MASTER.NAME}`)
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO}`, String(doc_no))
            .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`, Number(outlet_id))
            .first();


        if (!outletDetails) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Outlet details not found for outlet ${outlet_id}`,
                property: "outlet_id",
                code: "NOT_FOUND"
            });
        }



        const supplierDetails = await knex
            .select(
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE} as supplier_balance`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN} as supplier_gstin`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE} as supplier_mobile_no`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO} as supplier_bank_ac_no`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE} as gst_type`,
            )
            .from(`${OUTLET_PURCHASE_MASTER.NAME} as ${OUTLET_PURCHASE_MASTER.NAME}`)
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO}`, String(doc_no))
            .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`, Number(outlet_id))
            .first();

        if (!supplierDetails) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Supplier details not found for Outlet Purchase ${doc_no}`,
                property: "supplier_id",
                code: "NOT_FOUND"
            });
        }

        const poDetails = await knex(OUTLET_PURCHASE_MASTER.NAME)
            .distinct([
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PONO}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PODATE}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.MEMO_NO}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.MEMO_DATE}`
            ])
            .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO}`, String(doc_no))
            // .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE}`, Boolean(true))
            .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`, Number(outlet_id))
            .first();

        if (!poDetails) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Outlet Purchase ${doc_no} PO Details not found for outlet ${outlet_id}`,
                property: "doc_no",
                code: "NOT_FOUND"
            });
        }

        const master = await knex(OUTLET_PURCHASE_MASTER.NAME)
            .distinct([
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCDATE}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_NO}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_DATE}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.SUB_TOTAL_AMT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_GST_AMT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_IGST_AMT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_CESS_AMT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DISCOUNT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TCS}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.FRIGHT_CHARGES}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OTHER_CHARGES}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ROFF}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.GRAND_TOTAL_AMT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.REMARK}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.RETURN_REMARK}`


            ])
            .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO}`, String(doc_no))
            .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`, Number(outlet_id))
            .first();



        if (!master) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Outlet Purchase  ${doc_no} not found for outlet ${outlet_id}`,
                property: "doc_no",
                code: "NOT_FOUND"
            });
        }

        const item_details = await knex(OUTLET_PURCHASE_DETAILS.NAME)
            .select([
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID} as product_id`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_CODE} as product_code`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.HSN_CODE}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.MRP}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.DISCOUNT}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.GST}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.CESS}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.GST_AMOUNT}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.CESS_AMOUNT}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE_RATE}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.ACCEPTED_MARGIN}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.SALE_RATE}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.QTY}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.FREE_QTY}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.AMOUNT}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.IGST}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.IGST_AMOUNT}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.CGST}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.SGST}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.DISCOUNT_AMOUNT}`

            ])
            .innerJoin(
                ITEM.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID}`
            )
            .innerJoin(
                UNITS.NAME,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.UOM_ID}`
            )
            .where(
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID}`,
                master?.id
            );


        if (!Array.isArray(item_details) || item_details.length === 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `No items found for Outlet Purchase ${doc_no}`,
                property: "items",
                code: "NOT_FOUND"
            });
        }



        const batchRows = await knex(OUTLET_PURCHASE_BATCH_DETAILS.NAME)
            .where(
                OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.OUTLET_PURCHASE_MASTER_ID,
                Number(master?.id)
            );


        if (!Array.isArray(batchRows) || batchRows.length === 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `No items found for Outet Purchase ${doc_no}`,
                property: "items",
                code: "NOT_FOUND"
            });
        }


        // -----------------------------
        // STEP 5: Merge Items + Batches
        // -----------------------------
        const mergedItems = item_details.map(item => ({
            ...item,
            item_batch_details: batchRows
                .filter(b => b.product_id === item.product_id || b.mrp === item.mrp)
                .map(b => ({
                    batch_no: b.batch_no,
                    expiry_date: b.expiry_date,
                    manufacture_date: b.manufacture_date
                }))
        }));



        return {
            regionDetails,
            outletDetails,
            supplierDetails,
            poDetails,
            doc_no: master.docno ?? "",
            doc_date: master.docdate ?? "",
            invoice_no: master.invoice_no ?? "",
            invoice_date: master.invoice_date ?? null,
            sub_total_amt: master.sub_total_amt ?? 0,
            total_gst_amt: master.total_gst_amt ?? 0,
            total_igst_amt: master.total_igst_amt ?? 0,
            total_cess_amt: master.total_cess_amt ?? 0,
            discount: master.discount ?? 0,
            tcs: master.tcs ?? 0,
            fright_charges: master.fright_charges ?? 0,
            other_charges: master.other_charges ?? 0,
            roff: master.roff ?? 0,
            grand_total_amt: master.grand_total_amt ?? 0,
            remark: master.remark ?? "",
            return_remark: master.return_remark ?? "",
            item_details: mergedItems
        };
    }

    async function getOutletPurchaseDetailsNewRepo({ params, body }) {
        const knex = this;
        const { doc_no, outlet_id } = params;

        const master = await knex(OUTLET_PURCHASE_MASTER.NAME)
            .distinct([
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCDATE}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_NO}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_DATE}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.SUB_TOTAL_AMT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_GST_AMT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_IGST_AMT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_CESS_AMT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DISCOUNT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.TCS}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.FRIGHT_CHARGES}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OTHER_CHARGES}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.ROFF}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.GRAND_TOTAL_AMT}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.REMARK}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.RETURN_REMARK}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PONO}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PODATE}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.MEMO_NO}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.MEMO_DATE}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE} as supplier_balance`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN} as supplier_gstin`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE} as supplier_mobile_no`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO} as supplier_bank_ac_no`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE} as gst_type`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
                `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME}`
            ])
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .leftJoin(
                `${REGION.NAME} as ${REGION.NAME}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`,
                `${REGION.NAME}.${REGION.COLUMNS.ID}`
            )
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .where(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO}`, String(doc_no))
            .andWhere(`${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`, Number(outlet_id))
            .first();



        if (!master) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Outlet Purchase  ${doc_no} not found for outlet ${outlet_id}`,
                property: "doc_no",
                code: "NOT_FOUND"
            });
        }

        const item_details = await knex(OUTLET_PURCHASE_DETAILS.NAME)
            .select([
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID} as product_id`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_CODE} as product_code`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.HSN_CODE}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.MRP}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.DISCOUNT}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.GST}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.CESS}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.GST_AMOUNT}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.CESS_AMOUNT}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE_RATE}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.ACCEPTED_MARGIN}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.SALE_RATE}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.QTY}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.FREE_QTY}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.AMOUNT}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.IGST}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.IGST_AMOUNT}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.CGST}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.SGST}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.DISCOUNT_AMOUNT}`

            ])
            .innerJoin(
                ITEM.NAME,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID}`
            )
            .innerJoin(
                UNITS.NAME,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.UOM_ID}`
            )
            .where(
                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID}`,
                master?.id
            );


        if (!Array.isArray(item_details) || item_details.length === 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `No items found for Outlet Purchase ${doc_no}`,
                property: "items",
                code: "NOT_FOUND"
            });
        }



        const batchRows = await knex(OUTLET_PURCHASE_BATCH_DETAILS.NAME)
            .where(
                OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.OUTLET_PURCHASE_MASTER_ID,
                Number(master?.id)
            );


        if (!Array.isArray(batchRows) || batchRows.length === 0) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `No items found for Outet Purchase ${doc_no}`,
                property: "items",
                code: "NOT_FOUND"
            });
        }


        // -----------------------------
        // STEP 5: Merge Items + Batches
        // -----------------------------
        const mergedItems = item_details.map(item => ({
            ...item,
            item_batch_details: batchRows
                .filter(b => b.product_id === item.product_id || b.mrp === item.mrp)
                .map(b => ({
                    batch_no: b.batch_no,
                    expiry_date: b.expiry_date,
                    manufacture_date: b.manufacture_date
                }))
        }));

        return {
            doc_no: master.docno ?? "",
            doc_date: master.docdate ?? "",
            invoice_no: master.invoice_no ?? "",
            invoice_date: master.invoice_date ?? null,
            sub_total_amt: master.sub_total_amt ?? 0,
            total_gst_amt: master.total_gst_amt ?? 0,
            total_igst_amt: master.total_igst_amt ?? 0,
            total_cess_amt: master.total_cess_amt ?? 0,
            discount: master.discount ?? 0,
            tcs: master.tcs ?? 0,
            fright_charges: master.fright_charges ?? 0,
            other_charges: master.other_charges ?? 0,
            roff: master.roff ?? 0,
            grand_total_amt: master.grand_total_amt ?? 0,
            remark: master.remark ?? "",
            return_remark: master.return_remark ?? "",
            region_name: master.region_name ?? "",
            outlet_full_name: master.outlet_full_name ?? "",
            supplier_name: master.supplier_name ?? "",
            short_name: master.short_name ?? "",
            add1: master.add1 ?? "",
            add2: master.add2 ?? "",
            supplier_balance: master.supplier_balance ?? "",
            supplier_gstin: master.supplier_gstin ?? "",
            supplier_mobile_no: master.supplier_mobile_no ?? "",
            supplier_bank_ac_no: master.supplier_bank_ac_no ?? "",
            gst_type: master.gst_type ?? "",
            pono: master.pono ?? "",
            podate: master.podate ?? "",
            memo_no: master.memo_no ?? "",
            memo_date: master.memo_date ?? "",
            item_details: mergedItems
        };
    }

    async function postOutletManualPurchaseRepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;
        const trx = await knex.transaction();

        try {
            // Step 1: get Supplier Details
            const supplierDetails = await knex(SUPPLIER.NAME)
                .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
                .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
                .first()

            const { gst_type } = supplierDetails;

            // Step 2: Insert into `PURCHASE_MST` (Purchase Master)
            const [purchaseResponse] = await trx(`${OUTLET_PURCHASE_MASTER.NAME}`)
                .returning("id")
                .insert({
                    [OUTLET_PURCHASE_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.DOCDATE]: new Date(),
                    [OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_DATE]: body.invoice_date || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.CUSTOMER_TYPE]: Number(gst_type) || 1,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PONO]: body.pono || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PODATE]: body.podate || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.MEMO_NO]: body.memo_no || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.MEMO_DATE]: body.memo_date || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_DEBIT_NOTE_AMOUNT]: body.total_debit_note_amount || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.STATUS]: 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.MEMO_INVOICE_AMT]: body.memo_invoice_amt || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_ITEMS]: body.total_items,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.ROFF]: body.roff,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.FRIGHT_CHARGES]: body.fright_charges || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.OTHER_CHARGES]: body.other_charges || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.ADVANCE]: body.advance || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.TCS]: body.tcs || 0,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PRODUCT_TYPE]: 1,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.REMARK]: body.remark || " ",
                    [OUTLET_PURCHASE_MASTER.COLUMNS.RETURN_REMARK]: 1,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE]: body.purchase || false,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.WAREHOUSE_ID]: body.wh_id || 1,
                    [OUTLET_PURCHASE_MASTER.COLUMNS.CREATED_AT]: new Date(),
                    [OUTLET_PURCHASE_MASTER.COLUMNS.CREATED_BY]: userDetails.id
                });

            const purchase_id = purchaseResponse.id;
            const docno = `${purchase_id}`;

            // Step 3: Update `PURCHASE_MST` to add the generated document number
            await trx(`${OUTLET_PURCHASE_MASTER.NAME}`)
                .where(`${OUTLET_PURCHASE_MASTER.COLUMNS.ID}`, purchase_id)
                .update({ [OUTLET_PURCHASE_MASTER.COLUMNS.DOCNO]: docno });

            let subTotalAmount = 0;
            let totalGstAmount = 0;
            let totalIgstAmount = 0;
            let totalCessAmount = 0;
            let totalReturnAmount = 0;
            let totalDiscountAmount = 0;
            let grandTotalAmount = 0;
            let totalOrderQty = 0;
            let totalReceivedQty = 0;
            let totalReturnQty = 0;

            // Step 4: Insert Outlet Purchase Grn Details
            if (Array.isArray(body.outlet_purchase_details) && body.outlet_purchase_details.length > 0) {
                const allPurchaseDetailsData = [];

                for (const element of body.outlet_purchase_details) {

                    const product_id = Number(element.product_id) || 0;
                    const product_code = String(element.product_code) || 0;
                    const po_no = String(body.pono); // 🔑 important
                    const supplierId = Number(body.supplier_id) || 0;
                    const outletId = Number(body.outlet_id) || 0;

                    const productDetails = await trx(`${OUTLET_PO_DETAILS.NAME} AS ${OUTLET_PO_DETAILS.NAME}`)
                        .select([
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CATEGORY_ID} AS category_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID} AS sub_category_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID} AS brand_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID} AS brand_company_id`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BARCODE} AS barcode`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.RATE} AS pur_rate`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.HSN} AS hsn`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE} AS sale_rate`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.CESS} AS cess`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GST} AS gst`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE}`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE}`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MRP} AS mrp`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
                        ])
                        .innerJoin(
                            `${OUTLET_PRODUCT_MAPPING.NAME}`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`
                        )
                        .innerJoin(
                            `${ITEM.NAME}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`,
                            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`
                        )
                        .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, po_no)
                        .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`, product_id)
                        .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, outletId)
                        .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID}`, supplierId)
                        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
                        .first();

                    if (!productDetails) {
                        throw new Error(`No product mapping found for product_id ${element.product_id}`);
                    }

                    const mrp = Number(element.mrp) || 0;
                    const purchaseRate = Number(element.purchase_rate) || 0;
                    const orderQty = Number(element.orderQty) || 0;
                    const receivedQty = Number(element.qty) || 0;
                    const returnQty = Number(element.return_qty) || 0;
                    const freeQty = Number(element.free_qty) || 0;
                    const gst = Number(element.gst) || 0;
                    const cess = Number(element.cess) || 0;
                    const discountPer = Number(productDetails.discount) || 0;

                    const acceptedMargin = Number(productDetails.fixedmargin) || 0;

                    // ---- CORRECT CALCULATIONS ----
                    const amount = purchaseRate * receivedQty;

                    const gstAmount = Number(gst_type) === 1
                        ? amount * gst / 100
                        : 0;

                    const igstAmount = Number(gst_type) === 2
                        ? amount * gst / 100
                        : 0;

                    const cessAmount = amount * cess / 100;

                    const discountAmount = amount * discountPer / 100;

                    const returnAmount = purchaseRate * returnQty;

                    // ---- TOTALS ----
                    subTotalAmount += amount;
                    totalGstAmount += gstAmount;
                    totalIgstAmount += igstAmount;
                    totalCessAmount += cessAmount;
                    totalReturnAmount += returnAmount;
                    totalDiscountAmount += discountAmount;
                    totalOrderQty += orderQty;
                    totalReceivedQty += receivedQty;
                    totalReturnQty += returnQty;

                    allPurchaseDetailsData.push({
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID]: purchase_id,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.DOCNO]: docno,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.DOCDATE]: new Date(),
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.PO_NO]: po_no,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.COMPANY_ID]: body.company_id || 1,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SUPPLIER_ID]: supplierId,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_ID]: outletId,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID]: product_id,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_CODE]: product_code || '',
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.HSN_CODE]: element.hsn,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SUB_CATEGORY_ID]: productDetails.sub_category_id || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CATEGORY_ID]: productDetails.category_id || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.HEAD_ID]: productDetails.brand_id || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.TYPE_DESIGN_ID]: productDetails.brand_company_id || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.UOM_ID]: productDetails.uom_id || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.BARCODE]: productDetails.barcode || '',

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.QTY]: receivedQty || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_QTY]: returnQty,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.FREE_QTY]: freeQty,


                        [OUTLET_PURCHASE_DETAILS.COLUMNS.TEMP_RECEIVED_QTY]: receivedQty,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.TEMP_GRN_RETURN_QTY]: returnQty,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.MRP]: mrp,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SALE_RATE]: mrp,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE_RATE]: purchaseRate,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.ACCEPTED_MARGIN]: Number(productDetails.accepted_margin) || 0,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.AMOUNT]: amount,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_AMOUNT]: returnAmount,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.DISCOUNT]: discountPer,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.DISCOUNT_AMOUNT]: discountAmount,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.GST]: Number(body.gst_type) === 1 ? gst : 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.GST_AMOUNT]: gstAmount,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CGST]: Number(body.gst_type) === 1 ? gst / 2 : 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SGST]: Number(body.gst_type) === 1 ? gst / 2 : 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.IGST]: Number(body.gst_type) === 2 ? gst : 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.IGST_AMOUNT]: igstAmount,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CESS]: cess,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SELF_LIFE_EXPIRY_DAYS]: Number(element.self_life_qty) || 0,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.PURCHASE]: body.purchase || false,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CREATED_AT]: new Date()
                    });
                };

                const totalBeforeRoundOff =
                    subTotalAmount +
                    totalGstAmount +
                    totalIgstAmount +
                    totalReturnAmount +
                    totalCessAmount -
                    totalDiscountAmount;

                const roundedTotal = Math.round(totalBeforeRoundOff);
                const roundOff = roundedTotal - totalBeforeRoundOff;
                grandTotalAmount = totalBeforeRoundOff + roundOff;

                await trx(OUTLET_PURCHASE_MASTER.NAME)
                    .where(OUTLET_PURCHASE_MASTER.COLUMNS.ID, purchase_id)
                    .update({
                        [OUTLET_PURCHASE_MASTER.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmount,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotalAmount,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_RETURN_AMT]: totalReturnAmount,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? Number(totalGstAmount) : 0,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? Number(totalIgstAmount) : 0,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_CESS_AMT]: totalCessAmount || 0,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.DISCOUNT]: totalDiscountAmount,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_ORDER_QTY]: totalOrderQty || 0,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_RECEIVED_QTY]: totalReceivedQty || 0,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.TOTAL_RETURN_QTY]: totalReturnQty || 0
                    });

                if (allPurchaseDetailsData.length > 0) {
                    await trx.batchInsert(OUTLET_PURCHASE_DETAILS.NAME, allPurchaseDetailsData, 1000);
                }
            }

            /* Step 5: Update Outlet Purchase Batch Details */
            if (Array.isArray(body.outlet_purchase_details)) {

                const purchaseGrnChunks = _.chunk(body.outlet_purchase_details, 500);

                for (const grnChunk of purchaseGrnChunks) {

                    for (const element of grnChunk) {

                        if (!Array.isArray(element.outlet_purchase_batch_details)) continue;

                        const batchDetailsData = [];

                        for (const element1 of element.outlet_purchase_batch_details) {

                            batchDetailsData.push({
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.OUTLET_PURCHASE_MASTER_ID]: purchase_id,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_CODE]: String(element.product_code),
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO]: String(element1.batch_no),
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.QTY]: Number(element1.qty) || 0,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.MRP]: Number(element1.mrp) || 0,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.SELF_LIFE_EXPIRY_DAYS]: Number(element1.self_life_qty) || 0,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.RETURN_QTY]: Number(element1.return_qty) || 0,
                                [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.COMPANY_ID]: body.company_id || 1,
                                // [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE]: existingBatchDetails.manufacture_date || '',
                                // [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_ID]: existingBatchDetails.expiry_id || 0,
                                // [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE]: existingBatchDetails.expiry_value || 0,
                                // [OUTLET_PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_DATE]: existingBatchDetails.expiry_date || '',
                            });
                        }

                        // ----------- INSERT IN CHUNKS -----------
                        if (batchDetailsData.length > 0) {
                            await trx.batchInsert(
                                OUTLET_PURCHASE_BATCH_DETAILS.NAME,
                                batchDetailsData,
                                500
                            );
                        }
                    }
                }
            }

            // Step 6: Update Outlet Purchase Item Stock
            if (_.isArray(body.outlet_purchase_details)) {
                await Promise.all(
                    _.map(body.outlet_purchase_details, async (element) => {
                        const receivedQty = parseFloat(element.qty) || 0;
                        const freeQty = parseFloat(element.free_qty) || 0;
                        const mrp = parseFloat(element.mrp) || 0;
                        const purchase_rate = parseFloat(element.purchase_rate) || 0;
                        const gst = parseFloat(element.gst) || 0;
                        const cess = parseFloat(element.cess) || 0;
                        const hsn = parseFloat(element.hsn) || 0;
                        const sale_rate = parseFloat(element.sale_rate) || 0;
                        const accepted_margin = parseFloat(element.accepted_margin) || 0;
                        const totalReturnQty = parseFloat(element.return_qty) || 0;
                        const totalQty = receivedQty + freeQty;
                        const updateData = {
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: trx.raw(
                                `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} + ? - ?`,
                                [totalQty, totalReturnQty]
                            ),
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.MRP]: mrp,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_RATE]: purchase_rate,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.GST]: gst,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.CESS]: cess,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.HSN]: hsn,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE]: sale_rate,
                            [OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_MARGIN]: accepted_margin
                        };
                        await trx(OUTLET_PRODUCT_MAPPING.NAME)
                            .where(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID, element.product_id)
                            .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
                            .update(updateData)
                    })
                );
            }

            // Step 7: Insert or Update Stock Ledger
            if (Array.isArray(body.outlet_purchase_details)) {
                await Promise.all(body.outlet_purchase_details.map(async (element) => {
                    const receivedQty = parseFloat(element.qty) || 0;
                    const freeQty = parseFloat(element.free_qty) || 0;
                    const returnQty = parseFloat(element.return_qty) || 0;
                    const totalQty = receivedQty + freeQty + returnQty;

                    // Check if stock already exists for the product and date
                    const existingStock = await trx(OUTLET_STOCK_LEDGER.NAME)
                        .where({
                            [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.product_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: new Date()
                        })
                        .first();

                    if (existingStock) {
                        console.log(existingStock, "existing stock")

                        const grnDetails = await knex(OUTLET_PURCHASE_DETAILS.NAME)
                            .select(
                                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.QTY}`,
                                `${OUTLET_PURCHASE_DETAILS.NAME}.${OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_QTY}`)
                            .where(OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID, purchase_id)
                            .where(OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID, element.product_id)
                            .first()

                        const tempGrnQty = parseFloat(grnDetails?.qty) || 0;
                        const tempGrnReturnQty = parseFloat(grnDetails?.return_qty) || 0;
                        // If stock exists, update the purchase quantity
                        await trx(OUTLET_STOCK_LEDGER.NAME)
                            .where({
                                [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.product_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: new Date()
                            })
                            .update({
                                [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_QTY]: trx.raw(
                                    `${OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_QTY} + ? `,
                                    [tempGrnQty]
                                ),

                                [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY]: trx.raw(
                                    `${OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY} + ? `,
                                    [tempGrnReturnQty]
                                ),
                                [OUTLET_STOCK_LEDGER.COLUMNS.UPDATED_AT]: new Date(),
                                [OUTLET_STOCK_LEDGER.COLUMNS.UPDATED_BY]: userDetails.id
                            });

                    } else {
                        console.log("new stock");

                        // If stock does not exist, insert a new record
                        await trx(OUTLET_STOCK_LEDGER.NAME).insert({
                            [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: new Date(),
                            [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.product_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_QTY]: totalQty,
                            [OUTLET_STOCK_LEDGER.COLUMNS.WH_ID]: body.wh_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY]: returnQty,
                            [OUTLET_STOCK_LEDGER.COLUMNS.COMPANY_ID]: body.company_id || 1,
                            [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_AT]: new Date() // Ensure date is valid
                        });
                    }
                }));
            }

            // Step 8: Update Supplier Balance
            const supplier = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
                .select(
                    SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE,
                    SUPPLIER_OUTLET_MAPPING.COLUMNS.TDS_BALANCE
                )
                .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, body.supplier_id)
                .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
                .first();

            console.log("Fetched Supplier Balance:", supplier);

            const returnTotalAmount = body.return_amount > 0 ? body.return_amount : 0;
            const currentBalance = parseFloat(supplier?.balance || 0);
            const currentTdsBalance = parseFloat(supplier?.tds_balance || 0);
            const newBalance = currentBalance + grandTotalAmount - returnTotalAmount;
            const newTdsBalance = currentTdsBalance + subTotalAmount;

            console.log("Current Balance:", currentBalance);
            console.log("Grand Total Amount:", grandTotalAmount);
            console.log("Return Total Amount:", returnTotalAmount);
            console.log("New Balance:", newBalance);

            console.log("current Tds Balance:", currentTdsBalance);
            console.log("New TDS Balance:", newTdsBalance);

            if (!isNaN(newBalance)) {
                await trx(SUPPLIER_OUTLET_MAPPING.NAME)
                    .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, body.supplier_id)
                    .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
                    .update({
                        [SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE]: newBalance,
                        [SUPPLIER_OUTLET_MAPPING.COLUMNS.TDS_BALANCE]: newTdsBalance
                    });

                console.log("Supplier balance updated successfully");
            }

            // Step 9: Update GRN NO Stock
            if (body.invoice_no && body.supplier_id && body.pono) {
                await trx(OUTLET_PURCHASE_MASTER.NAME)
                    .where(OUTLET_PURCHASE_MASTER.COLUMNS.INVOICE_NO, body.invoice_no)
                    .where(OUTLET_PURCHASE_MASTER.COLUMNS.SUPPLIER_ID, body.supplier_id)
                    .where(OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID, body.outlet_id)
                    .where(OUTLET_PURCHASE_MASTER.COLUMNS.PONO, body.pono)
                    .update({
                        [OUTLET_PURCHASE_MASTER.COLUMNS.STATUS]: purchase_id,
                        [OUTLET_PURCHASE_MASTER.COLUMNS.PURCHASE]: true
                    });
            }

            // Step 10: Insert Party Ledger
            // If stock does not exist, insert a new record
            await trx(OUTLET_PARTY_LEDGER.NAME).insert({
                [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: purchase_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "E",
                [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
                [OUTLET_PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
                [OUTLET_PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
                [OUTLET_PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: 0,
                [OUTLET_PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: grandTotalAmount,
                [OUTLET_PARTY_LEDGER.COLUMNS.REMARKS]: `Outlet Purchase No (${docno})`,
                [OUTLET_PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'S',
                [OUTLET_PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
                [OUTLET_PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
            });


            if ((body.is_debit_note === true) && Number(body.total_debit_note_amount) > 0) {

                // STEP 12: INSERT PURCHASE RETURN MASTER
                const [response] = await trx(OUTLET_DEBIT_NOTE_MASTER.NAME)
                    .returning("id")
                    .insert({
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DOC_DATE]: new Date(),
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.PURCHASE_DOC_NO]: docno,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.PURCHASE_DOC_DATE]: new Date(),
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.COMPANY_ID]: body.company_id || 1,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.TOTAL_INVOICE_AMOUNT]: body.memo_invoice_amt || 0,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.PURCHASE_TOTAL_AMT]: body.grand_total_amt || 0,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.TOTAL_DEBIT_NOTE_AMOUNT]: body.total_debit_note_amount || 0,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.REMARK]: body.remark || 'DEBIT NOTE',
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.IS_ACTIVE]: true,
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.CREATED_AT]: new Date(),
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
                    });

                const debitNoteMasterId = response.id;
                const debitNoteMasterDocno = String(debitNoteMasterId);

                // STEP 2: UPDATE DOC NO
                await trx(OUTLET_DEBIT_NOTE_MASTER.NAME)
                    .where(OUTLET_DEBIT_NOTE_MASTER.COLUMNS.ID, debitNoteMasterId)
                    .update({
                        [OUTLET_DEBIT_NOTE_MASTER.COLUMNS.DOC_NO]: debitNoteMasterDocno
                    });

                // STEP 3: DEBIT NOTE AMOUNT (ONLY MRP MISMATCH)
                if (_.isArray(body.outlet_purchase_details) && body.outlet_purchase_details.length > 0) {

                    const debitNoteDetailsData = [];

                    for (const element of body.outlet_purchase_details) {

                        // ✅ ONLY MRP mismatch → push
                        if (Boolean(element.mrp_mismatch_flag) === true) {
                            const qty = Number(element.qty) || 0;
                            const purchaseRate = Number(element.purchase_rate) || 0;
                            const mrp = Number(element.mrp) || 0;
                            const amount = purchaseRate * qty;

                            debitNoteDetailsData.push({
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.OUTLET_DEBIT_NOTE_MST_ID]: debitNoteMasterId,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.PRODUCT_CODE]: element.product_code,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.QTY]: qty,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.RATE]: purchaseRate,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.MRP]: mrp,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.AMOUNT]: amount,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.REASON]: element.reason || 16,
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.CREATED_AT]: new Date(),
                                [OUTLET_DEBIT_NOTE_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
                            });
                        }

                        // ✅ Insert only if mismatch items exist
                        if (debitNoteDetailsData.length > 0) {
                            await trx.batchInsert(
                                OUTLET_DEBIT_NOTE_DETAILS.NAME,
                                debitNoteDetailsData,
                                1000
                            );
                        }
                    }


                }

            }

            await trx.commit();

            // Final response
            return {
                success: true,
                docno,
            };

        } catch (error) {
            await trx.rollback();
            console.error("Transaction Failed:", error);

            if (error?._code === 404 || error?._code === 400) {
                throw error;
            }
            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Outlet Purchase transaction failed.",
                property: "",
                code: "OUTLET_PURCHASE_GENERATION_FAILED",
            });
        }

    }


    return {
        generateOutletPurchaseDocnoRepo,
        getOutletPurchaseOutletListRepo,
        getOutletPurchaseSupplierListRepo,
        getOutletPurchasePoListRepo,
        getOutletPurchaseItemListRepo,
        postOutletPurchaseRepo,
        getOutletGrnByIdRepo,
        postOutletPurchaseReturnRepo,
        getOutletPurchaseDetailsRepo,
        getOutletPurchaseDetailsNewRepo,
        postOutletManualPurchaseRepo

    };
}
module.exports = OutletRepo
