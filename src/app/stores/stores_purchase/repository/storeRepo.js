const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const {
    OUTLET_PURCHASE_MASTER,
    OUTLET_PURCHASE_DETAILS,
    OUTLET_PURCHASE_BATCH_DETAILS,
    OUTLET_PARTY_LEDGER,
    OUTLET_DEBIT_NOTE_MASTER,
    OUTLET_DEBIT_NOTE_DETAILS,
    STORE_PO_MASTER,
    STORE_PO_DETAILS,
    STORE_PURCHASE_RETURN_MASTER,
    STORE_PURCHASE_RETURN_DETAILS,
    REASON
} = require("../commons/constants")
const _ = require("lodash");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { SUPPLIER } = require("../../../catalog/item/commons/constants")
const { OUTLET_STOCK_LEDGER } = require("../../../dashboard/outlet_sales/commons/constants")
const { OUTLET_PRODUCT_MAPPING, ITEM, TYPEDESIGN } = require("../../../catalog/commons")
const { UNITS } = require("../../../catalog/units/commons/constants");
const { SUPPLIER_OUTLET_MAPPING } = require("../../../catalog/supplier/commons/constants");
const { USERS } = require("../../../accounts/roles/commons/constants");



function storeRepo(fastify) {


    async function postStorePoPurchaseRepo({ params, body, logTrace, userDetails, financialYear }) {
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

                    const productDetails = await trx(`${STORE_PO_DETAILS.NAME} AS ${STORE_PO_DETAILS.NAME}`)
                        .select([
                            `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.CAT_ID} AS category_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID} AS sub_category_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID} AS brand_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID} AS brand_company_id`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BARCODE} AS barcode`,
                            `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PURCHASE_RATE} AS pur_rate`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.HSN} AS hsn`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE} AS sale_rate`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.CESS} AS cess`,
                            `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.GST} AS gst`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTTYPE}`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTVALUE}`,
                            `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.MRP} AS mrp`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.FIXEDMARGIN}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
                        ])
                        .innerJoin(
                            `${OUTLET_PRODUCT_MAPPING.NAME}`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`,
                            `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PROD_ID}`
                        )
                        .innerJoin(
                            `${ITEM.NAME}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`,
                            `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PROD_ID}`
                        )
                        .where(`${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PONO}`, po_no)
                        .andWhere(`${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PROD_ID}`, product_id)
                        .andWhere(`${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.OUTLET_ID}`, outletId)
                        .andWhere(`${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.SUPPLIER_ID}`, supplierId)
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
                    const sale_rate = Number(productDetails.sale_rate) || 0;
                    const acceptedMargin = Number(productDetails.fixedmargin) || 0;
                    const givenMargin = ((mrp - purchaseRate) / mrp)
                    const salesMargin = (sale_rate - purchaseRate) / sale_rate

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
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.ACCEPTED_MARGIN]: acceptedMargin || 0,

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
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CREATED_AT]: new Date(),

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SALES_MARGIN]: salesMargin,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.GIVEN_MARGIN]: givenMargin,

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

    async function postStoreManualPurchaseRepo({ params, body, logTrace, userDetails, financialYear }) {
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

                    const productDetails = await trx(`${OUTLET_PRODUCT_MAPPING.NAME} AS ${OUTLET_PRODUCT_MAPPING.NAME}`)
                        .select([
                            `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID} AS category_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID} AS sub_category_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID} AS brand_id`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID} AS brand_company_id`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BARCODE} AS barcode`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_RATE} AS pur_rate`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.HSN} AS hsn`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE} AS sale_rate`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.CESS} AS cess`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.GST} AS gst`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTTYPE}`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTVALUE}`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MRP} AS mrp`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.FIXEDMARGIN}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
                        ])
                        .innerJoin(
                            `${ITEM.NAME}`,
                            `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`,
                            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
                        )
                        .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`, product_id)
                        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outletId)
                        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`, supplierId)
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
                    const sale_rate = Number(productDetails.sale_rate) || 0;
                    const acceptedMargin = Number(productDetails.fixedmargin) || 0;
                    const givenMargin = ((mrp - purchaseRate) / mrp)
                    const salesMargin = (sale_rate - purchaseRate) / sale_rate

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
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.ACCEPTED_MARGIN]: acceptedMargin || 0,

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
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.CREATED_AT]: new Date(),

                        [OUTLET_PURCHASE_DETAILS.COLUMNS.SALES_MARGIN]: salesMargin,
                        [OUTLET_PURCHASE_DETAILS.COLUMNS.GIVEN_MARGIN]: givenMargin,

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

    async function postStorePORepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;

        const supplierDetails = await knex(SUPPLIER.NAME)
            .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
            .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
            .first()

        if (!supplierDetails || supplierDetails == undefined) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Supplier not found`,
                property: "",
                code: "NOT_FOUND"
            });
        }

        const { gst_type } = supplierDetails

        console.log(Number(gst_type), "supplier details");

        // Get the current max ID
        // const [{ max_id }] = await knex(STORE_PO_MASTER.NAME).max("id as max_id");
        // let nextId = (max_id || 0) + 1; 

        const purchaseOrderData = {
            // [STORE_PO_MASTER.COLUMNS.ID]: nextId,
            [STORE_PO_MASTER.COLUMNS.PODATE]: body.podate,
            [STORE_PO_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
            [STORE_PO_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
            [STORE_PO_MASTER.COLUMNS.EXPIRY_DATE]: body.expiry_date,
            [STORE_PO_MASTER.COLUMNS.COMPANY_ID]: userDetails.company_id,
            [STORE_PO_MASTER.COLUMNS.TOTAL_ITEMS]: body.total_items,
            [STORE_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY]: body.total_order_qty,
            [STORE_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: body.sub_total_amt,
            [STORE_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? body.total_gst_amt : 0,
            [STORE_PO_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? body.total_gst_amt : 0,
            [STORE_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.total_cess_amt,
            [STORE_PO_MASTER.COLUMNS.ROFF]: body.roff,
            [STORE_PO_MASTER.COLUMNS.UN_APPROVAL_COMMENTS]: '',
            [STORE_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: body.grand_total_amt,
            [STORE_PO_MASTER.COLUMNS.PO_TYPE]: isNaN(Number(body?.type_id)) ? 0 : Number(body?.type_id),
            [STORE_PO_MASTER.COLUMNS.PURCHASE_ORDER_TYPE]: body.purchase_order_type,
            [STORE_PO_MASTER.COLUMNS.PO_REF_NO]: body.po_ref_no,
            [STORE_PO_MASTER.COLUMNS.MBQ_REF_NO]: 0,
            [STORE_PO_MASTER.COLUMNS.AMENDMENT]: 0,
            [STORE_PO_MASTER.COLUMNS.IS_APPROVED_BY]: 0,
            [STORE_PO_MASTER.COLUMNS.WH_ID]: 1,
            [STORE_PO_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
            [STORE_PO_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
            [STORE_PO_MASTER.COLUMNS.CREATED_AT]: new Date(),
        };

        const purchaseOrderInsertQuery = await knex(STORE_PO_MASTER.NAME)
            .returning(STORE_PO_MASTER.COLUMNS.ID)
            .insert(purchaseOrderData);

        const purchaseOrderId = purchaseOrderInsertQuery[0].id;

        const pono = `${purchaseOrderId}`;

        await knex(STORE_PO_MASTER.NAME)
            .where(STORE_PO_MASTER.COLUMNS.ID, purchaseOrderId)
            .update({
                [STORE_PO_MASTER.COLUMNS.PONO]: pono,
                [STORE_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
            });

        if (body.purchase_order_details && body.purchase_order_details.length > 0) {
            const purchaseOrderDetailsData = body.purchase_order_details.map(detail => ({
                [STORE_PO_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID]: purchaseOrderId,
                [STORE_PO_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                [STORE_PO_DETAILS.COLUMNS.PONO]: pono,
                [STORE_PO_DETAILS.COLUMNS.PODATE]: body.podate,
                [STORE_PO_DETAILS.COLUMNS.BALANCE]: detail.balance,
                [STORE_PO_DETAILS.COLUMNS.PROD_ID]: detail.product_id,
                [STORE_PO_DETAILS.COLUMNS.CAT_ID]: detail.category_id,
                [STORE_PO_DETAILS.COLUMNS.SUB_CAT_ID]: detail.sub_category_id,
                [STORE_PO_DETAILS.COLUMNS.HEAD_ID]: detail.head_id,
                [STORE_PO_DETAILS.COLUMNS.TYPE_DESIGN_ID]: detail.type_design_id,
                [STORE_PO_DETAILS.COLUMNS.UOM_ID]: detail.uom_id,
                [STORE_PO_DETAILS.COLUMNS.BARCODE]: detail.barcode,
                [STORE_PO_DETAILS.COLUMNS.MRP]: detail.mrp,
                [STORE_PO_DETAILS.COLUMNS.PURCHASE_RATE]: detail.pur_rate,
                [STORE_PO_DETAILS.COLUMNS.COST_PRICE]: detail.pur_rate,
                [STORE_PO_DETAILS.COLUMNS.GST]: Number(gst_type) === 2 ? detail.gst : 0,
                [STORE_PO_DETAILS.COLUMNS.GST_AMOUNT]: Number(gst_type) === 2 ? detail.gst_amount : 0,
                [STORE_PO_DETAILS.COLUMNS.CGST]: (detail.gst && Number(detail.gst) > 0 && Number(gst_type) === 2) ? Number(detail.gst) / 2 : 0,
                [STORE_PO_DETAILS.COLUMNS.SGST]: (detail.gst && Number(detail.gst) > 0 && Number(gst_type) === 2) ? Number(detail.gst) / 2 : 0,
                [STORE_PO_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? detail.gst : 0,
                [STORE_PO_DETAILS.COLUMNS.IGST_AMOUNT]: Number(gst_type) === 2 ? detail.gst_amount : 0,
                [STORE_PO_DETAILS.COLUMNS.CESS]: detail.cess,
                [STORE_PO_DETAILS.COLUMNS.CESS_AMT]: detail.cess_amount,
                [STORE_PO_DETAILS.COLUMNS.AMOUNT]: detail.amount,
                [STORE_PO_DETAILS.COLUMNS.QTY]: detail.qty,
                [STORE_PO_DETAILS.COLUMNS.RECEIVED_QTY]: detail.received_qty,
                [STORE_PO_DETAILS.COLUMNS.CASE_QTY]: detail.case_qty,
                [STORE_PO_DETAILS.COLUMNS.LOOSE_QTY]: detail.loose_qty,
                [STORE_PO_DETAILS.COLUMNS.ORDER_QTY]: detail.loose_qty,
                [STORE_PO_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                [STORE_PO_DETAILS.COLUMNS.COMPANY_ID]: 1,
                [STORE_PO_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
                [STORE_PO_DETAILS.COLUMNS.CREATED_AT]: new Date(),
                [STORE_PO_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
                [STORE_PO_DETAILS.COLUMNS.PROD_CODE]: body.prod_code,
            }));
            await knex.batchInsert(STORE_PO_DETAILS.NAME, purchaseOrderDetailsData, 500);
        }
        return { success: true, purchase_order_id: purchaseOrderId };
    }

    async function putStorePoUnApprovedProduct({ body, params, logTrace, userDetails }) {
        const knex = this;
        const created_by = userDetails.id;

        const { un_approved_pono } = body;

        if (!Array.isArray(un_approved_pono) || un_approved_pono.length === 0) {
            throw CustomError.create({
                httpCode: StatusCodes.BAD_REQUEST,
                message: "No purchase orders provided for approval",
                property: "",
                code: "BAD_REQUEST"
            });
        }

        for (const po of un_approved_pono) {
            const { pono, approved, comments } = po;

            const query = knex(STORE_PO_MASTER.NAME)
                .where(STORE_PO_MASTER.COLUMNS.PONO, pono);

            const exists_response = await query;

            if (!exists_response.length) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: `Purchase order ${pono} is not found`,
                    property: "",
                    code: "NOT_FOUND"
                });
            }
            const updateData = {
                [STORE_PO_MASTER.COLUMNS.APPROVAL]: Number(approved),
                [STORE_PO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
                [STORE_PO_MASTER.COLUMNS.UPDATED_BY]: created_by
            };

            if (Number(approved) === 1) {
                updateData[STORE_PO_MASTER.COLUMNS.IS_APPROVED_BY] = created_by;
            }

            if (Number(approved) === 2) {
                updateData[STORE_PO_MASTER.COLUMNS.UN_APPROVAL_COMMENTS] = comments || "";
            }

            const query_update = await knex(STORE_PO_MASTER.NAME)
                .where(STORE_PO_MASTER.COLUMNS.PONO, pono)
                .update(updateData);

            if (!query_update) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_IMPLEMENTED,
                    message: `Failed to update purchase order ${pono}`,
                    code: "UPDATE_FAILED"
                });
            }

        }

        return { success: true };
    }

    async function putStorePurchaseOrderProductRepo({ params, body, userDetails, financialYear }) {
        const knex = this;
        const { po_no, company_id } = params;
        // Start a transaction to ensure atomicity
        const trx = await knex.transaction();
        try {

            // Step 1: Chek PURCHASE_MASTER_ID Already Exists
            const existingPurchaseOrderDetails = await trx(STORE_PO_MASTER.NAME)
                .select(
                    `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.ID}`,
                    `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.PONO}`
                )
                .where({
                    [STORE_PO_MASTER.COLUMNS.PONO]: String(po_no)
                })
                .where({
                    [STORE_PO_MASTER.COLUMNS.COMPANY_ID]: company_id
                })
                .first();

            if (!existingPurchaseOrderDetails && !existingPurchaseOrderDetails?.id) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Purchase Order Details was not found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const supplierDetails = await trx(SUPPLIER.NAME)
                .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
                .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
                .first()

            const { gst_type } = supplierDetails
            console.log(Number(gst_type), "supplier details");

            const purchaseOrderId = existingPurchaseOrderDetails?.id;
            console.log(existingPurchaseOrderDetails, purchaseOrderId, "purchase order details")
            // Step 2: Update the Purchase Order Master record based on the given `grn_id`
            const purchaseOrderUpdateResponse = await trx(`${STORE_PO_MASTER.NAME}`)
                .where({
                    [STORE_PO_MASTER.COLUMNS.ID]: purchaseOrderId, // Find the record by ID
                    [STORE_PO_MASTER.COLUMNS.COMPANY_ID]: company_id
                })
                .update({
                    [STORE_PO_MASTER.COLUMNS.PODATE]: body.podate,
                    [STORE_PO_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [STORE_PO_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [STORE_PO_MASTER.COLUMNS.EXPIRY_DATE]: body.expiry_date,
                    [STORE_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
                    [STORE_PO_MASTER.COLUMNS.TOTAL_ITEMS]: body.total_items,
                    [STORE_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY]: body.total_order_qty,
                    [STORE_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: body.sub_total_amt,
                    [STORE_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? body.total_gst_amt : 0,
                    [STORE_PO_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? body.total_gst_amt : 0,
                    [STORE_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.total_cess_amt,
                    [STORE_PO_MASTER.COLUMNS.ROFF]: body.roff,
                    [STORE_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: body.grand_total_amt,
                    [STORE_PO_MASTER.COLUMNS.PO_TYPE]: isNaN(Number(body?.type_id)) ? 0 : Number(body?.type_id),
                    [STORE_PO_MASTER.COLUMNS.PURCHASE_ORDER_TYPE]: body.purchase_order_type,
                    [STORE_PO_MASTER.COLUMNS.MBQ_REF_NO]: 0,
                    [STORE_PO_MASTER.COLUMNS.AMENDMENT]: 0,
                    [STORE_PO_MASTER.COLUMNS.IS_APPROVED_BY]: userDetails.id,
                    [STORE_PO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
                    [STORE_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
                });

            // Step 3: If no rows were updated, throw an error (i.e., invalid `grn_id` or record not found)
            if (purchaseOrderUpdateResponse === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Failed to update purchase order details",
                    property: "",
                    code: "NOT_FOUND"
                });
            }


            // Step 4: Insert `PURCHASE_ORDER_DETAILS` (if provided)
            if (_.isArray(body.purchase_order_details) && body.purchase_order_details.length > 0) {
                const purchaseOrderDetailsData = _.map(body.purchase_order_details, (detail) => ({
                    [STORE_PO_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID]: purchaseOrderId,
                    [STORE_PO_DETAILS.COLUMNS.PODATE]: body.podate,
                    [STORE_PO_DETAILS.COLUMNS.BALANCE]: detail.balance,
                    [STORE_PO_DETAILS.COLUMNS.PROD_ID]: detail.product_id,
                    [STORE_PO_DETAILS.COLUMNS.CAT_ID]: detail.category_id,
                    [STORE_PO_DETAILS.COLUMNS.SUB_CAT_ID]: detail.sub_category_id,
                    [STORE_PO_DETAILS.COLUMNS.HEAD_ID]: detail.head_id,
                    [STORE_PO_DETAILS.COLUMNS.TYPE_DESIGN_ID]: detail.type_design_id,
                    [STORE_PO_DETAILS.COLUMNS.UOM_ID]: detail.uom_id,
                    [STORE_PO_DETAILS.COLUMNS.BARCODE]: detail.barcode,
                    [STORE_PO_DETAILS.COLUMNS.MRP]: detail.mrp,
                    [STORE_PO_DETAILS.COLUMNS.PURCHASE_RATE]: detail.pur_rate,
                    [STORE_PO_DETAILS.COLUMNS.QTY]: detail.qty,
                    [STORE_PO_DETAILS.COLUMNS.RECEIVED_QTY]: detail.received_qty,
                    [STORE_PO_DETAILS.COLUMNS.AMOUNT]: detail.amount,
                    [STORE_PO_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [STORE_PO_DETAILS.COLUMNS.GST]: Number(gst_type) === 2 ? detail.gst : 0,
                    [STORE_PO_DETAILS.COLUMNS.GST_AMOUNT]: Number(gst_type) === 2 ? detail.gst_amount : 0,
                    [STORE_PO_DETAILS.COLUMNS.CGST]: (detail.gst && Number(detail.gst) > 0 && Number(gst_type) === 2) ? Number(detail.gst) / 2 : 0,
                    [STORE_PO_DETAILS.COLUMNS.SGST]: (detail.gst && Number(detail.gst) > 0 && Number(gst_type) === 2) ? Number(detail.gst) / 2 : 0,
                    [STORE_PO_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? detail.gst : 0,
                    [STORE_PO_DETAILS.COLUMNS.IGST_AMOUNT]: Number(gst_type) === 1 ? detail.gst_amount : 0,
                    [STORE_PO_DETAILS.COLUMNS.CESS]: detail.cess,
                    [STORE_PO_DETAILS.COLUMNS.CESS_AMT]: detail.cess_amount,
                    [STORE_PO_DETAILS.COLUMNS.CASE_QTY]: detail.case_qty,
                    [STORE_PO_DETAILS.COLUMNS.LOOSE_QTY]: detail.loose_qty,
                    [STORE_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
                    [STORE_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),

                }));

                // Batch insert in chunks of 1000 records
                if (purchaseOrderDetailsData.length > 0) {
                    for (let i = 0; i < purchaseOrderDetailsData.length; i += 1000) {
                        const batch = purchaseOrderDetailsData.slice(i, i + 1000);

                        await trx(STORE_PO_DETAILS.NAME)
                            .insert(batch)
                            .onConflict([STORE_PO_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID, STORE_PO_DETAILS.COLUMNS.PROD_ID])
                            .merge(); // merge will update if conflict happens, else insert
                    }
                }
            }

            // Commit transaction (all operations successful)
            await trx.commit();
            return { success: true };
        } catch (error) {
            // Rollback transaction in case of any failure
            await trx.rollback();
            console.error("Transaction Failed:", error);

            if (error?._code === 404) {
                // Re-throw the custom 404 error as is
                throw error;
            }

            // Default to internal server error if it's not a known custom error
            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Purchase Order transaction failed.",
                property: "",
                code: "TRANSACTION_FAILED"
            });
        }
    }

    async function getStorePoUnApprovedProduct({ body, params, queryString, logTrace }) {
        const knex = this;
        const { approved, from_date, to_date, company_id } = params;
        const currentDate = new Date().toISOString().split('T')[0];
        console.log(currentDate); // Example output: "2025-03-05"

        // find expired date purchase order
        const check_expried_query = knex
            .select([
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.PONO}`
            ])
            .from(`${STORE_PO_MASTER.NAME} as ${STORE_PO_MASTER.NAME}`)
            .where(`${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
            .whereRaw(
                `DATE(${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.EXPIRY_DATE}) <  ?`,
                [currentDate]
            )

        const expriedPoResponse = await check_expried_query;
        console.log(expriedPoResponse, "po response")
        const expried_po = expriedPoResponse.map(i => String(i.pono))
        console.log(expried_po, "expred po")
        // Update expired purchase orders (only if there are expired POs)
        // Ensure expired POs exist before updating
        if (expried_po.length > 0) {
            await knex(STORE_PO_MASTER.NAME) // ✅ Use actual table name (not alias)
                .where(`${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
                .whereIn(STORE_PO_MASTER.COLUMNS.PONO, expried_po) // ✅ Use column name directly
                .update({ [STORE_PO_MASTER.COLUMNS.EXPIRED]: true }); // ✅ Correct update syntax
        }

        console.log("Expired POs updated successfully!");

        const query = knex
            .select([
                `${STORE_PO_MASTER.NAME}.*`,
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.UN_APPROVAL_COMMENTS} as reason`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
                `${USERS.NAME}.${USERS.COLUMNS.USER_NAME} as approver_name`
            ])
            .from(`${STORE_PO_MASTER.NAME} as ${STORE_PO_MASTER.NAME}`)
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .leftJoin(
                `${USERS.NAME} as ${USERS.NAME}`,
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.IS_APPROVED_BY}`,
                `${USERS.NAME}.${USERS.COLUMNS.ID}`
            )
            .where(`${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
            .whereRaw(
                `DATE(${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.PODATE}) >= ?`,
                [from_date]
            )
            .whereRaw(
                `DATE(${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.PODATE}) <= ?`, // Fixed this condition
                [to_date]
            )
            .orderBy(`${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.ID}`, "DESC");

        // Additional conditions for `approved` field
        if (Number(approved) === 0) {
            query.where(
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.APPROVAL}`,
                0
            )
            query.andWhere(`${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.EXPIRED}`, false)
        }
        if (Number(approved) === 1) {
            query.where(
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.APPROVAL}`,
                1
            )
        }

        if (Number(approved) === 2) {
            query.where(
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.APPROVAL}`,
                2
            );
        }
        logQuery({
            logger: fastify.log,
            query,
            context: "Get Po details",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Purchase Order not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        const purchaseOrderDetails = await Promise.all(
            response.map(async (po, index) => {
                const po_details_lines = await knex
                    .select([
                        `${STORE_PO_DETAILS.NAME}.*`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`
                    ])
                    .from(`${STORE_PO_DETAILS.NAME} as ${STORE_PO_DETAILS.NAME}`)
                    .leftJoin(
                        `${ITEM.NAME} as ${ITEM.NAME}`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PROD_ID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                    )
                    .where(
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID}`,
                        po.id
                    );

                let po_status;
                switch (po.approval) {
                    case 0:
                        po_status = "Pending";
                        break;
                    case 1:
                        po_status = "Approval";
                        break;
                    case 2:
                        po_status = "UnApproval";
                        break;
                    case 3:
                        po_status = "GRN Complete";
                        break;
                    default:
                        po_status = "Pending";
                }
                return {
                    ...po,
                    Sno: index + 1, // ✅ index will increment correctly here
                    po_status,
                    po_type_name: "Manual",
                    po_details_lines,
                };
            })
        );


        return purchaseOrderDetails;
    }

    async function getStorePurchaseOrderApprovedItem({ body, params, logTrace }) {
        const knex = this;
        const { pono } = params;
        // Step 1: Chek PURCHASE_MASTER_ID Already Exists
        const existingPurchaseOrderDetails = await knex(STORE_PO_MASTER.NAME)
            .select(
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.ID}`,
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.PONO}`
            )
            .where({
                [STORE_PO_MASTER.COLUMNS.PONO]: String(pono).toLocaleUpperCase()
            })
            .first();

        if (!existingPurchaseOrderDetails && !existingPurchaseOrderDetails?.id) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Purchase Order Details was not found",
                property: "",
                code: "NOT_FOUND"
            });
        }
        const purchaseOrderId = existingPurchaseOrderDetails?.id;
        const query = knex
            .select([
                `${STORE_PO_MASTER.NAME}.*`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as add3`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as add4`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN} as gstin`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`
            ])
            .from(`${STORE_PO_MASTER.NAME} as ${STORE_PO_MASTER.NAME}`)
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .where(
                `${STORE_PO_MASTER.NAME}.${STORE_PO_MASTER.COLUMNS.ID}`,
                purchaseOrderId
            )

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Po details",
            logTrace
        });
        const response = await query;

        const purchaseOrderDetails = await Promise.all(
            response.map(async po => {
                const po_details_lines = await knex
                    .select([
                        `${ITEM.NAME}.*`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as soh`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.MRP} as mrp`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PURCHASE_RATE} as pur_rate`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.GST} as gst`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.IGST} as igst`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.BARCODE} as barcode`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.QTY} as qty`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.LOOSE_QTY} as order_qty`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.QTY} as po_order_qty`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.LOOSE_QTY} as po_loose_qty`
                    ])
                    .from(`${STORE_PO_DETAILS.NAME} as ${STORE_PO_DETAILS.NAME}`)
                    .leftJoin(
                        `${ITEM.NAME} as ${ITEM.NAME}`,
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PROD_ID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${UNITS.NAME} as ${UNITS.NAME}`, // ✅ Corrected alias for UNITS table
                        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
                    )
                    .where(
                        `${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID}`,
                        purchaseOrderId
                    )

                    .orderBy(`${STORE_PO_DETAILS.NAME}.${STORE_PO_DETAILS.COLUMNS.PROD_ID}`, "ASC");

                // ✅ Add `tray_id` and `tray_count` as `0`
                const updatedPoDetailsLines = po_details_lines.map((detail) => ({
                    ...detail,
                    cost_price: detail.pur_rate,
                    gst: Number(po.gst_type) === 2 ? detail.gst : detail.igst,
                    tray_id: 0,
                    tray_count: 0,
                    free_qty: 0,
                    return_qty: 0,
                    sale_rate: 0
                }));

                return { ...po, po_details_lines: updatedPoDetailsLines };
            })
        );

        return purchaseOrderDetails;
    }

    async function postStorePurchaseReturnRepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;

        // Start a transaction
        const trx = await knex.transaction();
        try {
            // Step 1: Available Balance Check
            if (_.isArray(body.purchase_return_details) && body.purchase_return_details.length > 0) {
                await Promise.all(
                    body.purchase_return_details.map(async (element) => {
                        const stockDetails = await trx(ITEM.NAME)
                            .select(
                                ITEM.COLUMNS.BALANCE,
                                ITEM.COLUMNS.PRODUCT_NAME
                            )
                            .where({ [ITEM.COLUMNS.ID]: element.product_id })
                            .first();

                        const balance = parseFloat(stockDetails?.balance) || 0;
                        const productName = String(stockDetails?.pro_name);
                        const returnQty = parseFloat(element.return_qty) || 0;
                        const returnFreeQty = parseFloat(element.return_free_qty) || 0;
                        const totalReturnQty = returnQty + returnFreeQty;
                        const purchaseMasterId = Number(body.purchase_master_id)
                        if (balance < totalReturnQty) {
                            throw CustomError.create({
                                httpCode: StatusCodes.NOT_FOUND,
                                message: `Stock (${balance}) is less than return qty (${totalReturnQty}) for Product Name ${productName}`,
                                property: "balance",
                                code: "STOCK_MISMATCHED"
                            });
                        }

                        if (purchaseMasterId != 0) {
                            const acceptedQty = parseFloat(element.accepted_qty) || 0;
                            if (returnQty > acceptedQty) {
                                throw CustomError.create({
                                    httpCode: StatusCodes.NOT_FOUND,
                                    message: `Actual Qty (${acceptedQty}) is less than return qty (${returnQty}) for Product Name ${productName}`,
                                    property: "balance",
                                    code: "STOCK_MISMATCHED"
                                });
                            }
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

            // Step 3: Insert into Purchase Return Master and retrieve the inserted ID
            const [response] = await trx(`${STORE_PURCHASE_RETURN_MASTER.NAME}`)
                .returning("id")
                .insert({
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.DOCDATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_DATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_AMOUNT]: body.total_amount,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.GRAND_TOTAL]: body.grand_total || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: body.grand_total || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID]: body.purchase_master_id,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || " ",
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.ROFF]: body.roff,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.RETURN_TYPE]: body.type,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? Number(body.igst) : 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? Number(body.igst) : 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.cess_amt || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.REMARK]: body.remark || " ",
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TDS_PERCENTAGE]: body.tds_percentage || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TDS_AMOUNT]: body.tds_amount || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EWAY]: 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_TYPE]: 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_DATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_VALID_DATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_PATH]: "",
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EINVOICE]: 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.AK_DATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.AKNO]: 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EFFECT_DATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.IRNNO]: 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.CREATED_AT]: new Date().toISOString(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
                });

            const purchase_return_mst_id = response.id;
            const docno = `${purchase_return_mst_id}`;

            // Step 4: Update DOCNO in Purchase Return Master
            await trx(`${STORE_PURCHASE_RETURN_MASTER.NAME}`)
                .where(STORE_PURCHASE_RETURN_MASTER.COLUMNS.ID, purchase_return_mst_id)
                .update({
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.DOCNO]: docno
                });

            // Step 5: Insert into Purchase Return Details
            if (_.isArray(body.purchase_return_details) && body.purchase_return_details.length > 0) {
                const purchaseReturnDetailsData = _.map(body.purchase_return_details, (element) => ({
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_mst_id,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.DOCNO]: docno,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.DOCDATE]: new Date(),
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRODID]: element.product_id,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRO_CODE]: element.product_code,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.BATCH_NO]: String(element.batch_no) || '',
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.EXPIRY_DATE]: element.expiry_date || new Date(),
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.ACCEPTED_QTY]: element.accepted_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.ACCEPTED_FREE_QTY]: element.accepted_free_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_QTY]: element.return_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.GRN_RETURN_QTY]: element.return_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY]: element.return_free_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.TEMP_RETURN_QTY]: element.return_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.TEMP_RETURN_FREE_QTY]: element.return_free_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.DIS_PER]: element.discount_percentage,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.DIS_AMT]: element.discount_amount,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RATE]: element.rate,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.AMOUNT]: element.amount || 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.MRP]: element.mrp,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.GST]: (Number(gst_type) === 2) ? Number(element.igst) : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.CGST]: (Number(gst_type) === 2) ? Number(element.igst) / 2 : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.SGST]: (Number(gst_type) === 2) ? Number(element.igst) / 2 : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.GST_AMOUNT]: (Number(gst_type) === 2) ? Number(element.rate) * Number(element.igst) * Number(element.return_qty) / 100 : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.IGST]: (Number(gst_type) === 1) ? Number(element.igst) : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.IGST_AMOUNT]: (Number(gst_type) === 1) ? Number(element.rate) * Number(element.igst) * Number(element.return_qty) / 100 : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.CESS]: element.cess || 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.CESS_AMT]: element.cess_amt || 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.REASON]: element.reason,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.CREATED_AT]: new Date(),
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
                }));

                // Batch insert in chunks of 1000 records
                if (purchaseReturnDetailsData.length > 0) {
                    await trx.batchInsert(STORE_PURCHASE_RETURN_DETAILS.NAME, purchaseReturnDetailsData, 1000);
                }
            }

            // Step 6: Update Supplier Balance
            const supplier = await trx(SUPPLIER.NAME)
                .select(SUPPLIER.COLUMNS.BALANCE)
                .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
                .first();

            console.log("Fetched Supplier Balance:", supplier);

            const grandTotalAmount = body.grand_total > 0 ? body.grand_total : 0;
            const currentBalance = parseFloat(supplier.balance || 0);
            const newBalance = currentBalance - grandTotalAmount;


            console.log("Current Balance:", currentBalance);
            console.log("Grand Total Amount:", grandTotalAmount);
            console.log("New Balance:", newBalance);

            if (!isNaN(newBalance)) {
                await trx(SUPPLIER.NAME)
                    .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
                    .update({ [SUPPLIER.COLUMNS.BALANCE]: newBalance });

                console.log("Supplier balance updated successfully");
            }


            // Step 7: Update Stock Ledger
            if (_.isArray(body.purchase_return_details)) {
                await Promise.all(
                    body.purchase_return_details.map(async (element) => {
                        const returnQty = parseFloat(element.return_qty) || 0;
                        const returnFreeQty = parseFloat(element.return_free_qty) || 0;
                        const totalReturnQty = returnQty + returnFreeQty;
                        const condition = {
                            [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.product_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: body.docdate,
                            [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
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
                                [OUTLET_STOCK_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.WH_ID]: body.wh_id || 1,
                                [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_AT]: new Date()
                            });
                        }
                    })
                );
            }

            // Step 8: Update Item Balance
            if (_.isArray(body.purchase_return_details)) {
                for (const element of body.purchase_return_details) {
                    const returnQty = parseFloat(element.return_qty) || 0;
                    const returnFreeQty = parseFloat(element.return_free_qty) || 0;

                    await trx(ITEM.NAME)
                        .where(ITEM.COLUMNS.ID, element.product_id)
                        .update({
                            [ITEM.COLUMNS.BALANCE]: trx.raw(
                                `${ITEM.COLUMNS.BALANCE} - ? - ?`,
                                [returnQty, returnFreeQty]
                            ),
                        });
                }
            }

            // Step 9: Update Return Balance
            if (_.isArray(body.purchase_return_details) && body.purchase_master_id != 0) {
                for (const element of body.purchase_return_details) {
                    const returnQty = parseFloat(element.return_qty) || 0;

                    // Fetch the existing return quantity
                    const returnStock = await trx(OUTLET_PURCHASE_DETAILS.NAME)
                        .select(OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_QTY)
                        .where({
                            [OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                            [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID]: body.purchase_master_id,
                            [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
                        })
                        .first(); // Get only the first row

                    const oldReturnQty = parseFloat(returnStock?.[OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_QTY]) || 0;
                    const totalReturnQty = oldReturnQty + returnQty;

                    // Update the return quantity
                    await trx(OUTLET_PURCHASE_DETAILS.NAME)
                        .where({
                            [OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                            [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID]: body.purchase_master_id,
                            [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
                        })
                        .update({
                            [OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_QTY]: totalReturnQty
                        });
                }
            }


            // Step 10: Insert Party Ledger
            await trx(OUTLET_PARTY_LEDGER.NAME).insert({
                [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: purchase_return_mst_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
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
                [OUTLET_PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
                [OUTLET_PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                [OUTLET_PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
            });

            // Commit the transaction
            await trx.commit();
            return { success: true, docno: docno };
        } catch (error) {
            // Rollback transaction in case of error
            // Rollback transaction in case of any failure
            await trx.rollback();
            console.error("Transaction Failed:", error);
            if (error?._code === 404) {
                // Re-throw the custom 404 error as is
                throw error;
            }

            // Default to internal server error if it's not a known custom error
            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Purchase Return transaction failed.",
                property: "",
                code: "TRANSACTION_FAILED"
            });
        }
    }

    async function putStorePurchaseReturnDetailsRepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;
        const { purchase_return_id } = params;
        // Start a transaction to ensure atomicity
        const trx = await knex.transaction();

        try {
            // Step 1: Available Balance Check
            if (_.isArray(body.purchase_return_details) && body.purchase_return_details.length > 0) {
                await Promise.all(
                    body.purchase_return_details.map(async (element) => {
                        const stockDetails = await trx(ITEM.NAME)
                            .select(
                                ITEM.COLUMNS.BALANCE,
                                ITEM.COLUMNS.PRODUCT_NAME
                            )
                            .where({ [ITEM.COLUMNS.ID]: element.product_id })
                            .first();

                        const balance = parseFloat(stockDetails?.balance) || 0;
                        const productName = String(stockDetails?.pro_name);
                        const returnQty = parseFloat(element.return_qty) || 0;
                        const returnFreeQty = parseFloat(element.return_free_qty) || 0;
                        const totalReturnQty = returnQty + returnFreeQty;
                        const purchaseMasterId = Number(body.purchase_master_id)
                        if (balance < totalReturnQty) {
                            throw CustomError.create({
                                httpCode: StatusCodes.NOT_FOUND,
                                message: `Stock (${balance}) is less than return qty (${totalReturnQty}) for Product Name ${productName}`,
                                property: "balance",
                                code: "STOCK_MISMATCHED"
                            });
                        }

                        if (purchaseMasterId != 0) {
                            const acceptedQty = parseFloat(element.accepted_qty) || 0;
                            if (returnQty < acceptedQty) {
                                throw CustomError.create({
                                    httpCode: StatusCodes.NOT_FOUND,
                                    message: `Actual Qty (${acceptedQty}) is less than return qty (${returnQty}) for Product Name ${productName}`,
                                    property: "balance",
                                    code: "STOCK_MISMATCHED"
                                });
                            }
                        }
                    })
                );
            }

            // Step 2: Get Supplier Gst_type
            const supplierDetails = await knex(SUPPLIER.NAME)
                .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
                .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
                .first()

            const { gst_type } = supplierDetails;

            // Step 3: Chek STORE_PURCHASE_RETURN_MASTER_ID Already Exists
            const existingPurchaseReturnDetails = await trx(STORE_PURCHASE_RETURN_MASTER.NAME)
                .select(
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.ID}`,
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.TEMP_GRAND_TOTAL}`,
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID}`,
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.DOCNO}`
                )
                .where({
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.ID]: purchase_return_id
                })
                .first();

            if (!existingPurchaseReturnDetails && !existingPurchaseReturnDetails?.id) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Purchase Return Details was not found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }
            const existingGrandTotal = Number(existingPurchaseReturnDetails.temp_grand_total) || 0;
            const purchase_master_id = Number(existingPurchaseReturnDetails.purchase_master_id) || 0;
            const docno = String(existingPurchaseReturnDetails.docno);
            // Step 4: Update the Purchase FMCG Return Master record based on the given `grn_id`
            const purchaseReturnUpdateResponse = await trx(`${STORE_PURCHASE_RETURN_MASTER.NAME}`)
                .where({
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.ID]: purchase_return_id // Find the record by ID
                })
                .update({
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.DOCDATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_DATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_AMOUNT]: body.total_amount,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.GRAND_TOTAL]: body.grand_total || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: body.grand_total || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID]: purchase_master_id || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || " ",
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.ROFF]: body.roff,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.RETURN_TYPE]: body.type,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? Number(body.igst) : 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? Number(body.igst) : 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.cess_amt || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.REMARK]: body.remark || " ",
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TDS_PERCENTAGE]: body.tds_percentage || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TDS_AMOUNT]: body.tds_amount || 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EWAY]: 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_TYPE]: 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_DATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_VALID_DATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EWAY_PATH]: "",
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EINVOICE]: 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.AK_DATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.AKNO]: 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.EFFECT_DATE]: new Date(),
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.IRNNO]: 0,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.UPDATED_AT]: new Date()
                });

            // Step 5: If no rows were updated, throw an error (i.e., invalid `grn_id` or record not found)
            if (purchaseReturnUpdateResponse === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Failed to update purchase return details",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            // Step 6: Insert `PURCHASE_FMCG_RETURN_DETAILS` (if provided)
            if (_.isArray(body.purchase_return_details) && body.purchase_return_details.length > 0) {
                const purchaseDetailsData = _.map(body.purchase_return_details, (element) => ({
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_id,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.DOCNO]: docno,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.DOCDATE]: body.docdate,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRODID]: element.product_id,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRO_CODE]: element.product_code,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.BATCH_NO]: element.batch_no,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.EXPIRY_DATE]: element.expiry_date,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.ACCEPTED_QTY]: element.accepted_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.ACCEPTED_FREE_QTY]: element.accepted_free_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_QTY]: element.return_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.GRN_RETURN_QTY]: element.return_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY]: element.return_free_qty,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.DIS_PER]: element.discount_percentage,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.DIS_AMT]: element.discount_amount,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RATE]: element.rate,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.AMOUNT]: element.amount || 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.MRP]: element.mrp,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.GST]: (Number(gst_type) === 2) ? Number(element.igst) : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.CGST]: (Number(gst_type) === 2) ? Number(element.igst) / 2 : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.SGST]: (Number(gst_type) === 2) ? Number(element.igst) / 2 : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.GST_AMOUNT]: (Number(gst_type) === 2) ? Number(element.rate) * Number(element.igst) * Number(element.return_qty) / 100 : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.IGST]: (Number(gst_type) === 1) ? Number(element.igst) : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.IGST_AMOUNT]: (Number(gst_type) === 1) ? Number(element.rate) * Number(element.igst) * Number(element.return_qty) / 100 : 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.CESS]: element.cess || 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.CESS_AMT]: element.cess_amt || 0,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.REASON]: element.reason,
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id
                }));

                // Batch insert in chunks of 1000 records
                if (purchaseDetailsData.length > 0) {
                    for (let i = 0; i < purchaseDetailsData.length; i += 1000) {
                        const batch = purchaseDetailsData.slice(i, i + 1000);

                        await trx(STORE_PURCHASE_RETURN_DETAILS.NAME)
                            .insert(batch)
                            .onConflict([STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PURMST_ID, STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRODID])
                            .merge(); // merge will update if conflict happens, else insert
                    }
                }
            }



            // Step 7: Update Purchase_RETURN_FMCG_Details
            if (_.isArray(body.purchase_return_details) && body.purchase_return_details.length > 0) {
                await Promise.all(
                    body.purchase_return_details.map(async (element) => {
                        const purchaseReturnDetail = await trx(STORE_PURCHASE_RETURN_DETAILS.NAME)
                            .select(
                                `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.TEMP_RETURN_QTY}`,
                                `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.TEMP_RETURN_FREE_QTY}`
                            )
                            .where({
                                [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_id,
                                [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRODID]: element.product_id
                            })
                            .first();

                        const oldReturnQty = parseFloat(purchaseReturnDetail.temp_return_qty) || 0;
                        const oldReturnFreeQty = parseFloat(purchaseReturnDetail.temp_return_free_qty) || 0;
                        const existingTotalReturnQty = oldReturnQty + oldReturnFreeQty;

                        const returnQty = parseFloat(element.return_qty) || 0;
                        const returnFreeQty = parseFloat(element.return_free_qty) || 0;
                        const totalReturnQty = returnQty + returnFreeQty;
                        console.log(existingTotalReturnQty, "existing purchase return qty");
                        console.log(totalReturnQty, "return qty")
                        await trx(ITEM.NAME)
                            .where(ITEM.COLUMNS.ID, element.product_id)
                            .update({
                                [ITEM.COLUMNS.BALANCE]: trx.raw(
                                    `${ITEM.COLUMNS.BALANCE} + ? - ?`,
                                    [parseFloat(existingTotalReturnQty) || 0, parseFloat(totalReturnQty) || 0]
                                )
                            });

                        await trx(STORE_PURCHASE_RETURN_DETAILS.NAME)
                            .where({
                                [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_id,
                                [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRODID]: element.product_id
                            })
                            .update({
                                [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.TEMP_RETURN_QTY]: returnQty,
                                [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.TEMP_RETURN_FREE_QTY]: returnFreeQty
                            });

                        const condition = {
                            [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.product_id,
                            [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: new Date(),
                            [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                        };

                        const existingStock = await trx(OUTLET_STOCK_LEDGER.NAME).where(condition).first();

                        if (existingStock) {
                            // Update existing stock record
                            await trx(OUTLET_STOCK_LEDGER.NAME)
                                .where(condition)
                                .update({
                                    [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY]: trx.raw(
                                        `${OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY} + ? - ?`,
                                        [parseFloat(existingTotalReturnQty) || 0, parseFloat(totalReturnQty) || 0]
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
                                [OUTLET_STOCK_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.WH_ID]: body.wh_id || 1,
                                [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_AT]: new Date()
                            });
                        }
                    })
                );
            }

            // Step 9: Update Return Balance
            if (_.isArray(body.purchase_return_details)) {
                if (body.purchase_master_id != 0) {
                    for (const element of body.purchase_return_details) {
                        const returnQty = parseFloat(element.return_qty) || 0;

                        await trx(OUTLET_PURCHASE_DETAILS.NAME)
                            .where({
                                [OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                                [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID]: body.purchase_master_id,
                                [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id
                            })
                            .update({
                                [OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_QTY]: returnQty
                            });
                    }
                }
            }


            // Step 8: Update Supplier Balance
            const supplier = await trx(SUPPLIER.NAME)
                .select(SUPPLIER.COLUMNS.BALANCE)
                .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
                .first();

            console.log("Fetched Supplier Balance:", supplier);

            const grandTotalAmount = body.grand_total > 0 ? body.grand_total : 0;
            const currentBalance = parseFloat(supplier.balance || 0);
            const newBalance = currentBalance + existingGrandTotal - grandTotalAmount;


            console.log("Current Balance:", currentBalance);
            console.log("Existing Balance:", existingGrandTotal);
            console.log("Grand Total Amount:", grandTotalAmount);
            console.log("New Balance:", newBalance);

            if (!isNaN(newBalance)) {
                await trx(SUPPLIER.NAME)
                    .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
                    .update({ [SUPPLIER.COLUMNS.BALANCE]: newBalance });

                await trx(STORE_PURCHASE_RETURN_MASTER.NAME)
                    .where(STORE_PURCHASE_RETURN_MASTER.COLUMNS.ID, purchase_return_id)
                    .update({ [STORE_PURCHASE_RETURN_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: grandTotalAmount });

                console.log("Supplier balance updated successfully");
            }

            // Step 9: Insert/ Update Party Ledger
            // Check if stock already exists for the product and date
            const existingSupplierDetails = await trx(OUTLET_PARTY_LEDGER.NAME)
                .where({
                    [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
                    [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
                    [OUTLET_PARTY_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id
                })
                .first();

            if (existingSupplierDetails) {
                // If stock exists, update the purchase quantity
                await trx(OUTLET_PARTY_LEDGER.NAME)
                    .where({
                        [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
                        [OUTLET_PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
                        [OUTLET_PARTY_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id
                    })
                    .update({
                        [OUTLET_PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: trx.raw(
                            `${OUTLET_PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT} + ?  - ? `,
                            [grandTotalAmount, existingGrandTotal] // ✅ Single array
                        ),
                        [OUTLET_PARTY_LEDGER.COLUMNS.UPDATED_AT]: new Date()
                    });
                console.log(grandTotalAmount, existingGrandTotal, "total amount")

            } else {
                // If party ledger does not exist, insert a new record
                await trx(OUTLET_PARTY_LEDGER.NAME).insert({
                    [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: purchase_return_id,
                    [OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
                    [OUTLET_PARTY_LEDGER.COLUMNS.OUTLET_ID]: body.outlet_id,
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
                    [OUTLET_PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
                    [OUTLET_PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                    [OUTLET_PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
                });
            }


            // Commit transaction (all operations successful)
            await trx.commit();
            return { success: true };

        } catch (error) {
            // Rollback transaction in case of any failure
            await trx.rollback();
            console.error("Transaction Failed:", error);

            if (error?._code === 404) {
                // Re-throw the custom 404 error as is
                throw error;
            }

            // Default to internal server error if it's not a known custom error
            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Purchase transaction failed.",
                property: "",
                code: "TRANSACTION_FAILED"
            });
        }
    }

    async function deleteStorePurchaseReturnDetailsRepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;
        const { purchase_return_id } = params;
        // Start a transaction to ensure atomicity
        const trx = await knex.transaction();

        try {
            // Step 1: Chek STORE_PURCHASE_RETURN_MASTER_ID Already Exists
            const existingPurchaseReturnDetails = await trx(STORE_PURCHASE_RETURN_MASTER.NAME)
                .select(
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.ID}`,
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID}`,
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.DOCDATE}`,
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.WH_ID}`,
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.SUPPLIER_ID}`,
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.GRAND_TOTAL}`,
                    `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID}`
                )
                .where({
                    [STORE_PURCHASE_RETURN_MASTER.COLUMNS.ID]: purchase_return_id
                })
                .first();

            if (!existingPurchaseReturnDetails && !existingPurchaseReturnDetails?.id) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Purchase Return Details was not found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            const { purchase_master_id, docdate, wh_id, supplier_id, grand_total, outlet_id } = existingPurchaseReturnDetails;
            console.log(existingPurchaseReturnDetails, "details")
            // Step 2: Get Purchase_Return_Details already exists
            const purchaseReturnDetail = await trx(STORE_PURCHASE_RETURN_DETAILS.NAME)
                .select([
                    `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.ID}`,
                    `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRODID}`,
                    `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_QTY} as qty`,
                    `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY} as free_qty `
                ])
                .where({
                    [STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_id
                })
            console.log(purchaseReturnDetail, "details")

            // Step 3: Update Purchase_RETURN_FMCG_Details
            if (Array.isArray(purchaseReturnDetail)) {
                await Promise.all(
                    purchaseReturnDetail.map(async (element) => {
                        const existingReturnQty = parseFloat(element.qty) || 0;
                        const existingReturnFreeQty = parseFloat(element.free_qty) || 0;
                        const existingTotalReturnQty = existingReturnQty + existingReturnFreeQty;
                        console.log(existingTotalReturnQty, "existing purchase return qty");
                        await trx(ITEM.NAME)
                            .where(ITEM.COLUMNS.ID, element.prodid)
                            .update({
                                [ITEM.COLUMNS.BALANCE]: trx.raw(
                                    `${ITEM.COLUMNS.BALANCE} + ?`,
                                    [parseFloat(existingTotalReturnQty) || 0]
                                )
                            });

                        const condition = {
                            [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.prodid,
                            [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: new Date(),
                            [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: outlet_id
                        };

                        const existingStock = await trx(OUTLET_STOCK_LEDGER.NAME).where(condition).first();

                        if (existingStock) {
                            // Update existing stock record
                            await trx(OUTLET_STOCK_LEDGER.NAME)
                                .where(condition)
                                .update({
                                    [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY]: trx.raw(
                                        `${OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY} - ?`,
                                        [parseFloat(existingTotalReturnQty) || 0]
                                    ),
                                });
                        } else {
                            // Insert new stock record
                            await trx(OUTLET_STOCK_LEDGER.NAME).insert({
                                [OUTLET_STOCK_LEDGER.COLUMNS.DATE]: new Date(),
                                [OUTLET_STOCK_LEDGER.COLUMNS.PROD_ID]: element.prodid,
                                [OUTLET_STOCK_LEDGER.COLUMNS.PURCHASE_RETURN_QTY]: existingTotalReturnQty,
                                [OUTLET_STOCK_LEDGER.COLUMNS.COMPANY_ID]: userDetails.company_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.OUTLET_ID]: outlet_id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                                [OUTLET_STOCK_LEDGER.COLUMNS.WH_ID]: wh_id || 1,
                            });
                        }

                        if (
                            purchase_master_id &&
                            purchase_master_id !== 0 &&
                            element &&
                            element.product_id
                        ) {
                            await trx(OUTLET_PURCHASE_DETAILS.NAME)
                                .where({
                                    [OUTLET_PURCHASE_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                                    [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_PURCHASE_MST_ID]: purchase_master_id,
                                    [OUTLET_PURCHASE_DETAILS.COLUMNS.OUTLET_ID]: outlet_id
                                })
                                .update({
                                    [OUTLET_PURCHASE_DETAILS.COLUMNS.RETURN_QTY]: 0
                                });
                        }
                    })
                );
            }


            // Step 4: Update Supplier Balance
            const supplier = await trx(SUPPLIER.NAME)
                .select(SUPPLIER.COLUMNS.BALANCE)
                .where(SUPPLIER.COLUMNS.ID, supplier_id)
                .first();

            console.log("Fetched Supplier Balance:", supplier);

            const grandTotalAmount = grand_total > 0 ? Number(grand_total) : 0;
            const currentBalance = parseFloat(supplier.balance || 0);
            const newBalance = currentBalance + grandTotalAmount;

            console.log("Current Balance:", currentBalance);
            console.log("Grand Total Amount:", grandTotalAmount);
            console.log("New Balance:", newBalance);

            if (!isNaN(newBalance)) {
                await trx(SUPPLIER.NAME)
                    .where(SUPPLIER.COLUMNS.ID, supplier_id)
                    .update({ [SUPPLIER.COLUMNS.BALANCE]: newBalance });

                console.log("Supplier balance updated successfully");
            }



            // Step 5: Delete Master and Details 
            await trx(STORE_PURCHASE_RETURN_MASTER.NAME)
                .where(STORE_PURCHASE_RETURN_MASTER.COLUMNS.ID, purchase_return_id)
                .del();

            await trx(STORE_PURCHASE_RETURN_DETAILS.NAME)
                .where(STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PURMST_ID, purchase_return_id)
                .del();

            await trx(OUTLET_PARTY_LEDGER.NAME)
                .where(OUTLET_PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID, purchase_return_id)
                .del();


            // Commit transaction (all operations successful)
            await trx.commit();
            return { success: true };

        } catch (error) {
            // Rollback transaction in case of any failure
            await trx.rollback();
            console.error("Transaction Failed:", error);

            if (error?._code === 404) {
                // Re-throw the custom 404 error as is
                throw error;
            }
            // Default to internal server error if it's not a known custom error
            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Purchase Return  transaction failed.",
                property: "",
                code: "TRANSACTION_FAILED"
            });
        }
    }

    async function getStorePurchaseReturnByIdRepo({ body, params, logTrace }) {
        const knex = this;
        const { purchase_return_id } = params;
        const query = knex
            .select([
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.ID}`,
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_NO} as invoice_no`,
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_NO} as invoice_no`,
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.INVOICE_DATE} as invoice_date`,
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.REMARK} as remark`,
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID} as purchase_master_id`,
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.RETURN_TYPE} as type_id`,
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.SUPPLIER_ID} as supplier_id`,
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID} as outlet_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as add3`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as add4`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`
            ])
            .from(`${STORE_PURCHASE_RETURN_MASTER.NAME} as ${STORE_PURCHASE_RETURN_MASTER.NAME}`)
            .leftJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .leftJoin(
                `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.OUTLET_ID}`,
                `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
            )
            .where(
                `${STORE_PURCHASE_RETURN_MASTER.NAME}.${STORE_PURCHASE_RETURN_MASTER.COLUMNS.ID}`,
                purchase_return_id
            )

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Purchase details",
            logTrace
        });

        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Purchase Return data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const purchaseDetails = await Promise.all(
            response.map(async purchase => {
                const purchase_return_details_lines = await knex
                    .select([
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRODID} as product_id`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRO_CODE} as product_code`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.BATCH_NO} as batch_no`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.EXPIRY_DATE} as expiry_date`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.ACCEPTED_QTY} as accepted_qty`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_QTY} as return_qty`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.ACCEPTED_FREE_QTY} as accepted_free_qty`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY} as return_free_qty`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID} as uom_id`,
                        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as balance`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.MRP} as mrp`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.RATE} as purchase_rate`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.DIS_PER} as discount_percentage`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.DIS_AMT} as discount_amount`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.GST} as gst`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.GST_AMOUNT} as gst_amount`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.IGST} as igst`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.IGST_AMOUNT} as igst_amount`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.CESS} as cess`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.CESS_AMT} as cess_amount`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.AMOUNT} as amount`,
                        knex.raw(
                            `to_jsonb(${REASON.NAME}.*) as reason`
                        )
                    ])
                    .from(`${STORE_PURCHASE_RETURN_DETAILS.NAME} as ${STORE_PURCHASE_RETURN_DETAILS.NAME}`)
                    .leftJoin(
                        `${ITEM.NAME} as ${ITEM.NAME}`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PRODID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${REASON.NAME} as ${REASON.NAME}`,
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.REASON}`,
                        `${REASON.NAME}.${REASON.COLUMNS.ID}`
                    )
                    .leftJoin(
                        `${UNITS.NAME} as ${UNITS.NAME}`, // ✅ Corrected alias for UNITS table
                        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
                    )
                    .where(
                        `${STORE_PURCHASE_RETURN_DETAILS.NAME}.${STORE_PURCHASE_RETURN_DETAILS.COLUMNS.PURMST_ID}`,
                        purchase.id
                    )


                return {
                    ...purchase,
                    gst: Number(purchase.gst_type) === 2,
                    igst: Number(purchase.gst_type) === 1,
                    purchase_return_details_lines
                };

            })
        );

        return purchaseDetails;
    }

    return {

        postStoreManualPurchaseRepo,
        postStorePORepo,
        getStorePoUnApprovedProduct,
        getStorePurchaseOrderApprovedItem,
        putStorePurchaseOrderProductRepo,
        putStorePoUnApprovedProduct,
        postStorePoPurchaseRepo,
        postStorePurchaseReturnRepo,
        putStorePurchaseReturnDetailsRepo,
        deleteStorePurchaseReturnDetailsRepo,
        getStorePurchaseReturnByIdRepo

    };
}
module.exports = storeRepo
