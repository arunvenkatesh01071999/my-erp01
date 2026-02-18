const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const _ = require('lodash');
const {
  PURCHASE_MST_PONUM,
  STOCKLEDGER,
  PURCHASE_FMCG_MASTER,
  PURCHASE_FMCG_DETAILS,
  PARTY_LEDGER,
  PURCHASE_TRAY_DETAILS,
  PURCHASE_FMCG_RETURN_MASTER,
  PURCHASE_FMCG_RETURN_DETAILS
} = require("../../commons");
const { SUPPLIER, ITEM, WAREHOUSE } = require("../../../catalog/commons");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { PURCHASE_FMCG_GRN_MASTER, PURCHASE_FMCG_GRN_DETAILS, PURCHASE_BATCH_DETAILS, PURCHASE_MASTER_BATCH_DETAILS, PURCHASE_GRN_TRAY_DETAILS } = require("../../../fmcg_purchase_grn/commons/constants");
const { COMPANY } = require("../../../catalog/supplier/commons/constants");
const currentYear = new Date().getFullYear();


function purchaseRepo(fastify) {
  async function postpurchase({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();

    try {
      const supplierDetails = await knex(SUPPLIER.NAME)
        .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
        .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
        .first()

      const { gst_type } = supplierDetails;
      // Step 1: Insert into `PURCHASE_MST` (Purchase Master)
      const [purchaseResponse] = await trx(`${PURCHASE_FMCG_MASTER.NAME}`)
        .returning("id")
        .insert({
          [PURCHASE_FMCG_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE]: new Date(),
          [PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_MASTER.COLUMNS.TOTAL_AMOUNT]: body.total_amount,
          [PURCHASE_FMCG_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
          [PURCHASE_FMCG_MASTER.COLUMNS.GRAND_TOTAL]: body.grand_total || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: body.grand_total || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_DATE]: body.invoice_date || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.ROUND_OFF]: body.roff,
          [PURCHASE_FMCG_MASTER.COLUMNS.PAID]: (body.grand_total - body.advance),
          [PURCHASE_FMCG_MASTER.COLUMNS.STATUS]: 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.RETURN_AMOUNT]: body.return_amount,
          [PURCHASE_FMCG_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
          [PURCHASE_FMCG_MASTER.COLUMNS.OTHER_CHARGES]: body.other_charges || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.GST]: Number(gst_type) === 2 ? Number(body.gst) : 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.IGST]: Number(gst_type) === 1 ? Number(body.gst) : 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.ADVANCE]: body.advance,
          [PURCHASE_FMCG_MASTER.COLUMNS.CESS_AMOUNT]: body.cess_amt || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.REMARK]: body.remark || " ",
          [PURCHASE_FMCG_MASTER.COLUMNS.LESS_AMOUNT]: body.less_amt || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.PRODUCT_TYPE]: 1,
          [PURCHASE_FMCG_MASTER.COLUMNS.TCS]: body.tcs || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.DC_NO]: body.dc_no || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.CLOSING_STOCK]: body.closing_stock || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.OPENING_STOCK]: body.opening_stock || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.PURCHASE]: body.purchase || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.PURCHASE_RETURN]: body.purchase_return || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.SALES]: body.sales || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.SALES_RETURN]: body.sales_return || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.DEBIT_NOTE]: body.debit_note || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.PROFIT]: body.profit || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.PERCENTAGE]: body.percentage || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.AVG_AGREED_MARGIN]: 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.AVG_FILL_RATE]: 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.TDS_PERCENTAGE]: body.tds_percentage || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.TDS_AMOUNT]: body.tds_amount || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.REASON_DEBIT_NOTE]: body.reason_debite_note || "",
          [PURCHASE_FMCG_MASTER.COLUMNS.REASON_DEBIT_NOTE_AMOUNT]: body.reason_debite_note_amount || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.DEBIT_NOTE_AMOUNT]: body.debite_note_amount || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.FREIGHT_CHARGES]: 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.CUSTOMER_TYPE]: Number(gst_type),
          [PURCHASE_FMCG_MASTER.COLUMNS.WAREHOUSE_ID]: body.wh_id || 1,
          [PURCHASE_FMCG_MASTER.COLUMNS.CREATED_AT]: new Date(),
          [PURCHASE_FMCG_MASTER.COLUMNS.CREATED_BY]: userDetails.id
        });

      const purchase_id = purchaseResponse.id;
      const docno = `${purchase_id}`;

      // Step 2: Update `PURCHASE_MST` to add the generated document number
      await trx(`${PURCHASE_FMCG_MASTER.NAME}`)
        .where(`${PURCHASE_FMCG_MASTER.COLUMNS.ID}`, purchase_id)
        .update({ [PURCHASE_FMCG_MASTER.COLUMNS.DOC_NO]: docno });


      // Step 3: Insert `PURCHASE_MST_PONUM` records (if any exist)
      if (_.isArray(body.po_details)) {
        await Promise.all(_.map(body.po_details, async (element) => {
          await trx(`${PURCHASE_MST_PONUM.NAME}`).insert({
            [PURCHASE_MST_PONUM.COLUMNS.PURMST_ID]: purchase_id,
            [PURCHASE_MST_PONUM.COLUMNS.DOCNO]: docno,
            [PURCHASE_MST_PONUM.COLUMNS.DOCDATE]: new Date(),
            [PURCHASE_MST_PONUM.COLUMNS.PONO]: element.pono,
            [PURCHASE_MST_PONUM.COLUMNS.PODATE]: element.podate,
            [PURCHASE_MST_PONUM.COLUMNS.COMPANY_ID]: body.company_id,
            [PURCHASE_MST_PONUM.COLUMNS.CREATED_BY]: userDetails.id,
            [PURCHASE_MST_PONUM.COLUMNS.WH_ID]: body.wh_id || 1
          });
        }));
      }
      // Step 3: Insert `PURCHASE_DETAILS` (if provided)
      if (_.isArray(body.purchase_fmcg_details) && body.purchase_fmcg_details.length > 0) {
        console.log(body.purchase_fmcg_details, "purchase details")
        console.log(gst_type, "purchase details")
        const purchaseDetailsData = _.map(body.purchase_fmcg_details, (element) => ({
          [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_DETAILS.COLUMNS.DOC_NO]: docno,
          [PURCHASE_FMCG_DETAILS.COLUMNS.DOC_DATE]: body.docdate,
          [PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_CODE]: element.product_code,
          [PURCHASE_FMCG_DETAILS.COLUMNS.QUANTITY]: element.qty,
          [PURCHASE_FMCG_DETAILS.COLUMNS.FREE_QUANTITY]: element.free_qty,
          [PURCHASE_FMCG_DETAILS.COLUMNS.DISCOUNT_PERCENTAGE]: element.discount_percentage,
          [PURCHASE_FMCG_DETAILS.COLUMNS.DISCOUNT_AMOUNT]: element.discount_amount,
          [PURCHASE_FMCG_DETAILS.COLUMNS.HEAD_ID]: element.head_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.TYPE_ID]: 1,
          [PURCHASE_FMCG_DETAILS.COLUMNS.SUB_CATEGORY_ID]: element.sub_category_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.CATEGORY_ID]: element.category_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.UOM_ID]: element.uom_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.RATE]: element.rate,
          [PURCHASE_FMCG_DETAILS.COLUMNS.AMOUNT]: element.amount || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.WAREHOUSE_ID]: body.wh_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_ORDER_NO]: body.pono,
          [PURCHASE_FMCG_DETAILS.COLUMNS.MRP]: element.mrp,
          [PURCHASE_FMCG_DETAILS.COLUMNS.GST]: (Number(gst_type) === 2) ? Number(element.gst) : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.CGST]: (Number(gst_type) === 2) ? Number(element.gst) / 2 : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.SGST]: (Number(gst_type) === 2) ? Number(element.gst) / 2 : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.GST_AMOUNT]: (Number(gst_type) === 2) ? Number(element.gst_amount) : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.IGST]: (Number(gst_type) === 1) ? Number(element.gst) : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.IGST_AMOUNT]: (Number(gst_type) === 1) ? Number(element.gst_amount) : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.CESS]: element.cess || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.CESS_AMOUNT]: element.cess_amt || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_ORDER_QUANTITY]: element.po_qty,
          [PURCHASE_FMCG_DETAILS.COLUMNS.WAREHOUSE_MARGIN]: element.warehouse_margin || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.SALES_MARGIN]: element.sales_margin,
          [PURCHASE_FMCG_DETAILS.COLUMNS.ACCEPTED_MARGIN]: element.accepted_margin || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.SALE_RATE]: element.sale_rate || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.REASON_DEBIT_NOTE]: element.reason_debit_note || "",
          [PURCHASE_FMCG_DETAILS.COLUMNS.REASON_DEBIT_NOTE_AMOUNT]: Number(element.reason_debit_note_amt) || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.RETURN_QUANTITY]: 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
        }));

        // Batch insert in chunks of 1000 records
        if (purchaseDetailsData.length > 0) {
          console.log(purchaseDetailsData, "purchase details data")
          await trx.batchInsert(PURCHASE_FMCG_DETAILS.NAME, purchaseDetailsData, 1000);
        }
      }

      // Step 4: Insert Purchase_Tray_Details
      if (Array.isArray(body.purchase_tray_details)) {
        const trayInsertData = [];
        _.forEach(body.purchase_tray_details, (element) => {
          trayInsertData.push({
            [PURCHASE_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
            [PURCHASE_TRAY_DETAILS.COLUMNS.DOCDATE]: new Date(),
            [PURCHASE_TRAY_DETAILS.COLUMNS.TRAY_ID]: element.tray_id,
            [PURCHASE_TRAY_DETAILS.COLUMNS.TRAY_COUNT]: parseFloat(element.tray_count) || 0
          });
        });
        if (trayInsertData.length > 0) {
          await trx(PURCHASE_TRAY_DETAILS.NAME).insert(trayInsertData); // 🚀 Bulk insert
        }
      }

      // Step 5: Insert or Update Purchase Batch Details
      if (Array.isArray(body.purchase_fmcg_details)) {
        // Split into chunks of 500 using Lodash
        const purchaseGrnChunks = _.chunk(body.purchase_fmcg_details, 500);
        for (const grnChunk of purchaseGrnChunks) {
          await Promise.all(
            _.map(grnChunk, async (element) => {
              if (Array.isArray(element.purchase_batch_details)) {
                const batchDetailsData = _.map(element.purchase_batch_details, (element1) => {
                  return {
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.DOCDATE]: body.docdate,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.PRODUCT_CODE]: element.product_code,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.BATCH_NO]: String(element1.batch_no),
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.QTY]: Number(element1.qty) || 0,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.SELF_LIFE_EXPIRY_DAYS]: Number(element1.self_life_qty) || 0,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.RETURN_QTY]: Number(element1.return_qty) || 0,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE]: element1.manufacture_date,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.EXPIRY_ID]: Number(element1.expiry_type) || null,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE]: element1.expiry_value || 0,
                    [PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.EXPIRY_DATE]: element1.expiry_date
                  };
                });

                await trx.batchInsert(PURCHASE_MASTER_BATCH_DETAILS.NAME, batchDetailsData, 500);
              }
            })
          );
        }
      }


      // Step 6: Update Item Stock
      if (_.isArray(body.purchase_fmcg_details)) {
        await Promise.all(
          _.map(body.purchase_fmcg_details, async (element) => {
            const updateData = {
              [ITEM.COLUMNS.MRP]: parseFloat(element.mrp) || 0,
              [ITEM.COLUMNS.DISCOUNT]: parseFloat(element.discount_percentage) || 0,
              [ITEM.COLUMNS.PURCHASE_RATE]: parseFloat(element.rate) || 0,
              [ITEM.COLUMNS.SALE_RATE]: parseFloat(element.sale_rate) || 0,
            };

            if (parseFloat(element.gst) > 0) {
              updateData[ITEM.COLUMNS.GST] = parseFloat(element.gst);
            }

            if (parseFloat(element.cess) > 0) {
              updateData[ITEM.COLUMNS.CESS] = parseFloat(element.cess);
            }


            await trx(ITEM.NAME)
              .where(ITEM.COLUMNS.ID, element.product_id)
              .update(updateData)
          })
        );
      }

      // Step 7: Update Supplier Balance
      const supplier = await trx(SUPPLIER.NAME)
        .select(SUPPLIER.COLUMNS.BALANCE)
        .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
        .first();

      console.log("Fetched Supplier Balance:", supplier);

      const grandTotalAmount = body.grand_total > 0 ? body.grand_total : 0;
      const returnTotalAmount = body.return_amount > 0 ? body.return_amount : 0;
      const currentBalance = parseFloat(supplier?.balance || 0);
      const newBalance = currentBalance + grandTotalAmount - returnTotalAmount;

      console.log("Current Balance:", currentBalance);
      console.log("Grand Total Amount:", grandTotalAmount);
      console.log("Return Total Amount:", returnTotalAmount);
      console.log("New Balance:", newBalance);

      if (!isNaN(newBalance)) {
        await trx(SUPPLIER.NAME)
          .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
          .update({ [SUPPLIER.COLUMNS.BALANCE]: newBalance });

        console.log("Supplier balance updated successfully");
      }

      // Step 8: Update GRN NO Stock
      if (body.invoice_no && body.supplier_id && body.pono) {
        await trx(PURCHASE_FMCG_GRN_MASTER.NAME)
          .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO, body.invoice_no)
          .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID, body.supplier_id)
          .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.PONO, body.pono)
          .update({
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.STATUS]: purchase_id,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.PURCHASE]: true
          });
      }

      // Step 9: Insert Party Ledger
      // If stock does not exist, insert a new record
      await trx(PARTY_LEDGER.NAME).insert({
        [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: purchase_id,
        [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
        [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
        [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
        [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "E",
        [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
        [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
        [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
        [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: 0,
        [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: grandTotalAmount,
        [PARTY_LEDGER.COLUMNS.REMARKS]: `Purchase No (${docno})`,
        [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'S',
        [PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
        [PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
        [PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
      });

      let isReturnAdded = false; // Track if any return was processed

      if (_.isArray(body.purchase_fmcg_details)) {
        await Promise.all(
          _.map(body.purchase_fmcg_details, async (element) => {
            if (element.return_qty && Number(element.return_qty) > 0) {
              isReturnAdded = true; // Mark that a return is being added

              // Step 1: Insert into Purchase Return Master
              const [response] = await trx(`${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
                .returning("id")
                .insert({
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCDATE]: body.docdate,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_AMOUNT]: body.return_amount,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.GRAND_TOTAL]: body.return_amount || 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_DATE]: body.invoice_date || 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ROFF]: 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.RETURN_TYPE]: 2,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_GST_AMT]: gst_type === 2 ? Number(body.gst) : 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMT]: gst_type === 1 ? Number(body.gst) : 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.cess_amt || 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.REMARK]: body.remark || " ",
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TDS_PERCENTAGE]: body.tds_percentage || 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TDS_AMOUNT]: body.tds_amount || 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.EWAY]: 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.EWAY_TYPE]: 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.EWAY_DATE]: new Date(),
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.EWAY_VALID_DATE]: new Date(),
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.EWAY_PATH]: "",
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.EINVOICE]: 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.AK_DATE]: new Date().toISOString(),
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.AKNO]: 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.EFFECT_DATE]: new Date().toISOString(),
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.IRNNO]: 0,
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.CREATED_AT]: new Date().toISOString(),
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
                });

              const purchase_return_mst_id = response.id;
              const docno = `${purchase_return_mst_id}`;

              // Update docno in return master
              await trx(`${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
                .where(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID, purchase_return_mst_id)
                .update({
                  [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCNO]: docno
                });

              // Prepare and insert return details...
              const purchaseReturnDetailsData = _.map(body.purchase_fmcg_details, (element) => ({
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_mst_id,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DOCNO]: docno,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DOCDATE]: body.docdate,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRODID]: element.product_id,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRO_CODE]: element.product_code,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.BATCH_NO]: 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.EXPIRY_DATE]: new Date(),
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ACCEPTED_QTY]: Number(element.qty) || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ACCEPTED_FREE_QTY]: Number(element.free_qty) || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_QTY]: Number(element.return_qty) || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GRN_RETURN_QTY]: Number(element.return_qty) || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY]: Number(element.free_qty) || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DIS_PER]: Number(element.discount_percentage) || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DIS_AMT]: Number(element.discount_amount) || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RATE]: Number(element.rate) || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.AMOUNT]: Number(element.return_qty * element.rate) || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.MRP]: element.mrp,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GST]: (Number(gst_type) === 2) ? Number(element.gst) : 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CGST]: (Number(gst_type) === 2) ? Number(element.gst) / 2 : 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.SGST]: (Number(gst_type) === 2) ? Number(element.gst) / 2 : 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GST_AMOUNT]: (Number(gst_type) === 2) ? Number(element.gst_amount) : 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.IGST]: (Number(gst_type) === 1) ? Number(element.gst) : 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.IGST_AMOUNT]: (Number(gst_type) === 1) ? Number(element.gst_amount) : 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CESS]: element.cess || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CESS_AMT]: element.cess_amt || 0,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.REASON]: 1,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CREATED_AT]: new Date(),
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
              }));

              if (purchaseReturnDetailsData.length > 0) {
                await trx.batchInsert(PURCHASE_FMCG_RETURN_DETAILS.NAME, purchaseReturnDetailsData, 1000);
              }

              // Update return qty in purchase master master
              await trx(`${PURCHASE_FMCG_DETAILS.NAME}`)
                .where({
                  [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
                  [PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id
                })
                .update({
                  [PURCHASE_FMCG_DETAILS.COLUMNS.RETURN_QUANTITY]: Number(element.return_qty)
                });
            }
          })
        );
      }

      // Final commit
      await trx.commit();

      // Final response
      return {
        success: true,
        docno,
        return: isReturnAdded // ✅ true if at least one return was inserted
      };

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



  async function putPurchaseDetailsRepo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    const { purchase_id } = params;
    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();

    try {
      // Step 1: Chek PURCHASE_MASTER_ID Already Exists
      const existingPurchaseDetails = await trx(PURCHASE_FMCG_MASTER.NAME)
        .select(
          `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`,
          `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.TEMP_GRAND_TOTAL}`
        )
        .where({
          [PURCHASE_FMCG_MASTER.COLUMNS.ID]: purchase_id
        })
        .first();

      if (!existingPurchaseDetails && !existingPurchaseDetails?.id) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Purchase Details was not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const supplierDetails = await knex(SUPPLIER.NAME)
        .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
        .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
        .first()

      const { gst_type } = supplierDetails;

      const existingGrandTotal = parseFloat(existingPurchaseDetails?.temp_grand_total) || 0;
      // Step 2: Update the Purchase FMCG Master record based on the given `grn_id`
      const purchaseUpdateResponse = await trx(`${PURCHASE_FMCG_MASTER.NAME}`)
        .where({
          [PURCHASE_FMCG_MASTER.COLUMNS.ID]: purchase_id // Find the record by ID
        })
        .update({
          [PURCHASE_FMCG_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE]: new Date(),
          [PURCHASE_FMCG_MASTER.COLUMNS.DOC_NO]: body.docno,
          [PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_MASTER.COLUMNS.TOTAL_AMOUNT]: body.total_amount,
          [PURCHASE_FMCG_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
          [PURCHASE_FMCG_MASTER.COLUMNS.GRAND_TOTAL]: body.grand_total || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_DATE]: body.invoice_date || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.ROUND_OFF]: body.roff,
          [PURCHASE_FMCG_MASTER.COLUMNS.PAID]: (body.grand_total - body.advance),
          [PURCHASE_FMCG_MASTER.COLUMNS.STATUS]: 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.RETURN_AMOUNT]: body.return_amount,
          [PURCHASE_FMCG_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
          [PURCHASE_FMCG_MASTER.COLUMNS.OTHER_CHARGES]: body.other_charges || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.GST]: Number(gst_type) === 2 ? Number(body.gst) : 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.IGST]: Number(gst_type) === 1 ? Number(body.gst) : 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.CUSTOMER_TYPE]: Number(gst_type),
          [PURCHASE_FMCG_MASTER.COLUMNS.ADVANCE]: body.advance,
          [PURCHASE_FMCG_MASTER.COLUMNS.CESS_AMOUNT]: body.cess_amt || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.REMARK]: body.remark || " ",
          [PURCHASE_FMCG_MASTER.COLUMNS.LESS_AMOUNT]: body.less_amt || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.PRODUCT_TYPE]: 1,
          [PURCHASE_FMCG_MASTER.COLUMNS.TCS]: body.tcs || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.DC_NO]: body.dc_no || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.CLOSING_STOCK]: body.closing_stock || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.OPENING_STOCK]: body.opening_stock || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.PURCHASE]: body.purchase,
          [PURCHASE_FMCG_MASTER.COLUMNS.PURCHASE_RETURN]: body.purchase_return || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.SALES]: body.sales || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.SALES_RETURN]: body.sales_return || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.DEBIT_NOTE]: body.debit_note || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.PROFIT]: body.profit || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.PERCENTAGE]: body.percentage || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.AVG_AGREED_MARGIN]: 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.AVG_FILL_RATE]: 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.TDS_PERCENTAGE]: body.tds_percentage || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.TDS_AMOUNT]: body.tds_amount || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.REASON_DEBIT_NOTE]: body.reason_debite_note || "",
          [PURCHASE_FMCG_MASTER.COLUMNS.REASON_DEBIT_NOTE_AMOUNT]: body.reason_debite_note_amount || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.DEBIT_NOTE_AMOUNT]: body.debite_note_amount || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.FREIGHT_CHARGES]: 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.WAREHOUSE_ID]: body.wh_id || 0,
          [PURCHASE_FMCG_MASTER.COLUMNS.IS_ACTIVE]: true,
          [PURCHASE_FMCG_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
          [PURCHASE_FMCG_MASTER.COLUMNS.UPDATED_AT]: new Date()
        });

      // Step 3: If no rows were updated, throw an error (i.e., invalid `grn_id` or record not found)
      if (purchaseUpdateResponse === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Failed to update purchase details",
          property: "",
          code: "NOT_FOUND"
        });
      }

      // Step 4: Insert `PURCHASE_DETAILS` (if provided)
      if (_.isArray(body.purchase_fmcg_details) && body.purchase_fmcg_details.length > 0) {
        const purchaseDetailsData = _.map(body.purchase_fmcg_details, (element) => ({
          [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_DETAILS.COLUMNS.DOC_NO]: body.docno,
          [PURCHASE_FMCG_DETAILS.COLUMNS.DOC_DATE]: new Date(),
          [PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_CODE]: element.product_code,
          [PURCHASE_FMCG_DETAILS.COLUMNS.QUANTITY]: element.qty,
          [PURCHASE_FMCG_DETAILS.COLUMNS.FREE_QUANTITY]: element.free_qty,
          [PURCHASE_FMCG_DETAILS.COLUMNS.DISCOUNT_PERCENTAGE]: element.discount_percentage,
          [PURCHASE_FMCG_DETAILS.COLUMNS.DISCOUNT_AMOUNT]: element.discount_amount,
          [PURCHASE_FMCG_DETAILS.COLUMNS.HEAD_ID]: element.head_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.TYPE_ID]: 1,
          [PURCHASE_FMCG_DETAILS.COLUMNS.SUB_CATEGORY_ID]: element.sub_category_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.CATEGORY_ID]: element.category_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.UOM_ID]: element.uom_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.RATE]: element.rate || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.AMOUNT]: element.amount || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.WAREHOUSE_ID]: body.wh_id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_ORDER_NO]: body.pono,
          [PURCHASE_FMCG_DETAILS.COLUMNS.MRP]: element.mrp,
          [PURCHASE_FMCG_DETAILS.COLUMNS.GST]: (Number(gst_type) === 2) ? Number(element.gst) : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.CGST]: (Number(gst_type) === 2) ? Number(element.gst) / 2 : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.SGST]: (Number(gst_type) === 2) ? Number(element.gst) / 2 : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.GST_AMOUNT]: (Number(gst_type) === 2) ? Number(element.gst_amount) : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.IGST]: (Number(gst_type) === 1) ? Number(element.gst) : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.IGST_AMOUNT]: (Number(gst_type) === 1) ? Number(element.gst_amount) : 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.CESS]: element.cess || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.CESS_AMOUNT]: element.cess_amt || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_ORDER_QUANTITY]: element.po_qty,
          [PURCHASE_FMCG_DETAILS.COLUMNS.WAREHOUSE_MARGIN]: element.warehouse_margin || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.SALES_MARGIN]: element.sales_margin,
          [PURCHASE_FMCG_DETAILS.COLUMNS.ACCEPTED_MARGIN]: element.accepted_margin || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.SALE_RATE]: element.sale_rate || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.REASON_DEBIT_NOTE]: element.reason_debit_note || "",
          [PURCHASE_FMCG_DETAILS.COLUMNS.REASON_DEBIT_NOTE_AMOUNT]: Number(element.reason_debit_note_amt) || 0,
          [PURCHASE_FMCG_DETAILS.COLUMNS.RETURN_QUANTITY]: element.return_qty,
          [PURCHASE_FMCG_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
          [PURCHASE_FMCG_DETAILS.COLUMNS.UPDATED_AT]: new Date()
        }));

        // Batch insert in chunks of 1000 records
        if (purchaseDetailsData.length > 0) {
          for (let i = 0; i < purchaseDetailsData.length; i += 1000) {
            const batch = purchaseDetailsData.slice(i, i + 1000);

            await trx(PURCHASE_FMCG_DETAILS.NAME)
              .insert(batch)
              .onConflict([PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID, PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID])
              .merge(); // merge will update if conflict happens, else insert
          }
        }
      }

      // Step 5: Update Purchase_Tray_Details
      if (Array.isArray(body.purchase_tray_details)) {
        const trayInsertData = [];

        _.forEach(body.purchase_tray_details, (element) => {
          trayInsertData.push({
            [PURCHASE_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
            [PURCHASE_TRAY_DETAILS.COLUMNS.DOCDATE]: body.docdate || null,
            [PURCHASE_TRAY_DETAILS.COLUMNS.TRAY_ID]: element.tray_id,
            [PURCHASE_TRAY_DETAILS.COLUMNS.TRAY_COUNT]: parseFloat(element.tray_count) || 0
          });
        });

        if (trayInsertData.length > 0) {
          await trx(PURCHASE_TRAY_DETAILS.NAME)
            .insert(trayInsertData)
            .onConflict([
              PURCHASE_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID,
              PURCHASE_TRAY_DETAILS.COLUMNS.TRAY_ID
            ])
            .merge();
        }
      }

      // Step 6: Update Item Stock
      if (_.isArray(body.purchase_fmcg_details)) {
        await Promise.all(
          _.map(body.purchase_fmcg_details, async (element) => {
            const updateData = {
              [ITEM.COLUMNS.MRP]: parseFloat(element.mrp) || 0,
              [ITEM.COLUMNS.DISCOUNT]: parseFloat(element.discount_percentage) || 0,
              [ITEM.COLUMNS.PURCHASE_RATE]: parseFloat(element.rate) || 0,
              [ITEM.COLUMNS.SALE_RATE]: parseFloat(element.sale_rate) || 0,
            };

            if (parseFloat(element.gst) > 0) {
              updateData[ITEM.COLUMNS.GST] = parseFloat(element.gst);
            }

            if (parseFloat(element.cess) > 0) {
              updateData[ITEM.COLUMNS.CESS] = parseFloat(element.cess);
            }


            await trx(ITEM.NAME)
              .where(ITEM.COLUMNS.ID, element.product_id)
              .update(updateData)
          })
        );
      }

      // Step 7: Update Supplier Balance
      const supplier = await trx(SUPPLIER.NAME)
        .select(SUPPLIER.COLUMNS.BALANCE)
        .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
        .first();

      console.log("Fetched Supplier Balance:", supplier);

      const grandTotalAmount = body.grand_total > 0 ? body.grand_total : 0;
      const existingGrandTotalAmount = existingGrandTotal > 0 ? existingGrandTotal : 0;
      const totalReturnAmount = body.return_amount > 0 ? body.return_amount : 0;
      const currentBalance = parseFloat(supplier[SUPPLIER.COLUMNS.BALANCE] || 0);
      const newBalance = currentBalance + grandTotalAmount - existingGrandTotalAmount - totalReturnAmount;

      console.log("Current Balance:", currentBalance);
      console.log("Grand Total Amount:", grandTotalAmount);
      console.log("Existing Grand Total Amount:", existingGrandTotalAmount);
      console.log("Total Return Amount:", totalReturnAmount);
      console.log("New Balance:", newBalance);

      if (!isNaN(newBalance)) {
        await trx(SUPPLIER.NAME)
          .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
          .update({ [SUPPLIER.COLUMNS.BALANCE]: newBalance });

        await trx(PURCHASE_FMCG_MASTER.NAME)
          .where(PURCHASE_FMCG_MASTER.COLUMNS.ID, purchase_id)
          .update({ [PURCHASE_FMCG_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: grandTotalAmount });

        console.log("Supplier balance updated successfully");
      }


      // Step 8: Update GRN NO Stock
      if (body.invoice_no && body.supplier_id && body.pono) {
        await trx(PURCHASE_FMCG_GRN_MASTER.NAME)
          .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO, body.invoice_no)
          .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID, body.supplier_id)
          .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.PONO, body.pono)
          .update({ [PURCHASE_FMCG_GRN_MASTER.COLUMNS.STATUS]: purchase_id });
      }

      // Step 9: Insert/ Update Party Ledger
      // Check if stock already exists for the product and date
      const existingSupplierDetails = await trx(PARTY_LEDGER.NAME)
        .where({
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
          [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date()
        })
        .first();

      if (existingSupplierDetails) {
        // If stock exists, update the purchase quantity
        await trx(PARTY_LEDGER.NAME)
          .where({
            [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
            [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date()
          })
          .update({
            [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: trx.raw(
              `${PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT} + ?  - ? `,
              [grandTotalAmount, existingGrandTotalAmount] // ✅ Single array
            ),
            [PARTY_LEDGER.COLUMNS.UPDATED_AT]: new Date()
          });
        console.log(grandTotalAmount, existingGrandTotalAmount, "total amount")

      } else {
        // If party ledger does not exist, insert a new record
        await trx(PARTY_LEDGER.NAME).insert({
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: purchase_id,
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
          [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
          [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: body.docno,
          [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "E",
          [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
          [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
          [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
          [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: 0,
          [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: grandTotalAmount,
          [PARTY_LEDGER.COLUMNS.REMARKS]: `Purchase No (${body.docno})`,
          [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'S',
          [PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
          [PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
          [PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
        });

      }

      let isReturnAdded = false;
      const returnItems = _.filter(body.purchase_fmcg_details, item => Number(item.return_qty) > 0);

      if (returnItems.length > 0) {
        isReturnAdded = true;

        let purchase_return_mst_id;
        let docno;

        const existingReturn = await trx(`${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
          .select("id", "docno")
          .where(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID, purchase_id)
          .first();

        if (existingReturn) {
          // ✅ update existing return master
          purchase_return_mst_id = existingReturn.id;
          docno = existingReturn.docno;

          await trx(`${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
            .where(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID, purchase_return_mst_id)
            .update({
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCDATE]: body.docdate,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_AMOUNT]: body.return_amount,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.GRAND_TOTAL]: body.return_amount || 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_DATE]: body.invoice_date || 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ROFF]: 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.RETURN_TYPE]: 1,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_GST_AMT]: gst_type === 2 ? Number(body.gst) : 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMT]: gst_type === 1 ? Number(body.gst) : 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.cess_amt || 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.UPDATED_AT]: new Date().toISOString(),
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
            }); // your update logic

          await trx(`${PURCHASE_FMCG_RETURN_DETAILS.NAME}`)
            .where(PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID, purchase_return_mst_id)
            .del();
        } else {
          // ✅ insert return master
          const [response] = await trx(`${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
            .returning("id")
            .insert({
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCDATE]: body.docdate,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_AMOUNT]: body.return_amount,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.GRAND_TOTAL]: body.return_amount || 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_DATE]: body.invoice_date || 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ROFF]: 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.RETURN_TYPE]: 2,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_GST_AMT]: gst_type === 2 ? Number(body.gst) : 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMT]: gst_type === 1 ? Number(body.gst) : 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.cess_amt || 0,
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.CREATED_AT]: new Date().toISOString(),
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.CREATED_BY]: userDetails.id
            }); // your insert logic

          purchase_return_mst_id = response.id;
          docno = `${purchase_return_mst_id}`;

          await trx(`${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
            .where(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID, purchase_return_mst_id)
            .update({
              [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCNO]: docno
            });
        }

        // ✅ Then build and insert return details
        const purchaseReturnDetailsData = returnItems.map(element => ({
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_mst_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DOCNO]: docno,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DOCDATE]: body.docdate,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRODID]: element.product_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRO_CODE]: element.product_code,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.BATCH_NO]: 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.EXPIRY_DATE]: new Date(),
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ACCEPTED_QTY]: element.qty || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ACCEPTED_FREE_QTY]: element.free_qty || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_QTY]: element.return_qty || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GRN_RETURN_QTY]: element.return_qty || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY]: element.free_qty || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DIS_PER]: element.discount_percentage || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DIS_AMT]: element.discount_amount || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RATE]: element.rate,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.AMOUNT]: Number(element.return_qty) * Number(element.rate) || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.MRP]: Number(element.mrp) || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GST]: gst_type === 2 ? Number(element.gst) : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CGST]: gst_type === 2 ? Number(element.gst) / 2 : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.SGST]: gst_type === 2 ? Number(element.gst) / 2 : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GST_AMOUNT]: gst_type === 2 ? Number(element.gst_amount) : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.IGST]: gst_type === 1 ? Number(element.gst) : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.IGST_AMOUNT]: gst_type === 1 ? Number(element.gst_amount) : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CESS]: element.cess || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CESS_AMT]: element.cess_amt || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.REASON]: 1,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CREATED_AT]: new Date(),
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CREATED_BY]: userDetails.id || 1
        }));

        if (purchaseReturnDetailsData.length > 0) {
          await trx.batchInsert(PURCHASE_FMCG_RETURN_DETAILS.NAME, purchaseReturnDetailsData, 1000);
        }

        // Step 6: Update Item Stock
        if (_.isArray(body.purchase_fmcg_details)) {
          await Promise.all(
            _.map(body.purchase_fmcg_details, async (element) => {
              await trx(`${PURCHASE_FMCG_DETAILS.NAME}`)
                .where({
                  [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_id,
                  [PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id
                })
                .update({
                  [PURCHASE_FMCG_DETAILS.COLUMNS.RETURN_QUANTITY]: Number(element.return_qty)
                });
            })
          );
        }
      }

      // Commit transaction (all operations successful)
      await trx.commit();
      return {
        success: true,
        return: isReturnAdded // ✅ true if at least one return was inserted
      };

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


  async function getPurchaseGrnRepo({ body, params, logTrace }) {
    const knex = this;
    const { pono, invoice_no } = params;

    const query = knex
      .select([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as address1`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as address2`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as address3`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as address4`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE} as supplier_balance`,
        knex.raw(`SUM(${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.PUR_QTY}) as purchase`),
        knex.raw(`SUM(${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.SALES_IN_QTY}) as sales`),
        knex.raw(`SUM(${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.PUR_RET_QTY}) as purchase_return`),
        knex.raw(`SUM(${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.SALES_RETURN_QTY}) as sales_return`),
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.OP_BAL} as opening_stock`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE} as closing_stock`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_DATE}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.PONO}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.COMPANY_ID}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.CUSTOMER_TYPE}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.GST_AMT}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.IGST_AMT}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.CESS_AMT}`
      ])
      .from(`${PURCHASE_FMCG_GRN_MASTER.NAME} as ${PURCHASE_FMCG_GRN_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .leftJoin(
        `${STOCKLEDGER.NAME} as ${STOCKLEDGER.NAME}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.WAREHOUSE_ID}`,
        `${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.WH_ID}`
      )
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.WAREHOUSE_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )
      .whereILike(
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.PONO}`,
        pono
      )
      .andWhereILike(
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO}`,
        invoice_no
      )
      .andWhere(
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.PURCHASE}`,
        false
      )
      .andWhereRaw(
        `EXTRACT(YEAR FROM ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.DATE}) = ?`,
        [currentYear]
      )
      .andWhere(
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.STATUS}`,
        0
      )
      .groupBy([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.OP_BAL}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_DATE}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.ID}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.COMPANY_ID}`
      ]);



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
    console.log(response, 'RESPONSE')
    const purchaseOrderDetails = await Promise.all(
      response.map(async po => {

        let po_details_lines = await knex
          .distinct([
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID} as id`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID} as grn_id`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_CODE}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.UOM_ID}`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.DISCOUNT}`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.DISCOUNT_AMOUNT}`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.ORDER_QTY} as po_qty`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.RECEIVED_QTY} as qty`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.FREE_QTY}`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.AMOUNT} as gross_amount`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.GST_AMOUNT}`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.IGST_AMOUNT}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_RATE} as cost_price`,
            `${ITEM.NAME}.${ITEM.COLUMNS.GST}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_RATE}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.MARGIN} as accepted_margin`,
            `${ITEM.NAME}.${ITEM.COLUMNS.HSN} as hsn`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.MRP} as mrp`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.SALE_RATE}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.SALES_MARGIN}`
          ])
          .from(`${PURCHASE_FMCG_GRN_DETAILS.NAME} as ${PURCHASE_FMCG_GRN_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`, // ✅ Corrected alias for UNITS table
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
          )
          .where(
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PURCHASE_GRN_MST_ID}`,
            po.id
          )
          .where(
            `${PURCHASE_FMCG_GRN_DETAILS.NAME}.${PURCHASE_FMCG_GRN_DETAILS.COLUMNS.PO_NO}`,
            pono
          )


        await Promise.all(
          po_details_lines.map(async (grn) => {
            grn.purchase_batch_details = await knex
              .select(
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.ID}`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID}`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_CODE}`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.BATCH_NO}`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.QTY}`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.SELF_LIFE_EXPIRY} as self_life_qty`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_ID} as expiry_type`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.RETURN_QTY}`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE}`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_DATE}`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE}`,
                `${PURCHASE_BATCH_DETAILS.NAME}.${PURCHASE_BATCH_DETAILS.COLUMNS.COMPANY_ID}`,
              )
              .from(PURCHASE_BATCH_DETAILS.NAME)
              .where(`${PURCHASE_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`, po.id)
              .andWhere(`${PURCHASE_BATCH_DETAILS.COLUMNS.PRODUCT_ID}`, grn.id)
          })
        );

        const purchase_tray_details = await knex
          .select(
            `${PURCHASE_GRN_TRAY_DETAILS.NAME}.${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.ID}`,
            `${PURCHASE_GRN_TRAY_DETAILS.NAME}.${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`,
            `${PURCHASE_GRN_TRAY_DETAILS.NAME}.${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.DOCDATE}`,
            `${PURCHASE_GRN_TRAY_DETAILS.NAME}.${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_ID}`,
            `${PURCHASE_GRN_TRAY_DETAILS.NAME}.${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.TRAY_COUNT}`
          )
          .from(PURCHASE_GRN_TRAY_DETAILS.NAME)
          .where(`${PURCHASE_GRN_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`, po.id);

        po_details_lines = po_details_lines.map(item => {
          const gst = Number(po.gst_type) === 2 ? Number(item.gst) : Number(item.gst);
          const igst = Number(po.gst_type) === 1 ? Number(item.gst) : 0;
          const qty = Number(item.qty) || 0;
          const gstAmount = Number(po.gst_type) === 2 ? Number(item.gst_amount) : Number(item.igst_amount);
          const cessAmount = Number(item.cess_amount) || 0;
          const purchaseRate = Number(item.cost_price) || 0;
          const mrp = Number(item.mrp) || 0;

          const Price = purchaseRate + (qty ? (gstAmount / qty) : 0) + (qty ? (cessAmount / qty) : 0);
          console.log(gst, igst, 'tax Details')
          console.log(qty, gstAmount, 'tax amount Details')
          console.log(cessAmount, purchaseRate, 'cost and tax Details')
          console.log(mrp, Price, 'cost Details')
          const purchaseMarginPercentage = mrp > 0
            ? ((mrp - Price) / mrp) * 100
            : 0;

          return {
            ...item,
            gst,
            igst,
            purchase_margin: purchaseMarginPercentage.toFixed(3)
          };
        });

        return {
          ...po,
          debit_note: 0,
          profit: (po.sales - po.purchase) > 0 ? (po.sales - po.purchase) : 0,
          percentage: 0,
          avg_agreed_margin: 0,
          purchase_margin: 0,
          avg_fil_rate: 0,
          gst: Number(po.gst_type) === 2,
          igst: Number(po.gst_type) === 1,
          po_details_lines,
          purchase_tray_details
        };

      })
    );

    return purchaseOrderDetails;
  }


  async function getPurchaseGrnListRepo({ body, params, logTrace, query }) {
    const knex = this;
    const { supplier_id } = params;
    const query1 = knex
      .select([
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.PONO}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_DATE}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`
      ])
      .from(`${PURCHASE_FMCG_GRN_MASTER.NAME} as ${PURCHASE_FMCG_GRN_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .where(
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.PURCHASE}`,
        false
      )
      .where(
        `${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID}`,
        supplier_id
      )
      .orderBy(`${PURCHASE_FMCG_GRN_MASTER.NAME}.${PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO}`, 'desc')

    const response = await query1;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Po data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }


  async function deletePurchaseDetailsRepo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    const { purchase_id } = params;

    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();

    try {
      // Step 1: Get PURCHASE_ID already exists
      const existingPurchaseDetails = await trx(PURCHASE_FMCG_MASTER.NAME)
        .select(
          `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`,
          `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}`,
          `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID}`,
          `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.GRAND_TOTAL}`,
          `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.RETURN_AMOUNT}`,
          `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO}`
        )
        .where({
          [PURCHASE_FMCG_MASTER.COLUMNS.ID]: purchase_id
        })
        .first();

      if (!existingPurchaseDetails && !existingPurchaseDetails?.id) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Purchase Details was not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const { docdate, supplier_id, grand_total, invoice_no, total_return_amount } = existingPurchaseDetails;
      console.log(existingPurchaseDetails, "purchase master")

      // Step 2: Update Supplier Balance
      const supplier = await trx(SUPPLIER.NAME)
        .select(SUPPLIER.COLUMNS.BALANCE)
        .where(SUPPLIER.COLUMNS.ID, supplier_id)
        .first();

      const grandTotalAmount = grand_total > 0 ? Number(grand_total) : 0;
      const totalReturnAmount = total_return_amount > 0 ? Number(total_return_amount) : 0;
      const currentBalance = parseFloat(supplier?.balance || 0); // FIXED HERE
      const newBalance = Math.max(currentBalance - grandTotalAmount + totalReturnAmount, 0);

      console.log("Current Balance:", currentBalance);
      console.log("Grand Total Amount:", grandTotalAmount);
      console.log("Grand Total Amount:", total_return_amount);
      console.log("New Balance:", newBalance);

      if (!isNaN(newBalance)) {
        await trx(SUPPLIER.NAME)
          .where(SUPPLIER.COLUMNS.ID, supplier_id)
          .update({ [SUPPLIER.COLUMNS.BALANCE]: newBalance });

        console.log("Supplier balance updated successfully");
      }


      // Step 5: Update GRN NO Stock
      if (invoice_no && supplier_id) {
        await trx(PURCHASE_FMCG_GRN_MASTER.NAME)
          .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.INVOICE_NO, invoice_no)
          .where(PURCHASE_FMCG_GRN_MASTER.COLUMNS.SUPPLIER_ID, supplier_id)
          .update({
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.STATUS]: 0,
            [PURCHASE_FMCG_GRN_MASTER.COLUMNS.PURCHASE]: false
          });
      }

      // Step 6: Delete Master and Details 
      await trx(PURCHASE_FMCG_MASTER.NAME)
        .where(PURCHASE_FMCG_MASTER.COLUMNS.ID, purchase_id)
        .del();

      await trx(PURCHASE_FMCG_DETAILS.NAME)
        .where(PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID, purchase_id)
        .del();

      await trx(PURCHASE_MASTER_BATCH_DETAILS.NAME)
        .where(PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID, purchase_id)
        .del();

      await trx(PURCHASE_TRAY_DETAILS.NAME)
        .where(PURCHASE_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID, purchase_id)
        .del();

      await trx(PURCHASE_MST_PONUM.NAME)
        .where(PURCHASE_MST_PONUM.COLUMNS.PURMST_ID, purchase_id)
        .del();

      await trx(PARTY_LEDGER.NAME)
        .where(PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID, purchase_id)
        .del();


      const existingReturn = await trx(`${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
        .select("id", "docno")
        .where(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID, purchase_id)
        .first();

      if (existingReturn) {
        // ✅ update existing return master
        let purchase_return_mst_id = existingReturn.id;
        await trx(PURCHASE_FMCG_RETURN_MASTER.NAME)
          .where(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID, purchase_id)
          .del();

        await trx(PURCHASE_FMCG_RETURN_DETAILS.NAME)
          .where(PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID, purchase_return_mst_id)
          .del();
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

  async function getPurchaseno({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    const query = knex(PURCHASE_FMCG_MASTER.NAME)
      .returning("id")
      .where(PURCHASE_FMCG_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear)
      .orderBy(PURCHASE_FMCG_MASTER.COLUMNS.ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Purchase Master",
      logTrace
    });

    const response = await query;


    if (response.length === 0) {
      return { Docno: "1" };
    }

    const docno = Number(response[0].docno);
    console.log(docno, "docno")
    const Docno = `${docno + 1}`;
    return { Docno };
  }

  async function getPurchaseByIdRepo({ body, params, logTrace }) {
    const knex = this;
    const { purchase_id } = params;
    const query = knex
      .select([
        `${PURCHASE_FMCG_MASTER.NAME}.*`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_NO}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.REMARK} as remark`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.TOTAL_AMOUNT} as total_amount`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DISCOUNT} as discount_amount`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.GRAND_TOTAL} as grand_total`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.CUSTOMER_TYPE}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO} as invoice_no`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_DATE} as invoice_date`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ROUND_OFF} as roff`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.RETURN_AMOUNT} as return_amount`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.COMPANY_ID} as company_id`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.OTHER_CHARGES} as other_charges`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.GST} as gst`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.IGST} as igst`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.CESS_AMOUNT} as cess_amt`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.LESS_AMOUNT} as less_amt`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.TCS} as tcs`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DC_NO} as dc_no`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.CLOSING_STOCK} as closing_stock`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.OPENING_STOCK} as opening_stock`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.PURCHASE} as purchase`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE} as gst_type`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as add3`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as add4`
      ])
      .from(`${PURCHASE_FMCG_MASTER.NAME} as ${PURCHASE_FMCG_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .where(
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`,
        purchase_id
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
        message: "Purchase data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const purchaseDetails = await Promise.all(
      response.map(async purchase => {
        const purchase_details_lines = await knex
          .select([
            `${PURCHASE_FMCG_DETAILS.NAME}.*`,
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.ID} as purchase_id`,
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID} as id`,
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_CODE} as prod_code`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as pro_name`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.RATE} as purchase_rate`,
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.RATE} as cost_price`,
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.DISCOUNT_PERCENTAGE} as discount`,
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.DISCOUNT_AMOUNT} as discount_amount`,
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.AMOUNT} as gross_amount`,
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.WAREHOUSE_MARGIN} as purchase_margin`,
            `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as soh`,
            `${ITEM.NAME}.${ITEM.COLUMNS.HSN} as hsn`
          ])
          .from(`${PURCHASE_FMCG_DETAILS.NAME} as ${PURCHASE_FMCG_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`, // ✅ Corrected alias for UNITS table
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
          )
          .where(
            `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`,
            purchase.id
          )

        await Promise.all(
          purchase_details_lines.map(async (element) => {
            element.purchase_batch_details = await knex
              .select([
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.ID}`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.PRODUCT_ID}`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.PRODUCT_CODE}`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.BATCH_NO}`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.QTY}`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.SELF_LIFE_EXPIRY_DAYS} as self_life_qty`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.EXPIRY_ID} as expiry_type`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.RETURN_QTY}`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.MANUFACTURE_DATE}`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.EXPIRY_DATE}`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.EXPIRY_VALUE}`,
                `${PURCHASE_MASTER_BATCH_DETAILS.NAME}.${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.COMPANY_ID}`,
              ])
              .from(PURCHASE_MASTER_BATCH_DETAILS.NAME)
              .where(`${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`, purchase.id)
              .where(`${PURCHASE_MASTER_BATCH_DETAILS.COLUMNS.PRODUCT_ID}`, element.prodid)
          })
        );

        const purchase_tray_details = await knex
          .select([
            `${PURCHASE_TRAY_DETAILS.NAME}.*`
          ])
          .from(PURCHASE_TRAY_DETAILS.NAME)
          .where(`${PURCHASE_TRAY_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`, purchase.id)
        console.log(purchase_details_lines, "purchase details lines")
        const purchase_grn_details = {
          pono: purchase_details_lines[0]?.po_no ? purchase_details_lines[0]?.po_no : 0,
          invoice_no: response[0].invoice_no,
          invoice_date: response[0].invoice_date,
          supplier_id: response[0].supplier_id,
          supplier_name: response[0].supplier_name
        }

        return {
          ...purchase,
          gst: Number(purchase.gst_type) === 2,
          igst: Number(purchase.gst_type) === 1,
          purchase_details_lines,
          purchase_tray_details,
          purchase_grn_details
        };

      })
    );

    return purchaseDetails;
  }

  async function getPurchaseEditListRepo({ params, body, logTrace, userDetails, query }) {
    const knex = this;
    const { bill_no, from_date, to_date } = query;

    const query1 = knex
      .select([
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`
      ])
      .from(`${PURCHASE_FMCG_MASTER.NAME} as ${PURCHASE_FMCG_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )


    // Check if bill_no is a valid value before applying condition
    if (bill_no) {
      query1.andWhere(`${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`, bill_no);
    }

    // Use .whereBetween() for better performance and readability
    if (from_date && to_date) {
      query1.whereBetween(`${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}`, [from_date, to_date]);
    }

    // Ensure orderBy is always applied
    query1.orderBy(`${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`, "ASC");

    const response = await query1;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase Details not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatedPurchaseDetails = response.map((detail) => ({
      ...detail,
      gst: Number(detail.gst_type) === 2,
      igst: Number(detail.gst_type) === 1
    }));

    return updatedPurchaseDetails;
  }


  return {
    postpurchase,
    putPurchaseDetailsRepo,
    getPurchaseGrnRepo,
    getPurchaseGrnListRepo,
    deletePurchaseDetailsRepo,
    getPurchaseno,
    getPurchaseByIdRepo,
    getPurchaseEditListRepo
  };
}

module.exports = purchaseRepo;
