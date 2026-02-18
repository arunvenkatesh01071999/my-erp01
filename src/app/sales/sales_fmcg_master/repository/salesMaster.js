const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SALES_FMCG_MASTER, SALES_FMCG_DETAILS, STOCKLEDGER, MAIN_CATEGORY, SALES_FMCG_TRAY_DETAILS, TRAY_LEDGER } = require("../commons/constants");
const { ITEM, CUSTOMER_PRODUCTS_MAPPING, CUSTOMER, SUB_GROUP, BARCODE_LIST } = require("../../../catalog/commons");
const { UNITS } = require("../../../catalog/units/commons/constants");
const _ = require("lodash");
const { PURCHASE_FMCG_DETAILS, PARTY_LEDGER } = require("../../../purchase/commons");
const { COMPANY } = require("../../../catalog/supplier/commons/constants");

function salesMasterRepo(fastify) {

  async function postSalesMaster({ body, userDetails, financialYear }) {
    const knex = this;

    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();
    try {
      // Step 1: Get Customer Details 
      const customerDetails = await knex(CUSTOMER.NAME)
        .select(
          `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.CUSTOMER_TYPE}`,
          `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.GST_TYPE}`,
        )
        .where(CUSTOMER.COLUMNS.ID, body.customer_id)
        .first()

      const { customer_type, gst_type } = customerDetails;
      const isCustomerDomestic = Number(customer_type) === 1;
      const isGST = Number(gst_type) === 1;
      const isIGST = Number(gst_type) === 2;
      const grandTotalAmount = Number(customer_type) === 1 ? Number(body.grand_total) : Number(body.total_amount);
      // Step 2: Available Balance Check
      if (_.isArray(body.sales_fmcg_details) && body.sales_fmcg_details.length > 0) {
        await Promise.all(
          body.sales_fmcg_details.map(async (element) => {
            const stockDetails = await trx(ITEM.NAME)
              .select(
                ITEM.COLUMNS.BALANCE,
                ITEM.COLUMNS.PRODUCT_NAME
              )
              .where({ [ITEM.COLUMNS.ID]: element.product_id })
              .first();

            const balance = parseFloat(stockDetails?.balance) || 0;
            const productName = String(stockDetails?.pro_name);
            const saleQty = parseFloat(element.qty) || 0;
            const saleFreeQty = parseFloat(element.free_qty) || 0;
            const totalSaleQty = saleQty + saleFreeQty;
            if (balance < totalSaleQty) {
              throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Stock (${balance}) is less than sale qty (${totalSaleQty}) for Product Name ${productName}`,
                property: "balance",
                code: "STOCK_MISMATCHED"
              });
            }
          })
        );
      }
      // Step 3: Insert into `SALES_MST` (Sales Master)
      const [salesResponse] = await trx(`${SALES_FMCG_MASTER.NAME}`)
        .returning("id")
        .insert({
          [SALES_FMCG_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [SALES_FMCG_MASTER.COLUMNS.DOCDATE]: new Date(),
          [SALES_FMCG_MASTER.COLUMNS.CUSTOMER_ID]: body.customer_id,
          [SALES_FMCG_MASTER.COLUMNS.CUSTOMER_TYPE]: Number(gst_type),
          [SALES_FMCG_MASTER.COLUMNS.TOTAL_AMOUNT]: body.total_amount,
          [SALES_FMCG_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
          [SALES_FMCG_MASTER.COLUMNS.GRAND_TOTAL]: grandTotalAmount || 0,
          [SALES_FMCG_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: grandTotalAmount || 0,
          [SALES_FMCG_MASTER.COLUMNS.ROFF]: body.roff,
          [SALES_FMCG_MASTER.COLUMNS.PAID]: (Number(grandTotalAmount) - 0),
          [SALES_FMCG_MASTER.COLUMNS.SALES_TYPE]: Number(customer_type),
          [SALES_FMCG_MASTER.COLUMNS.STATUS]: 0,
          [SALES_FMCG_MASTER.COLUMNS.RETURN_AMOUNT]: 0,
          [SALES_FMCG_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
          [SALES_FMCG_MASTER.COLUMNS.PO_NO]: body.pono || '',
          [SALES_FMCG_MASTER.COLUMNS.PO_DATE]: body.podate ? new Date(body.podate) : new Date(),
          [SALES_FMCG_MASTER.COLUMNS.LR_NO]: body.lr_no || '',
          [SALES_FMCG_MASTER.COLUMNS.LR_DATE]: body.lr_date ? new Date(body.lr_date) : new Date(),
          [SALES_FMCG_MASTER.COLUMNS.TRANSPORT]: body.transport || '',
          [SALES_FMCG_MASTER.COLUMNS.DELIVERY_BY]: body.delivery_by || '',
          [SALES_FMCG_MASTER.COLUMNS.PG_TOTAL]: 0,
          [SALES_FMCG_MASTER.COLUMNS.OTHER_CHARGES]: body.other_charges || 0,
          [SALES_FMCG_MASTER.COLUMNS.TOTAL_GST_AMOUNT]: isCustomerDomestic && isGST ? Number(body.gst) : 0,
          [SALES_FMCG_MASTER.COLUMNS.TOTAL_IGST_AMOUNT]: isCustomerDomestic && isIGST ? Number(body.gst) : 0,
          [SALES_FMCG_MASTER.COLUMNS.ADVANCE]: 0,
          [SALES_FMCG_MASTER.COLUMNS.DELETE_STATUS]: 0,
          [SALES_FMCG_MASTER.COLUMNS.CESS_AMT]: isCustomerDomestic ? body.cess_amt : 0,
          [SALES_FMCG_MASTER.COLUMNS.REMARK]: body.remark || " ",
          [SALES_FMCG_MASTER.COLUMNS.EXPORT_PENDING]: 0,
          [SALES_FMCG_MASTER.COLUMNS.DELIVERY_DATE]: body.delivery_date || new Date(),
          [SALES_FMCG_MASTER.COLUMNS.PERFIX]: '',
          [SALES_FMCG_MASTER.COLUMNS.AUTO_GEN_ID]: 0,
          [SALES_FMCG_MASTER.COLUMNS.MAIL_ID]: 0,
          [SALES_FMCG_MASTER.COLUMNS.INDENT_ID]: body.indent_id || 0,
          [SALES_FMCG_MASTER.COLUMNS.EXP_USER_ID]: 0,
          [SALES_FMCG_MASTER.COLUMNS.EXP_DATE]: new Date(),
          [SALES_FMCG_MASTER.COLUMNS.MSUID]: 0,
          [SALES_FMCG_MASTER.COLUMNS.MSDOCID]: 0,
          [SALES_FMCG_MASTER.COLUMNS.MSDATE]: new Date(),
          [SALES_FMCG_MASTER.COLUMNS.MOBILE_EXPORT]: 0,
          [SALES_FMCG_MASTER.COLUMNS.EINVOICE]: 0,
          [SALES_FMCG_MASTER.COLUMNS.AKNO]: '',
          [SALES_FMCG_MASTER.COLUMNS.AK_DATE]: new Date(),
          [SALES_FMCG_MASTER.COLUMNS.IRNNO]: '',
          [SALES_FMCG_MASTER.COLUMNS.VERIFY_USER_ID]: 0,
          [SALES_FMCG_MASTER.COLUMNS.EWAY]: 0,
          [SALES_FMCG_MASTER.COLUMNS.EWAY_NO]: '',
          [SALES_FMCG_MASTER.COLUMNS.EWAY_DATE]: new Date(),
          [SALES_FMCG_MASTER.COLUMNS.EWAY_VALID_DATE]: new Date(),
          [SALES_FMCG_MASTER.COLUMNS.EWAY_INVOICE_PATH]: '',
          [SALES_FMCG_MASTER.COLUMNS.EWAY_PATH]: '',
          [SALES_FMCG_MASTER.COLUMNS.EXPORT_PENDING_SCHEDULING]: new Date(),
          [SALES_FMCG_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
          [SALES_FMCG_MASTER.COLUMNS.IS_ACTIVE]: true,
          [SALES_FMCG_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
        });

      const sale_id = salesResponse.id;
      const docno = `${sale_id}`;

      // Step 4: Update `SALES_MST` to add the generated document number
      await trx(`${SALES_FMCG_MASTER.NAME}`)
        .where(`${SALES_FMCG_MASTER.COLUMNS.ID}`, sale_id)
        .where(`${SALES_FMCG_MASTER.COLUMNS.FINANCIAL_YEAR}`, financialYear)
        .update({ [SALES_FMCG_MASTER.COLUMNS.DOCNO]: docno });

      // Step 3: Insert `SALES_DETAILS` (if provided)
      if (_.isArray(body.sales_fmcg_details) && body.sales_fmcg_details.length > 0) {
        const saleDetailsData = _.map(body.sales_fmcg_details, (element) => {
          const qty = parseFloat(element.qty) || 0;
          const freeQty = parseFloat(element.free_qty) || 0;
          const totalSaleQty = qty + freeQty;
          return {
            [SALES_FMCG_DETAILS.COLUMNS.SALES_MASTER_ID]: sale_id,
            [SALES_FMCG_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
            [SALES_FMCG_DETAILS.COLUMNS.DOCNO]: docno,
            [SALES_FMCG_DETAILS.COLUMNS.DOCDATE]: new Date(),
            [SALES_FMCG_DETAILS.COLUMNS.PRODID]: element.product_id,
            [SALES_FMCG_DETAILS.COLUMNS.PRO_CODE]: element.product_code,
            [SALES_FMCG_DETAILS.COLUMNS.CATEGORY_ID]: element.category_id,
            [SALES_FMCG_DETAILS.COLUMNS.UOM_ID]: element.uom_id,
            [SALES_FMCG_DETAILS.COLUMNS.BATCH_NO]: '',
            [SALES_FMCG_DETAILS.COLUMNS.EXPIRY_DATE]: element.expiry_date || new Date(),
            [SALES_FMCG_DETAILS.COLUMNS.QTY]: qty,
            [SALES_FMCG_DETAILS.COLUMNS.FREE_QTY]: freeQty,
            [SALES_FMCG_DETAILS.COLUMNS.TEMP_SALE_QTY]: totalSaleQty,
            [SALES_FMCG_DETAILS.COLUMNS.DIS_PER]: element.discount_percentage,
            [SALES_FMCG_DETAILS.COLUMNS.DIS_AMT]: element.discount_amount,
            [SALES_FMCG_DETAILS.COLUMNS.RATE]: element.rate,
            [SALES_FMCG_DETAILS.COLUMNS.MRP]: element.mrp,
            [SALES_FMCG_DETAILS.COLUMNS.OUTLET_RATE]: element.outlet_rate,
            [SALES_FMCG_DETAILS.COLUMNS.AMOUNT]: element.amount,
            [SALES_FMCG_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
            [SALES_FMCG_DETAILS.COLUMNS.PRATE]: 0,
            [SALES_FMCG_DETAILS.COLUMNS.PAMOUNT]: 0,
            [SALES_FMCG_DETAILS.COLUMNS.TYPE_ID]: 1,
            [SALES_FMCG_DETAILS.COLUMNS.GST]: isCustomerDomestic && isGST ? Number(element.gst) : 0,
            [SALES_FMCG_DETAILS.COLUMNS.GST_AMOUNT]: isCustomerDomestic && isGST ? Number(element.gst_amt) : 0,
            [SALES_FMCG_DETAILS.COLUMNS.IGST]: isCustomerDomestic && isIGST ? Number(element.gst) : 0,
            [SALES_FMCG_DETAILS.COLUMNS.IGST_AMOUNT]: isCustomerDomestic && isIGST ? Number(element.gst_amt) : 0,
            [SALES_FMCG_DETAILS.COLUMNS.CGST]: isCustomerDomestic && isGST ? Number(element.gst) / 2 : 0,
            [SALES_FMCG_DETAILS.COLUMNS.SGST]: isCustomerDomestic && isGST ? Number(element.gst) / 2 : 0,
            [SALES_FMCG_DETAILS.COLUMNS.CESS]: isCustomerDomestic ? element.cess : 0,
            [SALES_FMCG_DETAILS.COLUMNS.CESS_AMT]: isCustomerDomestic ? element.cess_amt : 0,
            [SALES_FMCG_DETAILS.COLUMNS.PACK_ID]: 0,
            [SALES_FMCG_DETAILS.COLUMNS.MANUFACTURE_DATE]: element.manufacture_date || new Date(),
            [SALES_FMCG_DETAILS.COLUMNS.EXPIRY_ID]: element.expiry_id,
            [SALES_FMCG_DETAILS.COLUMNS.EXPIRY_VALUE]: element.expiry_value || 0,
            [SALES_FMCG_DETAILS.COLUMNS.INDENT]: 0,
            [SALES_FMCG_DETAILS.COLUMNS.INDENT_DATE]: new Date(),
            [SALES_FMCG_DETAILS.COLUMNS.INDENT_QTY]: 0,
            [SALES_FMCG_DETAILS.COLUMNS.BARCODE]: element.barcode || '',
            [SALES_FMCG_DETAILS.COLUMNS.PICKER_ID]: body.picker_id,
            [SALES_FMCG_DETAILS.COLUMNS.GROSS_ALTER_ID]: 0,
            [SALES_FMCG_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
            [SALES_FMCG_DETAILS.COLUMNS.CREATED_AT]: new Date(),
          };
        });

        // Batch insert in chunks of 1000 records
        if (saleDetailsData.length > 0) {
          await trx.batchInsert(SALES_FMCG_DETAILS.NAME, saleDetailsData, 1000);
        }
      }

      // Step 5: Insert `SALES_TRAY_DETAILS` (if provided)
      if (_.isArray(body.sales_tray_details) && body.sales_tray_details.length > 0) {
        const saleTrayDetailsData = _.map(body.sales_tray_details, (element) => ({
          [SALES_FMCG_TRAY_DETAILS.COLUMNS.SALES_MASTER_ID]: sale_id,
          [SALES_FMCG_TRAY_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [SALES_FMCG_TRAY_DETAILS.COLUMNS.DOCDATE]: body.docdate,
          [SALES_FMCG_TRAY_DETAILS.COLUMNS.TRAY_ID]: element.tray_id,
          [SALES_FMCG_TRAY_DETAILS.COLUMNS.QTY]: element.tray_count,
          [SALES_FMCG_TRAY_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
          [SALES_FMCG_TRAY_DETAILS.COLUMNS.CUSTOMER_ID]: body.customer_id,
          [SALES_FMCG_TRAY_DETAILS.COLUMNS.TYPE_ID]: body.sale_type,
          [SALES_FMCG_TRAY_DETAILS.COLUMNS.TEMP_TRAY_QTY]: element.tray_count
        }));

        // Batch insert in chunks of 1000 records
        await trx.batchInsert(SALES_FMCG_TRAY_DETAILS.NAME, saleTrayDetailsData, 1000);

      }

      // Step 6: Update Item Stock
      if (_.isArray(body.sales_fmcg_details) && body.sales_fmcg_details.length > 0) {
        await Promise.all(
          _.map(body.sales_fmcg_details, async (element) => {
            const productQty = (Number(element.qty) || 0) + (Number(element.free_qty) || 0);
            const updateData = {
              [ITEM.COLUMNS.BALANCE]: trx.raw(
                `${ITEM.COLUMNS.BALANCE} - ?`, [productQty]
              )
            };
            await trx(ITEM.NAME)
              .where(ITEM.COLUMNS.ID, element.product_id)
              .update(updateData);
          })
        );
      }

      // Step 7: Update Customer Balance
      const customer = await trx(CUSTOMER.NAME)
        .select(CUSTOMER.COLUMNS.BALANCE)
        .where(CUSTOMER.COLUMNS.ID, body.customer_id)
        .first();

      console.log("Fetched Customer Balance:", customer);

      const grand_Total_Amount = grandTotalAmount > 0 ? grandTotalAmount : 0;
      const currentBalance = parseFloat(customer?.balance || 0);
      const newBalance = currentBalance + grand_Total_Amount;

      console.log("Current Balance:", currentBalance);
      console.log("Grand Total Amount:", grand_Total_Amount);
      console.log("New Balance:", newBalance);

      if (!isNaN(newBalance)) {
        await trx(CUSTOMER.NAME)
          .where(CUSTOMER.COLUMNS.ID, body.customer_id)
          .update({ [CUSTOMER.COLUMNS.BALANCE]: newBalance });

        console.log("Customer balance updated successfully");
      }

      // Step 8: Update Sales Master Export Pending Status
      const customerExport = await trx(CUSTOMER.NAME)
        .select([
          `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`,
          `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.LOCATION_ID}`
        ])
        .where(CUSTOMER.COLUMNS.ID, body.customer_id)
        .andWhere(CUSTOMER.COLUMNS.WEB_SALES_EXPORT, 1)

      const locationId = customerExport[0]?.location_id;

      if (!locationId || Number(locationId) !== 0) {
        await trx(SALES_FMCG_MASTER.NAME)
          .where({
            [SALES_FMCG_MASTER.COLUMNS.ID]: sale_id,
          })
          .update({
            [SALES_FMCG_MASTER.COLUMNS.EXPORT_PENDING]: 1
          });
      }

      // Step 9: Insert/Update Tray Ledger
      if (_.isArray(body.sales_tray_details)) {
        await Promise.all(
          body.sales_tray_details.map(async (element) => {
            if (element.tray_id > 0 && element.tray_count > 0) {
              const trayQty = Number(element.tray_count) || 0;

              const existingStock = await trx(TRAY_LEDGER.NAME)
                .where({
                  [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                  [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date()
                })
                .first();

              if (existingStock) {
                const trayDetails = await knex(SALES_FMCG_TRAY_DETAILS.NAME)
                  .select(
                    `${SALES_FMCG_TRAY_DETAILS.NAME}.${SALES_FMCG_TRAY_DETAILS.COLUMNS.TEMP_TRAY_QTY}`
                  )
                  .where(SALES_FMCG_TRAY_DETAILS.COLUMNS.SALES_MASTER_ID, sale_id)
                  .where(SALES_FMCG_TRAY_DETAILS.COLUMNS.TRAY_ID, element.tray_id)
                  .first();

                const tempTrayQty = parseFloat(trayDetails?.temp_tray_qty) || 0;
                await trx(TRAY_LEDGER.NAME)
                  .where({
                    [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                    [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date()
                  })
                  .update({
                    [TRAY_LEDGER.COLUMNS.RECEIVED_QTY]: trx.raw(
                      `${TRAY_LEDGER.COLUMNS.RECEIVED_QTY} -? + ? `,
                      [tempTrayQty, trayQty]
                    ),
                    [TRAY_LEDGER.COLUMNS.BALANCE]: trx.raw(
                      `${TRAY_LEDGER.COLUMNS.BALANCE} -? + ? `,
                      [tempTrayQty, trayQty]
                    ),
                    [TRAY_LEDGER.COLUMNS.UPDATED_AT]: new Date()
                  });
              } else {
                await trx(TRAY_LEDGER.NAME).insert({
                  [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date(),
                  [TRAY_LEDGER.COLUMNS.CUSTOMER_ID]: body.customer_id,
                  [TRAY_LEDGER.COLUMNS.RECEIVED_QTY]: trayQty,
                  [TRAY_LEDGER.COLUMNS.ISSUED_QTY]: 0,
                  [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                  [TRAY_LEDGER.COLUMNS.TEMP_TRAY_QTY]: receivedQty, // Sum of received and free quantities
                  [TRAY_LEDGER.COLUMNS.WASTE_QTY]: 0,
                  [TRAY_LEDGER.COLUMNS.OPENING]: 0,
                  [TRAY_LEDGER.COLUMNS.BALANCE]: trayQty,
                  [TRAY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                  [TRAY_LEDGER.COLUMNS.TYPE]: body.sale_type,
                  [TRAY_LEDGER.COLUMNS.YEAR]: financialYear,
                  [TRAY_LEDGER.COLUMNS.CREATED_AT]: new Date()
                });
              }
            }
          })
        );
      }

      // Step 10: Insert or Update Stock Ledger
      if (Array.isArray(body.sales_fmcg_details)) {
        await Promise.all(body.sales_fmcg_details.map(async (element) => {
          // Check if stock already exists for the product and date
          const existingStock = await trx(STOCKLEDGER.NAME)
            .where({
              [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
              [STOCKLEDGER.COLUMNS.DATE]: new Date()
            })
            .first();

          if (existingStock) {
            // If stock exists, update the purchase quantity
            await trx(STOCKLEDGER.NAME)
              .where({
                [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
                [STOCKLEDGER.COLUMNS.DATE]: new Date()
              })
              .update({
                [STOCKLEDGER.COLUMNS.SALE_QTY]: trx.raw(
                  `${STOCKLEDGER.COLUMNS.SALE_QTY} + ?`,
                  [parseFloat(element.qty) || 0] // ✅ Single array
                ),
                [STOCKLEDGER.COLUMNS.UPDATED_AT]: new Date()
              });

          } else {
            // If stock does not exist, insert a new record
            await trx(STOCKLEDGER.NAME).insert({
              [STOCKLEDGER.COLUMNS.DATE]: new Date(), // Ensure date is valid
              [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id, // Mandatory field
              [STOCKLEDGER.COLUMNS.SALE_QTY]: parseFloat(element.qty) + parseFloat(element.free_qty) || 0, // Default to 0 if missing,
              [STOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: 0, // Default to 0 if missing
              [STOCKLEDGER.COLUMNS.COMPANY_ID]: body.company_id, // Ensure company ID consistency
              [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id, // Record creator ID
              [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id || 1,// Allow null warehouse ID
              [STOCKLEDGER.COLUMNS.CREATED_AT]: new Date()
            });
          }
        }));
      }

      // Step 11: Insert Party Ledger
      await trx(PARTY_LEDGER.NAME).insert({
        [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: sale_id,
        [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.customer_id,
        [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
        [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
        [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: body.sale_type = 1 ? "S" : "T", // "E" for purchase,
        [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
        [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
        [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
        [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: 0,
        [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: grandTotalAmount,
        [PARTY_LEDGER.COLUMNS.REMARKS]: `Sales No (${docno})`,
        [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'C',
        [PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
        [PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
        [PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
      });

      // Commit transaction (all operations successful)
      await trx.commit();
      return { success: true, docno };

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
        message: "Sales transaction failed.",
        property: "",
        code: "TRANSACTION_FAILED"
      });
    }
  }
  async function putSalesMasterRepo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    const { sale_id } = params;
    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();

    try {
      // Step 1: Chek SALES_MASTER_ID Already Exists
      const existingSalesDetails = await trx(SALES_FMCG_MASTER.NAME)
        .select(
          `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID}`,
          `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DOCNO}`,
          `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.TEMP_GRAND_TOTAL}`
        )
        .where({
          [SALES_FMCG_MASTER.COLUMNS.ID]: sale_id
        })
        .first();

      if (!existingSalesDetails && !existingSalesDetails?.id) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Sales Details was not found",
          property: "",
          code: "NOT_FOUND"
        });
      }
      const existingGrandTotalAmount = Number(existingSalesDetails.temp_grand_total);
      const docno = Number(existingSalesDetails.docno);

      // Step 2: Get Customer Details 
      const customerDetails = await knex(CUSTOMER.NAME)
        .select(
          `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.CUSTOMER_TYPE}`,
          `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.GST_TYPE}`,
        )
        .where(CUSTOMER.COLUMNS.ID, body.customer_id)
        .first()

      const { customer_type, gst_type } = customerDetails;
      const isCustomerDomestic = Number(customer_type) === 1;
      const isGST = Number(gst_type) === 1;
      const isIGST = Number(gst_type) === 2;
      const grandTotalAmount = Number(customer_type) === 1 ? Number(body.grand_total) : Number(body.total_amount);
      // Step 3: Available Balance Check
      if (_.isArray(body.sales_fmcg_details) && body.sales_fmcg_details.length > 0) {
        await Promise.all(
          body.sales_fmcg_details.map(async (element) => {
            const stockDetails = await trx(ITEM.NAME)
              .select(
                ITEM.COLUMNS.BALANCE,
                ITEM.COLUMNS.PRODUCT_NAME
              )
              .where({ [ITEM.COLUMNS.ID]: element.product_id })
              .first();

            const balance = parseFloat(stockDetails?.balance) || 0;
            const productName = String(stockDetails?.pro_name);
            const saleQty = parseFloat(element.qty) || 0;
            const saleFreeQty = parseFloat(element.free_qty) || 0;
            const totalSaleQty = saleQty + saleFreeQty;
            if (balance < totalSaleQty) {
              throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: `Stock (${balance}) is less than sale qty (${totalSaleQty}) for Product Name ${productName}`,
                property: "balance",
                code: "STOCK_MISMATCHED"
              });
            }
          })
        );
      }

      // Step 2: Update the Sales FMCG Master record based on the given `grn_id`
      const saleUpdateResponse = await trx(`${SALES_FMCG_MASTER.NAME}`)
        .where({
          [SALES_FMCG_MASTER.COLUMNS.ID]: sale_id // Find the record by ID
        })
        .update({
          [SALES_FMCG_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [SALES_FMCG_MASTER.COLUMNS.DOCNO]: docno,
          [SALES_FMCG_MASTER.COLUMNS.DOCDATE]: body.docdate,
          [SALES_FMCG_MASTER.COLUMNS.CUSTOMER_ID]: body.customer_id,
          [SALES_FMCG_MASTER.COLUMNS.CUSTOMER_TYPE]: Number(gst_type),
          [SALES_FMCG_MASTER.COLUMNS.TOTAL_AMOUNT]: body.total_amount,
          [SALES_FMCG_MASTER.COLUMNS.DISCOUNT]: body.discount_amount,
          [SALES_FMCG_MASTER.COLUMNS.GRAND_TOTAL]: grandTotalAmount || 0,
          [SALES_FMCG_MASTER.COLUMNS.ROFF]: body.roff,
          [SALES_FMCG_MASTER.COLUMNS.PAID]: (Number(grandTotalAmount) - 0),
          [SALES_FMCG_MASTER.COLUMNS.SALES_TYPE]: Number(customer_type),
          [SALES_FMCG_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
          [SALES_FMCG_MASTER.COLUMNS.PO_NO]: body.pono,
          [SALES_FMCG_MASTER.COLUMNS.PO_DATE]: body.podate ? new Date(body.podate) : null,
          [SALES_FMCG_MASTER.COLUMNS.LR_NO]: body.lr_no || 0,
          [SALES_FMCG_MASTER.COLUMNS.LR_DATE]: body.lr_date,
          [SALES_FMCG_MASTER.COLUMNS.TRANSPORT]: body.transport || '',
          [SALES_FMCG_MASTER.COLUMNS.DELIVERY_BY]: body.delivery_by,
          [SALES_FMCG_MASTER.COLUMNS.OTHER_CHARGES]: body.other_charges || 0,
          [SALES_FMCG_MASTER.COLUMNS.TOTAL_GST_AMOUNT]: isCustomerDomestic && isGST ? Number(body.gst) : 0,
          [SALES_FMCG_MASTER.COLUMNS.TOTAL_IGST_AMOUNT]: isCustomerDomestic && isIGST ? Number(body.gst) : 0,
          [SALES_FMCG_MASTER.COLUMNS.CESS_AMT]: isCustomerDomestic ? body.cess_amt : 0,
          [SALES_FMCG_MASTER.COLUMNS.REMARK]: body.remark || " ",
          [SALES_FMCG_MASTER.COLUMNS.DELIVERY_DATE]: body.delivery_date,
          [SALES_FMCG_MASTER.COLUMNS.PERFIX]: '',
          [SALES_FMCG_MASTER.COLUMNS.INDENT_ID]: body.indent_id,
          [SALES_FMCG_MASTER.COLUMNS.WH_ID]: body.wh_id || 1,
          [SALES_FMCG_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
          [SALES_FMCG_MASTER.COLUMNS.UPDATED_AT]: new Date()
        });

      // Step 3: If no rows were updated, throw an error (i.e., invalid `grn_id` or record not found)
      if (saleUpdateResponse === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Failed to update sales details",
          property: "",
          code: "NOT_FOUND"
        });
      }

      // Step 4: Insert `SALES_DETAILS` (if provided)
      if (_.isArray(body.sales_fmcg_details) && body.sales_fmcg_details.length > 0) {
        const saleDetailsData = _.map(body.sales_fmcg_details, (element) => {

          return {
            [SALES_FMCG_DETAILS.COLUMNS.SALES_MASTER_ID]: sale_id,
            [SALES_FMCG_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
            [SALES_FMCG_DETAILS.COLUMNS.DOCNO]: docno,
            [SALES_FMCG_DETAILS.COLUMNS.DOCDATE]: new Date(),
            [SALES_FMCG_DETAILS.COLUMNS.PRODID]: element.product_id,
            [SALES_FMCG_DETAILS.COLUMNS.PRO_CODE]: element.product_code,
            [SALES_FMCG_DETAILS.COLUMNS.CATEGORY_ID]: element.category_id,
            [SALES_FMCG_DETAILS.COLUMNS.UOM_ID]: element.uom_id,
            [SALES_FMCG_DETAILS.COLUMNS.BATCH_NO]: '',
            [SALES_FMCG_DETAILS.COLUMNS.EXPIRY_DATE]: element.expiry_date || new Date(),
            [SALES_FMCG_DETAILS.COLUMNS.QTY]: element.qty || 0,
            [SALES_FMCG_DETAILS.COLUMNS.FREE_QTY]: element.freeQty || 0,
            [SALES_FMCG_DETAILS.COLUMNS.DIS_PER]: element.discount_percentage,
            [SALES_FMCG_DETAILS.COLUMNS.DIS_AMT]: element.discount_amount,
            [SALES_FMCG_DETAILS.COLUMNS.RATE]: element.rate,
            [SALES_FMCG_DETAILS.COLUMNS.MRP]: element.mrp,
            [SALES_FMCG_DETAILS.COLUMNS.OUTLET_RATE]: element.outlet_rate,
            [SALES_FMCG_DETAILS.COLUMNS.AMOUNT]: Number(element.amount),
            [SALES_FMCG_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
            [SALES_FMCG_DETAILS.COLUMNS.GST]: isCustomerDomestic && isGST ? Number(element.gst) : 0,
            [SALES_FMCG_DETAILS.COLUMNS.GST_AMOUNT]: isCustomerDomestic && isGST ? Number(element.gst_amt) : 0,
            [SALES_FMCG_DETAILS.COLUMNS.IGST]: isCustomerDomestic && isIGST ? Number(element.gst) : 0,
            [SALES_FMCG_DETAILS.COLUMNS.IGST_AMOUNT]: isCustomerDomestic && isIGST ? Number(element.gst_amt) : 0,
            [SALES_FMCG_DETAILS.COLUMNS.CGST]: isCustomerDomestic && isGST ? Number(element.gst) / 2 : 0,
            [SALES_FMCG_DETAILS.COLUMNS.SGST]: isCustomerDomestic && isGST ? Number(element.gst) / 2 : 0,
            [SALES_FMCG_DETAILS.COLUMNS.CESS]: isCustomerDomestic ? element.cess : 0,
            [SALES_FMCG_DETAILS.COLUMNS.CESS_AMT]: isCustomerDomestic ? element.cess_amt : 0,
            [SALES_FMCG_DETAILS.COLUMNS.PACK_ID]: 0,
            [SALES_FMCG_DETAILS.COLUMNS.MANUFACTURE_DATE]: element.manufacture_date || new Date(),
            [SALES_FMCG_DETAILS.COLUMNS.EXPIRY_ID]: element.expiry_id,
            [SALES_FMCG_DETAILS.COLUMNS.EXPIRY_VALUE]: element.expiry_value || 0,
            [SALES_FMCG_DETAILS.COLUMNS.INDENT]: 0,
            [SALES_FMCG_DETAILS.COLUMNS.INDENT_DATE]: new Date(),
            [SALES_FMCG_DETAILS.COLUMNS.INDENT_QTY]: 0,
            [SALES_FMCG_DETAILS.COLUMNS.BARCODE]: element.barcode || '',
            [SALES_FMCG_DETAILS.COLUMNS.PICKER_ID]: body.picker_id,
            [SALES_FMCG_DETAILS.COLUMNS.GROSS_ALTER_ID]: 0,
            [SALES_FMCG_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
            [SALES_FMCG_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
          };
        })

        // Batch insert in chunks of 1000 records
        if (saleDetailsData.length > 0) {
          for (let i = 0; i < saleDetailsData.length; i += 1000) {
            const batch = saleDetailsData.slice(i, i + 1000);

            await trx(SALES_FMCG_DETAILS.NAME)
              .insert(batch)
              .onConflict([SALES_FMCG_DETAILS.COLUMNS.SALES_MASTER_ID, SALES_FMCG_DETAILS.COLUMNS.PRODID])
              .merge(); // merge will update if conflict happens, else insert
          }
        }
      }

      // Step 5: Update Sales_Tray_Details
      if (Array.isArray(body.sales_tray_details)) {
        const trayInsertData = [];

        _.forEach(body.sales_tray_details, (element) => {
          trayInsertData.push({
            [SALES_FMCG_TRAY_DETAILS.COLUMNS.SALES_MASTER_ID]: sale_id,
            [SALES_FMCG_TRAY_DETAILS.COLUMNS.DOCDATE]: new Date(),
            [SALES_FMCG_TRAY_DETAILS.COLUMNS.TRAY_ID]: element.tray_id,
            [SALES_FMCG_TRAY_DETAILS.COLUMNS.QTY]: parseFloat(element.tray_count) || 0
          });
        });

        if (trayInsertData.length > 0) {
          await trx(SALES_FMCG_TRAY_DETAILS.NAME)
            .insert(trayInsertData)
            .onConflict([
              SALES_FMCG_TRAY_DETAILS.COLUMNS.SALES_MASTER_ID,
              SALES_FMCG_TRAY_DETAILS.COLUMNS.TRAY_ID
            ])
            .merge();
        }
      }

      // Step 6: Update ITEM BALANCE
      if (_.isArray(body.sales_fmcg_details) && body.sales_fmcg_details.length > 0) {
        await Promise.all(
          body.sales_fmcg_details.map(async (element) => {
            const salesDetail = await trx(SALES_FMCG_DETAILS.NAME)
              .select(
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.TEMP_SALE_QTY}`
              )
              .where({
                [SALES_FMCG_DETAILS.COLUMNS.SALES_MASTER_ID]: sale_id,
                [SALES_FMCG_DETAILS.COLUMNS.PRODID]: element.product_id
              })
              .first();

            const existingTotalSalesQty = parseFloat(salesDetail.temp_sale_qty) || 0;
            const saleQty = parseFloat(element.qty) || 0;
            const saleFreeQty = parseFloat(element.free_qty) || 0;
            const totalSalesQty = saleQty + saleFreeQty;
            console.log(existingTotalSalesQty, "existing sales qty");
            console.log(totalSalesQty, "sale qty")
            await trx(ITEM.NAME)
              .where(ITEM.COLUMNS.ID, element.product_id)
              .update({
                [ITEM.COLUMNS.BALANCE]: trx.raw(
                  `${ITEM.COLUMNS.BALANCE} + ? - ?`,
                  [parseFloat(existingTotalSalesQty) || 0, parseFloat(totalSalesQty) || 0]
                )
              });

            await trx(SALES_FMCG_DETAILS.NAME)
              .where({
                [SALES_FMCG_DETAILS.COLUMNS.SALES_MASTER_ID]: sale_id,
                [SALES_FMCG_DETAILS.COLUMNS.PRODID]: element.product_id
              })
              .update({
                [SALES_FMCG_DETAILS.COLUMNS.TEMP_SALE_QTY]: totalSalesQty
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
                  [STOCKLEDGER.COLUMNS.SALE_QTY]: trx.raw(
                    `${STOCKLEDGER.COLUMNS.SALE_QTY} + ? - ?`,
                    [parseFloat(existingTotalSalesQty) || 0, parseFloat(totalSalesQty) || 0]
                  ),
                  [STOCKLEDGER.COLUMNS.UPDATED_AT]: new Date(),
                  [STOCKLEDGER.COLUMNS.UPDATED_BY]: userDetails.id
                });
            } else {
              // Insert new stock record
              await trx(STOCKLEDGER.NAME).insert({
                [STOCKLEDGER.COLUMNS.DATE]: new Date(),
                [STOCKLEDGER.COLUMNS.PROD_ID]: element.product_id,
                [STOCKLEDGER.COLUMNS.SALE_QTY]: totalSalesQty,
                [STOCKLEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id || 1,
                [STOCKLEDGER.COLUMNS.CREATED_AT]: new Date()
              });
            }
          })
        );
      }

      // Step 7: Update Customer Balance
      const customer = await trx(CUSTOMER.NAME)
        .select(CUSTOMER.COLUMNS.BALANCE)
        .where(CUSTOMER.COLUMNS.ID, body.customer_id)
        .first();

      console.log("Fetched Customer Balance:", customer);

      const grand_Total_Amount = grandTotalAmount > 0 ? grandTotalAmount : 0;
      const currentBalance = parseFloat(customer?.balance || 0);
      const newBalance = currentBalance - existingGrandTotalAmount + grand_Total_Amount;

      console.log("Current Balance:", currentBalance);
      console.log("Grand Total Amount:", grand_Total_Amount);
      console.log("New Balance:", newBalance);

      await trx(`${SALES_FMCG_MASTER.NAME}`)
        .where({
          [SALES_FMCG_MASTER.COLUMNS.ID]: sale_id
        })
        .update({
          [SALES_FMCG_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: Number(grandTotalAmount)
        });

      if (!isNaN(newBalance)) {
        await trx(CUSTOMER.NAME)
          .where(CUSTOMER.COLUMNS.ID, body.customer_id)
          .update({ [CUSTOMER.COLUMNS.BALANCE]: newBalance });

        console.log("Customer balance updated successfully");
      }

      // Step 8: Insert/Update Tray Ledger
      if (_.isArray(body.sales_tray_details)) {
        await Promise.all(
          body.sales_tray_details.map(async (element) => {
            if (element.tray_id > 0 && element.tray_count > 0) {
              const trayQty = Number(element.tray_count) || 0;

              const existingStock = await trx(TRAY_LEDGER.NAME)
                .where({
                  [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                  [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date()
                })
                .first();

              if (existingStock) {
                const trayDetails = await knex(SALES_FMCG_TRAY_DETAILS.NAME)
                  .select(
                    `${SALES_FMCG_TRAY_DETAILS.NAME}.${SALES_FMCG_TRAY_DETAILS.COLUMNS.TEMP_TRAY_QTY}`
                  )
                  .where(SALES_FMCG_TRAY_DETAILS.COLUMNS.SALES_MASTER_ID, sale_id)
                  .where(SALES_FMCG_TRAY_DETAILS.COLUMNS.TRAY_ID, element.tray_id)
                  .first();

                const tempTrayQty = parseFloat(trayDetails?.temp_tray_qty) || 0;
                await trx(TRAY_LEDGER.NAME)
                  .where({
                    [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                    [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date()
                  })
                  .update({
                    [TRAY_LEDGER.COLUMNS.RECEIVED_QTY]: trx.raw(
                      `${TRAY_LEDGER.COLUMNS.RECEIVED_QTY} -? + ? `,
                      [tempTrayQty, trayQty]
                    ),
                    [TRAY_LEDGER.COLUMNS.BALANCE]: trx.raw(
                      `${TRAY_LEDGER.COLUMNS.BALANCE} -? + ? `,
                      [tempTrayQty, trayQty]
                    ),
                    [TRAY_LEDGER.COLUMNS.UPDATED_AT]: new Date()
                  });

                // Update TEMP_REC_QTY in GRN Details
                await trx(SALES_FMCG_TRAY_DETAILS.NAME)
                  .where({
                    [SALES_FMCG_TRAY_DETAILS.COLUMNS.SALES_MASTER_ID]: sale_id,
                    [SALES_FMCG_TRAY_DETAILS.COLUMNS.TRAY_ID]: element.tray_id
                  })
                  .update({
                    [SALES_FMCG_TRAY_DETAILS.COLUMNS.TEMP_TRAY_QTY]: trayQty
                  });
              } else {
                await trx(TRAY_LEDGER.NAME).insert({
                  [TRAY_LEDGER.COLUMNS.DOCDATE]: new Date(),
                  [TRAY_LEDGER.COLUMNS.CUSTOMER_ID]: body.customer_id,
                  [TRAY_LEDGER.COLUMNS.RECEIVED_QTY]: trayQty,
                  [TRAY_LEDGER.COLUMNS.ISSUED_QTY]: 0,
                  [TRAY_LEDGER.COLUMNS.TRAY_ID]: element.tray_id,
                  [TRAY_LEDGER.COLUMNS.TEMP_TRAY_QTY]: receivedQty, // Sum of received and free quantities
                  [TRAY_LEDGER.COLUMNS.WASTE_QTY]: 0,
                  [TRAY_LEDGER.COLUMNS.OPENING]: 0,
                  [TRAY_LEDGER.COLUMNS.BALANCE]: trayQty,
                  [TRAY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                  [TRAY_LEDGER.COLUMNS.TYPE]: body.sale_type,
                  [TRAY_LEDGER.COLUMNS.YEAR]: financialYear,
                  [TRAY_LEDGER.COLUMNS.CREATED_AT]: new Date()
                });
              }
            }
          })
        );
      }

      // Step 9: Insert/ Update Party Ledger
      // Check if stock already exists for the product and date
      const existingSupplierDetails = await trx(PARTY_LEDGER.NAME)
        .where({
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.customer_id,
          [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date()
        })
        .first();

      if (existingSupplierDetails) {
        // If stock exists, update the purchase quantity
        await trx(PARTY_LEDGER.NAME)
          .where({
            [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.customer_id,
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
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: sale_id,
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.customer_id,
          [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
          [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
          [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: body.sale_type = 1 ? "S" : "T", // "E" for purchase,
          [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
          [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
          [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
          [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: 0,
          [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: grandTotalAmount,
          [PARTY_LEDGER.COLUMNS.REMARKS]: `Sales No (${docno})`,
          [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'C',
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
        message: "Sales transaction failed.",
        property: "",
        code: "TRANSACTION_FAILED"
      });
    }
  }

  async function getSalesByIdRepo({ body, params, logTrace }) {
    const knex = this;
    const { sale_id } = params;
    const query = knex
      .select([
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DOCDATE}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DOCNO}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.CUSTOMER_TYPE}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.TOTAL_AMOUNT}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DISCOUNT} as discount`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.GRAND_TOTAL}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ROFF} as roff`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.SALES_TYPE}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.COMPANY_ID}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.PO_NO}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.LR_NO}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.LR_DATE}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.TRANSPORT}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DELIVERY_BY}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.OTHER_CHARGES}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.TOTAL_GST_AMOUNT} as gst`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.TOTAL_IGST_AMOUNT} as igst`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.CESS_AMT}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.REMARK} as remark`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DELIVERY_DATE}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.PERFIX}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.INDENT_ID}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.WH_ID}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.CUSTOMER_ID}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_ONE} as add1`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_TWO} as add2`
      ])
      .from(`${SALES_FMCG_MASTER.NAME} as ${SALES_FMCG_MASTER.NAME}`)
      .leftJoin(
        `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.CUSTOMER_ID}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .where(
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID}`,
        sale_id
      )

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Sales details",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Sales data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const salesDetails = await Promise.all(
      response.map(async sales => {
        const sales_details_lines = await knex
          .select([
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.PRODID} as product_id`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.PRO_CODE} as product_code`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.CATEGORY_ID} as main_catgory_id`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.UOM_ID} as uom_id`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as units_short_name`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.EXPIRY_DATE}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.QTY} as qty`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.FREE_QTY} as free_qty`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.DIS_PER} as discount_percentage`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.DIS_AMT} as discount_amount`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.RATE} as pur_rate`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.OUTLET_RATE}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.BATCH_NO}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.AMOUNT}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.MRP}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.GST}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.IGST}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.GST_AMOUNT}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.IGST}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.IGST_AMOUNT}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.CESS}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.CESS_AMT}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.BARCODE}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.MANUFACTURE_DATE}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.EXPIRY_ID}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.EXPIRY_VALUE}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.PICKER_ID}`
          ])
          .from(`${SALES_FMCG_DETAILS.NAME} as ${SALES_FMCG_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.PRODID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.CATEGORY_ID}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          )
          .where(
            `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.SALES_MASTER_ID}`,
            sales.id
          )
        console.log(sales_details_lines, "details lines")
        console.log(sales.id, "details lines")

        const sales_tray_details = await knex
          .select([
            `${SALES_FMCG_TRAY_DETAILS.NAME}.${SALES_FMCG_TRAY_DETAILS.COLUMNS.TRAY_ID} as tray_id`,
            `${SALES_FMCG_TRAY_DETAILS.NAME}.${SALES_FMCG_TRAY_DETAILS.COLUMNS.QTY} as tray_count`
          ])
          .from(SALES_FMCG_TRAY_DETAILS.NAME)
          .where(`${SALES_FMCG_TRAY_DETAILS.COLUMNS.SALES_MASTER_ID}`, sales.id)

        const enrichedLines = await Promise.all(
          sales_details_lines.map(async element => {
            const product_id = element.product_id;
            const defaultMrp = element.mrp;

            const mrpRecords = await knex(`${PURCHASE_FMCG_DETAILS.NAME}`)
              .select([`${PURCHASE_FMCG_DETAILS.COLUMNS.MRP}`])
              .where(`${PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID}`, product_id)
              .orderBy(`${PURCHASE_FMCG_DETAILS.COLUMNS.ID}`, 'desc')
              .limit(5);

            let uniqueMrps = [...new Set(mrpRecords.map(record => record.mrp))];
            if (!uniqueMrps.includes(defaultMrp)) uniqueMrps.push(defaultMrp);
            if (uniqueMrps.length === 0) uniqueMrps = [defaultMrp];

            return {
              ...element,
              gst: Number(sales.customer_type) === 1 ? Number(element.gst) : Number(element.igst),
              gst_amt: Number(sales.customer_type) === 1 ? Number(element.gst_amount) : Number(element.igst_amount),
              mrp_list: uniqueMrps.map(mrp => ({ mrp }))
            };
          })
        );


        return {
          gst: Number(sales.customer_type) === 1 ? Number(sales.total_gst_amount) : Number(sales.total_igst_amount),
          sales_details_lines: enrichedLines,
          sales_tray_details,
          ...sales,
          customer_id: {
            id: sales.customer_id,
            customer_name: sales.customer_name,
            add1: sales.add1,
            add2: sales.add2,
            gst_type: Number(sales.customer_type) === 1 ? "GST" : "IGST",
            customer_type: Number(sales.sales_type) === 1 ? "Sale" : "Transfer"
          },
        };

      })
    );

    return salesDetails;
  }

  async function deleteSalesDetailsRepo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    const { sale_id } = params;

    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();

    try {
      // Step 1: Get SALES_ID already exists
      const existingSalesDetails = await trx(SALES_FMCG_MASTER.NAME)
        .select(
          `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID}`,
          `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DOCDATE}`,
          `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.CUSTOMER_ID}`,
          `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.GRAND_TOTAL}`
        )
        .where({
          [SALES_FMCG_MASTER.COLUMNS.ID]: sale_id
        })
        .first();

      if (!existingSalesDetails && !existingSalesDetails?.id) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Sales Details was not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const { customer_id, grand_total, docdate } = existingSalesDetails;
      console.log(existingSalesDetails, "sales master")
      // Step 2: Get SALES_Details already exists
      const salesDetail = await trx(SALES_FMCG_DETAILS.NAME)
        .select([
          `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.ID}`,
          `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.PRODID}`,
          `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.QTY} as qty`,
          `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.FREE_QTY} as free_qty `
        ])
        .where({
          [SALES_FMCG_DETAILS.COLUMNS.SALES_MASTER_ID]: sale_id
        })

      // Step 3: Update Purchase_RETURN_FMCG_Details
      if (Array.isArray(salesDetail)) {
        await Promise.all(
          salesDetail.map(async (element) => {
            const existingSaleQty = parseFloat(element.qty) || 0;
            const existingSaleFreeQty = parseFloat(element.free_qty) || 0;
            const existingTotalSaleQty = existingSaleQty + existingSaleFreeQty;
            console.log(existingTotalSaleQty, "existing sale qty");
            await trx(ITEM.NAME)
              .where(ITEM.COLUMNS.ID, element.prodid)
              .update({
                [ITEM.COLUMNS.BALANCE]: trx.raw(
                  `${ITEM.COLUMNS.BALANCE} + ?`,
                  [parseFloat(existingTotalSaleQty) || 0]
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
                  [STOCKLEDGER.COLUMNS.SALE_QTY]: trx.raw(
                    `${STOCKLEDGER.COLUMNS.SALE_QTY} - ?`,
                    [parseFloat(existingTotalSaleQty) || 0]
                  ),
                });
            } else {
              // Insert new stock record
              await trx(STOCKLEDGER.NAME).insert({
                [STOCKLEDGER.COLUMNS.DATE]: new Date(),
                [STOCKLEDGER.COLUMNS.PROD_ID]: element.prodid,
                [STOCKLEDGER.COLUMNS.SALE_QTY]: existingTotalSaleQty,
                [STOCKLEDGER.COLUMNS.COMPANY_ID]: userDetails.company_id,
                [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                [STOCKLEDGER.COLUMNS.WH_ID]: wh_id,
              });
            }
          })
        );
      }

      console.log(salesDetail, "sales details")


      // Step 4: Update Customer Balance
      const customer = await trx(CUSTOMER.NAME)
        .select(CUSTOMER.COLUMNS.BALANCE)
        .where(CUSTOMER.COLUMNS.ID, customer_id)
        .first();

      console.log("Fetched Customer Balance:", customer);

      const grandTotalAmount = grand_total > 0 ? grand_total : 0;
      const currentBalance = parseFloat(customer?.balance || 0);
      const newBalance = Number(currentBalance) - Number(grandTotalAmount);

      console.log("Current Balance:", currentBalance);
      console.log("Grand Total Amount:", grandTotalAmount);
      console.log("New Balance:", newBalance);

      if (!isNaN(newBalance)) {
        await trx(CUSTOMER.NAME)
          .where(CUSTOMER.COLUMNS.ID, customer_id)
          .update({ [CUSTOMER.COLUMNS.BALANCE]: newBalance });

        console.log("Customer balance updated successfully");
      }

      // Step 5: Get existingSalesTrayDetail already exists
      const existingSalesTrayDetail = await trx(SALES_FMCG_TRAY_DETAILS.NAME)
        .select([
          `${SALES_FMCG_TRAY_DETAILS.NAME}.${SALES_FMCG_TRAY_DETAILS.COLUMNS.TRAY_ID} `,
          `${SALES_FMCG_TRAY_DETAILS.NAME}.${SALES_FMCG_TRAY_DETAILS.COLUMNS.QTY} `
        ])
        .where({
          [SALES_FMCG_TRAY_DETAILS.COLUMNS.SALES_MASTER_ID]: sale_id
        })



      // Step 6: Insert or Update Tray Ledger
      if (Array.isArray(existingSalesTrayDetail) && existingSalesTrayDetail.length > 0) {
        await Promise.all(existingSalesTrayDetail.map(async (element) => {
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
              const tempQty = parseFloat(element.qty) || 0;
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
      // Step 7: Delete Master and Details 
      await trx(SALES_FMCG_MASTER.NAME)
        .where(SALES_FMCG_MASTER.COLUMNS.ID, sale_id)
        .del();

      await trx(SALES_FMCG_DETAILS.NAME)
        .where(SALES_FMCG_DETAILS.COLUMNS.SALES_MASTER_ID, sale_id)
        .del();

      await trx(SALES_FMCG_TRAY_DETAILS.NAME)
        .where(SALES_FMCG_TRAY_DETAILS.COLUMNS.SALES_MASTER_ID, sale_id)
        .del();

      await trx(PARTY_LEDGER.NAME)
        .where(PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID, sale_id)
        .del();

      // Commit transaction (if all operations are successful)
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
        message: "Sales transaction failed.",
        property: "",
        code: "TRANSACTION_FAILED"
      });
    }
  }

  async function getCustomerMasterRepo({ logTrace, params }) {
    const knex = this;
    const { customer_id, type_id } = params;
    const query = knex(`${CUSTOMER.NAME}`)
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as product_code`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID} as uom_id`
      ])
      .from(`${CUSTOMER_PRODUCTS_MAPPING.NAME} as ${CUSTOMER_PRODUCTS_MAPPING.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME} `,
        `${CUSTOMER_PRODUCTS_MAPPING.NAME}.${CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .where(`${CUSTOMER_PRODUCTS_MAPPING.NAME}.${CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID}`, customer_id)
      .andWhere(`${CUSTOMER_PRODUCTS_MAPPING.NAME}.${CUSTOMER.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, type_id)
    // .orderBy(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, 'asc')


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Customer Details",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "customer maping product not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;

  }

  async function getProductDetailsRepo({ logTrace, params, queryString }) {
    const knex = this;
    const { customer_id } = params;
    const { product_name } = queryString;

    if (!product_name) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "Product name is required",
        code: "INVALID_INPUT"
      });
    }

    const query = knex(`${ITEM.NAME} as ${ITEM.NAME}`)
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as product_code`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.DISCOUNT}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SALES_MARGIN}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.GST}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`
      ])
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .where(builder =>
        builder
          .where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, 'like', product_name)
          .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
      );

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Customer Details",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "customer mapping product not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const product_id = response[0].product_id;
    const defaultMrp = response[0].mrp;
    const sales_margin = response[0].sales_margin;
    const discount = response[0].discount;
    const gst_per = response[0].gst;
    const cess_per = response[0].cess;
    const defaultPurchaseRate = response[0].pur_rate;
    const balance = response[0].balance;
    const query1 = knex(`${CUSTOMER.NAME} as ${CUSTOMER.NAME}`)
      .select([
        `${SUB_GROUP.NAME}.${SUB_GROUP.COLUMNS.STATUS}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.MARGIN_ACTIVE}`,
      ])
      .leftJoin(
        `${SUB_GROUP.NAME} as ${SUB_GROUP.NAME}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.GROUP_ID}`,
        `${SUB_GROUP.NAME}.${SUB_GROUP.COLUMNS.ID}`
      )
      .where(`${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`, customer_id);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Customer Details",
      logTrace
    });

    const response1 = await query1;

    const status = Number(response1[0].margin_active === 1) ? response1[0].status : 2;
    const getMrpQuery = knex(`${PURCHASE_FMCG_DETAILS.NAME} as ${PURCHASE_FMCG_DETAILS.NAME}`)
      .select([
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.RATE}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.SUPPLIER_ID}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.MRP}`
      ])
      .where(PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID, product_id)
      .orderBy(PURCHASE_FMCG_DETAILS.COLUMNS.ID, 'desc')
      .first();

    logQuery({
      logger: fastify.log,
      query: getMrpQuery,
      context: "Get Purchase Order Details",
      logTrace
    });

    const getMrpResponse = await getMrpQuery;
    console.log(getMrpQuery.supplier_id, "response of mrp")
    console.log(getMrpQuery.rate, "response of mrp")
    console.log(getMrpQuery.mrp, "response of mrp")
    const CP = Number(getMrpResponse?.rate) > 0 ? Number(getMrpResponse.rate) : Number(defaultPurchaseRate);
    const MRP = Number(getMrpResponse?.mrp) > 0 ? Number(getMrpResponse.mrp) : Number(defaultMrp);

    let sale_rate = 0;
    let cost_price = CP;
    switch (status) {
      case 0:
        sale_rate = cost_price;
        break;

      case 1:
        sale_rate = cost_price;
        break;

      case 2:
        if (sales_margin === 0) {
          sale_rate = 0;
        } else {
          CP_GST = MRP - (MRP * sales_margin / 100);
          Tax_Value = CP_GST * gst_per / 100;
          Cess_Value = CP_GST * cess_per / 100;
          sale_rate = CP_GST - (Tax_Value + Cess_Value);
        }
        break;

      case 3:
        cost_price = CP - discount;
        sale_rate = cost_price + (cost_price * sales_margin / 100);
        break;

      default:
        sale_rate = CP;
    }

    const mrpRecords = await knex(`${PURCHASE_FMCG_DETAILS.NAME}`)
      .select([`${PURCHASE_FMCG_DETAILS.COLUMNS.MRP}`])
      .where(`${PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID}`, product_id)
      .orderBy(`${PURCHASE_FMCG_DETAILS.COLUMNS.ID}`, 'desc')
      .limit(5);

    // Extract unique MRPs
    let uniqueMrps = [...new Set(mrpRecords.map(record => record.mrp))];

    // If default MRP is not present, include it
    if (!uniqueMrps.includes(defaultMrp)) {
      uniqueMrps.push(defaultMrp);
    }

    // Fallback if no MRP at all
    if (uniqueMrps.length === 0) {
      uniqueMrps = [defaultMrp];
    }

    const mrpMap = uniqueMrps.map(mrp => ({ mrp }))
    const sales_rate = sale_rate < 0 ? 0 : sale_rate;

    //Barcode Details Details 
    const barcodeDetails = await knex(BARCODE_LIST.NAME)
      .select(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`)
      .where({
        [BARCODE_LIST.COLUMNS.PROD_ID]: product_id,
        [BARCODE_LIST.COLUMNS.IS_ACTIVE]: true
      })
      .first()
    const barcode = barcodeDetails?.barcode ? barcodeDetails.barcode : '';
    // Final Response
    const finalResponse = response.map(product => ({
      ...product,
      mrp_list: mrpMap,
      sale_rate: sales_rate,
      manufacture_date: '',
      expiry_date: '',
      indent_qty: 0,
      qty: 0,
      outlet_rate: defaultMrp,
      barcode: barcode,
      balance,
      defaultPurchaseRate,
      discount_amount: 0,
      gst_amount: 0,
      cess_amount: 0,
      amount: 0,
      tray_id: 0,
      tray_count: 0
    }));

    return finalResponse;
  }

  async function getCustomerDetailsRepo({ logTrace }) {
    const knex = this;
    const query = knex(`${CUSTOMER.NAME}`)
      .select([
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_ONE} as add1`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_TWO} as add2`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.GST_TYPE}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.CUSTOMER_TYPE}`
      ])
      .where(`${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.IS_ACTIVE}`, 1)
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Customer Details",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "customer not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const finalResponse = _.map(response, customer => ({
      ...customer,
      customer_type: (Number(customer.customer_type) === 1) ? 'Sale' : 'Transfer',
      gst_type: (Number(customer.gst_type) === 1) ? 'GST' : 'IGST',
    }))

    return finalResponse
  }

  async function generatSalesDocno({ body, params, logTrace, financialYear }) {
    const knex = this;

    const query = knex(SALES_FMCG_MASTER.NAME)
      .returning("id")
      .where(`${SALES_FMCG_MASTER.COLUMNS.FINANCIAL_YEAR}`, financialYear)
      .orderBy(SALES_FMCG_MASTER.COLUMNS.ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Sales Master",
      logTrace
    });

    const response = await query;


    if (response.length === 0) {
      return { Docno: "1" };
    }

    const docno = response[0].id;

    const Docno = `${docno + 1}`;

    return { Docno };
  }

  async function getExportPendingListRepo({ logTrace, params, queryString }) {
    const knex = this;

    const query = knex(`${SALES_FMCG_MASTER.NAME} as ${SALES_FMCG_MASTER.NAME}`)
      .select([
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID} as customer_id`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID} as bill_no`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DOCDATE}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DELIVERY_DATE}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.EXPORT_PENDING}`
      ])
      .leftJoin(
        `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.CUSTOMER_ID}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`
      )
      .where(`${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.EXPORT_PENDING}`, 1)

    // // If sales master exists
    // await trx(SALES_FMCG_MASTER.NAME)
    // .where({
    //   [SALES_FMCG_MASTER.COLUMNS.ID]: element.product_id,
    //   [STOCKLEDGER.COLUMNS.DATE]: body.docdate
    // })
    // .update({
    //   [STOCKLEDGER.COLUMNS.SALE_QTY]: trx.raw(
    //     `${STOCKLEDGER.COLUMNS.SALE_QTY} + ?`,
    //     [parseFloat(element.qty) || 0] // ✅ Single array
    //   )
    // });

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Export Details",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "export pending data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function putExportPendingRepo({ logTrace, params, body, userDetails }) {
    const knex = this;
    const { sale_id } = params;
    const { id } = userDetails;
    const query = knex(`${SALES_FMCG_MASTER.NAME} as ${SALES_FMCG_MASTER.NAME}`)
      .where({
        [SALES_FMCG_MASTER.COLUMNS.ID]: sale_id
      })
      .update({
        [SALES_FMCG_MASTER.COLUMNS.EXPORT_PENDING]: body.status,
        [SALES_FMCG_MASTER.COLUMNS.EXP_USER_ID]: id
      })

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Export Details",
      logTrace
    });

    await query;

    return { success: true };
  }



  async function getSalesEditListRepo({ params, body, logTrace, userDetails, query }) {
    const knex = this;
    const { company_id } = params;
    const { bill_no, from_date, to_date } = query;

    const query1 = knex
      .select([
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DOCDATE}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID} as customer_id`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.GST_TYPE}`
      ])
      .from(`${SALES_FMCG_MASTER.NAME} as ${SALES_FMCG_MASTER.NAME}`)
      .leftJoin(
        `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.CUSTOMER_ID}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .where(`${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.COMPANY_ID}`, company_id)


    // Check if bill_no is a valid value before applying condition
    if (bill_no) {
      query1.andWhere(`${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID}`, bill_no);
    }

    // Use .whereBetween() for better performance and readability
    if (from_date && to_date) {
      query1.whereBetween(`${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DOCDATE}`, [from_date, to_date]);
    }

    // Ensure orderBy is always applied
    query1.orderBy(`${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID}`, "DESC");

    const response = await query1;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Sales Details not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatedSalesDetails = response.map((detail) => ({
      ...detail,
      gst: Number(detail.gst_type) === 1,
      igst: Number(detail.gst_type) === 2
    }));

    return updatedSalesDetails;
  }


  return {
    postSalesMaster,
    putSalesMasterRepo,
    getSalesByIdRepo,
    deleteSalesDetailsRepo,
    getCustomerMasterRepo,
    getSalesEditListRepo,
    generatSalesDocno,
    getCustomerDetailsRepo,
    getProductDetailsRepo,
    getExportPendingListRepo,
    putExportPendingRepo,

  };
}

module.exports = salesMasterRepo;
