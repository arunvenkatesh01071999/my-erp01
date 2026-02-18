const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const _ = require('lodash');  // Import Lodash at the top
const { SUPPLIER, ITEM, BARCODE_LIST } = require("../../catalog/item/commons/constants")
const { UNITS } = require("../../catalog/units/commons/constants")
const { COMPANY } = require("../../catalog/supplier/commons/constants")
const {
  PURCHASE_FMCG_GRN_DETAILS,
  PURCHASE_FMCG_GRN_MASTER,
  STOCKLEDGER,
  PURCHASE_FV_GRN_MASTER,
  PURCHASE_GRN_FV_DETAILS,
  PURCHASE_FV_TRAY_DETAILS,
  PURCHASE_BATCH_DETAILS,
  TRAY_LEDGER,
  PURCHASE_GRN_TRAY_DETAILS
} = require("../commons/constants")
const { PURCHASE_ORDER_MASTER, PURCHASE_ORDER_DETAILS } = require("../../fmcg_purchase_order/commons/constants");



function purchaseGrnRepo(fastify) {
  async function postPurchaseGrnFmcgProductRepo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();

    try {
      const supplierDetails = await knex(SUPPLIER.NAME)
        .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
        .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
        .first()

      const { gst_type } = supplierDetails
      // Step 1: Insert into `PURCHASE_GRN_MST` (Purchase Grn Master)
      const [purchaseResponse] = await trx(`${PURCHASE_FMCG_GRN_MASTER.NAME}`)
        .returning("id")
        .insert({
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.DOCDATE]: new Date(),
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO]: body.party_invoice_no,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_DATE]: body.party_invoice_date,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.CUSTOMER_TYPE]: gst_type,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.PONO]: body.pono,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.PODATE]: body.podate,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.REMARK]: body.remark || " ",
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.RETURN_REMARK]: body.retrun_remark || " ",
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.PRODUCT_TYPE]: 1,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.TCS]: 0,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.TOTAL_ORDER_QTY]: body.total_order_qty,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.TOTAL_RECEIVED_QTY]: body.total_received_qty,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.WAREHOUSE_ID]: body.wh_id,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.IS_ACTIVE]: true,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.CREATED_BY]: userDetails.id
        });

      if (!purchaseResponse?.id && !purchaseResponse[0]?.id) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Failed to insert into purchase grn details ",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const purchase_id = purchaseResponse?.id || purchaseResponse[0]?.id;
      const docno = `${purchase_id}`;

      // Step 2: Update the generated docno
      const updatedRows = await trx(`${PURCHASE_FMCG_GRN_MASTER.NAME}`)
        .where(`${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID}`, purchase_id)
        .update({
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.DOCNO]: docno
        });

      if (updatedRows === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Failed to update document number",
          property: "",
          code: "NOT_FOUND"
        });
      }

      // Step 3: Insert Grn Details
      if (Array.isArray(body.purchase_grn_details) && body.purchase_grn_details.length > 0) {
        const allGrnDetailsData = [];
        let subTotalAmount = 0;
        let totalGst = 0;
        let totalGstAmount = 0;
        let totalIgst = 0;
        let totalIgstAmount = 0;
        let totalCess = 0;
        let totalCessAmount = 0;
        let totalReturnAmount = 0;

        // Use map to directly create the array of data
        body.purchase_grn_details.forEach(async (element) => {
          const purchaseRate = parseFloat(element.pur_rate) || 0;
          const receivedQty = parseFloat(element.received_qty) || 0;
          const gst = parseFloat(element.gst) || 0;
          const igst = parseFloat(element.igst) || 0;
          const cess = parseFloat(element.cess) || 0;
          const returnQty = parseFloat(element.return_qty) || 0;
          const freeQty = parseFloat(element.free_qty) || 0;

          console.log(cess, "cess amount")
          // Calculate amounts
          const gstAmount = Number(gst_type) === 2 ? purchaseRate * gst * receivedQty / 100 : 0; // Calculate GST amount (percentage)
          const cessAmount = purchaseRate * cess * receivedQty / 100; // Calculate cess amount (percentage)
          const igstAmount = Number(gst_type) === 1 ? purchaseRate * gst * receivedQty / 100 : 0; // Calculate IGST amount (percentage)
          const amount = receivedQty * purchaseRate; // Total amount
          const returnAmount = purchaseRate * returnQty; // Calculate cess amount (percentage)
          const totalQty = receivedQty + freeQty; // Calculate cess amount (percentage)
          console.log(cessAmount, "cess amount")
          // Add the values to totals for later calculations
          subTotalAmount += amount;
          totalGst += gst;
          totalGstAmount += gstAmount;
          totalIgst += igst;
          totalIgstAmount += igstAmount;
          totalCess += cess;
          totalCessAmount += cessAmount;
          totalReturnAmount += returnAmount;

          // Prepare the data object
          allGrnDetailsData.push({
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID]: purchase_id,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.DOCNO]: docno || '',
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.DOCDATE]: new Date(),
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PO_NO]: body.pono,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID]: element.product_id,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.HSN_CODE]: element.hsn,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_CODE]: element.prod_code || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SUB_CAT_ID]: element.sub_category_id || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.CAT_ID]: element.category_id || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.HEAD_ID]: element.head_id || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TYPE_DESIGN_ID]: element.type_design_id || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.UOM_ID]: element.uom_id || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.BARCODE]: element.barcode || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.ORDER_QTY]: element.order_qty || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.RECEIVED_QTY]: receivedQty,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.FREE_QTY]: freeQty,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_RATE]: element.pur_rate,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.AMOUNT]: amount,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.ACCEPTED_MARGIN]: parseFloat(element.accepted_margin) || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.MRP]: parseFloat(element.mrp) || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SALE_RATE]: parseFloat(element.mrp) || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.GST]: Number(gst_type) === 2 ? gst : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.GST_AMOUNT]: Number(gst_type) === 2 ? gstAmount : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.CGST]: Number(gst_type) === 2 ? Number(gst) / 2 : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SGST]: Number(gst_type) === 2 ? Number(gst) / 2 : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? gst : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.IGST_AMOUNT]: Number(gst_type) === 1 ? igstAmount : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.CESS]: cess,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_REC_QTY]: totalQty,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_GRN_RETURN_QTY]: returnQty,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SELF_LIFE_EXPIRY]: parseFloat(element.self_life_qty) || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.RETURN_QTY]: returnQty,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
          });

          await trx(ITEM.NAME)
            .where(ITEM.COLUMNS.ID, element.product_id)
            .update({
              [ITEM.COLUMNS.HSN]: parseFloat(element.hsn),
            })
        });


        // Calculate totals
        const totalBeforeRoundOff = subTotalAmount + totalGstAmount + totalIgstAmount + totalCessAmount;
        console.log(subTotalAmount, totalGstAmount, totalIgstAmount, totalIgstAmount, totalCessAmount, totalReturnAmount, "total values")
        const roundedTotal = Math.round(totalBeforeRoundOff);
        const roundOff = roundedTotal - totalBeforeRoundOff;
        const grandTotalAmount = totalBeforeRoundOff + roundOff;

        // Update master table with totals
        await trx(`${PURCHASE_FMCG_GRN_MASTER.NAME}`)
          .where(`${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID}`, purchase_id)
          .update({
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmount,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotalAmount,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.STATUS]: 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.DISCOUNT]: 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.ROFF]: roundOff,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.RETURN_AMOUNT]: totalReturnAmount,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.OTHER_CHARGES]: 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.GST_AMT]: Number(gst_type) === 2 ? totalGstAmount : 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.IGST_AMT]: Number(gst_type) === 1 ? totalIgstAmount : 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.ADVANCE]: 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.CESS_AMT]: totalCessAmount
          });

        // Insert in batches
        if (allGrnDetailsData.length > 0) {
          await trx.batchInsert(`${PURCHASE_FMCG_GRN_DETAILS.NAME}`, allGrnDetailsData, 1000);
        }

      }

      // Step 3: Insert Purchase_Grn_Tray_Details
      if (Array.isArray(body.tray_details)) {
        const trayInsertData = [];
        _.forEach(body.tray_details, (element) => {
          const totalTryQty = parseFloat(element.tray_qty) || 0;
          trayInsertData.push({
            [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
            [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.DOCDATE]: new Date(),
            [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_ID]: element.tray_id,
            [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_COUNT]: totalTryQty,
            [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TEMP_TRAY_QTY]: totalTryQty
          });
        });
        if (trayInsertData.length > 0) {
          await trx(PURCHASE_GRN_TRAY_DETAILS.NAME).insert(trayInsertData); // 🚀 Bulk insert
        }
      }

      // Step 4: Update Item Stock
      if (_.isArray(body.purchase_grn_details)) {
        await Promise.all(
          _.map(body.purchase_grn_details, async (element) => {
            const receivedQty = parseFloat(element.received_qty) || 0;
            const freeQty = parseFloat(element.free_qty) || 0;
            const totalReturnQty = parseFloat(element.return_qty) || 0;
            const totalQty = receivedQty + freeQty;
            const updateData = {
              [ITEM.COLUMNS.BALANCE]: trx.raw(
                `${ITEM.COLUMNS.BALANCE} + ? - ?`,
                [totalQty, totalReturnQty]
              ),
            };
            await trx(ITEM.NAME)
              .where(ITEM.COLUMNS.ID, element.product_id)
              .update(updateData)
          })
        );
      }

      // Step 5: Insert or Update Purchase Batch Details
      if (Array.isArray(body.purchase_grn_details)) {
        // Split purchase_grn_details into chunks of 500
        const purchaseGrnChunks = _.chunk(body.purchase_grn_details, 500);

        for (const grnChunk of purchaseGrnChunks) {
          await Promise.all(grnChunk.map(async (element) => {
            const batchItem = await trx(ITEM.NAME)
              .select(
                `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`
              )
              .where({
                [ITEM.COLUMNS.ID]: element.product_id,
                [ITEM.COLUMNS.BATCH_ITEM]: true
              })
              .first();
            if (Array.isArray(element.purchase_batch_details)) {
              const batchDetailsData = await Promise.all(
                element.purchase_batch_details.map(async (element1) => {
                  let manufacture_date = element1.manufacture_date ? new Date(element1.manufacture_date) : null;

                  // If batchItem exists, manufacture_date is required
                  if (batchItem && !manufacture_date) {
                    throw CustomError.create({
                      httpCode: StatusCodes.BAD_REQUEST,
                      message: `Invalid manufacture date for product ID: ${element.product_id}`,
                      property: "manufacture_date",
                      code: "INVALID_DATE"
                    });
                  }
                  const existingBatchDetails = await trx(PURCHASE_BATCH_DETAILS.NAME)
                    .select(
                      `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`
                    )
                    .where({
                      [PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
                      [PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                      [PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO]: String(element1.batch_no)
                    })
                    .first();

                  if (existingBatchDetails) {
                    throw CustomError.create({
                      httpCode: StatusCodes.BAD_REQUEST,
                      message: `Batch No Already Exists: ${element.batch_no}`,
                      property: "batch no",
                      code: "INVALID_BATCH_NO"
                    });
                  }

                  let expiry_date = null;
                  const expiryValue = Number(element1.expiry_value);
                  if (!isNaN(expiryValue) && expiryValue > 0 && manufacture_date) {
                    expiry_date = new Date(manufacture_date);
                    if (Number(element1.expiry_type) === 1) {
                      expiry_date.setMonth(expiry_date.getMonth() + expiryValue);
                    } else if (Number(element1.expiry_type) === 2) {
                      expiry_date.setDate(expiry_date.getDate() + expiryValue);
                    }
                  }

                  // If batchItem does NOT exist, expiry_date defaults to current date when not set
                  if (!batchItem && !expiry_date) {
                    expiry_date = new Date();
                  }

                  return {
                    [PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_CODE]: element.prod_code,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO]: String(element1.batch_no),
                    [PURCHASE_BATCH_DETAILS.COLUMNS.QTY]: Number(element1.qty) || 0,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.SELF_LIFE_EXPIRY]: Number(element1.self_life_qty) || 0,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.RETURN_QTY]: Number(element1.return_qty) || 0,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE]: manufacture_date
                      ? manufacture_date.toISOString().split('T')[0]
                      : null,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_ID]: Number(element1.expiry_type) || 1,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE]: expiryValue,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_DATE]: expiry_date.toISOString().split('T')[0]
                  };
                })
              );

              // Batch insert in chunks of 500
              await trx.batchInsert(PURCHASE_BATCH_DETAILS.NAME, batchDetailsData, 500);
            }
          }));
        }
      }



      // Step 6: Insert or Update Stock Ledger
      if (Array.isArray(body.purchase_grn_details)) {
        await Promise.all(body.purchase_grn_details.map(async (element) => {
          const receivedQty = parseFloat(element.received_qty) || 0;
          const freeQty = parseFloat(element.free_qty) || 0;
          const returnQty = parseFloat(element.return_qty) || 0;
          const totalQty = receivedQty + freeQty;

          // Check if stock already exists for the product and date
          const existingStock = await trx(STOCKLEDGER.NAME)
            .where({
              [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
              [STOCKLEDGER.COLUMNS.DATE]: new Date()
            })
            .first();

          if (existingStock) {
            console.log(existingStock, "existing stock")

            const grnDetails = await knex(PURCHASE_FMCG_GRN_DETAILS.NAME)
              .select(
                `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_REC_QTY}`,
                `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_GRN_RETURN_QTY}`)
              .where(PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID, purchase_id)
              .where(PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID, element.product_id)
              .first()

            const tempGrnQty = parseFloat(grnDetails?.temp_rec_qty) || 0;
            const tempGrnReturnQty = parseFloat(grnDetails?.temp_grn_return_qty) || 0;
            // If stock exists, update the purchase quantity
            await trx(STOCKLEDGER.NAME)
              .where({
                [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
                [STOCKLEDGER.COLUMNS.DATE]: new Date()
              })
              .update({
                [STOCKLEDGER.COLUMNS.PUR_QTY]: trx.raw(
                  `${STOCKLEDGER.COLUMNS.PUR_QTY} + ? `,
                  [tempGrnQty] // ✅ Single array
                ),

                [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: trx.raw(
                  `${STOCKLEDGER.COLUMNS.PUR_RET_QTY} + ? `,
                  [tempGrnReturnQty]
                ),
                [STOCKLEDGER.COLUMNS.UPDATED_AT]: new Date(),
                [STOCKLEDGER.COLUMNS.UPDATED_BY]: userDetails.id
              });

          } else {
            // If stock does not exist, insert a new record
            await trx(STOCKLEDGER.NAME).insert({
              [STOCKLEDGER.COLUMNS.DATE]: new Date(), // Ensure date is valid
              [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id, // Mandatory field
              [STOCKLEDGER.COLUMNS.PUR_QTY]: totalQty, // Default to 0 if missing,
              [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: returnQty, // Default to 0 if missing
              [STOCKLEDGER.COLUMNS.COMPANY_ID]: body.company_id, // Ensure company ID consistency
              [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id, // Record creator ID
              [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id || 1,// Allow null warehouse ID
              [STOCKLEDGER.COLUMNS.CREATED_AT]: new Date() // Ensure date is valid
            });
          }
        }));
      }

      // Step 7: Insert or Update Tray Ledger
      // Check if purchase_tray_details exists and is an array
      if (Array.isArray(body.tray_details)) {
        // Process each tray detail
        await Promise.all(body.tray_details.map(async (element) => {
          if (element.tray_id > 0 && element.tray_qty > 0) {
            const receivedQty = parseFloat(element.tray_qty) || 0;
            // Step 1: Check if stock already exists for the tray_id and docdate
            const existingStock = await trx(TRAY_LEDGER.NAME)
              .where({
                [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date()
              })
              .first();

            if (existingStock) {
              console.log(existingStock, "tray details")
              const trayDetails = await knex(PURCHASE_GRN_TRAY_DETAILS.NAME)
                .select(
                  `${PURCHASE_GRN_TRAY_DETAILS.NAME}.${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TEMP_TRAY_QTY}`
                )
                .where(PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID, purchase_id)
                .where(PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_ID, element.tray_id)
                .first();

              const tempTrayQty = parseFloat(trayDetails?.temp_tray_qty) || 0;
              // If stock exists, update the purchase quantity and balance
              await trx(TRAY_LEDGER.NAME)
                .where({
                  [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                  [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date()
                })
                .update({
                  [TRAY_LEDGER.COLUMNS.RECEIVED_QTY]: trx.raw(
                    `${TRAY_LEDGER.COLUMNS.RECEIVED_QTY} -? + ? `,
                    [tempTrayQty, receivedQty]
                  ),
                  [TRAY_LEDGER.COLUMNS.BALANCE]: trx.raw(
                    `${TRAY_LEDGER.COLUMNS.BALANCE} -? + ? `,
                    [tempTrayQty, receivedQty]
                  ),
                  [TRAY_LEDGER.COLUMNS.UPDATED_AT]: new Date()
                });
            } else {
              // If stock does not exist, insert a new record
              await trx(TRAY_LEDGER.NAME).insert({
                [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date(), // Ensure date is valid
                [TRAY_LEDGER.COLUMNS.CUSTOMER_ID]: body.supplier_id, // Mandatory field, default value
                [TRAY_LEDGER.COLUMNS.RECEIVED_QTY]: receivedQty, // Sum of received and free quantities
                [TRAY_LEDGER.COLUMNS.TEMP_TRAY_QTY]: receivedQty, // Sum of received and free quantities
                [TRAY_LEDGER.COLUMNS.ISSUED_QTY]: 0, // Default to 0 if missing
                [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id, // Mandatory field
                [TRAY_LEDGER.COLUMNS.WASTE_QTY]: 0, // Default to 0
                [TRAY_LEDGER.COLUMNS.OPENING]: 0, // Record creator ID
                [TRAY_LEDGER.COLUMNS.BALANCE]: receivedQty, // Set initial balance
                [TRAY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id, // Ensure company ID consistency
                [TRAY_LEDGER.COLUMNS.TYPE]: 1, // Record creator ID (assuming '1' represents a specific type)
                [TRAY_LEDGER.COLUMNS.YEAR]: financialYear, // Set financial year
                [TRAY_LEDGER.COLUMNS.CREATED_AT]: new Date()// Record creator ID
              });
            }
          }
        }));
      }


      // Step 8: Mark Purchase Order as Expired (if applicable)
      if (Number(body.total_order_qty) === Number(body.total_received_qty)) {
        // Check if purchase order exists for the given PONO
        const existingPO = await trx(PURCHASE_ORDER_MASTER.NAME)
          .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, body.pono)
          .first();

        if (existingPO) {
          // Mark the purchase order as expired
          await trx(`${PURCHASE_ORDER_MASTER.NAME} `)
            .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, String(body.pono))
            .update({
              [PURCHASE_ORDER_MASTER.COLUMNS.IS_GRN_COMPLETE]: true,
              [PURCHASE_ORDER_MASTER.COLUMNS.GRN_NO]: docno
            });

          // Mark all associated purchase order details as expired
          await trx(`${PURCHASE_ORDER_DETAILS.NAME} `)
            .where(PURCHASE_ORDER_DETAILS.COLUMNS.PONO, body.pono)
            .update({
              [PURCHASE_ORDER_DETAILS.COLUMNS.IS_GRN_COMPLETE]: true,
              [PURCHASE_ORDER_DETAILS.COLUMNS.RECEIVED_GRN_QTY]: body.total_received_qty
            });
        }
      }

      if (Number(body.total_order_qty) !== Number(body.total_received_qty)) {
        if (Array.isArray(body.purchase_grn_details)) {
          // ✅ Check existing PO once (before the loop)
          const existingPO = await trx(PURCHASE_ORDER_MASTER.NAME)
            .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, body.pono)
            .first();

          if (existingPO) {
            await Promise.all(body.purchase_grn_details.map(async (element) => {
              if (Number(element.order_qty) === Number(element.received_qty)) {
                // Mark the purchase order as expired
                await trx(`${PURCHASE_ORDER_MASTER.NAME} `)
                  .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, String(body.pono).toLocaleLowerCase())
                  .update({
                    [PURCHASE_ORDER_MASTER.COLUMNS.GRN_NO]: docno
                  });

                // ✅ Mark as expired when order matches received
                await trx(`${PURCHASE_ORDER_DETAILS.NAME} `)
                  .where(PURCHASE_ORDER_DETAILS.COLUMNS.PONO, body.pono)
                  .where(PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID, element.product_id)
                  .update({
                    [PURCHASE_ORDER_DETAILS.COLUMNS.IS_GRN_COMPLETE]: true
                  });
              } else {
                // Mark the purchase order as expired
                await trx(`${PURCHASE_ORDER_MASTER.NAME} `)
                  .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, String(body.pono).toLocaleLowerCase())
                  .update({
                    [PURCHASE_ORDER_MASTER.COLUMNS.GRN_NO]: docno
                  });
                // ✅ Subtract received qty from order qty using knex.raw
                await trx(`${PURCHASE_ORDER_DETAILS.NAME} `)
                  .where(PURCHASE_ORDER_DETAILS.COLUMNS.PONO, body.pono)
                  .where(PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID, element.product_id)
                  .update({
                    [PURCHASE_ORDER_DETAILS.COLUMNS.LOOSE_QTY]: trx.raw(
                      `${PURCHASE_ORDER_DETAILS.COLUMNS.LOOSE_QTY} - ? `,
                      [element.received_qty]
                    ),
                    // Correcting stock balance update
                    [PURCHASE_ORDER_DETAILS.COLUMNS.RECEIVED_GRN_QTY]: trx.raw(
                      `${PURCHASE_ORDER_DETAILS.COLUMNS.RECEIVED_GRN_QTY} + ? `, // Corrected raw SQL
                      [parseFloat(element.received_qty) || 0] // Corrected parameter format
                    ),
                  });
              }
            }));
          }
        }
      }

      // Commit transaction (if all operations are successful)
      await trx.commit();
      return { success: true, docno };
    } catch (error) {
      await trx.rollback(); // Rollback transaction if any error occurs

      console.error("Transaction Failed:", error);

      // ✅ Catch and return structured error to the frontend
      if (error instanceof CustomError) {
        console.log(error, "error message");
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: error._errors[0].message || "Something went wrong",
          property: "",
          code: "NOT_FOUND"
        });
      } else {
        throw {
          statusCode: 500,
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR"
        };
      }
    }
  }


  async function putPurchaseGrnFmcgProductService({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    const { grn_id } = params;
    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();

    try {
      // Step 1: Get GRN_ID Already Exists
      const existingGRN = await trx(PURCHASE_FMCG_GRN_MASTER.NAME)
        .select(
          `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID} `,
          `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.DOCNO} `
        )
        .where({
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID]: grn_id
        })
        .first();

      if (!existingGRN && !existingGRN?.id) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Purchase GRN was not found",
          property: "",
          code: "NOT_FOUND"
        });
      }
      const { docno } = existingGRN;
      const supplierDetails = await knex(SUPPLIER.NAME)
        .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE} `)
        .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
        .first()

      const { gst_type } = supplierDetails
      console.log(supplierDetails, "supplier details")
      // Step 2: Update the Purchase FMCG GRN Master record based on the given `grn_id`
      const purchaseUpdateResponse = await trx(`${PURCHASE_FMCG_GRN_MASTER.NAME} `)
        .where({
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID]: grn_id // Find the record by ID
        })
        .update({
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.DOCDATE]: new Date(),
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.DOCNO]: docno,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO]: body.party_invoice_no,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_DATE]: body.party_invoice_date,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.PONO]: body.pono,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.PODATE]: body.podate,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.CUSTOMER_TYPE]: gst_type,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.REMARK]: body.remark || " ",
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.RETURN_REMARK]: body.return_remark || " ",
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.COMPANY_ID]: body.company_id || 1,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.PRODUCT_TYPE]: 1,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.TCS]: 0,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.TOTAL_ORDER_QTY]: body.total_order_qty,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.TOTAL_RECEIVED_QTY]: body.total_received_qty,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.WAREHOUSE_ID]: body.wh_id || 1,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.IS_ACTIVE]: true,
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.UPDATED_AT]: new Date(),
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
        });

      // Step 3: If no rows were updated, throw an error (i.e., invalid `grn_id` or record not found)
      if (purchaseUpdateResponse === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Failed to update purchase grn",
          property: "",
          code: "NOT_FOUND"
        });
      }


      // Step-4: Update Purchase GRN Details
      // Check if purchase_grn_details array exists and has elements
      if (Array.isArray(body.purchase_grn_details) && body.purchase_grn_details.length > 0) {
        const allGrnDetailsData = [];
        let subTotalAmount = 0;
        let totalGstAmount = 0;
        let totalIgstAmount = 0;
        let totalCessAmount = 0;
        let totalReturnAmount = 0;

        for (const element of body.purchase_grn_details) {
          const poDetails = await knex(PURCHASE_ORDER_DETAILS.NAME)
            .select(`${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_RATE} `)
            .where(PURCHASE_ORDER_DETAILS.COLUMNS.PONO, body.pono)
            .andWhere(PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID, element.product_id)
            .first();

          const purchaseRate = parseFloat(poDetails?.purchase_rate || 0);
          const receivedQty = parseFloat(element.received_qty) || 0;
          const gst = parseFloat(element.gst) || 0;
          const cess = parseFloat(element.cess) || 0;
          const returnQty = parseFloat(element.return_qty) || 0;
          const freeQty = parseFloat(element.free_qty) || 0;

          const gstAmount = Number(gst_type) === 2 ? (purchaseRate * gst * receivedQty) / 100 : 0;
          const igstAmount = Number(gst_type) === 1 ? (purchaseRate * gst * receivedQty) / 100 : 0;
          const cessAmount = (purchaseRate * cess * receivedQty) / 100;
          const amount = purchaseRate * receivedQty;
          const returnAmount = purchaseRate * returnQty;

          subTotalAmount += amount;
          totalGstAmount += gstAmount;
          totalIgstAmount += igstAmount;
          totalCessAmount += cessAmount;
          totalReturnAmount += returnAmount;
          // Prepare the data object
          allGrnDetailsData.push({
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID]: grn_id,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.DOCNO]: docno,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.DOCDATE]: new Date(),
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PO_NO]: body.pono,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID]: element.product_id,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_CODE]: element.prod_code || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.HSN_CODE]: element.hsn || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SUB_CAT_ID]: element.sub_category_id || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.CAT_ID]: element.category_id || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.HEAD_ID]: element.head_id || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TYPE_DESIGN_ID]: element.type_design_id || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.UOM_ID]: element.uom_id || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.BARCODE]: element.barcode || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.ORDER_QTY]: element.order_qty || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.RECEIVED_QTY]: receivedQty,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.FREE_QTY]: freeQty,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_RATE]: purchaseRate,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.AMOUNT]: amount,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.ACCEPTED_MARGIN]: parseFloat(element.accepted_margin) || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.MRP]: parseFloat(element.mrp) || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SALE_RATE]: parseFloat(element.mrp) || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.GST]: Number(gst_type) === 2 ? gst : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.GST_AMOUNT]: Number(gst_type) === 2 ? gstAmount : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.CGST]: Number(gst_type) === 2 ? Number(gst) / 2 : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SGST]: Number(gst_type) === 2 ? Number(gst) / 2 : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? gst : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.IGST_AMOUNT]: Number(gst_type) === 1 ? igstAmount : 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.CESS]: cess,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SELF_LIFE_EXPIRY]: parseFloat(element.self_life_qty) || 0,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.RETURN_QTY]: returnQty,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
            [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.UPDATED_AT]: new Date()
          });
        };

        // Calculate totals
        const totalBeforeRoundOff = subTotalAmount + totalGstAmount + totalIgstAmount + totalCessAmount;
        const roundedTotal = Math.round(totalBeforeRoundOff);
        const roundOff = roundedTotal - totalBeforeRoundOff;
        const grandTotalAmount = totalBeforeRoundOff + roundOff;
        console.log(subTotalAmount, totalGstAmount, totalIgstAmount, totalIgstAmount, totalCessAmount, totalReturnAmount, grandTotalAmount, roundOff, "total values")
        // Update master table with totals
        await trx(`${PURCHASE_FMCG_GRN_MASTER.NAME} `)
          .where(`${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID} `, grn_id)
          .update({
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmount,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotalAmount,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.STATUS]: 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.DISCOUNT]: 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.ROFF]: roundOff,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.RETURN_AMOUNT]: totalReturnAmount,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.OTHER_CHARGES]: 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.GST_AMT]: Number(gst_type) === 2 ? totalGstAmount : 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.IGST_AMT]: Number(gst_type) === 1 ? totalIgstAmount : 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.ADVANCE]: 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.CESS_AMT]: totalCessAmount
          });

        if (allGrnDetailsData.length > 0) {
          for (let i = 0; i < allGrnDetailsData.length; i += 1000) {
            const batch = allGrnDetailsData.slice(i, i + 1000);

            await trx(PURCHASE_FMCG_GRN_DETAILS.NAME)
              .insert(batch)
              .onConflict([PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID, PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID])
              .merge(); // merge will update if conflict happens, else insert
          }
        }
      }

      // Step 5: Update Purchase_Grn_Tray_Details
      if (Array.isArray(body.tray_details)) {
        const trayInsertData = [];

        _.forEach(body.tray_details, (element) => {
          const totalTryQty = parseFloat(element.tray_qty) || 0;
          trayInsertData.push({
            [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: grn_id,
            [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.DOCDATE]: new Date(),
            [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_ID]: element.tray_id,
            [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_COUNT]: totalTryQty
          });
        });

        if (trayInsertData.length > 0) {
          await trx(PURCHASE_GRN_TRAY_DETAILS.NAME)
            .insert(trayInsertData)
            .onConflict([
              PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID,
              PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_ID
            ])
            .merge();
        }
      }

      // Step 6: Insert or Update Purchase Batch Details
      if (Array.isArray(body.purchase_grn_details)) {
        // Split purchase_grn_details into chunks of 500
        const purchaseGrnChunks = _.chunk(body.purchase_grn_details, 500);

        for (const grnChunk of purchaseGrnChunks) {
          await Promise.all(grnChunk.map(async (element) => {
            // Fetch batch item settings for each product
            const batchItem = await trx(ITEM.NAME)
              .select(
                `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID} `,
                `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE} `
              )
              .where({
                [ITEM.COLUMNS.ID]: element.product_id,
                [ITEM.COLUMNS.BATCH_ITEM]: true
              })
              .first();

            console.log("element product_id item found for:", element.product_id, batchItem);

            if (Array.isArray(element.purchase_batch_details)) {
              // Prepare batch details data
              const batchDetailsMap = new Map();
              for (const element1 of element.purchase_batch_details) {
                const manufacture_date = element1.manufacture_date ? new Date(element1.manufacture_date) : null;

                if (!manufacture_date) {
                  throw CustomError.create({
                    httpCode: StatusCodes.BAD_REQUEST,
                    message: `Invalid manufacture date for product ID: ${element.product_id} `,
                    property: "manufacture_date",
                    code: "INVALID_DATE"
                  });
                }

                let expiry_date = null;
                const expiryValue = Number(element1.expiry_value);
                if (!isNaN(expiryValue) && expiryValue > 0 && manufacture_date) {
                  expiry_date = new Date(manufacture_date);
                  if (Number(element1.expiry_type) === 1) {
                    expiry_date.setMonth(expiry_date.getMonth() + expiryValue);
                  } else if (Number(element1.expiry_type) === 2) {
                    expiry_date.setDate(expiry_date.getDate() + expiryValue);
                  }
                }

                const key = `${grn_id} -${element.product_id} -${element1.batch_no} `;
                if (!batchDetailsMap.has(key)) {
                  batchDetailsMap.set(key, {
                    [PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: grn_id,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_CODE]: element.prod_code,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO]: String(element1.batch_no),
                    [PURCHASE_BATCH_DETAILS.COLUMNS.QTY]: Number(element1.qty) || 0,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.SELF_LIFE_EXPIRY]: Number(element1.self_life_qty) || 0,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.RETURN_QTY]: Number(element1.return_qty) || 0,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE]: manufacture_date.toISOString().split('T')[0],
                    [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_ID]: Number(element1.expiry_type) || null,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE]: expiryValue || 0,
                    [PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_DATE]: expiry_date ? expiry_date.toISOString().split('T')[0] : null
                  });

                }
              }

              const batchDetailsData = Array.from(batchDetailsMap.values());

              if (batchDetailsData.length > 0) {
                await trx(PURCHASE_BATCH_DETAILS.NAME)
                  .insert(batchDetailsData)
                  .onConflict([
                    PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID,
                    PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID,
                    PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO
                  ])
                  .merge(); // 🔁 will update if key exists, insert if not
              }

            }
          }));
        }
      }

      // Step 7: Insert or Update Purchase ITEM Details
      if (_.isArray(body.purchase_grn_details)) {
        await Promise.all(
          _.map(body.purchase_grn_details, async (element) => {
            const receivedQty = parseFloat(element.received_qty) || 0;
            const freeQty = parseFloat(element.free_qty) || 0;
            const totalQty = receivedQty + freeQty;
            const totalReturnQty = parseFloat(element.return_qty) || 0;
            const rateResponse = await trx(PURCHASE_FMCG_GRN_DETAILS.NAME)
              .select(
                `${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_REC_QTY} as qty`,
                `${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_GRN_RETURN_QTY} as return_qty`
              )
              .where({
                [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID]: grn_id,
                [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID]: element.product_id
              })
              .first();

            const oldQty = parseFloat(rateResponse?.qty) || 0;
            const oldReturnQty = parseFloat(rateResponse?.return_qty) || 0;
            // Update item stock balance
            await trx(ITEM.NAME)
              .where(ITEM.COLUMNS.ID, element.product_id)
              .update({
                [ITEM.COLUMNS.BALANCE]: trx.raw(
                  `${ITEM.COLUMNS.BALANCE} - ? + ? + ? - ? `,
                  [oldQty, totalQty, oldReturnQty, totalReturnQty]
                )
              });
          })
        );
      }


      // Step 8: Insert or Update Stock Ledger
      if (Array.isArray(body.purchase_grn_details)) {
        await Promise.all(body.purchase_grn_details.map(async (element) => {
          const receivedQty = parseFloat(element.received_qty) || 0;
          const freeQty = parseFloat(element.free_qty) || 0;
          const returnQty = parseFloat(element.return_qty) || 0;
          const totalQty = receivedQty + freeQty;

          // Step 7.1: Check if stock entry already exists for the given product_id and date
          const existingStock = await trx(STOCKLEDGER.NAME)
            .where({
              [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
              [STOCKLEDGER.COLUMNS.DATE]: body.docdate
            })
            .first();
          console.log(existingStock, "existing stock");

          if (existingStock) {
            const grnDetails = await knex(PURCHASE_FMCG_GRN_DETAILS.NAME)
              .select(
                `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_REC_QTY}`,
                `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_GRN_RETURN_QTY}`)
              .where(PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID, grn_id)
              .where(PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID, element.product_id)
              .first()

            const tempQty = parseFloat(grnDetails?.temp_rec_qty) || 0;
            const tempReturnQty = parseFloat(grnDetails?.temp_grn_return_qty) || 0;
            // Step 7.2: If stock exists, update the existing record (increment pur_qty and pur_ret_qty)
            await trx(STOCKLEDGER.NAME)
              .where({
                [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
                [STOCKLEDGER.COLUMNS.DATE]: new Date()
              })
              .update({
                [STOCKLEDGER.COLUMNS.PUR_QTY]: trx.raw(
                  `${STOCKLEDGER.COLUMNS.PUR_QTY} - ? + ? `,
                  [tempQty, totalQty]
                ),
                [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: trx.raw(
                  `${STOCKLEDGER.COLUMNS.PUR_RET_QTY} - ? + ? `,
                  [tempReturnQty, returnQty]     // Add return quantity
                ),
                [STOCKLEDGER.COLUMNS.UPDATED_AT]: new Date(),
                [STOCKLEDGER.COLUMNS.UPDATED_BY]: userDetails.id
              });

            // Update TEMP_REC_QTY in GRN Details
            await trx(PURCHASE_FMCG_GRN_DETAILS.NAME)
              .where({
                [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID]: grn_id,
                [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID]: element.product_id
              })
              .update({
                [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_REC_QTY]: totalQty,
                [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_GRN_RETURN_QTY]: returnQty
              });
          } else {
            // Step 7.3: If stock does not exist, insert a new record
            await trx(STOCKLEDGER.NAME).insert({
              [STOCKLEDGER.COLUMNS.DATE]: new Date(),                     // Stock entry date
              [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,                    // Product ID
              [STOCKLEDGER.COLUMNS.PUR_QTY]: totalQty, // Purchase Quantity (Received + Free)
              [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: returnQty,  // Purchase Return Quantity
              [STOCKLEDGER.COLUMNS.COMPANY_ID]: body.company_id,                     // Company ID
              [STOCKLEDGER.COLUMNS.CREATED_AT]: new Date(),                          // Set created timestamp
              [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,                      // Set created by user
              [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id || 1                       // Warehouse ID (optional)
            });
          }
        }));
      }

      // Step 9: Insert or Update Tray Ledger
      // Check if purchase_tray_details exists and is an array
      if (Array.isArray(body.tray_details)) {
        // Process each tray detail
        await Promise.all(body.tray_details.map(async (element) => {
          if (element.tray_id > 0 && element.tray_qty > 0) {
            const receivedQty = parseFloat(element.tray_qty) || 0;
            // Step 1: Check if stock already exists for the tray_id and docdate
            const existingStock = await trx(TRAY_LEDGER.NAME)
              .where({
                [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date()
              })
              .first();
            console.log(existingStock, "stock tray details")
            if (existingStock) {
              const trayDetails = await knex(PURCHASE_GRN_TRAY_DETAILS.NAME)
                .select(
                  `${PURCHASE_GRN_TRAY_DETAILS.NAME}.${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TEMP_TRAY_QTY}`
                )
                .where(PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID, grn_id)
                .where(PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_ID, element.tray_id)
                .first();

              const tempTrayQty = parseFloat(trayDetails?.temp_tray_qty) || 0;
              // If stock exists, update the purchase quantity and balance
              await trx(TRAY_LEDGER.NAME)
                .where({
                  [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                  [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date()
                })
                .update({
                  [TRAY_LEDGER.COLUMNS.RECEIVED_QTY]: trx.raw(
                    `${TRAY_LEDGER.COLUMNS.RECEIVED_QTY} -? + ? `,
                    [tempTrayQty, receivedQty]
                  ),
                  [TRAY_LEDGER.COLUMNS.BALANCE]: trx.raw(
                    `${TRAY_LEDGER.COLUMNS.BALANCE} -? + ? `,
                    [tempTrayQty, receivedQty]
                  ),
                  [TRAY_LEDGER.COLUMNS.UPDATED_AT]: new Date()
                });

              // Update TEMP_REC_QTY in GRN Details
              await trx(PURCHASE_GRN_TRAY_DETAILS.NAME)
                .where({
                  [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: grn_id,
                  [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_ID]: element.tray_id
                })
                .update({
                  [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TEMP_TRAY_QTY]: receivedQty
                });
            } else {
              // If stock does not exist, insert a new record
              await trx(TRAY_LEDGER.NAME).insert({
                [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date(), // Ensure date is valid
                [TRAY_LEDGER.COLUMNS.CUSTOMER_ID]: body.supplier_id, // Mandatory field, default value
                [TRAY_LEDGER.COLUMNS.RECEIVED_QTY]: receivedQty, // Sum of received and free quantities
                [TRAY_LEDGER.COLUMNS.TEMP_TRAY_QTY]: receivedQty, // Sum of received and free quantities
                [TRAY_LEDGER.COLUMNS.ISSUED_QTY]: 0, // Default to 0 if missing
                [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id, // Mandatory field
                [TRAY_LEDGER.COLUMNS.WASTE_QTY]: 0, // Default to 0
                [TRAY_LEDGER.COLUMNS.OPENING]: 0, // Record creator ID
                [TRAY_LEDGER.COLUMNS.BALANCE]: receivedQty, // Set initial balance
                [TRAY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id, // Ensure company ID consistency
                [TRAY_LEDGER.COLUMNS.TYPE]: 1, // Record creator ID (assuming '1' represents a specific type)
                [TRAY_LEDGER.COLUMNS.YEAR]: financialYear, // Set financial year
                [TRAY_LEDGER.COLUMNS.CREATED_AT]: new Date()
              });
            }
          }
        }));
      }

      // Step 10: Mark Purchase Order as Expired (if applicable)
      const existingPO = await trx(PURCHASE_ORDER_MASTER.NAME)
        .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, body.pono)
        .first();

      if (existingPO) {
        // Handle PO expiry logic if total_order_qty matches total_received_qty
        if (Number(body.total_order_qty) === Number(body.total_received_qty)) {
          await trx(PURCHASE_ORDER_MASTER.NAME)
            .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, String(body.pono))
            .update({
              [PURCHASE_ORDER_MASTER.COLUMNS.IS_GRN_COMPLETE]: true,
              [PURCHASE_ORDER_MASTER.COLUMNS.GRN_NO]: docno
            });

          await trx(PURCHASE_ORDER_DETAILS.NAME)
            .where(PURCHASE_ORDER_DETAILS.COLUMNS.PONO, body.pono)
            .update({
              [PURCHASE_ORDER_DETAILS.COLUMNS.IS_GRN_COMPLETE]: true,
              [PURCHASE_ORDER_DETAILS.COLUMNS.RECEIVED_GRN_QTY]: body.total_received_qty
            });
        } else if (Number(body.total_order_qty) !== Number(body.total_received_qty)) {
          // Handle case when total_order_qty doesn't match total_received_qty
          await Promise.all(body.purchase_grn_details.map(async (element) => {
            if (Number(element.order_qty) === Number(element.received_qty)) {
              // Update GRN number and mark PO as complete for matching order
              await trx(PURCHASE_ORDER_MASTER.NAME)
                .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, String(body.pono).toLowerCase())
                .update({
                  [PURCHASE_ORDER_MASTER.COLUMNS.GRN_NO]: docno
                });

              await trx(PURCHASE_ORDER_DETAILS.NAME)
                .where(PURCHASE_ORDER_DETAILS.COLUMNS.PONO, body.pono)
                .where(PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID, element.product_id)
                .update({
                  [PURCHASE_ORDER_DETAILS.COLUMNS.IS_GRN_COMPLETE]: true
                });
            } else {
              // Update GRN number and adjust quantities when received qty does not match order qty
              await trx(PURCHASE_ORDER_MASTER.NAME)
                .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, String(body.pono).toLowerCase())
                .update({
                  [PURCHASE_ORDER_MASTER.COLUMNS.GRN_NO]: docno
                });

              await trx(PURCHASE_ORDER_DETAILS.NAME)
                .where(PURCHASE_ORDER_DETAILS.COLUMNS.PONO, body.pono)
                .where(PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID, element.product_id)
                .update({
                  [PURCHASE_ORDER_DETAILS.COLUMNS.LOOSE_QTY]: trx.raw(
                    `${PURCHASE_ORDER_DETAILS.COLUMNS.LOOSE_QTY} - ? `,
                    [element.received_qty]
                  ),
                  [PURCHASE_ORDER_DETAILS.COLUMNS.RECEIVED_GRN_QTY]: trx.raw(
                    `${PURCHASE_ORDER_DETAILS.COLUMNS.RECEIVED_GRN_QTY} + ? `,
                    [parseFloat(element.received_qty) || 0]
                  )
                });
            }
          }));
        }
      }
      // Commit transaction (if all operations are successful)
      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback(); // Rollback transaction if any error occurs

      console.error("Transaction Failed:", error);

      // ✅ Catch and return structured error to the frontend
      if (error instanceof CustomError) {
        console.log(error, "error message");
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: error._errors[0].message || "Something went wrong",
          property: "",
          code: "NOT_FOUND"
        });
      } else {
        throw {
          statusCode: 500,
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR"
        };
      }
    }
  }

  async function deletePurchaseGrnFmcgProductRepo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    const { grn_id } = params;

    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();

    try {
      // Step 1: Get GRN_ID already exists
      const existingGRN = await trx(PURCHASE_FMCG_GRN_MASTER.NAME)
        .select(
          `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID} `,
          `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.DOCDATE} `,
          `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.PONO} `
        )
        .where({
          [PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID]: grn_id
        })
        .first();

      if (!existingGRN) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Purchase GRN was not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const query1 = knex(PURCHASE_FMCG_GRN_MASTER.NAME)
        .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID, grn_id)
        .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.PURCHASE, true)

      const exists_response1 = await query1;

      if (exists_response1.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Purchase with GRN ID ${grn_id} cannot be deleted.`,
          property: "",
          code: "NOT_FOUND"
        });
      }

      const { docdate, pono } = existingGRN;

      // Step 2: Get GRN_Details already exists
      const existingGRNDetail = await trx(PURCHASE_FMCG_GRN_DETAILS.NAME)
        .select([
          `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.ID} `,
          `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID} `,
          `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.TEMP_REC_QTY} `,
          `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.RETURN_QTY} `
        ])
        .where({
          [PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID]: grn_id
        })

      if (Array.isArray(existingGRNDetail) && existingGRNDetail.length > 0) {
        await Promise.all(existingGRNDetail.map(async (element) => {
          const prodId = element.prod_id;
          const totalReturnQty = parseFloat(element.return_qty) || 0;
          const grnQty = parseFloat(element.temp_rec_qty) || 0;

          const existingStock = await trx(STOCKLEDGER.NAME)
            .where({
              [STOCKLEDGER.COLUMNS.PROD_ID]: prodId,
              [STOCKLEDGER.COLUMNS.DATE]: docdate
            })
            .first();

          if (existingStock) {
            if (existingStock.stock_qty < grnQty) {
              throw CustomError.create({
                httpCode: StatusCodes.BAD_REQUEST,
                message: "Not enough stock available to process the return",
                code: "STOCK_ERROR"
              });
            }

            await trx(STOCKLEDGER.NAME)
              .where({
                [STOCKLEDGER.COLUMNS.PROD_ID]: prodId,
                [STOCKLEDGER.COLUMNS.DATE]: docdate
              })
              .update({
                [STOCKLEDGER.COLUMNS.PUR_QTY]: trx.raw(
                  `${STOCKLEDGER.COLUMNS.PUR_QTY} - ? `,
                  [grnQty]
                ),
                [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: trx.raw(
                  `${STOCKLEDGER.COLUMNS.PUR_RET_QTY} - ? `,
                  [totalReturnQty]
                ),
                [STOCKLEDGER.COLUMNS.UPDATED_AT]: new Date(),
                [STOCKLEDGER.COLUMNS.UPDATED_BY]: userDetails.id
              });
          }

          await trx(ITEM.NAME)
            .where(ITEM.COLUMNS.ID, prodId)
            .update({
              [ITEM.COLUMNS.BALANCE]: trx.raw(
                `${ITEM.COLUMNS.BALANCE} - ? `,
                [grnQty]
              )
            });
        }));
      }


      // Step 4: Get GRN_Tray_Details already exists
      const existingGRNTrayDetail = await trx(PURCHASE_GRN_TRAY_DETAILS.NAME)
        .select([
          `${PURCHASE_GRN_TRAY_DETAILS.NAME}.${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_ID} `,
          `${PURCHASE_GRN_TRAY_DETAILS.NAME}.${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_COUNT} `,
          `${PURCHASE_GRN_TRAY_DETAILS.NAME}.${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TEMP_TRAY_QTY} `
        ])
        .where({
          [PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: grn_id
        })



      // Step 5: Insert or Update Tray Ledger
      if (Array.isArray(existingGRNTrayDetail) && existingGRNTrayDetail.length > 0) {
        await Promise.all(existingGRNTrayDetail.map(async (element) => {
          // Step 4.1: Proceed only if tray_id and tray_qty are valid (> 0)
          if (element.tray_id > 0 && element.tray_count > 0) {
            // Step 4.2: Check if tray stock entry already exists for the given tray_id and docdate
            const existingTrayStock = await trx(TRAY_LEDGER.NAME)
              .where({
                [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                [TRAY_LEDGER.COLUMNS.DOCDATE]: docdate
              })
              .first();

            if (existingTrayStock) {
              const tempQty = parseFloat(element.temp_tray_qty) || 0;
              // Step 4.3: Update tray ledger (decrease received_qty and balance)
              await trx(TRAY_LEDGER.NAME)
                .where({
                  [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                  [TRAY_LEDGER.COLUMNS.DOCDATE]: docdate
                })
                .update({
                  [TRAY_LEDGER.COLUMNS.RECEIVED_QTY]: trx.raw(
                    `${TRAY_LEDGER.COLUMNS.RECEIVED_QTY} - ? `,
                    [tempQty]
                  ),
                  [TRAY_LEDGER.COLUMNS.BALANCE]: trx.raw(
                    `${TRAY_LEDGER.COLUMNS.BALANCE} - ? `,
                    [tempQty]
                  )
                });
            }
          }
        }));
      }

      // Step 6: Mark Purchase Order as Expired (if applicable)
      const existingPO = await trx(PURCHASE_ORDER_MASTER.NAME)
        .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, pono)
        .first();

      if (existingPO) {
        await trx(PURCHASE_ORDER_MASTER.NAME)
          .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, String(pono))
          .update({
            [PURCHASE_ORDER_MASTER.COLUMNS.IS_GRN_COMPLETE]: false,
            [PURCHASE_ORDER_MASTER.COLUMNS.APPROVAL]: 1,
            [PURCHASE_ORDER_MASTER.COLUMNS.GRN_NO]: ''
          });

        await trx(PURCHASE_ORDER_DETAILS.NAME)
          .where(PURCHASE_ORDER_DETAILS.COLUMNS.PONO, pono)
          .update({
            [PURCHASE_ORDER_DETAILS.COLUMNS.IS_GRN_COMPLETE]: false,
            [PURCHASE_ORDER_DETAILS.COLUMNS.RECEIVED_GRN_QTY]: 0
          });
      }

      // Step 7: Delete Master and Details 
      await trx(PURCHASE_FMCG_GRN_MASTER.NAME)
        .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID, grn_id)
        .del();

      await trx(PURCHASE_FMCG_GRN_DETAILS.NAME)
        .where(PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID, grn_id)
        .del();

      await trx(PURCHASE_BATCH_DETAILS.NAME)
        .where(PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID, grn_id)
        .del();

      await trx(PURCHASE_GRN_TRAY_DETAILS.NAME)
        .where(PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID, grn_id)
        .del();

      // Commit transaction (if all operations are successful)
      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback(); // Rollback transaction if any error occurs

      console.error("Transaction Failed:", error);

      // ✅ Catch and return structured error to the frontend
      if (error instanceof CustomError) {
        console.log(error, "error message");
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: error._errors[0].message || "Something went wrong",
          property: "",
          code: "NOT_FOUND"
        });
      } else {
        throw {
          statusCode: 500,
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR"
        };
      }
    }
  }


  async function postPurchaseGrnFvProductRepo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();

    try {
      // Step 1: Insert into `PURCHASE_MST` (Purchase Master)
      const [purchaseResponse] = await trx(`${PURCHASE_FV_GRN_MASTER.NAME} `)
        .returning("id")
        .insert({
          [PURCHASE_FV_GRN_MASTER.COLUMNS.DOCDATE]: body.docdate,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.PRODUCT_TYPE]: 2,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.WH_ID]: body.wh_id,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.AMOUNT]: body.total_amt,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.GST_AMT]: body.total_gst || 0,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.CESS_AMT]: body.total_cess || 0,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.ROFF]: body.roff,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.FREIGHT_CHARGES]: body.freight_charges,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.OTHER_CHARGES]: body.other_charges,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.COMPANY_ID]: userDetails.company_id,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.TOTAL_QTY]: body.total_qty,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
          [PURCHASE_FV_GRN_MASTER.COLUMNS.CREATED_BY]: userDetails.id

        });
      if (!purchaseResponse?.id) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Failed to insert into PURCHASE_GRN_FV_MASTER",
          property: "",
          code: "NOT_FOUND"
        });
      }
      const purchase_id = purchaseResponse.id;
      const docno = `WPGRN_${financialYear || "FV"}_${purchase_id} `;

      // Step 2: Update the generated docno
      const updatedRows = await trx(`${PURCHASE_FV_GRN_MASTER.NAME} `)
        .where(`${PURCHASE_FV_GRN_MASTER.COLUMNS.ID} `, purchase_id)
        .update({
          [PURCHASE_FV_GRN_MASTER.COLUMNS.DOCNO]: docno
        });
      if (updatedRows !== 1) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Failed to update document number",
          property: "",
          code: "NOT_FOUND"
        });
      }

      // Step 3: Insert into PURCHASE_FMCG_GRN_DETAILS (if provided)
      if (Array.isArray(body.PURCHASE_FMCG_GRN_DETAILS)) {
        await Promise.all(body.PURCHASE_FMCG_GRN_DETAILS.map(async (element) => {
          await trx(`${PURCHASE_GRN_FV_DETAILS.NAME} `).insert({
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.PURCHASE_GRN_FV_MST_ID]: purchase_id, // Link to master table
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.DOCNO]: docno, // Generated document number
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.DOCDATE]: body.docdate || null, // Ensure valid date or null
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.PROD_ID]: element.product_id, // Mandatory
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.PROD_CODE]: element.prod_code || null, // Allow null values
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.SUB_CAT_ID]: element.sub_category_id || null, // Allow null values
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.CAT_ID]: element.category_id || null, // Allow null values
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.HEAD_ID]: element.head_id || null, // Allow null values
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.TYPE_DESIGN_ID]: element.type_design_id || null, // Allow null values
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.UOM_ID]: element.uom_id || null, // Allow null values
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.BARCODE]: element.barcode || null, // Allow null barcode
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.MRP]: parseFloat(element.mrp) || 0, // Ensure numeric value
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.GST]: parseFloat(element.gst_per) || 0, // Ensure numeric value
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.CESS]: parseFloat(element.cess_per) || 0, // Ensure numeric value
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.PURCHASE_RATE]: parseFloat(element.pur_rate) || 0, // Ensure numeric value
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.QTY]: parseInt(element.qty) || 0, // Ensure integer value
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.COMPANY_ID]: userDetails.company_id || body.company_id, // Default to main company ID if missing
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.IGST_PER]: parseFloat(element.igst) || 0, // Ensure numeric value
            [PURCHASE_GRN_FV_DETAILS.COLUMNS.CREATED_BY]: userDetails.id, // Created by current user
          });
        }));
      }

      // Step 4: Insert into PURCHASE_GRN_FV_TRAY_DETAILS (if provided)
      if (Array.isArray(body.tray_details)) {
        await Promise.all(body.tray_details.map(async (element) => {
          await trx(`${PURCHASE_FV_TRAY_DETAILS.NAME} `).insert({
            [PURCHASE_FV_TRAY_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID]: purchase_id, // Link to master table
            [PURCHASE_FV_TRAY_DETAILS.COLUMNS.TRAY_ID]: Number(element.tray_id), // Ensure numeric value
            [PURCHASE_FV_TRAY_DETAILS.COLUMNS.TRAY_QTY]: Number(element.tray_qty)// Ensure numeric value
          });
        }));
      }

      // Commit transaction (if all operations are successful)
      await trx.commit();
      return { success: true, docno };
    } catch (error) {
      // Rollback transaction in case of any failure
      await trx.rollback();
      console.error("Transaction Failed:", error);
      throw new Error("Purchase transaction failed.");
    }
  }

  async function getPurchaseGrnFvProductRepo({ body, params, logTrace }) {
    const knex = this;
    const { product_code } = params;

    const query = knex
      .select(
        knex.raw(`
          DISTINCT ON(${ITEM.NAME}.${ITEM.COLUMNS.ID})
          ${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id,
            ${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as prod_code,
              ${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID} as category_id,
                ${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID} as sub_category_id,
                  ${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID} as head_id,
                    ${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID} as type_design_id,
                      ${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID} as uom_id,
                        ${ITEM.NAME}.${ITEM.COLUMNS.MRP} as mrp,
                          ${ITEM.NAME}.${ITEM.COLUMNS.GST} as gst_per,
                            ${ITEM.NAME}.${ITEM.COLUMNS.CESS} as cess_per,
                              ${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE} as pur_rate,
                                ${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE} as barcode
        `)
      )
      .from(`${ITEM.NAME} as ${ITEM.NAME} `)
      .leftJoin(
        `${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} `,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID} `
      )
      .where(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE} `, true)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} `, product_code)
      .orderBy(`${ITEM.NAME}.${ITEM.COLUMNS.ID} `, 'ASC'); // Order to maintain uniqueness

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item details",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Item not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const finalResponse = response.map((item) => ({
      ...item,
      igst: 0,
      qty: 0
    })
    )
    return finalResponse[0];
  }

  async function getPurchaseOrderApprovedPo({ body, params, logTrace }) {
    const knex = this;
    const { pono } = params;
    const query = knex
      .select([
        `${PURCHASE_ORDER_MASTER.NAME}.* `,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as add3`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as add4`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN} as gstin`,
      ])
      .from(`${PURCHASE_ORDER_MASTER.NAME} as ${PURCHASE_ORDER_MASTER.NAME} `)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME} `,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID} `,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} `
      )
      .where(
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PONO} `,
        String(pono).toLocaleUpperCase()
      )

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
        message: "Po data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const purchaseOrderDetails = await Promise.all(
      response.map(async po => {
        const po_details_lines = await knex
          .select([
            `${ITEM.NAME}.* `,
            `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as soh`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.MRP} as mrp`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_RATE} as pur_rate`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.GST} as gst`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.BARCODE} as barcode`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.LOOSE_QTY} as qty`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.LOOSE_QTY} as order_qty`
          ])
          .from(`${PURCHASE_ORDER_DETAILS.NAME} as ${PURCHASE_ORDER_DETAILS.NAME} `)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME} `,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID} `,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID} `
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME} `, // ✅ Corrected alias for UNITS table
            `${UNITS.NAME}.${UNITS.COLUMNS.ID} `,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID} `
          )
          .where(
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID} `,
            po.id
          )
          .where(
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.EXPIRED} `,
            false
          )
          .where(
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.IS_GRN_COMPLETE} `,
            false
          )
          .orderBy(`${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID} `, "ASC")

        // ✅ Add `tray_id` and `tray_count` as `0`
        const updatedPoDetailsLines = po_details_lines.map((detail) => ({
          ...detail,
          cost_price: detail.pur_rate,
          tray_id: 0,
          tray_count: 0,
          free_qty: 0,
          return_qty: 0,
          sale_rate: 0,
          igst: 0
        }));

        return { ...po, po_details_lines: updatedPoDetailsLines };
      })
    );

    return purchaseOrderDetails;
  }

  async function getPurchaseGrnByIdRepo({ body, params, logTrace }) {
    const knex = this;
    const { grn_id } = params;
    const query = knex
      .select([
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.DOCNO} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.DOCDATE} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.PONO} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_DATE} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.WAREHOUSE_ID} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.REMARK} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.CUSTOMER_TYPE} `,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as add3`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as add4`
      ])
      .from(`${PURCHASE_FMCG_GRN_MASTER.NAME} as ${PURCHASE_FMCG_GRN_MASTER.NAME} `)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID} `,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} `
      )
      .where(
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID} `,
        grn_id
      )

    logQuery({
      logger: fastify.log,
      query,
      context: "Get GRN details",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "GRN data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const purchaseGrnDetails = await Promise.all(
      response.map(async grn => {
        const grn_details_lines = await knex
          .select([
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.* `,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_CODE} as pro_code`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.HSN_CODE} as hsn`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID} as id`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SELF_LIFE_EXPIRY} as self_life`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.RECEIVED_QTY} as qty`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} `,
            `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as soh`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
          ])
          .from(`${PURCHASE_FMCG_GRN_DETAILS.NAME} as ${PURCHASE_FMCG_GRN_DETAILS.NAME} `)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME} `,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID} `,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID} `
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME} `, // ✅ Corrected alias for UNITS table
            `${UNITS.NAME}.${UNITS.COLUMNS.ID} `,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID} `
          )
          .where(
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID} `,
            grn.id
          )

        await Promise.all(
          grn_details_lines.map(async (element) => {
            element.purchase_batch_details = await knex
              .select([
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.ID} `,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID} `,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID} `,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_CODE} `,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO} `,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.QTY} `,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.SELF_LIFE_EXPIRY} as self_life_qty`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_ID} as expiry_type`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.RETURN_QTY} `,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE} `,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_DATE} `,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE} `,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.COMPANY_ID} `,
              ])
              .from(PURCHASE_BATCH_DETAILS.NAME)
              .where(`${PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID} `, grn.id)
              .where(`${PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID} `, element.id)
          })
        );

        const purchase_tray_details = await knex
          .select([
            `${PURCHASE_GRN_TRAY_DETAILS.NAME}.* `
          ])
          .from(PURCHASE_GRN_TRAY_DETAILS.NAME)
          .where(`${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID} `, grn.id)


        const gst = Number(grn.gst_type) === 2 ? true : false;
        const igst = Number(grn.gst_type) === 1 ? true : false;

        return {
          ...grn,
          gst,
          igst,
          grn_details_lines,
          purchase_tray_details
        };

      })
    );

    return purchaseGrnDetails;
  }


  async function getGrnno({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    const query = knex(PURCHASE_FMCG_GRN_MASTER.NAME)
      .returning("id")
      .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear)
      .orderBy(PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Grn Master",
      logTrace
    });

    const response = await query;


    if (response.length === 0) {
      return { Docno: "1" };
    }

    const docno = Number(response[0].docno);
    console.log(docno, "docno")
    const Docno = `${docno + 1} `;
    return { Docno };
  }

  async function getPurchaseGrnListRepo({ params, body, logTrace, userDetails, query }) {
    const knex = this;
    const { bill_no, from_date, to_date } = query;

    const query1 = knex
      .select([
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.DOCDATE} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.PURCHASE} `,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} `,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE} `
      ])
      .from(`${PURCHASE_FMCG_GRN_MASTER.NAME} as ${PURCHASE_FMCG_GRN_MASTER.NAME} `)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME} `,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID} `,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} `
      )
    // Check if bill_no is a valid value before applying condition
    if (bill_no) {
      query1.andWhere(`${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID} `, bill_no);
    }

    // Use .whereBetween() for better performance and readability
    if (from_date && to_date) {
      query1.whereBetween(`${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.DOCDATE} `, [from_date, to_date]);
    }

    // Ensure orderBy is always applied
    query1.orderBy(`${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID} `, "DESC");

    const response = await query1;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase Grn not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatedPurchaseDetails = response.map((detail) => ({
      ...detail,
      isEdit: detail.purchase === false ? true : false,
      gst: Number(detail.gst_type) === 2,
      igst: Number(detail.gst_type) === 1
    }));

    return updatedPurchaseDetails;
  }

  return {
    postPurchaseGrnFmcgProductRepo,
    postPurchaseGrnFvProductRepo,
    getPurchaseGrnFvProductRepo,
    putPurchaseGrnFmcgProductService,
    getPurchaseOrderApprovedPo,
    deletePurchaseGrnFmcgProductRepo,
    getPurchaseGrnListRepo,
    getPurchaseGrnByIdRepo,
    getGrnno
  };
}

module.exports = purchaseGrnRepo
