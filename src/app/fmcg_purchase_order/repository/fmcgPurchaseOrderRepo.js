const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const _ = require("lodash");
const { SUPPLIER, ITEM, VENDORS_MAPPING, BARCODE_LIST } = require("../../catalog/item/commons/constants")
const { PURCHASE_ORDER_MASTER, PURCHASE_ORDER_DETAILS, PURCHASE_ORDER_SETTING } = require("../commons/constants")
const { STATES, COUNTRIES, CITIES } = require("../../masterData/commons/constants")
const { USERS } = require("../../accounts/admin/commons/constants");
const { UNITS } = require("../../catalog/units/commons/constants");
const { COMPANY } = require("../../catalog/supplier/commons/constants");
const { COMPANY_PRODUCTS_MAPPING } = require("../../catalog/commons");


function purchaseOrderRepo(fastify) {

  async function postPurchaseOrderProduct({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    // const po_setting_query = knex(PURCHASE_ORDER_SETTING.NAME)
    //   .where(PURCHASE_ORDER_SETTING.COLUMNS.PURCHASE_ORDER, true);

    // const existing_po_setting_query = await po_setting_query;

    // if (!existing_po_setting_query || existing_po_setting_query.length === 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.BAD_REQUEST,
    //     message: "Purchase order approval setting is not enabled.",
    //     property: "",
    //     code: "BAD_REQUEST"
    //   });
    // }

    const supplierDetails = await knex(SUPPLIER.NAME)
      .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`)
      .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
      .first()

    const { gst_type } = supplierDetails
    console.log(Number(gst_type), "supplier details");
    // Get the current max ID
    const [{ max_id }] = await knex(PURCHASE_ORDER_MASTER.NAME).max("id as max_id");
    let nextId = (max_id || 0) + 1; // Start from the next available ID
    const purchaseOrderData = {
      [PURCHASE_ORDER_MASTER.COLUMNS.ID]: nextId,
      [PURCHASE_ORDER_MASTER.COLUMNS.PODATE]: body.podate,
      [PURCHASE_ORDER_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
      [PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
      [PURCHASE_ORDER_MASTER.COLUMNS.EXPIRY_DATE]: body.expiry_date,
      [PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID]: userDetails.company_id,
      [PURCHASE_ORDER_MASTER.COLUMNS.TOTAL_ITEMS]: body.total_items,
      [PURCHASE_ORDER_MASTER.COLUMNS.TOTAL_ORDER_QTY]: body.total_order_qty,
      [PURCHASE_ORDER_MASTER.COLUMNS.SUB_TOTAL_AMT]: body.sub_total_amt,
      [PURCHASE_ORDER_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? body.total_gst_amt : 0,
      [PURCHASE_ORDER_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? body.total_gst_amt : 0,
      [PURCHASE_ORDER_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.total_cess_amt,
      [PURCHASE_ORDER_MASTER.COLUMNS.ROFF]: body.roff,
      [PURCHASE_ORDER_MASTER.COLUMNS.UN_APPROVAL_COMMENTS]: '',
      [PURCHASE_ORDER_MASTER.COLUMNS.GRAND_TOTAL_AMT]: body.grand_total_amt,
      [PURCHASE_ORDER_MASTER.COLUMNS.PO_TYPE]: isNaN(Number(body?.type_id)) ? 0 : Number(body?.type_id),
      [PURCHASE_ORDER_MASTER.COLUMNS.PURCHASE_ORDER_TYPE]: body.purchase_order_type,
      [PURCHASE_ORDER_MASTER.COLUMNS.PO_REF_NO]: body.po_ref_no,
      [PURCHASE_ORDER_MASTER.COLUMNS.MBQ_REF_NO]: 0,
      [PURCHASE_ORDER_MASTER.COLUMNS.AMENDMENT]: 0,
      [PURCHASE_ORDER_MASTER.COLUMNS.IS_APPROVED_BY]: 0,
      [PURCHASE_ORDER_MASTER.COLUMNS.WH_ID]: 1,
      [PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID]: 1,
      [PURCHASE_ORDER_MASTER.COLUMNS.CREATED_BY]: userDetails.id
    };

    const purchaseOrderInsertQuery = await knex(PURCHASE_ORDER_MASTER.NAME)
      .returning(PURCHASE_ORDER_MASTER.COLUMNS.ID)
      .insert(purchaseOrderData);

    const purchaseOrderId = purchaseOrderInsertQuery[0].id;

    const pono = `${purchaseOrderId}`;

    await knex(PURCHASE_ORDER_MASTER.NAME)
      .where(PURCHASE_ORDER_MASTER.COLUMNS.ID, purchaseOrderId)
      .update({
        [PURCHASE_ORDER_MASTER.COLUMNS.PONO]: pono,
        [PURCHASE_ORDER_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
      });

    if (body.purchase_order_details && body.purchase_order_details.length > 0) {
      const purchaseOrderDetailsData = body.purchase_order_details.map(detail => ({
        [PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID]: purchaseOrderId,
        [PURCHASE_ORDER_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
        [PURCHASE_ORDER_DETAILS.COLUMNS.PONO]: pono,
        [PURCHASE_ORDER_DETAILS.COLUMNS.PODATE]: body.podate,
        [PURCHASE_ORDER_DETAILS.COLUMNS.BALANCE]: detail.balance,
        [PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID]: detail.product_id,
        [PURCHASE_ORDER_DETAILS.COLUMNS.CAT_ID]: detail.category_id,
        [PURCHASE_ORDER_DETAILS.COLUMNS.SUB_CAT_ID]: detail.sub_category_id,
        [PURCHASE_ORDER_DETAILS.COLUMNS.HEAD_ID]: detail.head_id,
        [PURCHASE_ORDER_DETAILS.COLUMNS.TYPE_DESIGN_ID]: detail.type_design_id,
        [PURCHASE_ORDER_DETAILS.COLUMNS.UOM_ID]: detail.uom_id,
        [PURCHASE_ORDER_DETAILS.COLUMNS.BARCODE]: detail.barcode,
        [PURCHASE_ORDER_DETAILS.COLUMNS.MRP]: detail.mrp,
        [PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_RATE]: detail.pur_rate,
        [PURCHASE_ORDER_DETAILS.COLUMNS.COST_PRICE]: detail.pur_rate,
        [PURCHASE_ORDER_DETAILS.COLUMNS.GST]: Number(gst_type) === 2 ? detail.gst : 0,
        [PURCHASE_ORDER_DETAILS.COLUMNS.GST_AMOUNT]: Number(gst_type) === 2 ? detail.gst_amount : 0,
        [PURCHASE_ORDER_DETAILS.COLUMNS.CGST]: (detail.gst && Number(detail.gst) > 0 && Number(gst_type) === 2) ? Number(detail.gst) / 2 : 0,
        [PURCHASE_ORDER_DETAILS.COLUMNS.SGST]: (detail.gst && Number(detail.gst) > 0 && Number(gst_type) === 2) ? Number(detail.gst) / 2 : 0,
        [PURCHASE_ORDER_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? detail.gst : 0,
        [PURCHASE_ORDER_DETAILS.COLUMNS.IGST_AMOUNT]: Number(gst_type) === 2 ? detail.gst_amount : 0,
        [PURCHASE_ORDER_DETAILS.COLUMNS.CESS]: detail.cess,
        [PURCHASE_ORDER_DETAILS.COLUMNS.CESS_AMT]: detail.cess_amount,
        [PURCHASE_ORDER_DETAILS.COLUMNS.AMOUNT]: detail.amount,
        [PURCHASE_ORDER_DETAILS.COLUMNS.QTY]: detail.qty,
        [PURCHASE_ORDER_DETAILS.COLUMNS.RECEIVED_QTY]: detail.received_qty,
        [PURCHASE_ORDER_DETAILS.COLUMNS.CASE_QTY]: detail.case_qty,
        [PURCHASE_ORDER_DETAILS.COLUMNS.LOOSE_QTY]: detail.loose_qty,
        [PURCHASE_ORDER_DETAILS.COLUMNS.ORDER_QTY]: detail.loose_qty,
        [PURCHASE_ORDER_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
        [PURCHASE_ORDER_DETAILS.COLUMNS.COMPANY_ID]: 1,
        [PURCHASE_ORDER_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
      }));

      // Perform batch insert
      await knex.batchInsert(PURCHASE_ORDER_DETAILS.NAME, purchaseOrderDetailsData, 500);
    }


    return { success: true, purchase_order_id: purchaseOrderId };
  }

  async function putPurchaseOrderProductRepo({ params, body, userDetails, financialYear }) {
    const knex = this;
    const { po_no, company_id } = params;
    // Start a transaction to ensure atomicity
    const trx = await knex.transaction();
    try {

      // Step 1: Chek PURCHASE_MASTER_ID Already Exists
      const existingPurchaseOrderDetails = await trx(PURCHASE_ORDER_MASTER.NAME)
        .select(
          `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.ID}`,
          `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PONO}`
        )
        .where({
          [PURCHASE_ORDER_MASTER.COLUMNS.PONO]: String(po_no)
        })
        .where({
          [PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID]: company_id
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
      const purchaseOrderUpdateResponse = await trx(`${PURCHASE_ORDER_MASTER.NAME}`)
        .where({
          [PURCHASE_ORDER_MASTER.COLUMNS.ID]: purchaseOrderId, // Find the record by ID
          [PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID]: company_id
        })
        .update({
          [PURCHASE_ORDER_MASTER.COLUMNS.PODATE]: body.podate,
          [PURCHASE_ORDER_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_ORDER_MASTER.COLUMNS.EXPIRY_DATE]: body.expiry_date,
          [PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID]: company_id,
          [PURCHASE_ORDER_MASTER.COLUMNS.TOTAL_ITEMS]: body.total_items,
          [PURCHASE_ORDER_MASTER.COLUMNS.TOTAL_ORDER_QTY]: body.total_order_qty,
          [PURCHASE_ORDER_MASTER.COLUMNS.SUB_TOTAL_AMT]: body.sub_total_amt,
          [PURCHASE_ORDER_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? body.total_gst_amt : 0,
          [PURCHASE_ORDER_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? body.total_gst_amt : 0,
          [PURCHASE_ORDER_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.total_cess_amt,
          [PURCHASE_ORDER_MASTER.COLUMNS.ROFF]: body.roff,
          [PURCHASE_ORDER_MASTER.COLUMNS.GRAND_TOTAL_AMT]: body.grand_total_amt,
          [PURCHASE_ORDER_MASTER.COLUMNS.PO_TYPE]: isNaN(Number(body?.type_id)) ? 0 : Number(body?.type_id),
          [PURCHASE_ORDER_MASTER.COLUMNS.PURCHASE_ORDER_TYPE]: body.purchase_order_type,
          [PURCHASE_ORDER_MASTER.COLUMNS.MBQ_REF_NO]: 0,
          [PURCHASE_ORDER_MASTER.COLUMNS.AMENDMENT]: 0,
          [PURCHASE_ORDER_MASTER.COLUMNS.IS_APPROVED_BY]: userDetails.id,
          [PURCHASE_ORDER_MASTER.COLUMNS.UPDATED_AT]: new Date(),
          [PURCHASE_ORDER_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
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
          [PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID]: purchaseOrderId,
          [PURCHASE_ORDER_DETAILS.COLUMNS.PODATE]: body.podate,
          [PURCHASE_ORDER_DETAILS.COLUMNS.BALANCE]: detail.balance,
          [PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID]: detail.product_id,
          [PURCHASE_ORDER_DETAILS.COLUMNS.CAT_ID]: detail.category_id,
          [PURCHASE_ORDER_DETAILS.COLUMNS.SUB_CAT_ID]: detail.sub_category_id,
          [PURCHASE_ORDER_DETAILS.COLUMNS.HEAD_ID]: detail.head_id,
          [PURCHASE_ORDER_DETAILS.COLUMNS.TYPE_DESIGN_ID]: detail.type_design_id,
          [PURCHASE_ORDER_DETAILS.COLUMNS.UOM_ID]: detail.uom_id,
          [PURCHASE_ORDER_DETAILS.COLUMNS.BARCODE]: detail.barcode,
          [PURCHASE_ORDER_DETAILS.COLUMNS.MRP]: detail.mrp,
          [PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_RATE]: detail.pur_rate,
          [PURCHASE_ORDER_DETAILS.COLUMNS.QTY]: detail.qty,
          [PURCHASE_ORDER_DETAILS.COLUMNS.RECEIVED_QTY]: detail.received_qty,
          [PURCHASE_ORDER_DETAILS.COLUMNS.AMOUNT]: detail.amount,
          [PURCHASE_ORDER_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [PURCHASE_ORDER_DETAILS.COLUMNS.GST]: Number(gst_type) === 2 ? detail.gst : 0,
          [PURCHASE_ORDER_DETAILS.COLUMNS.GST_AMOUNT]: Number(gst_type) === 2 ? detail.gst_amount : 0,
          [PURCHASE_ORDER_DETAILS.COLUMNS.CGST]: (detail.gst && Number(detail.gst) > 0 && Number(gst_type) === 2) ? Number(detail.gst) / 2 : 0,
          [PURCHASE_ORDER_DETAILS.COLUMNS.SGST]: (detail.gst && Number(detail.gst) > 0 && Number(gst_type) === 2) ? Number(detail.gst) / 2 : 0,
          [PURCHASE_ORDER_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? detail.gst : 0,
          [PURCHASE_ORDER_DETAILS.COLUMNS.IGST_AMOUNT]: Number(gst_type) === 1 ? detail.gst_amount : 0,
          [PURCHASE_ORDER_DETAILS.COLUMNS.CESS]: detail.cess,
          [PURCHASE_ORDER_DETAILS.COLUMNS.CESS_AMT]: detail.cess_amount,
          [PURCHASE_ORDER_DETAILS.COLUMNS.CASE_QTY]: detail.case_qty,
          [PURCHASE_ORDER_DETAILS.COLUMNS.LOOSE_QTY]: detail.loose_qty,
          [PURCHASE_ORDER_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
          [PURCHASE_ORDER_DETAILS.COLUMNS.UPDATED_AT]: new Date()
        }));

        // Batch insert in chunks of 1000 records
        if (purchaseOrderDetailsData.length > 0) {
          for (let i = 0; i < purchaseOrderDetailsData.length; i += 1000) {
            const batch = purchaseOrderDetailsData.slice(i, i + 1000);

            await trx(PURCHASE_ORDER_DETAILS.NAME)
              .insert(batch)
              .onConflict([PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID, PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID])
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

  async function getPurchaseOrderPono({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    const { company_id } = params;
    const query = knex(PURCHASE_ORDER_MASTER.NAME)
      .returning("id")
      .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.FINANCIAL_YEAR}`, financialYear)
      .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .orderBy(PURCHASE_ORDER_MASTER.COLUMNS.ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Purchase Order Master",
      logTrace
    });

    const response = await query;

    console.log(response, "response1");

    if (response.length === 0) {
      return { Docno: "1" };
    }

    const docno = Number(response[0].pono);
    const Docno = `${docno + 1}`;

    return { Docno };
  }

  async function getProductBySupplierRepo({ params, body, logTrace, userDetails, query }) {
    const knex = this;
    const { vendor_id, company_id } = params;
    const { search, type, product_id } = query;

    const query1 = knex(ITEM.NAME)
      .distinctOn(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
      .select(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as supplier_add1`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as supplier_add2`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as supplier_add3`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as supplier_add4`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as supplier_state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as supplier_city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as supplier_country_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${ITEM.NAME}.*`,
        `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as soh`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE} as barcode`
      )
      .leftJoin(
        `${VENDORS_MAPPING.NAME}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY_PRODUCTS_MAPPING.NAME}`,
        `${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(
        `${BARCODE_LIST.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`
      )
      .leftJoin(
        `${SUPPLIER.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`
      )
      .leftJoin(
        `${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where(`${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE}`, true)
      .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`, vendor_id)
      .andWhere(`${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
      // .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE}`, '>', 0)
      .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
      .orderBy([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`
      ]);
    if (product_id) {
      query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, product_id);
    }
    // ✅ Apply search condition only on mapped items
    if (search) {
      query1.andWhere(function () {
        this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, "ilike", `%${search}%`)
          .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search}%`);
      });
    }

    // ✅ Apply filter f&v products
    if (type == 2) {
      query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, 2)
    } else {
      query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, 1)
    }

    const response = await query1;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase product not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const finalResponse = response.map(item => {
      // ✅ Initialize qty and case_qty safely
      let qty = 0;
      // let loose_qty = 0;
      let cost_price = item.pur_rate;
      // if (item.order_qty - item.balance > 0 && item.case_qty > 0) {
      //   qty = Math.floor(item.balance / item.case_qty); // Rounds down to nearest whole number
      //   loose_qty = qty * item.case_qty;
      // }

      return {
        ...item,
        qty,
        purchase_order_type: 0,
        cost_price
      }

    });

    return finalResponse;
  }



  async function getPoUnApprovedProduct({ body, params, queryString, logTrace }) {
    const knex = this;
    const { approved, from_date, to_date, company_id } = params;
    const currentDate = new Date().toISOString().split('T')[0];
    console.log(currentDate); // Example output: "2025-03-05"

    // find expired date purchase order
    const check_expried_query = knex
      .select([
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PONO}`
      ])
      .from(`${PURCHASE_ORDER_MASTER.NAME} as ${PURCHASE_ORDER_MASTER.NAME}`)
      .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .whereRaw(
        `DATE(${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.EXPIRY_DATE}) <  ?`,
        [currentDate]
      )

    const expriedPoResponse = await check_expried_query;
    console.log(expriedPoResponse, "po response")
    const expried_po = expriedPoResponse.map(i => String(i.pono))
    console.log(expried_po, "expred po")
    // Update expired purchase orders (only if there are expired POs)
    // Ensure expired POs exist before updating
    if (expried_po.length > 0) {
      await knex(PURCHASE_ORDER_MASTER.NAME) // ✅ Use actual table name (not alias)
        .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID}`, company_id)
        .whereIn(PURCHASE_ORDER_MASTER.COLUMNS.PONO, expried_po) // ✅ Use column name directly
        .update({ [PURCHASE_ORDER_MASTER.COLUMNS.EXPIRED]: true }); // ✅ Correct update syntax
    }

    console.log("Expired POs updated successfully!");

    const query = knex
      .select([
        `${PURCHASE_ORDER_MASTER.NAME}.*`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.UN_APPROVAL_COMMENTS} as reason`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
        `${USERS.NAME}.${USERS.COLUMNS.USER_NAME} as approver_name`
      ])
      .from(`${PURCHASE_ORDER_MASTER.NAME} as ${PURCHASE_ORDER_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${USERS.NAME} as ${USERS.NAME}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.IS_APPROVED_BY}`,
        `${USERS.NAME}.${USERS.COLUMNS.ID}`
      )
      .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .whereRaw(
        `DATE(${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PODATE}) >= ?`,
        [from_date]
      )
      .whereRaw(
        `DATE(${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PODATE}) <= ?`, // Fixed this condition
        [to_date]
      )
      .orderBy(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.ID}`, "DESC");

    // Additional conditions for `approved` field
    if (Number(approved) === 0) {
      query.where(
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.APPROVAL}`,
        0
      )
      query.andWhere(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.EXPIRED}`, false)
    }
    if (Number(approved) === 1) {
      query.where(
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.APPROVAL}`,
        1
      )
    }

    if (Number(approved) === 2) {
      query.where(
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.APPROVAL}`,
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
            `${PURCHASE_ORDER_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`
          ])
          .from(`${PURCHASE_ORDER_DETAILS.NAME} as ${PURCHASE_ORDER_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID}`,
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

  async function putPoUnApprovedProduct({ body, params, logTrace, userDetails }) {
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

    // const po_setting_query = knex(PURCHASE_ORDER_SETTING.NAME)
    //   .where(PURCHASE_ORDER_SETTING.COLUMNS.PURCHASE_ORDER, true);

    // const existing_po_setting_query = await po_setting_query;

    // if (existing_po_setting_query.length > 0) {
    for (const po of un_approved_pono) {
      const { pono, approved, comments } = po;

      const query = knex(PURCHASE_ORDER_MASTER.NAME)
        .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, pono);

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
        [PURCHASE_ORDER_MASTER.COLUMNS.APPROVAL]: Number(approved),
        [PURCHASE_ORDER_MASTER.COLUMNS.UPDATED_AT]: new Date(),
        [PURCHASE_ORDER_MASTER.COLUMNS.UPDATED_BY]: created_by
      };

      if (Number(approved) === 1) {
        updateData[PURCHASE_ORDER_MASTER.COLUMNS.IS_APPROVED_BY] = created_by;
      }

      if (Number(approved) === 2) {
        updateData[PURCHASE_ORDER_MASTER.COLUMNS.UN_APPROVAL_COMMENTS] = comments || "";
      }

      const query_update = await knex(PURCHASE_ORDER_MASTER.NAME)
        .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, pono)
        .update(updateData);

      if (!query_update) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: `Failed to update purchase order ${pono}`,
          code: "UPDATE_FAILED"
        });
      }

    }
    // }
    // else {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.BAD_REQUEST,
    //     message: "Purchase order approval setting is not enabled.",
    //     property: "",
    //     code: "BAD_REQUEST"
    //   });
    // }

    return { success: true };
  }

  async function putPoSetting({ body, params, logTrace, userDetails }) {
    const knex = this;
    // const created_by = userDetails.id;

    const { purchase_order } = body;

    const query_update = await knex(PURCHASE_ORDER_SETTING.NAME)
      // .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, pono)
      .update({
        [PURCHASE_ORDER_SETTING.COLUMNS.PURCHASE_ORDER]: purchase_order,
        // [PURCHASE_ORDER_MASTER.COLUMNS.UPDATED_AT]: new Date(),
        // [PURCHASE_ORDER_MASTER.COLUMNS.UPDATED_BY]: created_by
      });

    if (!query_update) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: `Error while approving purchase order ${pono}`,
        property: "",
        code: "UPDATE_FAILED"
      });
    }


    return { success: true };
  }

  async function getPoSetting({ body, params, logTrace, userDetails }) {
    const knex = this;
    // const created_by = userDetails.id;

    const query = knex(PURCHASE_ORDER_SETTING.NAME);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Po setting details",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Po setting details not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response[0];
  }


  async function getPurchaseOrderApprovedItem({ body, params, logTrace }) {
    const knex = this;
    const { pono } = params;
    // Step 1: Chek PURCHASE_MASTER_ID Already Exists
    const existingPurchaseOrderDetails = await knex(PURCHASE_ORDER_MASTER.NAME)
      .select(
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.ID}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PONO}`
      )
      .where({
        [PURCHASE_ORDER_MASTER.COLUMNS.PONO]: String(pono).toLocaleUpperCase()
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
        `${PURCHASE_ORDER_MASTER.NAME}.*`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as short_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as add1`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as add2`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as add3`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as add4`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN} as gstin`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`
      ])
      .from(`${PURCHASE_ORDER_MASTER.NAME} as ${PURCHASE_ORDER_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .where(
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.ID}`,
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
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.MRP} as mrp`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_RATE} as pur_rate`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.GST} as gst`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.IGST} as igst`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.BARCODE} as barcode`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.QTY} as qty`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.LOOSE_QTY} as order_qty`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.QTY} as po_order_qty`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.LOOSE_QTY} as po_loose_qty`
          ])
          .from(`${PURCHASE_ORDER_DETAILS.NAME} as ${PURCHASE_ORDER_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`, // ✅ Corrected alias for UNITS table
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
          )
          .where(
            `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID}`,
            purchaseOrderId
          )
          // .where(
          //   `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.EXPIRED}`,
          //   false
          // )
          // .where(
          //   `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.IS_GRN_COMPLETE}`,
          //   false
          // )
          .orderBy(`${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID}`, "ASC");

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

  async function getPurchaseOrderApprovedPono({ body, params, logTrace }) {
    const knex = this;
    const { vendor_id, company_id } = params
    const query = knex
      .distinct(
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.ID}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PONO}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PODATE}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.EXPIRY_DATE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`
      )
      .from(`${PURCHASE_ORDER_MASTER.NAME} as ${PURCHASE_ORDER_MASTER.NAME}`)
      .innerJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${PURCHASE_ORDER_DETAILS.NAME} as ${PURCHASE_ORDER_DETAILS.NAME}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.ID}`,
        `${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.PURCHASE_ORDER_MST_ID}`
      )
      .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.APPROVAL}`, 1)
      .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.EXPIRED}`, false)
      .where(`${PURCHASE_ORDER_DETAILS.NAME}.${PURCHASE_ORDER_DETAILS.COLUMNS.IS_GRN_COMPLETE}`, false)
      .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID}`, vendor_id)
      .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .orderBy(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.ID}`, "DESC");

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

    const updatedSupplierDetails = response.map((detail) => ({
      ...detail,
      gst: Number(detail.gst_type) === 2,
      igst: Number(detail.gst_type) === 1,
    }));

    return updatedSupplierDetails;
  }

  async function getProductExpiryBySupplierRepo({ params, body, logTrace, userDetails, query }) {
    const knex = this;
    const { vendor_id, company_id } = params;

    const query1 = knex
      .select([
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PONO}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PODATE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`
      ])
      .from(`${PURCHASE_ORDER_MASTER.NAME} as ${PURCHASE_ORDER_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.EXPIRED}`, true)
      .andWhere(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID}`, vendor_id)
      .andWhere(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .orderBy(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.ID}`, "DESC");

    const response = await query1;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase product not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function deletePurchaseOrderProductRepo({ body, params, logTrace, userDetails }) {
    const knex = this;
    const { po_no, company_id } = params;

    // Check if the purchase order exists
    const query = knex(PURCHASE_ORDER_MASTER.NAME)
      .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, po_no)
      .where(PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID, company_id)
    const exists_response = await query;

    if (!Array.isArray(exists_response) || exists_response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `Purchase order ${po_no} is not found`,
        property: "",
        code: "NOT_FOUND"
      });
    }

    const query1 = knex(PURCHASE_ORDER_MASTER.NAME)
      .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, po_no)
      .where(PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID, company_id)
      .whereIn(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.APPROVAL}`, [1, 2, 3]);

    const exists_response1 = await query1;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `Purchase Order ${po_no} is approved and cannot be deleted`,
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Use a transaction to ensure atomicity
    return await knex.transaction(async (trx) => {
      // Delete from PURCHASE_ORDER_DETAILS first to prevent foreign key constraint issues
      const queryDeleteDetails = await trx(PURCHASE_ORDER_DETAILS.NAME)
        .where(PURCHASE_ORDER_DETAILS.COLUMNS.PONO, po_no)
        .where(PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID, company_id)
        .del();

      const queryDeleteMaster = await trx(PURCHASE_ORDER_MASTER.NAME)
        .where(PURCHASE_ORDER_MASTER.COLUMNS.PONO, po_no)
        .where(PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID, company_id)
        .del();

      // Check if the deletion was successful
      if (!queryDeleteMaster) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: `Error while deleting purchase order ${po_no}`,
          property: "",
          code: "DELETE_FAILED"
        });
      }

      return { success: true };
    });

  }


  async function getPurchaseOrderUnApprovedListRepo({ params, body, logTrace, userDetails, query }) {
    const knex = this;
    const { company_id } = params;
    const { bill_no, from_date, to_date } = query;

    const query1 = knex
      .select([
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PONO}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PODATE}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.APPROVAL}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`
      ])
      .from(`${PURCHASE_ORDER_MASTER.NAME} as ${PURCHASE_ORDER_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .where(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.COMPANY_ID}`, company_id)


    // Check if bill_no is a valid value before applying condition
    if (bill_no) {
      query1.andWhere(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PONO}`, String(bill_no).toLocaleUpperCase());
    }

    // Use .whereBetween() for better performance and readability
    if (from_date && to_date) {
      query1.whereRaw(
        `DATE(${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PODATE}) >= ?`,
        [from_date]
      )
      query1.whereRaw(
        `DATE(${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.PODATE}) <= ?`,
        [to_date]
      )
    }



    // Ensure orderBy is always applied
    query1.orderBy(`${PURCHASE_ORDER_MASTER.NAME}.${PURCHASE_ORDER_MASTER.COLUMNS.ID}`, "DESC");

    const response = await query1;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase Order not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatedPurchaseDetails = response.map((detail) => ({
      ...detail,
      isEdit: detail.approval === 0 ? true : false

    }));

    return updatedPurchaseDetails;
  }

  return {
    postPurchaseOrderProduct,
    putPurchaseOrderProductRepo,
    deletePurchaseOrderProductRepo,
    getProductBySupplierRepo,
    getPoUnApprovedProduct,
    putPoUnApprovedProduct,
    putPoSetting,
    getPurchaseOrderPono,
    getPoSetting,
    getPurchaseOrderApprovedItem,
    getPurchaseOrderApprovedPono,
    getProductExpiryBySupplierRepo,
    getPurchaseOrderUnApprovedListRepo
  };
}

module.exports = purchaseOrderRepo
