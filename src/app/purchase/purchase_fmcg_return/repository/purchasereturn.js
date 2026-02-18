const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const _ = require("lodash");
const { PURCHASE_FMCG_RETURN_MASTER, PURCHASE_FMCG_RETURN_DETAILS, PURCHASE_RETURN_DETAILS, STOCKLEDGER, PURCHASE_FMCG_MASTER, PURCHASE_FMCG_DETAILS, PARTY_LEDGER, REASON } = require("../../commons");
const { PURCHASE_DETAILS, PURCHASE_MST } = require("../../commons")
const { SUPPLIER, VENDORS_MAPPING } = require("../../../catalog/commons");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { COMPANY } = require("../../../accounts/company/commons/constants");
const { ITEM } = require("../../../catalog/commons");



function purchaseReturnRepo(fastify) {
  async function postPurchaseReturnRepo({ params, body, logTrace, userDetails, financialYear }) {
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
      const [response] = await trx(`${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
        .returning("id")
        .insert({
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCDATE]: new Date(),
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_DATE]: new Date(),
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_AMOUNT]: body.total_amount,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.GRAND_TOTAL]: body.grand_total || 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: body.grand_total || 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID]: body.purchase_master_id,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || " ",
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ROFF]: body.roff,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.RETURN_TYPE]: body.type,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? Number(body.igst) : 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? Number(body.igst) : 0,
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
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.AK_DATE]: new Date(),
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.AKNO]: 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.EFFECT_DATE]: new Date(),
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.IRNNO]: 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.CREATED_AT]: new Date().toISOString(),
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
        });

      const purchase_return_mst_id = response.id;
      const docno = `${purchase_return_mst_id}`;

      // Step 4: Update DOCNO in Purchase Return Master
      await trx(`${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
        .where(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID, purchase_return_mst_id)
        .update({
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCNO]: docno
        });

      // Step 5: Insert into Purchase Return Details
      if (_.isArray(body.purchase_return_details) && body.purchase_return_details.length > 0) {
        const purchaseReturnDetailsData = _.map(body.purchase_return_details, (element) => ({
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_mst_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DOCNO]: docno,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DOCDATE]: new Date(),
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRODID]: element.product_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRO_CODE]: element.product_code,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.BATCH_NO]: String(element.batch_no) || '',
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.EXPIRY_DATE]: element.expiry_date || new Date(),
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ACCEPTED_QTY]: element.accepted_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ACCEPTED_FREE_QTY]: element.accepted_free_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_QTY]: element.return_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GRN_RETURN_QTY]: element.return_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY]: element.return_free_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.TEMP_RETURN_QTY]: element.return_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.TEMP_RETURN_FREE_QTY]: element.return_free_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DIS_PER]: element.discount_percentage,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DIS_AMT]: element.discount_amount,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RATE]: element.rate,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.AMOUNT]: element.amount || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.MRP]: element.mrp,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GST]: (Number(gst_type) === 2) ? Number(element.igst) : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CGST]: (Number(gst_type) === 2) ? Number(element.igst) / 2 : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.SGST]: (Number(gst_type) === 2) ? Number(element.igst) / 2 : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GST_AMOUNT]: (Number(gst_type) === 2) ? Number(element.rate) * Number(element.igst) * Number(element.return_qty) / 100 : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.IGST]: (Number(gst_type) === 1) ? Number(element.igst) : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.IGST_AMOUNT]: (Number(gst_type) === 1) ? Number(element.rate) * Number(element.igst) * Number(element.return_qty) / 100 : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CESS]: element.cess || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CESS_AMT]: element.cess_amt || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.REASON]: element.reason,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CREATED_AT]: new Date(),
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
        }));

        // Batch insert in chunks of 1000 records
        if (purchaseReturnDetailsData.length > 0) {
          await trx.batchInsert(PURCHASE_FMCG_RETURN_DETAILS.NAME, purchaseReturnDetailsData, 1000);
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
              [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
              [STOCKLEDGER.COLUMNS.DATE]: body.docdate,
            };

            const existingStock = await trx(STOCKLEDGER.NAME).where(condition).first();

            if (existingStock) {
              // Update existing stock record
              await trx(STOCKLEDGER.NAME)
                .where(condition)
                .update({
                  [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: trx.raw(
                    `${STOCKLEDGER.COLUMNS.PUR_RET_QTY} + ?`,
                    [totalReturnQty]
                  ),
                  [STOCKLEDGER.COLUMNS.UPDATED_BY]: userDetails.id,
                  [STOCKLEDGER.COLUMNS.UPDATED_AT]: new Date()
                });
            } else {
              // Insert new stock record
              await trx(STOCKLEDGER.NAME).insert({
                [STOCKLEDGER.COLUMNS.DATE]: new Date(),
                [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
                [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: totalReturnQty,
                [STOCKLEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id || 1,
                [STOCKLEDGER.COLUMNS.CREATED_AT]: new Date()
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
          const returnStock = await trx(PURCHASE_FMCG_DETAILS.NAME)
            .select(PURCHASE_FMCG_DETAILS.COLUMNS.RETURN_QUANTITY)
            .where({
              [PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
              [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: body.purchase_master_id
            })
            .first(); // Get only the first row

          const oldReturnQty = parseFloat(returnStock?.[PURCHASE_FMCG_DETAILS.COLUMNS.RETURN_QUANTITY]) || 0;
          const totalReturnQty = oldReturnQty + returnQty;

          // Update the return quantity
          await trx(PURCHASE_FMCG_DETAILS.NAME)
            .where({
              [PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
              [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: body.purchase_master_id
            })
            .update({
              [PURCHASE_FMCG_DETAILS.COLUMNS.RETURN_QUANTITY]: totalReturnQty
            });
        }
      }


      // Step 10: Insert Party Ledger
      await trx(PARTY_LEDGER.NAME).insert({
        [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: purchase_return_mst_id,
        [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
        [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
        [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
        [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "PR",
        [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
        [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
        [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
        [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: body.grand_total,
        [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: 0,
        [PARTY_LEDGER.COLUMNS.REMARKS]: `Purchase Retrun No (${docno})`,
        [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'S',
        [PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
        [PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
        [PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
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

  async function putPurchaseReturnDetailsRepo({ params, body, logTrace, userDetails, financialYear }) {
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

      // Step 3: Chek PURCHASE_FMCG_RETURN_MASTER_ID Already Exists
      const existingPurchaseReturnDetails = await trx(PURCHASE_FMCG_RETURN_MASTER.NAME)
        .select(
          `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID}`,
          `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TEMP_GRAND_TOTAL}`,
          `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID}`,
          `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCNO}`
        )
        .where({
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID]: purchase_return_id
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
      const purchaseReturnUpdateResponse = await trx(`${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
        .where({
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID]: purchase_return_id // Find the record by ID
        })
        .update({
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCDATE]: new Date(),
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_DATE]: new Date(),
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_AMOUNT]: body.total_amount,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.GRAND_TOTAL]: body.grand_total || 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: body.grand_total || 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID]: purchase_master_id || 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || " ",
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ROFF]: body.roff,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.RETURN_TYPE]: body.type,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? Number(body.igst) : 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? Number(body.igst) : 0,
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
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.AK_DATE]: new Date(),
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.AKNO]: 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.EFFECT_DATE]: new Date(),
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.IRNNO]: 0,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.UPDATED_AT]: new Date()
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
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DOCNO]: docno,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DOCDATE]: body.docdate,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRODID]: element.product_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRO_CODE]: element.product_code,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.BATCH_NO]: element.batch_no,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.EXPIRY_DATE]: element.expiry_date,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ACCEPTED_QTY]: element.accepted_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ACCEPTED_FREE_QTY]: element.accepted_free_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_QTY]: element.return_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GRN_RETURN_QTY]: element.return_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY]: element.return_free_qty,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DIS_PER]: element.discount_percentage,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DIS_AMT]: element.discount_amount,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RATE]: element.rate,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.AMOUNT]: element.amount || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.MRP]: element.mrp,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GST]: (Number(gst_type) === 2) ? Number(element.igst) : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CGST]: (Number(gst_type) === 2) ? Number(element.igst) / 2 : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.SGST]: (Number(gst_type) === 2) ? Number(element.igst) / 2 : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GST_AMOUNT]: (Number(gst_type) === 2) ? Number(element.rate) * Number(element.igst) * Number(element.return_qty) / 100 : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.IGST]: (Number(gst_type) === 1) ? Number(element.igst) : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.IGST_AMOUNT]: (Number(gst_type) === 1) ? Number(element.rate) * Number(element.igst) * Number(element.return_qty) / 100 : 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CESS]: element.cess || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CESS_AMT]: element.cess_amt || 0,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.REASON]: element.reason,
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        // Batch insert in chunks of 1000 records
        if (purchaseDetailsData.length > 0) {
          for (let i = 0; i < purchaseDetailsData.length; i += 1000) {
            const batch = purchaseDetailsData.slice(i, i + 1000);

            await trx(PURCHASE_FMCG_RETURN_DETAILS.NAME)
              .insert(batch)
              .onConflict([PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID, PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRODID])
              .merge(); // merge will update if conflict happens, else insert
          }
        }
      }



      // Step 7: Update Purchase_RETURN_FMCG_Details
      if (_.isArray(body.purchase_return_details) && body.purchase_return_details.length > 0) {
        await Promise.all(
          body.purchase_return_details.map(async (element) => {
            const purchaseReturnDetail = await trx(PURCHASE_FMCG_RETURN_DETAILS.NAME)
              .select(
                `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.TEMP_RETURN_QTY}`,
                `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.TEMP_RETURN_FREE_QTY}`
              )
              .where({
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_id,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRODID]: element.product_id
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

            await trx(PURCHASE_FMCG_RETURN_DETAILS.NAME)
              .where({
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_id,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRODID]: element.product_id
              })
              .update({
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.TEMP_RETURN_QTY]: returnQty,
                [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.TEMP_RETURN_FREE_QTY]: returnFreeQty
              });

            const condition = {
              [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
              [STOCKLEDGER.COLUMNS.DATE]: new Date(),
            };

            const existingStock = await trx(STOCKLEDGER.NAME).where(condition).first();

            if (existingStock) {
              // Update existing stock record
              await trx(STOCKLEDGER.NAME)
                .where(condition)
                .update({
                  [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: trx.raw(
                    `${STOCKLEDGER.COLUMNS.PUR_RET_QTY} + ? - ?`,
                    [parseFloat(existingTotalReturnQty) || 0, parseFloat(totalReturnQty) || 0]
                  ),
                  [STOCKLEDGER.COLUMNS.UPDATED_BY]: userDetails.id,
                  [STOCKLEDGER.COLUMNS.UPDATED_AT]: new Date()
                });
            } else {
              // Insert new stock record
              await trx(STOCKLEDGER.NAME).insert({
                [STOCKLEDGER.COLUMNS.DATE]: new Date(),
                [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
                [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: totalReturnQty,
                [STOCKLEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id || 1,
                [STOCKLEDGER.COLUMNS.CREATED_AT]: new Date()
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

            await trx(PURCHASE_FMCG_DETAILS.NAME)
              .where({
                [PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: body.purchase_master_id
              })
              .update({
                [PURCHASE_FMCG_DETAILS.COLUMNS.RETURN_QUANTITY]: returnQty
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

        await trx(PURCHASE_FMCG_RETURN_MASTER.NAME)
          .where(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID, purchase_return_id)
          .update({ [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: grandTotalAmount });

        console.log("Supplier balance updated successfully");
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
              [grandTotalAmount, existingGrandTotal] // ✅ Single array
            ),
            [PARTY_LEDGER.COLUMNS.UPDATED_AT]: new Date()
          });
        console.log(grandTotalAmount, existingGrandTotal, "total amount")

      } else {
        // If party ledger does not exist, insert a new record
        await trx(PARTY_LEDGER.NAME).insert({
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: purchase_return_id,
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
          [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
          [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
          [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "PR",
          [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
          [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
          [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
          [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: body.grand_total,
          [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: 0,
          [PARTY_LEDGER.COLUMNS.REMARKS]: `Purchase Retrun No (${docno})`,
          [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'S',
          [PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
          [PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
          [PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
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


  async function deletePurchaseReturnDetailsRepo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    const { purchase_return_id } = params;
    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();

    try {
      // Step 1: Chek PURCHASE_FMCG_RETURN_MASTER_ID Already Exists
      const existingPurchaseReturnDetails = await trx(PURCHASE_FMCG_RETURN_MASTER.NAME)
        .select(
          `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID}`,
          `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID}`,
          `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCDATE}`,
          `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.WH_ID}`,
          `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.SUPPLIER_ID}`,
          `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.GRAND_TOTAL}`
        )
        .where({
          [PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID]: purchase_return_id
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

      const { purchase_master_id, docdate, wh_id, supplier_id, grand_total } = existingPurchaseReturnDetails;
      console.log(existingPurchaseReturnDetails, "details")
      // Step 2: Get Purchase_Return_Details already exists
      const purchaseReturnDetail = await trx(PURCHASE_FMCG_RETURN_DETAILS.NAME)
        .select([
          `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ID}`,
          `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRODID}`,
          `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_QTY} as qty`,
          `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY} as free_qty `
        ])
        .where({
          [PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID]: purchase_return_id
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
              [STOCKLEDGER.COLUMNS.PROD_ID]: element.prodid,
              [STOCKLEDGER.COLUMNS.DATE]: new Date()
            };

            const existingStock = await trx(STOCKLEDGER.NAME).where(condition).first();

            if (existingStock) {
              // Update existing stock record
              await trx(STOCKLEDGER.NAME)
                .where(condition)
                .update({
                  [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: trx.raw(
                    `${STOCKLEDGER.COLUMNS.PUR_RET_QTY} - ?`,
                    [parseFloat(existingTotalReturnQty) || 0]
                  ),
                });
            } else {
              // Insert new stock record
              await trx(STOCKLEDGER.NAME).insert({
                [STOCKLEDGER.COLUMNS.DATE]: new Date(),
                [STOCKLEDGER.COLUMNS.PROD_ID]: element.prodid,
                [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: existingTotalReturnQty,
                [STOCKLEDGER.COLUMNS.COMPANY_ID]: userDetails.company_id,
                [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                [STOCKLEDGER.COLUMNS.WH_ID]: wh_id || 1,
              });
            }

            if (
              purchase_master_id &&
              purchase_master_id !== 0 &&
              element &&
              element.product_id
            ) {
              await trx(PURCHASE_FMCG_DETAILS.NAME)
                .where({
                  [PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                  [PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID]: purchase_master_id
                })
                .update({
                  [PURCHASE_FMCG_DETAILS.COLUMNS.RETURN_QUANTITY]: 0
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
      await trx(PURCHASE_FMCG_RETURN_MASTER.NAME)
        .where(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID, purchase_return_id)
        .del();

      await trx(PURCHASE_FMCG_RETURN_DETAILS.NAME)
        .where(PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID, purchase_return_id)
        .del();

      await trx(PARTY_LEDGER.NAME)
        .where(PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID, purchase_return_id)
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


  async function generatePurchaseReturnNo({ logTrace, financialYear }) {
    const knex = this;

    const query = knex(PURCHASE_FMCG_RETURN_MASTER.NAME)
      .returning("id")
      .where(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear)
      .orderBy(PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Account Master",
      logTrace
    });

    const response = await query;

    if (response.length === 0) {
      return { Docno: `1` };
    }

    const docno = Number(response[0].id);
    const Docno = `${docno + 1}`;
    return { Docno };
  }

  async function getPurchaseReturnByDocNo({ params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${PURCHASE_DETAILS.NAME}.*`,
        `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.ID} AS purchase_details_id`,
        `${SUPPLIER.NAME}.*`,
        `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.PARTYCODE}`,
        `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.IS_BARCODE_GENERATED}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} AS item_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} AS description`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SHORT_NAME} AS item_short_name`,

      ])
      .from(PURCHASE_DETAILS.NAME)
      .leftJoin(
        PURCHASE_MST.NAME,
        `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.DOCNO}`,
        '=',
        `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.DOCNO}`
      )
      .leftJoin(
        SUPPLIER.NAME,
        `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.PARTYCODE}`,
        '=',
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        ITEM.NAME,
        `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.PROD_ID}`,
        '=',
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .where(`${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.DOCNO}`, params.docno);




    logQuery({
      logger: fastify.log,
      query,
      context: "Get PURCHASE Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PURCHASE not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getPurchaseReturnByBillNo({ prod_id, billno, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.QTY} AS prqty`,
      ])
      .from(PURCHASE_RETURN_DETAILS.NAME)
      .leftJoin(
        `${PURCHASERETURNMASTER.NAME} as ${PURCHASERETURNMASTER.NAME}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.PRMST_ID}`,
        `${PURCHASERETURNMASTER.NAME}.${PURCHASERETURNMASTER.COLUMNS.ID}`
      )
      .where(`${PURCHASERETURNMASTER.NAME}.${PURCHASERETURNMASTER.COLUMNS.BILLNO}`, billno)
      .where(`${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.PROD_ID}`, prod_id);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get PURCHASE Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      return { prqty: 0 };
    }
    return response[0];
  }



  async function getPurchaseMaster({ logTrace }) {
    const knex = this;

    // const query = knex("purchase_master as pm")
    //   .select("pm.*", "supplier.*")
    //   .join("supplier", "pm.partycode", "=", "supplier.id")
    //   .where("pm.is_active", "1");


    const query = knex
      .select([
        `${PURCHASE_MST.NAME}.*`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PINCODE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PHONE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.EMAIL}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.WEBSITE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.FSSAI}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANKNAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.AC_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IFSCCODE}`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`,

      ])
      .from(`${PURCHASE_MST.NAME} as ${PURCHASE_MST.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.PARTYCODE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where(
        `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.IS_ACTIVE}`,
        1
      )
      .orderBy(`${PURCHASE_MST.COLUMNS.ID}`, 'DESC');




    logQuery({
      logger: fastify.log,
      query,
      context: "Get PURCHASE",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PURCHASE not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getPurchaseReturnGetAllMaster({ body, params, logTrace }) {
    const knex = this;
    const docno = body.docno
    const query = knex
      .select([
        `${PURCHASERETURNMASTER.NAME}.*`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.PRMST_ID}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.DOCNO}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.DOCDATE}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.PROD_ID}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.DIS_PER}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.DIS_AMT}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.MRP}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.RATE}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.QTY}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.GST_PER}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.GST_AMT}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.CESS_PER}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.CESS_AMT}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.BARCODE}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.HEAD_ID}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.TYPE_ID}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.SUBCAT_ID}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.CAT_ID}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.IGST_PER}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.COMPANY_ID}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_shortname`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as supplier_add1`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as supplier_add2`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as supplier_add3`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as supplier_add4`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY} as supplier_city`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PINCODE} as supplier_pincode`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE} as supplier_state`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY} as supplier_country`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PHONE} as supplier_phone`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE} as supplier_mobile`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.EMAIL} as supplier_email`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.WEBSITE} as supplier_website`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN} as supplier_gstin`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.FSSAI} as supplier_fssai`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO} as supplier_bank_ac_no`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANKNAME} as supplier_bankname`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.AC_NAME} as supplier_ac_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IFSCCODE} as supplier_ifsccode`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.CODE} as company_code`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.SHORTNAME} as company_shortname`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.FULLNAME} as company_fullname`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ADD1} as company_add1`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ADD2} as company_add2`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ADD3} as company_add3`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ADD4} as company_add4`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.CITY} as company_city`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.PINCODE} as company_pincode`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.STATE} as company_state`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.COUNTRY} as company_country`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.PHONE} as company_phone`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.MOBILE} as company_mobile`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.EMAIL} as company_email`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.WEBSITE} as company_website`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.GSTIN} as company_gstin`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.FSSAI} as company_fssai`,
      ])
      .from(`${PURCHASERETURNMASTER.NAME} as ${PURCHASERETURNMASTER.NAME}`)
      .leftJoin(
        `${PURCHASE_RETURN_DETAILS.NAME} as ${PURCHASE_RETURN_DETAILS.NAME}`,
        `${PURCHASERETURNMASTER.NAME}.${PURCHASERETURNMASTER.COLUMNS.DOCNO}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.DOCNO}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${PURCHASERETURNMASTER.NAME}.${PURCHASERETURNMASTER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${PURCHASE_RETURN_DETAILS.NAME}.${PURCHASE_RETURN_DETAILS.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASERETURNMASTER.NAME}.${PURCHASERETURNMASTER.COLUMNS.PARTYCODE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where(
        `${PURCHASERETURNMASTER.NAME}.${PURCHASERETURNMASTER.COLUMNS.DOCNO}`,
        docno
      );

    const response = await query;

    return response[0]
  }


  async function getPurchaseReturnRepo({ body, params, queryString, logTrace }) {
    const knex = this;
    const { supplier_id, type_id } = params;
    const { pro_code, pro_name } = queryString;
    const supplierDetails = await knex(SUPPLIER.NAME)
      .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
      .where(SUPPLIER.COLUMNS.ID, supplier_id)
      .first()

    const { gst_type } = supplierDetails;
    console.log(gst_type, "gst supplier details")
    const query1 = knex
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP} as mrp`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE} as purchase_rate`,
        `${ITEM.NAME}.${ITEM.COLUMNS.GST}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.DISCOUNT}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${VENDORS_MAPPING.NAME} as ${VENDORS_MAPPING.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .where(`${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE}`, true)
      .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`, supplier_id)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE}`, '>', 0)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, company_id)
      .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true);

    // ✅ Type 1: Search by product code
    if (Number(type_id) === 1 && pro_code) {
      query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, '=', String(pro_code));
    }


    // ✅ Type 2: Search by product name
    if (Number(type_id) === 2 && pro_name) {
      query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, 'like', `%${pro_name}%`);
    }

    const response = await query1;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatedResponse = _.map(response, po => ({
      ...po,
      batch_no: 0,
      expiry_date: new Date(),
      return_qty: 0,
      gst_amount: 0,
      discount_amount: 0,
      gst: Number(po.gst),
      igst: 0,
      igst_amount: 0,
      cess_amount: 0,
      reason: "",
      amount: 0
    }));

    return updatedResponse;

  }

  async function getPurchaseNoDetailsRepo({ body, params, queryString, logTrace }) {
    const knex = this;
    const { supplier_id, purchase_id } = params;
    const query = knex
      .select([
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID} as id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as product_code`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.SUPPLIER_ID} as supplier_id`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID} as purchase_master_id`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.QUANTITY}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.RETURN_QUANTITY}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.FREE_QUANTITY} as accepted_free_qty`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.MRP} as mrp`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.RATE} as purchase_rate`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.RATE} as cost_price`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.DISCOUNT_PERCENTAGE} as discount_percentage`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.DISCOUNT_AMOUNT} as discount_amount`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.GST} as gst`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.IGST} as igst`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.CESS} as cess`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_DATE}`
      ])
      .from(`${PURCHASE_FMCG_MASTER.NAME} as ${PURCHASE_FMCG_MASTER.NAME}`)
      .leftJoin(
        `${PURCHASE_FMCG_DETAILS.NAME} as ${PURCHASE_FMCG_DETAILS.NAME}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`
      )
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
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID}`,
        supplier_id
      )

    if (purchase_id) {
      query.andWhere(
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`,
        purchase_id
      )
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Po details",
      logTrace
    });
    const response = await query;
    console.log(response, "resposnse")
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatedResponse = _.map(response, po => ({
      ...po,
      batch_no: " ",
      accepted_qty: Math.max(0, Number(po.qty) - Number(po.return_qty)),
      return_qty: 0,
      return_free_qty: 0,
      expiry_date: new Date(),
      gst_amount: 0,
      igst_amount: 0,
      cess_amount: 0,
      tds_percentage: 0,
      tds_amount: 0,
      reason: " ",
      amount: 0,
      remark: " ",
    }));


    return updatedResponse;

  }

  async function getProductDetailsBySupplierRepo({ body, params, queryString, logTrace }) {
    const knex = this;
    const { supplier_id } = params;
    const query1 = knex
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as product_code`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${VENDORS_MAPPING.NAME} as ${VENDORS_MAPPING.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_ID}`
      )
      .where(`${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE}`, true)
      .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`, supplier_id)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE}`, '>', 0)
      .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
      .orderBy(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, 'ASC');

    const response = await query1;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product details data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getPurchaseReturnListRepo({ body, params, queryString, logTrace }) {
    const knex = this;
    const { from_date, to_date } = params;
    const { billno } = queryString;
    const query = knex
      .select([
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID} as purchase_master_id`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_DATE}`,
        knex.raw(
          `to_jsonb(${SUPPLIER.NAME}.*) as supplier_id`
        ),
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE} as purchase_date`,
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
      .whereRaw(
        `DATE(${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}) >= ?`,
        [from_date]
      )
      .whereRaw(
        `DATE(${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}) <= ?`, // Fixed this condition
        [to_date]
      )
      .orderBy(`${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`, "ASC")

    if (billno) {
      query.andWhere(
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`,
        billno
      )
    }


    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product details data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatePurchaseList = response.map(purchase => {
      const gst = Number(purchase.gst_type) === 2;
      const igst = Number(purchase.gst_type) === 1;

      return {
        ...purchase,
        supplier_id: {
          ...purchase.supplier_id,
          gst,
          igst
        }
      };
    });

    return updatePurchaseList;
  }

  async function getPurchaseReturnBillwiseRepo({ body, params, queryString, logTrace }) {
    const knex = this;
    const { supplier_id } = params;
    const query = knex
      .select([
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID} as id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.QUANTITY} as po_qty`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.FREE_QUANTITY} as free_qty`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.UOM_ID}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.RATE} as cost_price`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.MRP} as mrp`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.DISCOUNT_PERCENTAGE}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.DISCOUNT_AMOUNT}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.GST}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.IGST}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.CESS}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.RATE} as purchase_rate`,
      ])
      .from(`${PURCHASE_FMCG_MASTER.NAME} as ${PURCHASE_FMCG_MASTER.NAME}`)
      .leftJoin(
        `${PURCHASE_FMCG_DETAILS.NAME} as ${PURCHASE_FMCG_DETAILS.NAME}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`
      )
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
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID}`,
        supplier_id
      )
      .whereRaw(
        `DATE(${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}) >= ?`,
        [from_date]
      )
      .whereRaw(
        `DATE(${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}) <= ?`, // Fixed this condition
        [to_date]
      )

    // ✅ Apply search condition only on mapped items
    if (pro_code || pro_name) {
      query.andWhere(function () {
        if (pro_code) {
          this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, pro_code); // exact match
        } else if (pro_name) {
          this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${pro_name}%`); // partial match
        }
      });

    }

    if (invoice_no) {
      query.andWhereILike(
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO}`,
        invoice_no
      )
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Po details",
      logTrace
    });
    const response = await query;
    console.log(response, "resposnse")
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatedResponse = _.map(response, po => ({
      ...po,
      return_qty: 0,
      return_free_qty: 0,
      gst_amount: 0,
      batch_no: 0,
      expiry_date: new Date(),
      discount_amount: 0,
      igst_amount: 0,
      cess_amount: 0,
      reason: " ",
      amount: 0
    }));

    return updatedResponse;
  }


  async function getPurchaseReturnEditListRepo({ params, body, logTrace, userDetails, queryString }) {
    const knex = this;
    const { bill_no, from_date, to_date } = queryString;

    const query1 = knex
      .select([
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID}`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCDATE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`
      ])
      .from(`${PURCHASE_FMCG_RETURN_MASTER.NAME} as ${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )


    // Check if bill_no is a valid value before applying condition
    if (bill_no) {
      query1.andWhere(`${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID}`, bill_no);
    }

    // Use .whereBetween() for better performance and readability
    if (from_date && to_date) {
      query1.whereBetween(`${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.DOCDATE}`, [from_date, to_date]);
    }

    // Ensure orderBy is always applied
    query1.orderBy(`${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID}`, "ASC");

    const response = await query1;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase Return Details not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    console.log(response, "response")
    const updatedPurchaseDetails = response.map((detail) => ({
      ...detail,
      gst: Number(detail.gst_type) === 2,
      igst: Number(detail.gst_type) === 1
    }));

    return updatedPurchaseDetails;
  }

  async function getPurchaseReturnByIdRepo({ body, params, logTrace }) {
    const knex = this;
    const { purchase_return_id } = params;
    const query = knex
      .select([
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID}`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_NO} as invoice_no`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_NO} as invoice_no`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.INVOICE_DATE} as invoice_date`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.REMARK} as remark`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.PURCHASE_MASTER_ID} as purchase_master_id`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.RETURN_TYPE} as type_id`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.SUPPLIER_ID} as supplier_id`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as add3`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as add4`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`
      ])
      .from(`${PURCHASE_FMCG_RETURN_MASTER.NAME} as ${PURCHASE_FMCG_RETURN_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .where(
        `${PURCHASE_FMCG_RETURN_MASTER.NAME}.${PURCHASE_FMCG_RETURN_MASTER.COLUMNS.ID}`,
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
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRODID} as product_id`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRO_CODE} as product_code`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.BATCH_NO} as batch_no`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.EXPIRY_DATE} as expiry_date`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ACCEPTED_QTY} as accepted_qty`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_QTY} as return_qty`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.ACCEPTED_FREE_QTY} as accepted_free_qty`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY} as return_free_qty`,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID} as uom_id`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
            `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as balance`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.MRP} as mrp`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.RATE} as purchase_rate`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DIS_PER} as discount_percentage`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.DIS_AMT} as discount_amount`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GST} as gst`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.GST_AMOUNT} as gst_amount`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.IGST} as igst`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.IGST_AMOUNT} as igst_amount`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CESS} as cess`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.CESS_AMT} as cess_amount`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.AMOUNT} as amount`,
            knex.raw(
              `to_jsonb(${REASON.NAME}.*) as reason`
            )
          ])
          .from(`${PURCHASE_FMCG_RETURN_DETAILS.NAME} as ${PURCHASE_FMCG_RETURN_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PRODID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${REASON.NAME} as ${REASON.NAME}`,
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.REASON}`,
            `${REASON.NAME}.${REASON.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`, // ✅ Corrected alias for UNITS table
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
          )
          .where(
            `${PURCHASE_FMCG_RETURN_DETAILS.NAME}.${PURCHASE_FMCG_RETURN_DETAILS.COLUMNS.PURMST_ID}`,
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
    postPurchaseReturnRepo,
    putPurchaseReturnDetailsRepo,
    deletePurchaseReturnDetailsRepo,
    generatePurchaseReturnNo,
    getPurchaseReturnByDocNo,
    getPurchaseMaster,
    getPurchaseReturnRepo,
    getPurchaseReturnByBillNo,
    getPurchaseReturnGetAllMaster,
    getProductDetailsBySupplierRepo,
    getPurchaseReturnListRepo,
    getPurchaseReturnBillwiseRepo,
    getPurchaseNoDetailsRepo,
    getPurchaseReturnEditListRepo,
    getPurchaseReturnByIdRepo
  };
}

module.exports = purchaseReturnRepo;
