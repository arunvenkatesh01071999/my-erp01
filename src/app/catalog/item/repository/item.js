const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { ITEM, VENDORS_MAPPING, PICKER_PRODUCT_MAPPING, ITEM_LOGS, CUSTOMER, WAREHOUSE_CUSTOMER_MAPPING, CUSTOMER_PRODUCTS_MAPPING, WAREHOUSE_PRODUCTS_MAPPING, WAREHOUSE, PURCHASE_FMCG_DETAILS, PURCHASE_ORDER_DETAILS, COMPANY_PRODUCTS_MAPPING, ITEM_EDIT } = require("../../commons");
const { OUTLET_PRODUCT_MAPPING } = require("../../commons");
const { TYPEDESIGN } = require("../../commons");
const { HEADS } = require("../../commons");
const { MAIN_CATEGORY, SESSIONS } = require("../../category/commons/constants");
const { SUB_CATEGORY } = require("../../category/commons/constants");
const { UNITS } = require("../../units/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { BARCODE_LIST } = require("../../../accounts/barcode/commons/constant")
const { COMPANY, COMPANY_BANK_DETAILS } = require("../../../accounts/company/commons/constants");
const { SUPPLIER } = require("../../../../app/catalog/commons")
const { SUPPLIER_OUTLET_MAPPING } = require("../../../../app/catalog/supplier/commons/constants")
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { CLOSING_STOCK_TEMP } = require("../../../closing_stock/commons");
const { WAREHOUSE_STOCKS } = require("../../../packing_issue/commons");
const { INCHARGE_MASTER } = require("../../inchargemaster/commons/constants");
const { TRAY_MASTER } = require("../../traymaster/commons/constants");
const { EXPIRY_TYPE, PUTAWAY, PRODUCT_TYPE } = require("../commons/constants");
const { PICKER_MASTER } = require("../../pickermaster/commons/constants");
const { MERCHANT_CATEGORY } = require("../../merchantcategory/commons/constants");
const { OUTLET_PO_MASTER, OUTLET_PO_DETAILS } = require("../../../outlet_po/Outlet_po_auto/commons/constants");
const { OUTLET_PURCHASE_MEMO_MASTER, OUTLET_PURCHASE_MEMO_DETAILS, OUTLET_PURCHASE_MEMO_BATCH_DETAILS } = require("../../../outlet_memo/commons/constants");
const excelImportRepo = require("../../../Excelupload/repository/excelmport")
const { insertInBatches, updateInBatches, validateBarcodeDB, findDuplicateBarcodes, transformExcelResult } = require("../transformer/itemTransformer")


function itemRepo(fastify) {


  async function getItemDetailsOutletsSalesProduct({ body, params, logTrace }) {
    const knex = this;
    const { barcode, outlet_id } = params
    const query = knex(BARCODE_LIST.NAME)
      .select(
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as pro_code`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as pro_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE} as pur_rate`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SALE_RATE} as sale_rate`,
        `${ITEM.NAME}.${ITEM.COLUMNS.WHOLESALE_RATE} as wholesale_rate`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP} as mrp`,
        `${ITEM.NAME}.${ITEM.COLUMNS.GST} as gst`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CESS} as cess`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HSN} as hsn`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE} as type`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as type_name`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM} as uom`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEADID} as head_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY} as sub_cat`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_cat_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID} as cat_id`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as cat_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_TYPE} as product_type`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_PRODUCT_ID} as main_product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CONVERTION_FACTOR} as convertion_factor`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRO_DESCRIPTION} as pro_description`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_PRODUCT_QTY} as main_product_qty`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SHORT_NAME} as short_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.DISCOUNT} as discount`,
        `${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE} as is_active`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE} as barcode`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.DIS_PER} as special_discount`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK} as op_stk`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as balance`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK} as min_stock`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK} as allow_neg_stk`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE} as wscale`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_WARN_STOCK} as outlet_min_warn_stock`
      )
      .leftJoin(
        ITEM.NAME,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        '=',
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`
      )
      .leftJoin(
        `${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .where(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
      .where(function () {
        this.where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, barcode)
          .orWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PRODUCT_CODE}`, barcode)
          .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, barcode);
      });


    logQuery({
      logger: fastify.log,
      query,
      context: "Get item",
      logTrace
    });
    const response = await query;
    console.log(response, "response");

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Item not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    let transformedResponse = response.map((item) => {

      let min_warn_stock = item.outlet_min_warn_stock || false;
      let negative_stock = item.allow_neg_stk;
      let balance_stock = item.balance;
      let min_stock = item.min_stock;

      let min_stock_waring_message = "";
      let min_stock_waring_flag = false;

      if (min_warn_stock) {
        if (Number(balance_stock) <= Number(min_stock)) {
          min_stock_waring_message = "Product reaches the Minimum Stock Level...";
          min_stock_waring_flag = true;
        }
      }
      if (negative_stock == false && Number(balance_stock) <= 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Negative Stock Not Allowed...",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
      return {
        ...item,
        min_stock_waring_message,
        min_stock_waring_flag,
      };
    })


    return transformedResponse[0];
    // return response
  }
  async function getItemOutlet({ body, params, logTrace }) {
    const knex = this;

    var itemWithOutlets = knex
      .distinct([`${ITEM.NAME}.*`])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .innerJoin(
        `${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
      )
      .where(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
        params.outlet_id
      )

    if (params.search && params.search.length >= 3) {
      itemWithOutlets.where(function () {
        // console.log("search");
        this.where(
          `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          "ilike",
          `%${params.search}%`
        )
      });
    }


    const response = await itemWithOutlets;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Item not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getItemPurchaseProduct({ logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as main_product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        // `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
        // `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
        // `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as type_name`,
        // `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as cat_name`,
        // `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_cat_name`
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      // .leftJoin(
      //   `${UNITS.NAME} as ${UNITS.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.UOM}`,
      //   `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${HEADS.NAME} as ${HEADS.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`,
      //   `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`,
      //   `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
      //   `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
      //   `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      // )
      .where(
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_TYPE}`, "purchase"
      )
      .orderBy(ITEM.COLUMNS.ID, "DESC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item",
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
    return response;
  }
  async function getItem({ logTrace, queryparams, params }) {
    const knex = this;
    const { search } = queryparams;
    // get item query
    const query = knex
      .select([
        `${ITEM.NAME}.*`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
        // `${COMPANY.NAME}.${COMPANY.COLUMNS.FULLNAME} as company_name`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
        // `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as type_name`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
        // `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_category_name`,
        // `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME} as merchant_category_name`,
        // `${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.INCHARGE_NAME} as incharge_name`,
        // `${TRAY_MASTER.NAME}.${TRAY_MASTER.COLUMNS.TRAY_NAME} as tray_name`,
        // `${EXPIRY_TYPE.NAME}.${EXPIRY_TYPE.COLUMNS.EXPIRY_NAME} as expiry_name`,
        // `${PUTAWAY.NAME}.${PUTAWAY.COLUMNS.PUTAWAY_TYPE} as putaway_name`,
        // `${PRODUCT_TYPE.NAME}.${PRODUCT_TYPE.COLUMNS.PRODUCT_TYPE_NAME} as product_type_name`
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      // .leftJoin(
      //   `${COMPANY.NAME} as ${COMPANY.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`,
      //   `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`,
      //   `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${MERCHANT_CATEGORY.NAME} as ${MERCHANT_CATEGORY.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.MERCHANT_CATEGORY_ID}`,
      //   `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.ID}`
      // 
      // .leftJoin(
      //   `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`,
      //   `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${UNITS.NAME} as ${UNITS.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
      //   `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${INCHARGE_MASTER.NAME} as ${INCHARGE_MASTER.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.INCHARGE_ID}`,
      //   `${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${TRAY_MASTER.NAME} as ${TRAY_MASTER.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.TRAY_ID}`,
      //   `${TRAY_MASTER.NAME}.${TRAY_MASTER.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${EXPIRY_TYPE.NAME} as ${EXPIRY_TYPE.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
      //   `${EXPIRY_TYPE.NAME}.${EXPIRY_TYPE.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${PUTAWAY.NAME} as ${PUTAWAY.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.PUTAWAY}`,
      //   `${PUTAWAY.NAME}.${PUTAWAY.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${PRODUCT_TYPE.NAME} as ${PRODUCT_TYPE.NAME}`,
      //   `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
      //   `${PRODUCT_TYPE.NAME}.${PRODUCT_TYPE.COLUMNS.ID}`
      // )
      .orderBy(ITEM.COLUMNS.ID, "ASC")
      .limit(params.take)
      .offset(params.skip)

    if (Number(params.type_id) == 1 && Number(params.type_id) == 2) {
      query.where(
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
        Number(params.type_id)
      );
    }

    if (search) {
      query.andWhere(function () {
        this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, "ilike", `%${search}%`)
          .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search}%`);
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item",
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
    return response;
  }

  async function getItemPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { current_page, page_size } = params;
    const { status, search, company_id, outlet_id } = queryString;
    // get item query
    const query = knex
      .distinct(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
      .select([
        `${ITEM.NAME}.*`,
        knex.raw(`CAST(${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} AS INTEGER) AS numeric_product_code`),
        `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as available_balance`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.FULLNAME} as company_name`,
        knex.raw(
          `to_jsonb(${MAIN_CATEGORY.NAME}.*) as main_catgory_id`
        ),
        knex.raw(
          `to_jsonb(${MERCHANT_CATEGORY.NAME}.*) as merchant_category_id`
        ),
        knex.raw(
          `to_jsonb(${SUB_CATEGORY.NAME}.*) as sub_category_id`
        ),
        knex.raw(
          `to_jsonb(${HEADS.NAME}.*) as head_id`
        ),
        knex.raw(
          `to_jsonb(${TYPEDESIGN.NAME}.*) as typedesign_id`
        ),
        knex.raw(
          `to_jsonb(${UNITS.NAME}.*) as uom_id`
        ),
        knex.raw(
          `to_jsonb(${UNITS.NAME}.*) as main_uom_id`
        ),
        knex.raw(
          `to_jsonb(${INCHARGE_MASTER.NAME}.*) as incharge_id`
        ),
        knex.raw(
          `to_jsonb(${TRAY_MASTER.NAME}.*) as tray_id`
        ),
        knex.raw(
          `to_jsonb(${SESSIONS.NAME}.*) as session_id`
        ),
        knex.raw(`to_jsonb(parent_item.*) as parent_product_id`),
        knex.raw(`to_jsonb(pack_item.*) as pack_product_id`),
        `${EXPIRY_TYPE.NAME}.${EXPIRY_TYPE.COLUMNS.EXPIRY_NAME} as expiry_name`,
        `${PUTAWAY.NAME}.${PUTAWAY.COLUMNS.PUTAWAY_TYPE} as putaway_name`
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${MERCHANT_CATEGORY.NAME} as ${MERCHANT_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MERCHANT_CATEGORY_ID}`,
        `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${INCHARGE_MASTER.NAME} as ${INCHARGE_MASTER.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.INCHARGE_ID}`,
        `${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.ID}`
      )
      .leftJoin(
        `${TRAY_MASTER.NAME} as ${TRAY_MASTER.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TRAY_ID}`,
        `${TRAY_MASTER.NAME}.${TRAY_MASTER.COLUMNS.ID}`
      )
      .leftJoin(
        `${EXPIRY_TYPE.NAME} as ${EXPIRY_TYPE.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
        `${EXPIRY_TYPE.NAME}.${EXPIRY_TYPE.COLUMNS.ID}`
      )
      .leftJoin(
        `${SESSIONS.NAME} as ${SESSIONS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SESSION_ID}`,
        `${SESSIONS.NAME}.${SESSIONS.COLUMNS.ID}`
      )
      .leftJoin(
        `${ITEM.NAME} as parent_item`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PARENT_PRODUCT_ID}`,
        `parent_item.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(
        `${ITEM.NAME} as pack_item`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PACK_PRODUCT_ID}`,
        `pack_item.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(
        `${PUTAWAY.NAME} as ${PUTAWAY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PUTAWAY}`,
        `${PUTAWAY.NAME}.${PUTAWAY.COLUMNS.ID}`
      )
      .leftJoin(
        `${PRODUCT_TYPE.NAME} as ${PRODUCT_TYPE.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
        `${PRODUCT_TYPE.NAME}.${PRODUCT_TYPE.COLUMNS.ID}`
      )
      .orderBy('numeric_product_code', 'ASC')


    if (Number(company_id)) {
      query.leftJoin(
        `${COMPANY_PRODUCTS_MAPPING.NAME} as ${COMPANY_PRODUCTS_MAPPING.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID}`
      )
      query.where(
        `${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID}`,
        company_id
      )
    }

    if (Number(outlet_id)) {
      query.leftJoin(
        `${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
      )
      query.where(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
        outlet_id
      )
    }

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 1) {
      query.where(function () {
        this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search}%`)
          .orWhereRaw(`CAST(${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} AS TEXT) ILIKE ?`, [`%${search}%`])
          .orWhere(`${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`, "ilike", `%${search}%`)
      });
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item",
      logTrace
    });

    const response = await query.paginate({
      pageSize: page_size, // Customize as needed
      currentPage: current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Item not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    console.log(response.data.length, "length");

    const itemWithOutlets = await Promise.all(
      response.data.map(async item => {

        const outlets = await knex
          .select([`${OUTLETS.NAME}.*`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK} as outlet_opng_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as outlet_balnc_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK} as outlet_min_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK} as outlet_allow_neg_stk`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE} as outlet_wscale`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE} as outlet_is_active`
          ])
          .from(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
          .innerJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        const vendors = await knex
          .select([`${SUPPLIER.NAME}.*`])
          .from(`${VENDORS_MAPPING.NAME} as ${VENDORS_MAPPING.NAME}`)
          .innerJoin(
            `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
            `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
          )
          .where(
            `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        const barcode_list = await knex
          .select([`${BARCODE_LIST.NAME}.*`])
          .from(`${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`)
          .innerJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(
            `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
            item.id
          );

        const pickers = await knex
          .select([`${PICKER_MASTER.NAME}.*`])
          .from(`${PICKER_PRODUCT_MAPPING.NAME} as ${PICKER_PRODUCT_MAPPING.NAME}`)
          .leftJoin(
            `${PICKER_MASTER.NAME} as ${PICKER_MASTER.NAME}`,
            `${PICKER_PRODUCT_MAPPING.NAME}.${PICKER_PRODUCT_MAPPING.COLUMNS.PICKER_ID}`,//22222
            `${PICKER_MASTER.NAME}.${PICKER_MASTER.COLUMNS.ID}`//123
          )
          .where(
            `${PICKER_PRODUCT_MAPPING.NAME}.${PICKER_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${PICKER_PRODUCT_MAPPING.NAME}.${PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        const customers = await knex
          .select([`${CUSTOMER.NAME}.*`])
          .from(`${CUSTOMER_PRODUCTS_MAPPING.NAME} as ${CUSTOMER_PRODUCTS_MAPPING.NAME}`)
          .innerJoin(
            `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
            `${CUSTOMER_PRODUCTS_MAPPING.NAME}.${CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID}`,//22222
            `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`//123
          )
          .where(
            `${CUSTOMER_PRODUCTS_MAPPING.NAME}.${CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${CUSTOMER_PRODUCTS_MAPPING.NAME}.${CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        const warehouse = await knex
          .select([
            `${WAREHOUSE.NAME}.*`,
            `${WAREHOUSE_PRODUCTS_MAPPING.NAME}.${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.BALENCE_STOCK} as warehouse_stock`,
            `${WAREHOUSE_PRODUCTS_MAPPING.NAME}.${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE} as warehouse_is_active`
          ])
          .from(`${WAREHOUSE_PRODUCTS_MAPPING.NAME} as ${WAREHOUSE_PRODUCTS_MAPPING.NAME}`)
          .innerJoin(
            `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
            `${WAREHOUSE_PRODUCTS_MAPPING.NAME}.${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID}`,//22222
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`//123
          )
          .where(
            `${WAREHOUSE_PRODUCTS_MAPPING.NAME}.${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${WAREHOUSE_PRODUCTS_MAPPING.NAME}.${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        const companyDetails = await knex
          .select([
            `${COMPANY.NAME}.*`,
            `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
            `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
            `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
          ])
          .from(`${COMPANY_PRODUCTS_MAPPING.NAME} as ${COMPANY_PRODUCTS_MAPPING.NAME}`)
          .innerJoin(
            `${COMPANY.NAME} as ${COMPANY.NAME}`,
            `${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID}`,//22222
            `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`//123
          )
          .leftJoin(
            `${STATES.NAME} as ${STATES.NAME}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.STATE}`,
            `${STATES.NAME}.${STATES.COLUMNS.ID}`
          )
          .leftJoin(
            `${CITIES.NAME} as ${CITIES.NAME}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.CITY}`,
            `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
          )
          .leftJoin(
            `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.COUNTRY}`,
            `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
          )
          .where(
            `${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        const company_details = await Promise.all(
          companyDetails.map(async company => {
            const bank_details = await knex(COMPANY_BANK_DETAILS.NAME).where(
              COMPANY_BANK_DETAILS.COLUMNS.COMPANY_ID,
              company.id
            );

            return { ...company, bank_details };
          })
        );

        return { ...item, customers, outlets, vendors, barcode_list, pickers, warehouse, company_details };
      })
    );
    const combinedResponse = {
      data: itemWithOutlets,
      meta: response.meta
    };

    return combinedResponse;
  }

  async function getItemExportRepo({ queryString, params, logTrace }) {
    const knex = this;
    const { company_id } = params;
    const { type_id } = queryString;

    const query = knex
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} AS Product_Code`,
        // Correct numeric sort field
        knex.raw(`CAST(${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} AS INTEGER) AS numeric_product_code`),
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} AS Product_Name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP} AS MRP`,
        `${ITEM.NAME}.${ITEM.COLUMNS.GST} AS GST`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CESS} AS CESS`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} AS Main_Category`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} AS Sub_Category`,
        `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME} AS Merchandise`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} AS Brand`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} AS BrandCompany`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} AS Unit`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HSN} AS HSN`,
        `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.BATCH_ITEM}`,
        // Optimized barcode subquery
        knex.raw(`JSON_AGG(DISTINCT NULLIF(bl.barcode, '')) AS barcodes`)
      ])
      .from(`${ITEM.NAME} AS ${ITEM.NAME}`)
      .leftJoin(
        `${MAIN_CATEGORY.NAME} AS ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${BARCODE_LIST.NAME} as bl`,
        `bl.outlet_product_id`,
        `${ITEM.NAME}.outlet_product_id`
      )
      .leftJoin(
        `${SUB_CATEGORY.NAME} AS ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${MERCHANT_CATEGORY.NAME} AS ${MERCHANT_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MERCHANT_CATEGORY_ID}`,
        `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} AS ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .leftJoin(
        `${TYPEDESIGN.NAME} AS ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        `${UNITS.NAME} AS ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .where(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
      .orderBy("numeric_product_code", "ASC")
      .groupBy([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.GST}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.BATCH_ITEM}`,
        // Joins
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
        `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
      ])



    // Optional type filter
    if (type_id) {
      query.where(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, Number(type_id));
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item",
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

    const finalData = response.map(r => {
      const barcodes = Array.isArray(r.barcodes)
        ? r.barcodes.filter(b => b && b.trim() !== "") // remove empty strings
        : [];

      return {
        ...r,
        Batch: r.batch_item == true ? "Y" : "N",
        Barcode: barcodes[0] || "",
        Barcode1: barcodes[1] || "",
        Barcode2: barcodes[2] || "",
        Barcode3: barcodes[3] || "",
        Barcode4: barcodes[4] || "",

        ...(Number(type_id) === 1 && {
          Expiry_Type: r.expiry_type_id == 1 ? "Month" : "Days",
          Expiry_Value: r.expiry_value || ""
        })
      };
    });

    return finalData;
  }


  async function getItemImportStatusRepo({ logTrace }) {
    const knex = this;

    const getImportStatus = await knex(Product_EXCEL_IMPORT_TYPE.NAME)
      .select();

    return getImportStatus;
  }

  async function getItemStatusRepo({ logTrace }) {
    const knex = this;

    const getProductStatusType = await knex(PRODUCT_TYPE.NAME)
      .select();

    return getProductStatusType;
  }

  async function getItemParentList({ queryString, params, logTrace }) {
    const knex = this;

    const existIds = await knex(ITEM.NAME)
      .distinct(ITEM.COLUMNS.PARENT_PRODUCT_ID)
      .pluck(ITEM.COLUMNS.PARENT_PRODUCT_ID);

    console.log(existIds, "exist ids");

    const query = knex
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .whereNotIn(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, existIds) // ✅ filter by id
      .orderBy(ITEM.COLUMNS.ID, "ASC");

    const response = await query;
    return response;
  }


  async function postItem({ params, body, logTrace, userDetails }) {
    const knex = this;
    const response = knex.transaction(async (trx) => {
      const query = trx(ITEM.NAME)
        .where(ITEM.COLUMNS.PRODUCT_NAME, body.pro_name);
      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Item Name Already Exists",
          code: "NOT_ACCEPTABLE"
        });
      }
      // Get the next available ID
      const [{ max_id }] = await knex(ITEM.NAME).max("id as max_id");
      const nextId = (max_id || 0) + 1; // ✅ Get the next ID safely
      const response = await trx(ITEM.NAME)
        .returning("id")
        .insert({
          [ITEM.COLUMNS.ID]: nextId,
          [ITEM.COLUMNS.PRODUCT_CODE]: body.pro_code,
          [ITEM.COLUMNS.SHORT_NAME]: body.short_name?.trim() || null,
          [ITEM.COLUMNS.PRO_DESCRIPTION]: body.pro_description?.trim() || null,
          [ITEM.COLUMNS.REGIONAL_NAME]: body.regional_name?.trim() || null,
          [ITEM.COLUMNS.PRODUCT_NAME]: body.pro_name?.trim() || null,
          [ITEM.COLUMNS.COMPANY_ID]: body.company_id,
          [ITEM.COLUMNS.TYPE_ID]: body.type_id,
          [ITEM.COLUMNS.MAIN_CATEGORY_ID]: body.main_catgory_id,
          [ITEM.COLUMNS.MERCHANT_CATEGORY_ID]: body.merchant_category_id,
          [ITEM.COLUMNS.SUB_CATEGORY_ID]: body.sub_category_id,
          [ITEM.COLUMNS.HEAD_ID]: body.head_id,
          [ITEM.COLUMNS.TYPEDESIGN_ID]: body.typedesign_id,
          [ITEM.COLUMNS.MAIN_UOM_ID]: body.main_uom_id || 0,
          [ITEM.COLUMNS.UOM_ID]: body.main_uom_id,
          [ITEM.COLUMNS.MRP]: body.mrp,
          [ITEM.COLUMNS.PURCHASE_RATE]: body.pur_rate,
          [ITEM.COLUMNS.SALE_RATE]: body.sale_rate,
          [ITEM.COLUMNS.WHOLESALE_RATE]: body.wholesale_rate,
          [ITEM.COLUMNS.GST]: body.gst,
          [ITEM.COLUMNS.CESS]: body.cess,
          [ITEM.COLUMNS.HSN]: body.hsn,
          [ITEM.COLUMNS.OPENING_STOCK]: body.op_stk || 0,
          [ITEM.COLUMNS.BALANCE]: body.balance,
          [ITEM.COLUMNS.MIN_STOCK]: body.min_stock || 0,
          [ITEM.COLUMNS.INCHARGE_ID]: body.incharge_id || 0,
          [ITEM.COLUMNS.TRAY_ID]: body.tray_id || 0,
          [ITEM.COLUMNS.EXPIRY_TYPE_ID]: body.expiry_type_id,
          [ITEM.COLUMNS.EXPIRY_VALUE]: body.expiry_value,
          [ITEM.COLUMNS.MBQ]: body.mbq || 0,
          [ITEM.COLUMNS.SHRINKAGE]: body.shrinkage || 0,
          [ITEM.COLUMNS.CASE_QTY]: body.case_qty || 0,
          [ITEM.COLUMNS.PUTAWAY]: body.putaway || 1,
          [ITEM.COLUMNS.BULK_ITEM]: body.bulk_item || false,
          [ITEM.COLUMNS.RETURNABLE_ITEM]: body.returnable_item || false,
          [ITEM.COLUMNS.PURCHASE]: body.purchase || true,
          [ITEM.COLUMNS.MIN_STOCK_WARNING]: body.min_stock_warning || false,
          [ITEM.COLUMNS.BATCH_ITEM]: body.batch_item || false,
          [ITEM.COLUMNS.ALLOW_NEG_STK]: body.allow_neg_stk || false,
          [ITEM.COLUMNS.GST_INCLUSIVE]: body.gst_inclusive || false,
          [ITEM.COLUMNS.SALES_MARGIN_NEW]: body.sales_margin_new || false,
          [ITEM.COLUMNS.WSCALE]: body.wscale || false,
          [ITEM.COLUMNS.CONVERSION_FACTOR]: body.convertion_factor || 1,
          [ITEM.COLUMNS.DISCOUNT]: body.discount,
          [ITEM.COLUMNS.MAIN_PRODUCT_ID]: body.main_product_id || 0,
          [ITEM.COLUMNS.MAIN_PRODUCT_QTY]: body.main_product_qty || 0,
          //add fileds
          [ITEM.COLUMNS.MARGIN]: body.margin || 0,
          [ITEM.COLUMNS.WAREHOUSE_MARGIN]: body.margin || 0,
          [ITEM.COLUMNS.WASTAGE]: body.wastage || 0,
          [ITEM.COLUMNS.PARENT_PRODUCT_ID]: body.parent_product_id || 0,
          [ITEM.COLUMNS.PRODUCT_WEIGHT]: body.product_weight || 0,
          [ITEM.COLUMNS.PACK_PRODUCT_ID]: body.pack_product_id || 0,
          [ITEM.COLUMNS.PACK_QTY]: body.pack_qty || 0,
          [ITEM.COLUMNS.SESSION_ID]: body.session_id || 0,
          [ITEM.COLUMNS.OUTLET_PURCHASE]: body.outlet_purchase || false,
          [ITEM.COLUMNS.PRIORITY]: body.priority || 0,
          [ITEM.COLUMNS.IS_ACTIVE]: body.is_active,
          [ITEM.COLUMNS.CREATED_BY]: userDetails.id
        });

      if (!response || response.length === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Error while creating Item",
          code: "NOT_IMPLEMENTED"
        });
      }

      const product_id = response[0].id;

      const { outlets, vendors, customers, warehouse, company_details, barcode_details, picker_details } = body
      if (outlets?.length > 0) {
        if (outlets[0].outlet_id == 0) {
          const outlet_ids = await trx(OUTLETS.NAME)
            .select(OUTLETS.COLUMNS.ID)
            .where(OUTLETS.COLUMNS.IS_ACTIVE, true);
          console.log(outlet_ids, "outlet_ids")
          // Get the current max ID
          const [{ max_id }] = await knex(OUTLET_PRODUCT_MAPPING.NAME).max("id as max_id");
          let nextId = (max_id || 0) + 1; // Start from the next available ID

          const outletDetails = outlet_ids.map((outlet, index) => ({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.ID]: nextId + index,  // Increment ID for each row
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet.id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PACK_QTY]: outlet.pack_qty || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: outlet.outlet_opng_stock || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: outlet.outlet_balnc_stock || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK]: outlet.outlet_min_stock || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK]: outlet.outlet_allow_neg_stk ?? false,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE]: outlet.outlet_wscale ?? false,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE]: outlet.outlet_purchase,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_NON_SALEABLE]: outlet.outlet_non_saleable,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));

          await trx(OUTLET_PRODUCT_MAPPING.NAME).insert(outletDetails);
        } else {
          // Fetch current max_id again to avoid duplicate IDs
          const [{ max_id }] = await knex(OUTLET_PRODUCT_MAPPING.NAME).max("id as max_id");
          let nextId = (max_id || 0) + 1;

          const outletsDetails = outlets.map((outlet, index) => ({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.ID]: nextId + index,  // Unique ID for each row
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PACK_QTY]: outlet.pack_qty || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: outlet.outlet_opng_stock || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: outlet.outlet_balnc_stock || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK]: outlet.outlet_min_stock || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK]: outlet.outlet_allow_neg_stk,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE]: outlet.outlet_wscale,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE]: outlet.outlet_purchase,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_NON_SALEABLE]: outlet.outlet_non_saleable,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: outlet.is_active
          }));

          await trx(OUTLET_PRODUCT_MAPPING.NAME).insert(outletsDetails);
        }
      }

      // Handle Vendor Mapping
      if (vendors?.length > 0) {
        // Get the current max ID
        const [{ max_id }] = await trx(VENDORS_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1; // Start from the next available ID

        if (vendors[0].vendor_id == 0) {
          const vendors_ids = await trx(SUPPLIER.NAME)
            .select(SUPPLIER.COLUMNS.ID)
            .where(SUPPLIER.COLUMNS.IS_ACTIVE, true);

          const vendorsDetails = vendors_ids.map((vendor, index) => ({
            [VENDORS_MAPPING.COLUMNS.ID]: nextId + index,  // Ensure unique ID
            [VENDORS_MAPPING.COLUMNS.VENDORS_ID]: vendor.id,
            [VENDORS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [VENDORS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
            [VENDORS_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
            [VENDORS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [VENDORS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));

          for (let i = 0; i < vendorsDetails.length; i += BATCH_SIZE) {
            const batch = vendorsDetails.slice(i, i + BATCH_SIZE);
            await trx(VENDORS_MAPPING.NAME)
              .insert(batch)
              .onConflict([
                VENDORS_MAPPING.COLUMNS.VENDORS_ID,
                VENDORS_MAPPING.COLUMNS.PRODUCT_ID,
                VENDORS_MAPPING.COLUMNS.COMPANY_ID
              ])
              .ignore();
          }
        } else {
          const vendorsDetails = vendors.map((vendor, index) => ({
            [VENDORS_MAPPING.COLUMNS.ID]: nextId + index,  // Ensure unique ID
            [VENDORS_MAPPING.COLUMNS.VENDORS_ID]: vendor.vendor_id,
            [VENDORS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [VENDORS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
            [VENDORS_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
            [VENDORS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [VENDORS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));

          await trx(VENDORS_MAPPING.NAME).insert(vendorsDetails);
        }
      }
      // Handle Customer Mapping
      if (customers?.length > 0) {
        if (customers[0].customer_id == 0) {
          const customer_ids = await trx(CUSTOMER.NAME)
            .select(CUSTOMER.COLUMNS.ID)
            .where(CUSTOMER.COLUMNS.IS_ACTIVE, 1);

          const customerDetails = customer_ids.map((customer) => ({
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID]: customer.id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRO_CODE]: body.pro_code,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));

          await trx(CUSTOMER_PRODUCTS_MAPPING.NAME)
            .insert(customerDetails)
            .onConflict(['product_id', 'customer_id', 'warehouse_id'])  // unique constraint
            .ignore(); // or .merge() to update instead

        } else {
          const customerDetails = customers.map((customer) => ({
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID]: customer.customer_id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRO_CODE]: body.pro_code,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));

          await trx(CUSTOMER_PRODUCTS_MAPPING.NAME)
            .insert(customerDetails)
            .onConflict(['product_id', 'customer_id', 'warehouse_id'])  // unique constraint
            .ignore(); // or .merge() to update instead

        }
      }


      // Handle Warehouse Product Mapping
      if (warehouse?.length > 0) {
        // Get the current max ID
        const [{ max_id }] = await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1; // Start from the next available ID

        if (warehouse[0].warehouse_id == 0) {
          const warehouse_ids = await trx(WAREHOUSE.NAME)
            .select(WAREHOUSE.COLUMNS.ID)
            .where(WAREHOUSE.COLUMNS.IS_ACTIVE, true);

          const warehouseData = warehouse_ids.map((warehouse, index) => ({
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Unique ID for each row
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.BALENCE_STOCK]: 0,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouse.id,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_AT]: new Date(),
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: warehouse.is_active
          }));

          await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
            .insert(warehouseData)
            .onConflict(['product_id', 'company_id', 'warehouse_id'])  // unique constraint
            .ignore(); // or .merge() to update instead
        } else {
          const warehouseData = warehouse.map((warehouse, index) => ({
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Unique ID for each row
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.BALENCE_STOCK]: 0,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: 1,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_AT]: new Date(),
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true
          }));

          await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
            .insert(warehouseData)
            .onConflict(['product_id', 'company_id', 'warehouse_id'])  // unique constraint
            .ignore(); // or .merge() to update instead
        }
      } else {
        // Get the current max ID
        const { rows } = await trx.raw(`SELECT nextval('warehouse_products_mapping_id_seq')`);
        const nextId = Number(rows[0].nextval);


        const warehouseData = {
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.ID]: nextId,  // Unique ID for each row
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.BALENCE_STOCK]: 0,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: 1,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_AT]: new Date(),
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true
        };

        await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
          .insert(warehouseData)
          .onConflict(['product_id', 'company_id', 'warehouse_id'])  // unique constraint
          .ignore(); // or .merge() to update instead
      }

      // Handle Company Product Mapping
      if (company_details?.length > 0) {
        // Get the current max ID
        const [{ max_id }] = await trx(COMPANY_PRODUCTS_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1; // Start from the next available ID

        if (company_details[0].company_id == 0) {
          const company_ids = await trx(COMPANY.NAME)
            .select(COMPANY.COLUMNS.ID)
            .where(COMPANY.COLUMNS.IS_ACTIVE, true);

          const companyEntries = company_ids.map((company, index) => ({
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Unique ID for each row
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: company.id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_AT]: new Date(),
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: company.is_active
          }));

          await trx(COMPANY_PRODUCTS_MAPPING.NAME)
            .insert(companyEntries)
            .onConflict(['product_id', 'company_id'])  // unique constraint
            .ignore(); // or .merge() to update instead
        } else {
          const companyEntries = company_details.map((company, index) => ({
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Unique ID for each row
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: company.company_id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_AT]: new Date(),
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: company.is_active || true
          }));

          await trx(COMPANY_PRODUCTS_MAPPING.NAME)
            .insert(companyEntries)
            .onConflict(['product_id', 'company_id'])  // unique constraint
            .ignore(); // or .merge() to update instead
        }
      }

      // Handle Barcode Generation
      if (barcode_details?.length > 0) {
        // Get the next available ID
        const [{ max_id }] = await trx(BARCODE_LIST.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1; // ✅ Get the next ID safely

        const barcodes = barcode_details.map((bar, index) => ({
          [BARCODE_LIST.COLUMNS.ID]: nextId + index, // ✅ Ensure unique ID
          [BARCODE_LIST.COLUMNS.PROD_ID]: product_id,
          [BARCODE_LIST.COLUMNS.PRODUCT_CODE]: body.pro_code,
          [BARCODE_LIST.COLUMNS.BARCODE]: bar.barcode,
          [BARCODE_LIST.COLUMNS.COMPANY_ID]: body.company_id,
          [BARCODE_LIST.COLUMNS.CREATED_BY]: userDetails.id
        }));

        await trx(BARCODE_LIST.NAME).insert(barcodes);
      }


      // Handle Picker Mapping
      if (picker_details?.length > 0) {
        // Get the next available ID
        const [{ max_id }] = await trx(PICKER_PRODUCT_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1; // ✅ Get the next ID safely

        const pickerData = picker_details.map((pick, index) => ({
          [PICKER_PRODUCT_MAPPING.COLUMNS.ID]: nextId + index, // ✅ Ensure unique ID
          [PICKER_PRODUCT_MAPPING.COLUMNS.PICKER_ID]: pick.picker_id,
          [PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
          [PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
          [PICKER_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
          [PICKER_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: userDetails.id
        }));

        await trx(PICKER_PRODUCT_MAPPING.NAME).insert(pickerData);
      }

      // Insert log entry
      await trx(ITEM_LOGS.NAME).insert({
        [ITEM_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
        [ITEM_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [ITEM_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [ITEM_LOGS.COLUMNS.ITEM_ID]: product_id,
        [ITEM_LOGS.COLUMNS.ITEM_NAME]: String(body.pro_name).trim()
      });

      return { success: true };
    });
    return response;
  }


  async function putItem({ params, body, userDetails }) {
    const knex = this;
    const trx = await knex.transaction(); // Start transaction
    const { id } = params;
    try {
      const itemExists = await trx(ITEM.NAME)
        .where(ITEM.COLUMNS.ID, id)
        .first();
      if (!itemExists) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Item not found to update",
          code: "NOT_ACCEPTABLE"
        });
      }

      const existingItem = await trx(ITEM.NAME)
        .where((query) => {
          const conditions = [];
          if (body.short_name) conditions.push(query.orWhere(ITEM.COLUMNS.SHORT_NAME, body.short_name.trim()));
          if (body.pro_description) conditions.push(query.orWhere(ITEM.COLUMNS.PRO_DESCRIPTION, body.pro_description.trim()));
          if (body.pro_name) conditions.push(query.orWhere(ITEM.COLUMNS.PRODUCT_NAME, body.pro_name.trim()));
          if (body.regional_name) conditions.push(query.orWhere(ITEM.COLUMNS.REGIONAL_NAME, body.regional_name.trim()));

          if (conditions.length === 0) {
            query.whereRaw("1=0"); // Prevent unintended selection if no conditions are applied
          }
        })
        .whereNot(ITEM.COLUMNS.ID, id)
        .select([
          ITEM.COLUMNS.ID,
          ITEM.COLUMNS.SHORT_NAME,
          ITEM.COLUMNS.PRO_DESCRIPTION,
          ITEM.COLUMNS.PRODUCT_NAME,  // Fix: Ensure correct property name
          ITEM.COLUMNS.REGIONAL_NAME
        ])
        .first();

      console.log(existingItem, "existing item");

      if (existingItem) {
        let duplicateFields = [];

        if (existingItem.short_name === body.short_name?.trim()) duplicateFields.push("short_name");
        if (existingItem.pro_description === body.pro_description?.trim()) duplicateFields.push("pro_description");
        if (existingItem.product_name === body.pro_name?.trim()) duplicateFields.push("product_name"); // Fix: Correct field name
        if (existingItem.regional_name === body.regional_name?.trim()) duplicateFields.push("regional_name");

        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: `Item Name already exists for fields: ${duplicateFields.join(", ")}`,
          code: "NOT_ACCEPTABLE"
        });
      }

      // Update item
      const updateResult = await trx(ITEM.NAME)
        .where(ITEM.COLUMNS.ID, id)
        .update({
          [ITEM.COLUMNS.PRODUCT_CODE]: body.pro_code,
          [ITEM.COLUMNS.SHORT_NAME]: body.short_name?.trim() || null,
          [ITEM.COLUMNS.PRO_DESCRIPTION]: body.pro_description?.trim() || null,
          [ITEM.COLUMNS.REGIONAL_NAME]: body.regional_name?.trim() || null,
          [ITEM.COLUMNS.PRODUCT_NAME]: body.pro_name?.trim() || null,
          [ITEM.COLUMNS.COMPANY_ID]: body.company_id,
          [ITEM.COLUMNS.TYPE_ID]: body.type_id,
          [ITEM.COLUMNS.MAIN_CATEGORY_ID]: body.main_catgory_id,
          [ITEM.COLUMNS.MERCHANT_CATEGORY_ID]: body.merchant_category_id,
          [ITEM.COLUMNS.SUB_CATEGORY_ID]: body.sub_category_id,
          [ITEM.COLUMNS.HEAD_ID]: body.head_id,
          [ITEM.COLUMNS.TYPEDESIGN_ID]: body.typedesign_id,
          [ITEM.COLUMNS.MAIN_UOM_ID]: body?.main_uom_id || 0,
          [ITEM.COLUMNS.UOM_ID]: body.main_uom_id,
          [ITEM.COLUMNS.MRP]: body.mrp,
          [ITEM.COLUMNS.PURCHASE_RATE]: body.pur_rate,
          [ITEM.COLUMNS.SALE_RATE]: body.sale_rate,
          [ITEM.COLUMNS.WHOLESALE_RATE]: body.wholesale_rate,
          [ITEM.COLUMNS.GST]: body.gst,
          [ITEM.COLUMNS.CESS]: body.cess,
          [ITEM.COLUMNS.HSN]: body.hsn,
          [ITEM.COLUMNS.OPENING_STOCK]: body.op_stk || 0,
          [ITEM.COLUMNS.BALANCE]: body.balance,
          [ITEM.COLUMNS.MIN_STOCK]: body.min_stock || 0,
          [ITEM.COLUMNS.INCHARGE_ID]: body.incharge_id || 0,
          [ITEM.COLUMNS.TRAY_ID]: body.tray_id || 0,
          [ITEM.COLUMNS.EXPIRY_TYPE_ID]: body.expiry_type_id,
          [ITEM.COLUMNS.EXPIRY_VALUE]: body.expiry_value,
          [ITEM.COLUMNS.MBQ]: body.mbq || 0,
          [ITEM.COLUMNS.SHRINKAGE]: body.shrinkage || 0,
          [ITEM.COLUMNS.CASE_QTY]: body.case_qty || 0,
          [ITEM.COLUMNS.PUTAWAY]: body.putaway || 1,
          [ITEM.COLUMNS.BULK_ITEM]: body.bulk_item || false,
          [ITEM.COLUMNS.RETURNABLE_ITEM]: body.returnable_item || false,
          [ITEM.COLUMNS.PURCHASE]: body.purchase || true,
          [ITEM.COLUMNS.MIN_STOCK_WARNING]: body.min_stock_warning || false,
          [ITEM.COLUMNS.BATCH_ITEM]: body.batch_item || false,
          [ITEM.COLUMNS.ALLOW_NEG_STK]: body.allow_neg_stk || false,
          [ITEM.COLUMNS.GST_INCLUSIVE]: body.gst_inclusive || false,
          [ITEM.COLUMNS.SALES_MARGIN_NEW]: body.sales_margin_new || false,
          [ITEM.COLUMNS.WSCALE]: body.wscale || false,
          [ITEM.COLUMNS.CONVERSION_FACTOR]: body.convertion_factor || 1,
          [ITEM.COLUMNS.DISCOUNT]: body.discount,
          [ITEM.COLUMNS.MAIN_PRODUCT_ID]: body.main_product_id || 0,
          [ITEM.COLUMNS.MAIN_PRODUCT_QTY]: body.main_product_qty || 0,
          //add fileds
          [ITEM.COLUMNS.MARGIN]: body.margin || 0,
          [ITEM.COLUMNS.WAREHOUSE_MARGIN]: body.margin || 0,
          [ITEM.COLUMNS.WASTAGE]: body.wastage || 0,
          [ITEM.COLUMNS.PARENT_PRODUCT_ID]: body.parent_product_id || 0,
          [ITEM.COLUMNS.PRODUCT_WEIGHT]: body.product_weight || 0,
          [ITEM.COLUMNS.PACK_PRODUCT_ID]: body.pack_product_id || 0,
          [ITEM.COLUMNS.PACK_QTY]: body.pack_qty || 0,
          [ITEM.COLUMNS.SESSION_ID]: body.session_id || 0,
          [ITEM.COLUMNS.OUTLET_PURCHASE]: body.outlet_purchase || false,
          [ITEM.COLUMNS.PRIORITY]: body.priority || 0,
          [ITEM.COLUMNS.IS_ACTIVE]: body.is_active,
          [ITEM.COLUMNS.UPDATED_BY]: userDetails.id,
          [ITEM.COLUMNS.UPDATED_AT]: knex.fn.now()
        });

      if (!updateResult) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Error while updating item",
          code: "NOT_IMPLEMENTED"
        });
      }
      const { outlets, vendors, customers, warehouse, company_details, barcode_details, picker_details } = body;

      // 🔹 OUTLET MAPPING UPDATE
      if (outlets?.length) {
        // Step 1: Deactivate existing mappings for this product + company
        await trx(OUTLET_PRODUCT_MAPPING.NAME)
          .where(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, id)
          .where(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE, body.pro_code)
          .where(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, body.company_id)
          .update({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: false,
          });

        let outletEntries = [];

        // Step 2: Determine next ID
        const [{ max_id }] = await trx(OUTLET_PRODUCT_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1;

        // Step 3: Prepare new outlet entries
        if (outlets[0].outlet_id === 0) {
          // Fetch all active outlets
          const outletIds = await trx(OUTLETS.NAME)
            .select(OUTLETS.COLUMNS.ID)
            .where(OUTLETS.COLUMNS.IS_ACTIVE, true);

          outletEntries = outletIds.map((outlet, index) => ({
            // [OUTLET_PRODUCT_MAPPING.COLUMNS.ID]: nextId + index,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet.id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PACK_QTY]: 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK]: 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK]: false,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE]: 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active,
          }));
        } else {
          outletEntries = outlets.map((outlet, index) => ({
            // [OUTLET_PRODUCT_MAPPING.COLUMNS.ID]: nextId + index,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PACK_QTY]: outlet.pack_qty || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: outlet.outlet_opng_stock || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: outlet.outlet_balnc_stock || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK]: outlet.outlet_min_stock || 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK]: outlet.outlet_allow_neg_stk ?? false,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE]: outlet.outlet_wscale ?? 0,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active,
          }));
        }

        // ✅ Step 4: Batch insert to avoid parameter overflow
        const BATCH_SIZE = 500; // Safe threshold (13 cols * 500 = 6500 params)
        const totalBatches = Math.ceil(outletEntries.length / BATCH_SIZE);

        console.log(`Inserting ${outletEntries.length} records in ${totalBatches} batches...`);

        for (let i = 0; i < outletEntries.length; i += BATCH_SIZE) {
          const batch = outletEntries.slice(i, i + BATCH_SIZE);

          await trx(OUTLET_PRODUCT_MAPPING.NAME)
            .insert(batch)
            .onConflict([
              OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID,
              OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID,
              OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE,
              OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID
            ])
            .merge({
              [OUTLET_PRODUCT_MAPPING.COLUMNS.PACK_QTY]: trx.raw("excluded.pack_qty"),
              [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: trx.raw("excluded.opening_stock"),
              [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: trx.raw("excluded.balance_stock"),
              [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK]: trx.raw("excluded.min_stock"),
              [OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK]: trx.raw("excluded.allow_neg_stk"),
              [OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE]: trx.raw("excluded.wscale"),
              [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: trx.raw("excluded.company_id"),
              [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: trx.raw("excluded.created_by"),
              [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: trx.raw("excluded.is_active"),
              [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_AT]: trx.fn.now(),
            });
        }

        console.log("✅ Outlet mapping insert/update completed successfully!");
      }

      // Update Vendor Mapping
      if (vendors?.length) {
        await trx(VENDORS_MAPPING.NAME)
          .where(VENDORS_MAPPING.COLUMNS.PRODUCT_ID, id)
          .where(VENDORS_MAPPING.COLUMNS.COMPANY_ID, body.company_id)
          .update({
            [VENDORS_MAPPING.COLUMNS.IS_ACTIVE]: false,
            [VENDORS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [VENDORS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
          });

        let vendorEntries = [];
        // Get the current max ID
        const [{ max_id }] = await trx(VENDORS_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1; // Start from the next available ID
        if (vendors[0].vendor_id == 0) {
          const vendorIds = await trx(SUPPLIER.NAME)
            .select(SUPPLIER.COLUMNS.ID)
            .where(SUPPLIER.COLUMNS.IS_ACTIVE, true);

          vendorEntries = vendorIds.map((vendor, index) => ({
            [VENDORS_MAPPING.COLUMNS.ID]: nextId + index,  // Ensure unique ID
            [VENDORS_MAPPING.COLUMNS.VENDORS_ID]: vendor.id,
            [VENDORS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [VENDORS_MAPPING.COLUMNS.PRODUCT_ID]: id,
            [VENDORS_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
            [VENDORS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [VENDORS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));
        } else {
          vendorEntries = vendors.map((vendor, index) => ({
            [VENDORS_MAPPING.COLUMNS.ID]: nextId + index,  // Ensure unique ID
            [VENDORS_MAPPING.COLUMNS.VENDORS_ID]: vendor.vendor_id,
            [VENDORS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [VENDORS_MAPPING.COLUMNS.PRODUCT_ID]: id,
            [VENDORS_MAPPING.COLUMNS.COMPANY_ID]: 1,
            [VENDORS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [VENDORS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));
        }

        // Use onConflict().merge() for bulk inserts
        await trx(VENDORS_MAPPING.NAME)
          .insert(vendorEntries)
          .onConflict([
            VENDORS_MAPPING.COLUMNS.PRODUCT_ID,
            VENDORS_MAPPING.COLUMNS.VENDORS_ID
          ])
          .merge({
            [VENDORS_MAPPING.COLUMNS.COMPANY_ID]: trx.raw("excluded.company_id"),
            [VENDORS_MAPPING.COLUMNS.CREATED_BY]: trx.raw("excluded.created_by"),
            [VENDORS_MAPPING.COLUMNS.IS_ACTIVE]: trx.raw("excluded.is_active"),
            [VENDORS_MAPPING.COLUMNS.PRODUCT_CODE]: trx.raw("excluded.pro_code") // Corrected column reference
          });
      }

      // if (customers?.length) {
      //   await trx(CUSTOMER_PRODUCTS_MAPPING.NAME)
      //     .where(CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID, id)
      //     .where(CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID, body.warehouse_id)
      //     .update({
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: false,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
      //     });

      //   let customerEntries = [];
      //   // Get the current max ID
      //   const [{ max_id }] = await trx(CUSTOMER_PRODUCTS_MAPPING.NAME).max("id as max_id");
      //   let nextId = (max_id || 0) + 1; // Start from the next available ID
      //   if (customers[0].customer_id == 0) {
      //     const customerIds = await trx(CUSTOMER.NAME)
      //       .select(CUSTOMER.COLUMNS.ID)
      //       .where(CUSTOMER.COLUMNS.IS_ACTIVE, true);

      //     customerEntries = customerIds.map((customer, index) => ({
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Ensure unique ID
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID]: customer.id,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRO_CODE]: body.pro_code,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: id,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
      //     }));
      //   } else {
      //     customerEntries = customers.map((customer, index) => ({
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Ensure unique ID
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID]: customer.customer_id,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRO_CODE]: body.pro_code,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: id,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
      //     }));
      //   }

      //   await trx(CUSTOMER_PRODUCTS_MAPPING.NAME)
      //     .insert(customerEntries)
      //     .onConflict([
      //       CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID,
      //       CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID,
      //       CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID // must include this!
      //     ])
      //     .merge({
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: trx.raw("excluded.warehouse_id"),
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: trx.raw("excluded.created_by"),
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: trx.raw("excluded.is_active"),
      //       [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRO_CODE]: trx.raw("excluded.pro_code")
      //     });
      // }

      if (body.customers?.length) {
        await trx(CUSTOMER_PRODUCTS_MAPPING.NAME)
          .where(CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID, id)
          .where(CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID, body.warehouse_id)
          .update({
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: false,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
          });

        let customerEntries = [];
        // Get the current max ID
        const [{ max_id }] = await trx(CUSTOMER_PRODUCTS_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1; // Start from the next available ID
        if (body.customers[0].customer_id == 0) {
          const customerIds = await trx(CUSTOMER.NAME)
            .select(CUSTOMER.COLUMNS.ID)
            .where(CUSTOMER.COLUMNS.IS_ACTIVE, 1);

          customerEntries = customerIds.map((customer, index) => ({
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Ensure unique ID
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID]: customer.id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRO_CODE]: body.pro_code,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));
        } else {
          customerEntries = body.customers.map((customer, index) => ({
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Ensure unique ID
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID]: customer.customer_id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRO_CODE]: body.pro_code,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));
        }

        await trx(CUSTOMER_PRODUCTS_MAPPING.NAME)
          .insert(customerEntries)
          .onConflict([
            CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID,
            CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID,
            CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID // must include this!
          ])
          .merge({
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: trx.raw("excluded.warehouse_id"),
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: trx.raw("excluded.created_by"),
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: trx.raw("excluded.is_active"),
            [CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRO_CODE]: trx.raw("excluded.pro_code")
          });

      }

      if (company_details?.length) {
        await trx(COMPANY_PRODUCTS_MAPPING.NAME)
          .where(COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID, id)
          .update({
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: false,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
          });

        let companyEntries = [];
        // Get the current max ID
        const [{ max_id }] = await trx(COMPANY_PRODUCTS_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1; // Start from the next available ID
        if (company_details[0].company_id == 0) {
          const companyIds = await trx(COMPANY.NAME)
            .select(COMPANY.COLUMNS.ID)
            .where(COMPANY.COLUMNS.IS_ACTIVE, true);

          companyEntries = companyIds.map((company, index) => ({
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Ensure unique ID
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: company.id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));
        } else {
          companyEntries = company_details.map((company, index) => ({
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Ensure unique ID
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: company.company_id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active
          }));
        }

        await trx(COMPANY_PRODUCTS_MAPPING.NAME)
          .insert(companyEntries)
          .onConflict([
            COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID,
            COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID // must include this!
          ])
          .merge({
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: trx.raw("excluded.company_id"),
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: trx.raw("excluded.created_by"),
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: trx.raw("excluded.is_active"),
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: trx.raw("excluded.pro_code")
          });

      }

      // 🔹 Update Barcode List
      if (barcode_details?.length) {
        // Step 1️⃣ — Deactivate old barcodes for this product & company
        await trx(BARCODE_LIST.NAME)
          .where(BARCODE_LIST.COLUMNS.PROD_ID, id)
          .where(BARCODE_LIST.COLUMNS.COMPANY_ID, body.company_id)
          .update({
            [BARCODE_LIST.COLUMNS.IS_ACTIVE]: false,
            [BARCODE_LIST.COLUMNS.UPDATED_BY]: userDetails.id,
            [BARCODE_LIST.COLUMNS.UPDATED_AT]: knex.fn.now()
          });

        // Step 2️⃣ — Get max ID and prepare new entries
        const [{ max_id }] = await trx(BARCODE_LIST.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1;

        // Step 3️⃣ — Deduplicate barcodes to avoid DB unique constraint conflicts
        const uniqueBarcodes = [
          ...new Map(barcode_details.map(b => [b.barcode, b])).values()
        ];

        // Step 4️⃣ — Prepare new barcode insert data
        const barcodeEntries = uniqueBarcodes.map((bar, index) => ({
          [BARCODE_LIST.COLUMNS.ID]: nextId + index,
          [BARCODE_LIST.COLUMNS.PROD_ID]: id,
          [BARCODE_LIST.COLUMNS.PRODUCT_CODE]: body.pro_code,
          [BARCODE_LIST.COLUMNS.BARCODE]: bar.barcode,
          [BARCODE_LIST.COLUMNS.COMPANY_ID]: body.company_id,
          [BARCODE_LIST.COLUMNS.CREATED_BY]: userDetails.id,
          [BARCODE_LIST.COLUMNS.IS_ACTIVE]: true
        }));

        // Step 5️⃣ — Insert or Merge (based on actual DB constraint)
        await trx(BARCODE_LIST.NAME)
          .insert(barcodeEntries)
          .onConflict([
            BARCODE_LIST.COLUMNS.PROD_ID,
            BARCODE_LIST.COLUMNS.PRODUCT_CODE,
            BARCODE_LIST.COLUMNS.BARCODE
          ])
          .merge({
            [BARCODE_LIST.COLUMNS.COMPANY_ID]: trx.raw("excluded.company_id"),
            [BARCODE_LIST.COLUMNS.CREATED_BY]: trx.raw("excluded.created_by"),
            [BARCODE_LIST.COLUMNS.IS_ACTIVE]: trx.raw("excluded.is_active"),
            [BARCODE_LIST.COLUMNS.UPDATED_AT]: knex.fn.now()
          });


      } else {
        // Step 6️⃣ — No barcodes passed → deactivate existing ones
        await trx(BARCODE_LIST.NAME)
          .where(BARCODE_LIST.COLUMNS.PROD_ID, id)
          .where(BARCODE_LIST.COLUMNS.COMPANY_ID, body.company_id)
          .update({
            [BARCODE_LIST.COLUMNS.IS_ACTIVE]: false,
            [BARCODE_LIST.COLUMNS.UPDATED_BY]: userDetails.id,
            [BARCODE_LIST.COLUMNS.UPDATED_AT]: knex.fn.now()
          });
      }

      // Update Picking Mapping
      if (picker_details?.length) {
        await trx(PICKER_PRODUCT_MAPPING.NAME)
          .where(PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, id)
          .where(PICKER_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, body.company_id)
          .update({
            [PICKER_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: false,
            [PICKER_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [PICKER_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
          });
        // Get the next available ID
        const [{ max_id }] = await trx(PICKER_PRODUCT_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1; // ✅ Get the next ID safely

        const pickerEntries = picker_details.map((pick, index) => ({
          [PICKER_PRODUCT_MAPPING.COLUMNS.ID]: nextId + index, // ✅ Ensure unique ID
          [PICKER_PRODUCT_MAPPING.COLUMNS.PICKER_ID]: pick.picker_id,
          [PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: id,
          [PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
          [PICKER_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
          [PICKER_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: userDetails.id
        }));

        await trx(PICKER_PRODUCT_MAPPING.NAME)
          .insert(pickerEntries)
          .onConflict(
            [
              PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID,
              PICKER_PRODUCT_MAPPING.COLUMNS.PICKER_ID
            ])
          .merge({
            [PICKER_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: trx.raw("excluded.company_id"),
            [PICKER_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: trx.raw("excluded.created_by"),
            [PICKER_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: trx.raw("excluded.is_active"),
            [PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: trx.raw("excluded.pro_code")
          });
      } else {
        await trx(PICKER_PRODUCT_MAPPING.NAME)
          .where(PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, id)
          .where(PICKER_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, body.company_id)
          .update({
            [PICKER_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: false,
            [PICKER_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [PICKER_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
          });
      }

      // Update Warehouse Product Mapping
      if (warehouse?.length) {
        await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
          .where(WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID, id)
          .where(WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID, body.company_id)
          .update({
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: false,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
          });
        // Get the next available ID
        const [{ max_id }] = await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1; // ✅ Get the next ID safely

        const warehouseEntries = warehouse.map((war, index) => ({
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.ID]: nextId + index,  // Unique ID for each row
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: body.pro_code,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: id,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.BALENCE_STOCK]: 0,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: war.warehouse_id,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: body.company_id,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: war.is_active
        }));

        await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
          .insert(warehouseEntries)
          .onConflict(
            [
              WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID,
              WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID,
              WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID
            ])
          .merge({
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: trx.raw("excluded.company_id"),
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: trx.raw("excluded.created_by"),
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: trx.raw("excluded.is_active"),
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: trx.raw("excluded.pro_code")
          });
      } else {
        await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
          .where(WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID, id)
          .where(WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID, body.company_id)
          .update({
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: false,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
          });
      }

      // Update log entry
      await trx(ITEM_LOGS.NAME).insert({
        [ITEM_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
        [ITEM_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [ITEM_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [ITEM_LOGS.COLUMNS.ITEM_ID]: id,
        [ITEM_LOGS.COLUMNS.ITEM_NAME]: String(body.pro_name).trim()
      });

      await trx.commit(); // Commit transaction
      return { success: true, message: "Item updated successfully" };

    } catch (error) {
      await trx.rollback(); // Rollback transaction in case of error
      throw error;
    }
  }


  async function putItemActiveStatusRepo({ body, logTrace, params, userDetails }) {
    const knex = this;
    const { company_id, product_id } = params;
    const { is_active } = body;
    const response = await knex.transaction(async (trx) => {
      try {
        // Check if item exists
        const exists_responseItem = await trx(ITEM.NAME)
          .leftJoin(
            `${COMPANY_PRODUCTS_MAPPING.NAME} as ${COMPANY_PRODUCTS_MAPPING.NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
            `${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID}`
          )
          .where(`${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID}`, product_id)
          .andWhere(`${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID}`, company_id);

        if (exists_responseItem.length === 0) {
          throw CustomError.create({
            httpCode: StatusCodes.NOT_ACCEPTABLE,
            message: `Item not found for company_id ${company_id} and product_id ${product_id}`,
            code: "NOT_ACCEPTABLE"
          });
        }

        // Update IS_ACTIVE to false
        await trx(ITEM.NAME)
          .where(ITEM.COLUMNS.ID, product_id)
          .update({
            [ITEM.COLUMNS.IS_ACTIVE]: is_active,
            [ITEM.COLUMNS.UPDATED_BY]: userDetails.id,
            [ITEM.COLUMNS.UPDATED_AT]: knex.fn.now()
          });

        // Update IS_ACTIVE to false
        await trx(COMPANY_PRODUCTS_MAPPING.NAME)
          .where(COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID, product_id)
          // .where(COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID, company_id)
          .update({
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: is_active,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [COMPANY_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
          });

        // Insert logs
        await trx(ITEM_LOGS.NAME).insert({
          [ITEM_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
          [ITEM_LOGS.COLUMNS.USER_ID]: userDetails.id,
          [ITEM_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
          [ITEM_LOGS.COLUMNS.ITEM_ID]: product_id,
          [ITEM_LOGS.COLUMNS.ITEM_NAME]: String(exists_responseItem[0].pro_name).trim()
        });

        return { success: true };
      } catch (error) {
        throw error;
      }
    });

    return response;
  }

  async function putItemDiscount({ body, logTrace, userDetails }) {
    const knex = this;

    const barcode_details = body.barcode_details;
    const special_discount = body.special_discount;

    for (let detail of barcode_details) {
      const { barcode, prod_id } = detail;


      const exists_response = await knex(BARCODE_LIST.NAME)
        .where(BARCODE_LIST.COLUMNS.PROD_ID, prod_id)
        .andWhere(BARCODE_LIST.COLUMNS.BARCODE, barcode);

      if (!exists_response.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Item not found to update",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }

      const query_update = await knex(BARCODE_LIST.NAME)
        .where(BARCODE_LIST.COLUMNS.PROD_ID, prod_id)
        .andWhere(BARCODE_LIST.COLUMNS.BARCODE, barcode)
        .update({
          [BARCODE_LIST.COLUMNS.DIS_PER]: special_discount,
          [BARCODE_LIST.COLUMNS.UPDATED_BY]: 2,
          [BARCODE_LIST.COLUMNS.UPDATED_AT]: new Date(),
        });

      if (!query_update) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Item not found to update",
          property: "",
          code: "NOT_IMPLEMENTED"
        });
      }
    }

    return { success: true };
  }

  async function deleteItem({ id, body, logTrace, userDetails }) {
    const knex = this;

    const response = knex.transaction(async (trx) => {
      try {
        // Check if item exists in ITEM table
        const exists_responseItem = await trx(ITEM.NAME)
          .where(ITEM.COLUMNS.ID, id);

        if (exists_responseItem.length === 0) {
          throw CustomError.create({
            httpCode: StatusCodes.NOT_ACCEPTABLE,
            message: "Item not found to delete",
            property: "",
            code: "NOT_ACCEPTABLE"
          });
        }

        // Check if item exists in related tables
        const [
          exists_responsePurchaseDetail,
          // exists_responSalesDetail,
          // exists_responOutletSalesDetail,
          // exists_responBarcodeList,
          // exists_responOutletMapping
        ] = await Promise.all([
          trx(PURCHASE_ORDER_DETAILS.NAME).where(PURCHASE_ORDER_DETAILS.COLUMNS.PROD_ID, id),
          // trx(PURCHASE_FMCG_DETAILS.NAME).where(PURCHASE_FMCG_DETAILS.COLUMNS.PRODID, id),
          // trx(OUTLETSALESDETAILS.NAME).where(OUTLETSALESDETAILS.COLUMNS.PRODID, id)
        ]);

        // If the item exists in any of these tables, throw a conflict error
        if (
          exists_responsePurchaseDetail.length > 0
          // exists_responSalesDetail.length > 0 ||
          // exists_responOutletSalesDetail.length > 0
        ) {
          throw CustomError.create({
            httpCode: StatusCodes.CONFLICT,
            message: "Cannot delete item as it is referenced in related tables",
            property: "",
            code: "CONFLICT"
          });
        }

        // Proceed to delete the item if it is not referenced in any other table
        await trx(ITEM.NAME).where(ITEM.COLUMNS.ID, id).del();
        await trx(BARCODE_LIST.NAME).where(BARCODE_LIST.COLUMNS.PROD_ID, id).del();
        await trx(VENDORS_MAPPING.NAME).where(VENDORS_MAPPING.COLUMNS.PRODUCT_ID, id).del();
        await trx(OUTLET_PRODUCT_MAPPING.NAME).where(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, id).del();
        await trx(PICKER_PRODUCT_MAPPING.NAME).where(PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, id).del();
        await trx(CUSTOMER_PRODUCTS_MAPPING.NAME).where(CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID, id).del();
        await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME).where(WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID, id).del();
        await trx(COMPANY_PRODUCTS_MAPPING.NAME).where(COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID, id).del();
        await trx(ITEM_LOGS.NAME).insert({
          [ITEM_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
          [ITEM_LOGS.COLUMNS.USER_ID]: userDetails.id,
          [ITEM_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
          [ITEM_LOGS.COLUMNS.ITEM_ID]: id,
          [ITEM_LOGS.COLUMNS.ITEM_NAME]: String(exists_responseItem[0].pro_name).trim()
        });
        // Commit the transaction if everything is successful
        return { success: true };
      } catch (error) {
        // Rollback the transaction if any error occurs
        throw error;
      }

    });
    return response;
  }



  async function getItemInfo({ params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${ITEM.NAME}.*`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.FULLNAME} as company_name`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as type_name`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_category_name`,
        `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME} as merchant_category_name`,
        `${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.INCHARGE_NAME} as incharge_name`,
        `${TRAY_MASTER.NAME}.${TRAY_MASTER.COLUMNS.TRAY_NAME} as tray_name`,
        `${EXPIRY_TYPE.NAME}.${EXPIRY_TYPE.COLUMNS.EXPIRY_NAME} as expiry_name`,
        `${PUTAWAY.NAME}.${PUTAWAY.COLUMNS.PUTAWAY_TYPE} as putaway_name`,
        `${PRODUCT_TYPE.NAME}.${PRODUCT_TYPE.COLUMNS.PRODUCT_TYPE_NAME} as product_type_name`
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${MERCHANT_CATEGORY.NAME} as ${MERCHANT_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MERCHANT_CATEGORY_ID}`,
        `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${INCHARGE_MASTER.NAME} as ${INCHARGE_MASTER.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.INCHARGE_ID}`,
        `${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.ID}`
      )
      .leftJoin(
        `${TRAY_MASTER.NAME} as ${TRAY_MASTER.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TRAY_ID}`,
        `${TRAY_MASTER.NAME}.${TRAY_MASTER.COLUMNS.ID}`
      )
      .leftJoin(
        `${EXPIRY_TYPE.NAME} as ${EXPIRY_TYPE.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
        `${EXPIRY_TYPE.NAME}.${EXPIRY_TYPE.COLUMNS.ID}`
      )
      .leftJoin(
        `${PUTAWAY.NAME} as ${PUTAWAY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PUTAWAY}`,
        `${PUTAWAY.NAME}.${PUTAWAY.COLUMNS.ID}`
      )
      .leftJoin(
        `${PRODUCT_TYPE.NAME} as ${PRODUCT_TYPE.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`,
        `${PRODUCT_TYPE.NAME}.${PRODUCT_TYPE.COLUMNS.ID}`
      )
      .where(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, params.id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item Info",
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

    const itemWithOutlets = await Promise.all(
      response.map(async item => {
        const outlets = await knex
          .select([`${OUTLETS.NAME}.*`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK} as outlet_opng_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as outlet_balnc_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK} as outlet_min_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK} as outlet_allow_neg_stk`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE} as outlet_wscale`

          ])
          .from(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        const vendors = await knex
          .select([`${SUPPLIER.NAME}.*`])
          .from(`${VENDORS_MAPPING.NAME} as ${VENDORS_MAPPING.NAME}`)
          .leftJoin(
            `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
            `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`,//22222
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`//123
          )
          .where(
            `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        const barcode = await knex
          .select([`${BARCODE_LIST.NAME}.*`])
          .from(`${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(
            `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
            item.id
          );

        const pickers = await knex
          .select([`${PICKER_MASTER.NAME}.*`])
          .from(`${PICKER_PRODUCT_MAPPING.NAME} as ${PICKER_PRODUCT_MAPPING.NAME}`)
          .leftJoin(
            `${PICKER_MASTER.NAME} as ${PICKER_MASTER.NAME}`,
            `${PICKER_PRODUCT_MAPPING.NAME}.${PICKER_PRODUCT_MAPPING.COLUMNS.PICKER_ID}`,//22222
            `${PICKER_MASTER.NAME}.${PICKER_MASTER.COLUMNS.ID}`//123
          )
          .where(
            `${PICKER_PRODUCT_MAPPING.NAME}.${PICKER_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${PICKER_PRODUCT_MAPPING.NAME}.${PICKER_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        const company_details = await knex
          .select([
            `${COMPANY.NAME}.*`,
            knex.raw(
              `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
            ),
            knex.raw(
              `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
            ),
            knex.raw(
              `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
            )
          ])
          .from(`${COMPANY_PRODUCTS_MAPPING.NAME} as ${COMPANY_PRODUCTS_MAPPING.NAME}`)
          .leftJoin(
            `${COMPANY.NAME} as ${COMPANY.NAME}`,
            `${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID}`,//22222
            `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`//123
          )
          .leftJoin(
            `${STATES.NAME} as ${STATES.NAME}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.STATE}`,
            `${STATES.NAME}.${STATES.COLUMNS.ID}`
          )
          .leftJoin(
            `${CITIES.NAME} as ${CITIES.NAME}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.CITY}`,
            `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
          )
          .leftJoin(
            `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.COUNTRY}`,
            `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
          )
          .where(
            `${COMPANY_PRODUCTS_MAPPING.NAME}.${COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        return { ...item, outlets, vendors, barcode, pickers, company_details };
      })
    );


    return itemWithOutlets[0];
  }

  async function getItemInfoWithProcode({ body, params, logTrace }) {
    const knex = this;
    // const query = knex(ITEM.NAME).where(ITEM.COLUMNS.ID, params.id);
    const pro_code = body.pro_code
    const query = knex
      .select([
        `${ITEM.NAME}.*`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as type_name`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as cat_name`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_cat_name`
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, pro_code);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item Info",
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
    // return response;
    const itemWithOutlets = await Promise.all(
      response.map(async item => {

        const outlets = await knex
          .select([`${OUTLETS.NAME}.*`])
          .from(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        const vendors = await knex
          .select([`${SUPPLIER.NAME}.*`])
          .from(`${VENDORS_MAPPING.NAME} as ${VENDORS_MAPPING.NAME}`)
          .leftJoin(
            `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
            `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`,//22222
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`//123
          )
          .where(
            `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_ID}`,
            item.id
          );

        return { ...item, outlets, vendors };
      })
    );


    return itemWithOutlets[0];
  }
  async function getItemCodeInfo({ params, logTrace }) {

    const knex = this;
    const query = knex
      .select([
        `${ITEM.NAME}.*`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as type_name`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as cat_name`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_cat_name`
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .whereRaw(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} ILIKE ?`, [params.product_code])


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item Info",
      logTrace
    });
    const response = await query;

    if (response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Item not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function itemSearch({ params, logTrace }) {
    const knex = this;
    const query = knex(ITEM.NAME);
    if (params.search) {
      query.where(function () {
        this.where(
          `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          "like",
          `%${params.search}%`
        );
        this.orWhere(
          `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
          "like",
          `%${params.search}%`
        );
        this.orWhere(
          `${ITEM.NAME}.${ITEM.COLUMNS.BARCODE}`,
          "like",
          `%${params.search}%`
        );
      });
    }

    const response = await query;

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item",
      logTrace
    });

    if (response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: " not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function itemBarcodeSearch({ params, logTrace }) {
    const knex = this;

    const invalidBarcodeQuery = await knex(BARCODE_LIST.NAME)
      .select(
        `${BARCODE_LIST.NAME}.*`,
      )
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, params.barcode)
      .orWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PRODUCT_CODE}`, params.barcode)

    if (invalidBarcodeQuery.length == 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `data not found`,
        property: "",
        code: "NOT_FOUND"
      });
    }

    const query = knex(BARCODE_LIST.NAME)
      .select(
        `${ITEM.NAME}.*`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.DIS_PER} as special_discount`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as type_name`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as cat_name`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_cat_name`
      )
      .leftJoin(
        ITEM.NAME,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        '=',
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, params.barcode)
      .orWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PRODUCT_CODE}`, params.barcode)
      .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, params.barcode);

    const response = await query;

    return response[0];
  }


  async function getItemsSearchClosingStock({ params, logTrace }) {
    const knex = this;

    const invalidBarcodeQuery = await knex(BARCODE_LIST.NAME)
      .select(
        `${BARCODE_LIST.NAME}.*`,
      )
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, params.barcode)

    if (invalidBarcodeQuery.length == 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `This is barcode is invalid`,
        property: "",
        code: "NOT_FOUND"
      });
    }



    const barcodeTempQuery = await knex(CLOSING_STOCK_TEMP.NAME)
      .select(
        `${CLOSING_STOCK_TEMP.NAME}.*`,
      )
      .where(`${CLOSING_STOCK_TEMP.NAME}.${CLOSING_STOCK_TEMP.COLUMNS.BARCODE}`, params.barcode)
      .where(`${CLOSING_STOCK_TEMP.NAME}.${CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID}`, params.outlet_id)

    if (barcodeTempQuery.length != 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `This barcode already exists`,
        property: "",
        code: "NOT_FOUND"
      });
    }



    const barcodeSoldQuery = await knex(BARCODE_LIST.NAME)
      .select(
        `${BARCODE_LIST.NAME}.*`,
      )
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, params.barcode)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`, params.outlet_id)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`, true)


    if (barcodeSoldQuery.length != 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `This item is Sold`,
        property: "",
        code: "NOT_FOUND"
      });
    }

    const barcodeUnverifedQuery = await knex(BARCODE_LIST.NAME)
      .select(
        `${BARCODE_LIST.NAME}.*`,
      )
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, params.barcode)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`, params.outlet_id)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_VERIFIED}`, 0)

    if (barcodeUnverifedQuery.length != 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `This item is not Verified`,
        property: "",
        code: "NOT_FOUND"
      });
    }

    const barcodeMissedQuery = await knex(BARCODE_LIST.NAME)
      .select(
        `${BARCODE_LIST.NAME}.*`,
      )
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, params.barcode)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_MISSED}`, true)

    if (barcodeMissedQuery.length != 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `This item is in missed report`,
        property: "",
        code: "NOT_FOUND"
      });
    }

    const barcodeWarehouseQuery = await knex(BARCODE_LIST.NAME)
      .select(
        `${BARCODE_LIST.NAME}.*`,
      )
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, params.barcode)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`, null)

    if (barcodeWarehouseQuery.length != 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `This item is warehouse`,
        property: "",
        code: "NOT_FOUND"
      });
    }

    const barcodeCurrentMonthQuery = knex(BARCODE_LIST.NAME)
      .select(
        `${BARCODE_LIST.NAME}.*`
      )
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, params.barcode)
      .andWhereRaw(
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} < DATE_TRUNC('month', CURRENT_DATE) 
      OR ${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} >= DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'`
      )

    var barcodeCurrentMonth = await barcodeCurrentMonthQuery

    if (barcodeCurrentMonth.length == 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `Current Month New Item`,
        property: "",
        code: "NOT_FOUND"
      });
    }


    const query = knex(BARCODE_LIST.NAME)
      .select(
        `${BARCODE_LIST.NAME}.*`,
        `${ITEM.NAME}.*`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as description`
      )
      .leftJoin(
        ITEM.NAME,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        '=',
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`
      )
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, params.barcode)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`, params.outlet_id)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`, false)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_CLOSED}`, 0)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_VERIFIED}`, 1)
      .where(`${ITEM.NAME}.${ITEM.COLUMNS.CATID}`, params.cat_id)

    if (!params.sub_cat_id) {
      query.where(
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        params.sub_cat_id
      );
    }


    const response = await query;


    if (response.length > 0) {

      if (response[0].outlet_id != params.outlet_id) {

        const short_name = await knex(OUTLETS.NAME)
          .where(OUTLETS.COLUMNS.ID, response[0].outlet_id)
          .select(OUTLETS.COLUMNS.SHORTNAME);

        const outlet_short_name = short_name[0].short_name

        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `This is mapped with ${outlet_short_name} outlet`,
          property: "",
          code: "NOT_FOUND"
        });
      }
    }



    if (response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "This Barcode not belongs to this Category",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getBarcodeIssueSearch({ params, logTrace }) {
    const knex = this;

    const query = knex(BARCODE_LIST.NAME)
      .select(
        `${BARCODE_LIST.NAME}.*`,
        `${ITEM.NAME}.*`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as qty`, // Cast to numeric
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as description`
      )
      .leftJoin(
        ITEM.NAME,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        '=',
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`
      )
      // .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, params.barcode)
      // .orWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PRODUCT_CODE}`, params.barcode);
      .whereRaw(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE} ILIKE ?`, [params.barcode])
      .orWhereRaw(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PRODUCT_CODE} ILIKE ?`, [params.barcode])
      // .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} ILIKE ?`, params.barcode)
      .orWhereRaw(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} ILIKE ?`, [params.barcode])




    const response = await query;

    if (response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Barcode not found. Please verify and enter a valid barcode",
        property: "",
        code: "NOT_FOUND"
      });
    }
    response[0].qty = Number(response[0].qty);
    return response[0];
  }

  async function getSubWarehouseStocks({ params, logTrace }) {
    const knex = this;
    const { barcode, outlet_id } = params


    const query = knex
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as prod_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as pro_code`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as pro_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PARCHASE_RATE} as pur_rate`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SALE_RATE} as sale_rate`,
        `${ITEM.NAME}.${ITEM.COLUMNS.WHOLESALE_RATE} as wholesale_rate`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP} as mrp`,
        `${ITEM.NAME}.${ITEM.COLUMNS.GST} as gst`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CESS} as cess`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HSN} as hsn`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE} as type`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as type_name`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM} as uom`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEADID} as head_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY} as sub_cat`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_cat_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID} as cat_id`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as cat_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_TYPE} as product_type`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_PRODUCT_ID} as main_product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CONVERTION_FACTOR} as convertion_factor`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRO_DESCRIPTION} as pro_description`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_PRODUCT_QTY} as main_product_qty`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SHORT_NAME} as short_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.DISCOUNT} as discount`,
        `${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE} as is_active`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE} as barcode`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.DIS_PER} as special_discount`,
        `${WAREHOUSE_STOCKS.NAME}.${WAREHOUSE_STOCKS.COLUMNS.STOCK} as qty`,

      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`
      )
      .leftJoin(
        `${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
      )
      .leftJoin(
        `${WAREHOUSE_STOCKS.NAME} as ${WAREHOUSE_STOCKS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${WAREHOUSE_STOCKS.NAME}.${WAREHOUSE_STOCKS.COLUMNS.PROD_ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .where(
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, barcode
      )
      .orWhere(
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PRODUCT_CODE}`, barcode
      )
      .orWhere(
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, barcode
      )
      .andWhere(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id
      )

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product not  mapping  with the  outlet",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0]
  }

  async function getWarehouseMappingListRepo({ params, logTrace, userDetails, queryString }) {
    const knex = this;
    const id = Array.isArray(queryString.id)
      ? queryString.id.map(Number)
      : [Number(queryString.id)];

    console.log(id, "warehouse_id");
    const query = knex
      .distinct()
      .select([
        `${WAREHOUSE_CUSTOMER_MAPPING.NAME}.*`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name `
      ])
      .from(`${WAREHOUSE_CUSTOMER_MAPPING.NAME} as ${WAREHOUSE_CUSTOMER_MAPPING.NAME}`)
      .leftJoin(
        `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
        `${WAREHOUSE_CUSTOMER_MAPPING.NAME}.${WAREHOUSE_CUSTOMER_MAPPING.COLUMNS.CUSTOMER_ID}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`
      )
      .whereIn(`${WAREHOUSE_CUSTOMER_MAPPING.NAME}.${WAREHOUSE_CUSTOMER_MAPPING.COLUMNS.WAREHOUSE_ID}`, id)
      .where(`${WAREHOUSE_CUSTOMER_MAPPING.NAME}.${WAREHOUSE_CUSTOMER_MAPPING.COLUMNS.IS_ACTIVE}`, 1);


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product not mapping with the outlet",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  // async function postItemExcelValidation({ body, params, logTrace, query, userDetails }) {
  //   const knex = this;
  //   const trx = await knex.transaction();
  //   const { company_id, status, type_id } = params;
  //   const { uploadExcelData } = excelImportRepo(fastify);
  //   const excelColumnData = await uploadExcelData.call(knex, {
  //     body,
  //     params,
  //     logTrace
  //   });
  //   const excelColumns = excelColumnData.headers;
  //   const excelData = excelColumnData.data;

  //   // get item query
  //   try {
  //     const errorCodes = [];
  //     const errorNames = [];
  //     const errorCategoryNames = [];
  //     const errorSubCategoryNames = [];
  //     const errorBrandNames = [];
  //     const errorBrandCompanyNames = [];
  //     const errorUOMNames = [];
  //     const errorMerchantCategoryNames = [];
  //     const errorBarcodes = [];
  //     const typeMismatchCodes = [];

  //     // Step 1: Define required columns
  //     const requiredColumns = [
  //       "Product_Code",
  //       "Product_Name",
  //       "MRP",
  //       "VAT",
  //       "CESS",
  //       "Main_Category",
  //       "Sub_Category",
  //       "Merchandise",
  //       "Brand",
  //       "BrandCompany",
  //       "Unit",
  //       "HSN",
  //       "Batch",
  //       "Barcode",
  //       "Barcode1",
  //       "Barcode2",
  //       "Barcode3",
  //       "Barcode4"
  //     ];
  //     console.log("excelColumns", excelColumns)
  //     // Step 3: Check if any required column is missing
  //     const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
  //     if (missingColumns.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: `Missing required columns: ${missingColumns.join(", ")}`,
  //         property: "",
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     // Step 2: Extract uploaded product codes
  //     const uploadedCodes = excelData.map(p => String(p.Product_Code).trim());
  //     const uploadedProductNames = excelData.map(p => String(p.Product_Name).toLowerCase().trim());

  //     // Step 5: Get existing products from DB
  //     const dbProductsRaw = await trx(ITEM.NAME)
  //       .select(ITEM.COLUMNS.PRODUCT_CODE, ITEM.COLUMNS.PRODUCT_NAME, ITEM.COLUMNS.TYPE_ID);

  //     const dbProductCodes = dbProductsRaw.map(p => p[ITEM.COLUMNS.PRODUCT_CODE]);
  //     const dbProductNames = dbProductsRaw.map(p => p[ITEM.COLUMNS.PRODUCT_NAME].toLowerCase());

  //     // Step 6: Validate product codes
  //     if (Number(status) === 1) {
  //       let invalidCodes = uploadedCodes.filter(code => dbProductCodes.includes(code));
  //       if (invalidCodes.length > 0) {
  //         errorCodes.push(...invalidCodes);  // spread instead of join
  //       }
  //     } else {
  //       let invalidCodes = uploadedCodes.filter(code => !dbProductCodes.includes(code));
  //       if (invalidCodes.length > 0) {
  //         errorCodes.push(...invalidCodes);  // spread instead of join
  //       }
  //     }
  //     // console.log("invaild error code", errorCodes)
  //     // console.log("invaild error code", dbProductCodes)
  //     // Step 7: Check type mismatch (only if status != 1)
  //     const parsedTypeId = Number(type_id);
  //     if (Number(status) !== 1) {
  //       for (const product of dbProductsRaw) {
  //         if (uploadedCodes.includes(product[ITEM.COLUMNS.PRODUCT_CODE])) {
  //           if (product[ITEM.COLUMNS.TYPE_ID] !== parsedTypeId) {
  //             typeMismatchCodes.push(product[ITEM.COLUMNS.PRODUCT_CODE]);
  //           }
  //         }
  //       }
  //       if (typeMismatchCodes.length > 0) {
  //         errorCodes.push(...typeMismatchCodes); // spread
  //       }
  //     }

  //     // Step 8: Check product names
  //     if (Number(status) === 1) {
  //       // Insert → names must be unique
  //       let existingNames = uploadedProductNames.filter(name => dbProductNames.includes(name));
  //       if (existingNames.length > 0) {
  //         errorNames.push(...existingNames);
  //       }
  //     }

  //     // STEP 9: Unique, cleaned category names from Excel
  //     const categoryNames = [...new Set(
  //       excelData
  //         .map(p => String(p.Main_Category || "").trim().toLowerCase())
  //         .filter(Boolean)
  //     )];

  //     // Helper → Fetch categories in safe chunks
  //     async function fetchInChunks(trx, table, column, values, chunkSize = 300) {
  //       const result = [];

  //       for (let i = 0; i < values.length; i += chunkSize) {
  //         const chunk = values.slice(i, i + chunkSize);

  //         const placeholders = chunk.map(() => '?').join(',');

  //         const rows = await trx(table)
  //           .select("id", column)
  //           .whereRaw(`LOWER(TRIM(${column})) IN (${placeholders})`, chunk);

  //         result.push(...rows);
  //       }

  //       return result;
  //     }

  //     // STEP 10: Fetch existing categories efficiently
  //     const existingCategoryRows = await fetchInChunks(
  //       trx,
  //       MAIN_CATEGORY.NAME,
  //       MAIN_CATEGORY.COLUMNS.CATEGORY_NAME,
  //       categoryNames
  //     );

  //     // STEP 11: Build map for fast lookup
  //     const existingCategoryMap = new Map(
  //       existingCategoryRows.map(c => [
  //         String(c[MAIN_CATEGORY.COLUMNS.CATEGORY_NAME]).trim().toLowerCase(),
  //         c[MAIN_CATEGORY.COLUMNS.ID]
  //       ])
  //     );

  //     // STEP 12: Detect missing ones
  //     const missingCategories = categoryNames.filter(
  //       name => !existingCategoryMap.has(name)
  //     );

  //     // STEP 13: Report missing categories
  //     if (missingCategories.length > 0) {
  //       errorCategoryNames.push(`Main Category Not Found: ${missingCategories.join(', ')}`);
  //     }


  //     // Step 14: Fetch existing sub category IDs 
  //     const subCategoryKeysFromExcel = [...new Set(
  //       excelData.map(row => {
  //         const subName = String(row.Sub_Category || "").trim().toLowerCase();
  //         const mainName = String(row.Main_Category || "").trim().toLowerCase();
  //         const categoryId = existingCategoryMap.get(mainName);

  //         // Skip invalid rows
  //         if (!subName || !categoryId) return null;

  //         return `${subName}|${categoryId}`;
  //       }).filter(Boolean)
  //     )];

  //     async function fetchSubcategoriesInChunks(trx, categoryIds, chunkSize = 300) {
  //       const result = [];

  //       for (let i = 0; i < categoryIds.length; i += chunkSize) {
  //         const chunk = categoryIds.slice(i, i + chunkSize);

  //         const rows = await trx(SUB_CATEGORY.NAME)
  //           .select(
  //             SUB_CATEGORY.COLUMNS.ID,
  //             SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME,
  //             SUB_CATEGORY.COLUMNS.CATEGORY_ID
  //           )
  //           .whereIn(SUB_CATEGORY.COLUMNS.CATEGORY_ID, chunk);

  //         result.push(...rows);
  //       }

  //       return result;
  //     }


  //     // Step 15: Fetch existing subcategories from DB
  //     const categoryIds = Array.from(existingCategoryMap.values());

  //     const subCategoryData = await fetchSubcategoriesInChunks(trx, categoryIds);


  //     // Step 16: Create existing subcategory map for fast lookup
  //     const existingSubCategoryMap = new Map(
  //       subCategoryData.map(s => [
  //         `${String(s.subcategory_name).trim().toLowerCase()}|${s.category_id}`,
  //         s.id
  //       ])
  //     );

  //     // Step 17: Validate missing subcategories
  //     const missingSubcategories = subCategoryKeysFromExcel.filter(
  //       key => !existingSubCategoryMap.has(key)
  //     );

  //     // Convert back to readable names
  //     if (missingSubcategories.length > 0) {
  //       errorSubCategoryNames.push(
  //         ...missingSubcategories.map(k => {
  //           const [subName, categoryId] = k.split("|");
  //           const mainName = [...existingCategoryMap.entries()]
  //             .find(([_, id]) => id === Number(categoryId))?.[0];

  //           return `Subcategory: "${subName}" under Main Category: "${mainName}"`;
  //         })
  //       );
  //     }


  //     // Step-19: Fetch existing brand IDs based on brand names (lowercase + trim)
  //     await validateNames({
  //       trx,
  //       excelData,
  //       excelKey: "Brand",
  //       tableName: HEADS.NAME,
  //       dbColumn: HEADS.COLUMNS.CATEOGORY_NAME,
  //       idColumn: HEADS.COLUMNS.ID,
  //       errorCollector: errorBrandNames
  //     });

  //     // Step-20: Normalize company brand names from Excel (trim + lowercase)
  //     await validateNames({
  //       trx,
  //       excelData,
  //       excelKey: "BrandCompany",
  //       tableName: TYPEDESIGN.NAME,
  //       dbColumn: TYPEDESIGN.COLUMNS.TYPE_NAME,
  //       idColumn: TYPEDESIGN.COLUMNS.ID,
  //       errorCollector: errorBrandCompanyNames
  //     });

  //     //Step-21: Fetch existing unit ids
  //     await validateNames({
  //       trx,
  //       excelData,
  //       excelKey: "Unit",
  //       tableName: UNITS.NAME,
  //       dbColumn: UNITS.COLUMNS.UNITS_SHORT_NAME,
  //       idColumn: UNITS.COLUMNS.ID,
  //       errorCollector: errorUOMNames
  //     });

  //     //Step-24: Fetch existing  ids
  //     await validateNames({
  //       trx,
  //       excelData,
  //       excelKey: "Merchandise",
  //       tableName: MERCHANT_CATEGORY.NAME,
  //       dbColumn: MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME,
  //       idColumn: MERCHANT_CATEGORY.COLUMNS.ID,
  //       errorCollector: errorMerchantCategoryNames
  //     });

  //     // ✅ Step 25: Extract all uploaded barcodes (keep track of which column)
  //     const uploadedBarcodes = [];

  //     for (const p of excelData) {
  //       const productCode = String(p.Product_Code || '').trim();
  //       const barcodeFields = ["Barcode", "Barcode1", "Barcode2", "Barcode3", "Barcode4"];

  //       for (const field of barcodeFields) {
  //         const cleanBarcode = String(p[field] || '').trim();

  //         if (cleanBarcode.length > 0) {
  //           uploadedBarcodes.push({
  //             barcode: cleanBarcode,
  //             product_code: productCode,
  //             field_name: field, // 👈 track which column
  //           });
  //         }
  //       }
  //     }

  //     console.log(uploadedBarcodes, "→ uploaded barcodes");

  //     // ✅ Step 25.1: Detect duplicate barcodes inside Excel
  //     const seenBarcodes = new Map();
  //     const duplicateBarcodes = [];

  //     for (const { barcode, product_code, field_name } of uploadedBarcodes) {
  //       const cleanBarcode = barcode.trim();

  //       if (seenBarcodes.has(cleanBarcode)) {
  //         const firstEntry = seenBarcodes.get(cleanBarcode);
  //         duplicateBarcodes.push({
  //           barcode: cleanBarcode,
  //           message: `${cleanBarcode} duplicated in Excel — first found in [${firstEntry.field_name || 'Unknown Field'}] (product_code: ${firstEntry.product_code || 'N/A'}) and again in [${field_name || 'Unknown Field'}] (product_code: ${product_code || 'N/A'})`,
  //           field: field_name,
  //         });
  //       } else {
  //         seenBarcodes.set(cleanBarcode, { product_code, field_name });
  //       }
  //     }

  //     if (duplicateBarcodes.length > 0) {
  //       console.log(duplicateBarcodes, "→ duplicate barcodes in Excel");
  //       // Collect only the messages for summary
  //       const summary = duplicateBarcodes.map(i => i.message).join(', ');
  //       errorBarcodes.push(`Duplicate barcodes found in Excel: ${summary}`);
  //     }


  //     // ✅ Step 26: Fetch DB barcodes
  //     const dbBarcodeRaw = await trx(BARCODE_LIST.NAME).select(
  //       BARCODE_LIST.COLUMNS.ID,
  //       BARCODE_LIST.COLUMNS.BARCODE,
  //       BARCODE_LIST.COLUMNS.PRODUCT_CODE
  //     );

  //     // ✅ Convert DB data into a map for fast lookup
  //     const dbBarcodeMap = new Map(
  //       dbBarcodeRaw.map(p => [
  //         String(p[BARCODE_LIST.COLUMNS.BARCODE]).trim(),
  //         String(p[BARCODE_LIST.COLUMNS.PRODUCT_CODE]).trim(),
  //       ])
  //     );

  //     const invalidBarcodes = [];

  //     // ✅ Step 26: Validate barcodes against DB + Excel mismatch
  //     for (const { barcode, product_code, field_name } of uploadedBarcodes) {
  //       const cleanBarcode = String(barcode).trim();
  //       const cleanProductCode = String(product_code).trim();
  //       const dbProductCode = dbBarcodeMap.get(cleanBarcode);
  //       const isProductCodeAvailable = dbProductCodes.includes(cleanBarcode); // ✅ Check if product_code exists in DB

  //       // ✅ Condition 1: Barcode already linked to another product in DB
  //       if (dbProductCode && dbProductCode !== cleanProductCode) {
  //         invalidBarcodes.push({
  //           barcode: cleanBarcode,
  //           message: `${cleanBarcode} already linked in DB to product_code ${dbProductCode}`,
  //           field: field_name,
  //         });
  //         continue;
  //       }

  //       // ✅ Condition 2: Excel mismatch (barcode ≠ product_code)
  //       // 👉 Only check if product_code exists in DB AND barcode is not a long numeric code
  //       if (isProductCodeAvailable && cleanBarcode !== cleanProductCode) {
  //         const isNumericBarcode = /^\d+$/.test(cleanBarcode); // check if all digits
  //         const isLongBarcode = cleanBarcode.length >= 10;     // length >= 10

  //         if (!(isNumericBarcode && isLongBarcode)) {
  //           invalidBarcodes.push({
  //             barcode: cleanBarcode,
  //             message: `${cleanBarcode} Excel mismatch — got product_code ${cleanProductCode}`,
  //             field: field_name,
  //           });
  //         }
  //       }

  //       // ✅ Condition 1: Barcode already linked to another product in DB
  //       if (dbProductCode && dbProductCode !== cleanProductCode) {
  //         invalidBarcodes.push({
  //           barcode: cleanBarcode,
  //           message: `${cleanBarcode} already linked in DB to product_code ${dbProductCode}`,
  //           field: field_name,
  //         });
  //         continue;
  //       }

  //     }


  //     console.log(invalidBarcodes, "→ invalid barcode list");

  //     // ✅ Step 27: Throw or collect detailed error
  //     if (invalidBarcodes.length > 0) {
  //       // Collect only the messages for summary
  //       const summary = invalidBarcodes.map(i => i.message).join(', ');
  //       errorBarcodes.push(`Invalid barcodes found: ${summary}`);
  //     }

  //     // ✅ Convert to a simple lookup for faster Excel field checking
  //     const errorBarcodeMap = new Map();

  //     for (const err of invalidBarcodes) {
  //       const key = `${err.barcode}_${err.field}`;
  //       errorBarcodeMap.set(key, true);
  //     }

  //     for (const err of duplicateBarcodes) {
  //       const key = `${err.barcode}_${err.field}`;
  //       errorBarcodeMap.set(key, true);
  //     }

  //     console.log("🚨 Barcode Error Map:", [...errorBarcodeMap.keys()]);

  //     // ✅ Helper to safely return string
  //     const safeString = (val) => (typeof val === "string" ? val : (val != null ? String(val) : ""));

  //     // ✅ Transform data with error mapping
  //     const result = excelData.map(item => {
  //       const fields = ["Barcode", "Barcode1", "Barcode2", "Barcode3", "Barcode4"];

  //       // create barcode field objects dynamically
  //       const barcodeFields = {};
  //       for (const f of fields) {
  //         const key = `${safeString(item[f])}_${f}`;
  //         barcodeFields[f] = {
  //           value: safeString(item[f]),
  //           error: errorBarcodeMap.has(key), // ✅ now checks by field + barcode
  //         };
  //       }

  //       return {
  //         ...item,
  //         Product_Code: {
  //           value: safeString(item.Product_Code),
  //           error: errorCodes.includes(safeString(item.Product_Code))
  //         },
  //         Product_Name: {
  //           value: safeString(item.Product_Name),
  //           error: errorNames.some(name => normalize(name) === normalize(safeString(item.Product_Name)))
  //         },
  //         MRP: { value: safeString(item.MRP), error: false },
  //         CESS: { value: safeString(item.CESS), error: false },
  //         VAT: { value: safeString(item.VAT), error: false },
  //         Main_Category: {
  //           value: safeString(item.Main_Category),
  //           error: errorCategoryNames.some(name => normalize(name) === normalize(safeString(item.Main_Category)))
  //         },
  //         Sub_Category: {
  //           value: safeString(item.Sub_Category),
  //           error: errorSubCategoryNames.some(entry => {
  //             const subName = typeof entry === "string" ? entry : entry.subName;
  //             return normalize(subName) === normalize(safeString(item.Sub_Category));
  //           })
  //         },
  //         Merchandise: {
  //           value: safeString(item.Merchandise),
  //           error: errorMerchantCategoryNames.some(name => normalize(name) === normalize(safeString(item.Merchandise)))
  //         },
  //         Brand: {
  //           value: safeString(item.Brand),
  //           error: errorBrandNames.some(name => normalize(name) === normalize(safeString(item.Brand)))
  //         },
  //         BrandCompany: {
  //           value: safeString(item.BrandCompany),
  //           error: errorBrandCompanyNames.some(name => normalize(name) === normalize(safeString(item.BrandCompany)))
  //         },
  //         Unit: {
  //           value: safeString(item.Unit),
  //           error: errorUOMNames.some(name => normalize(name) === normalize(safeString(item.Unit)))
  //         },
  //         HSN: { value: safeString(item.HSN), error: false },
  //         Batch: { value: safeString(item.Batch), error: false },

  //         // ✅ dynamically inject barcode errors
  //         ...barcodeFields
  //       };
  //     });


  //     await trx.commit();

  //     return result;

  //   } catch (error) {
  //     // Rollback transaction in case of any failure
  //     await trx.rollback();
  //     console.error("Transaction Failed:", error);

  //     if (error._code == 404 || error._code == 400) {
  //       throw error;
  //     }

  //     // Default to internal server error if it's not a known custom error
  //     throw CustomError.create({
  //       httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //       message: "Product excel import failed.",
  //       property: "",
  //       code: "EXCEL_IMPORT_FAILED"
  //     });

  //   }
  // }

  async function postItemExcelValidation({ body, params, logTrace }) {
    const knex = this;
    const { company_id, status, type_id } = params;

    // Load excel
    const { uploadExcelData } = excelImportRepo(fastify);
    const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });

    const excelColumns = excelColumnData.headers;
    const excelData = excelColumnData.data;

    try {
      const errorCodes = [];
      const errorNames = [];
      const errorCategoryNames = [];
      const errorSubCategoryNames = [];
      const errorBrandNames = [];
      const errorBrandCompanyNames = [];
      const errorUOMNames = [];
      const errorMerchantCategoryNames = [];
      const errorBarcodes = [];
      const typeMismatchCodes = [];

      // -------------------------
      // Step 1: Required columns
      // -------------------------
      const requiredColumns = [
        "Product_Code", "Product_Name", "MRP", "GST", "CESS",
        "Main_Category", "Sub_Category", "Merchandise", "Brand", "BrandCompany",
        "Unit", "HSN", "Batch",
        "Barcode", "Barcode1", "Barcode2", "Barcode3", "Barcode4"
      ];

      const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
      if (missingColumns.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Missing required columns: ${missingColumns.join(", ")}`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // -------------------------------
      // Step 2: Upload data extracted
      // -------------------------------
      const uploadedCodes = excelData.map(p => String(p.Product_Code).trim());
      const uploadedProductNames = excelData.map(p => String(p.Product_Name).trim().toLowerCase());

      // -------------------------------------
      // Step 5: Get all DB products
      // -------------------------------------
      const dbProductsRaw = await knex(ITEM.NAME)
        .select(ITEM.COLUMNS.PRODUCT_CODE, ITEM.COLUMNS.PRODUCT_NAME, ITEM.COLUMNS.TYPE_ID);

      const dbProductCodes = dbProductsRaw.map(p => p[ITEM.COLUMNS.PRODUCT_CODE]);
      const dbProductNames = dbProductsRaw.map(p => p[ITEM.COLUMNS.PRODUCT_NAME].toLowerCase());

      // ----------------------------------------
      // Step 6: Validate product codes
      // ----------------------------------------
      // Step 7: Check type mismatch (only if status != 1)
      if (Number(status) !== 1) {
        const parsedTypeId = Number(type_id);

        // 🔥 Create a quick lookup map { product_code -> type_id }
        const dbProductTypeMap = new Map(
          dbProductsRaw.map(p => [p.pro_code, p.type_id])
        );

        // 🔥 Loop only uploaded codes (FASTER)
        for (const code of uploadedCodes) {
          const existingType = dbProductTypeMap.get(code);

          if (existingType !== undefined && existingType !== parsedTypeId) {
            typeMismatchCodes.push(code);
          }
        }

        // 🔥 Add mismatched codes to errorCodes
        if (typeMismatchCodes.length > 0) {
          errorCodes.push(...typeMismatchCodes);
        }
      }

      // ----------------------------------------
      // Step 7: Validate Type mismatch
      // ----------------------------------------
      if (Number(status) !== 1) {
        const parsedTypeId = Number(type_id);

        for (const product of dbProductsRaw) {
          if (uploadedCodes.includes(product.product_code)) {
            if (product.type_id !== parsedTypeId) {
              typeMismatchCodes.push(product.product_code);
            }
          }
        }

        errorCodes.push(...typeMismatchCodes);
      }

      // ----------------------------------------
      // Step 8: Validate product name duplicates
      // ----------------------------------------
      if (Number(status) === 1) {
        const duplicateNames = uploadedProductNames.filter(name => dbProductNames.includes(name));
        errorNames.push(...duplicateNames);
      }

      // Helper → Fetch categories in safe chunks
      async function fetchInChunks(trx, table, column, values, chunkSize = 300) {
        const result = [];

        for (let i = 0; i < values.length; i += chunkSize) {
          const chunk = values.slice(i, i + chunkSize);

          const placeholders = chunk.map(() => '?').join(',');

          const rows = await trx(table)
            .select("id", column)
            .whereRaw(`LOWER(TRIM(${column})) IN (${placeholders})`, chunk);

          result.push(...rows);
        }

        return result;
      }


      // ----------------------------------------
      // CATEGORY CHECK (Optimized)
      // ----------------------------------------
      const categoryNames = [...new Set(
        excelData.map(p => String(p.Main_Category || "").trim().toLowerCase()).filter(Boolean)
      )];

      const existingCategories = await fetchInChunks(
        knex,
        MAIN_CATEGORY.NAME,
        MAIN_CATEGORY.COLUMNS.CATEGORY_NAME,
        categoryNames
      );

      const categoryMap = new Map(
        existingCategories.map(c => [
          String(c.category_name).trim().toLowerCase(),
          c.id
        ])
      );

      const missingCategories = categoryNames.filter(n => !categoryMap.has(n));

      if (missingCategories.length > 0) {
        errorCategoryNames.push(`Main Category Not Found: ${missingCategories.join(", ")}`);
      }

      // ----------------------------------------
      // SUBCATEGORY CHECK
      // ----------------------------------------
      const subCategoryKeys = [...new Set(
        excelData.map(row => {
          const subName = String(row.Sub_Category).trim().toLowerCase();
          const main = String(row.Main_Category).trim().toLowerCase();

          const catId = categoryMap.get(main);
          if (!subName || !catId) return null;

          return `${subName}|${catId}`;
        }).filter(Boolean)
      )];

      const subCategoryData = await knex(SUB_CATEGORY.NAME)
        .select("id", "subcategory_name", "category_id");

      const subCategoryMap = new Map(
        subCategoryData.map(s => [
          `${String(s.subcategory_name).trim().toLowerCase()}|${s.category_id}`,
          s.id
        ])
      );

      const missingSubcategories = subCategoryKeys.filter(k => !subCategoryMap.has(k));

      if (missingSubcategories.length > 0) {
        errorSubCategoryNames.push(...missingSubcategories);
      }

      /**
 * Generic helper to validate names against DB (case-insensitive)
 */
      async function validateNames({
        trx,
        excelData,
        excelKey,
        tableName,
        dbColumn,
        idColumn,
        errorCollector
      }) {
        // Extract names from Excel
        const rawNames = excelData.map(p => p[excelKey]);
        const normalizedNames = rawNames.map(n => String(n).trim().toLowerCase());

        // Fetch existing rows
        const existingRows = await trx(tableName)
          .select(idColumn, dbColumn)
          .whereRaw(
            `LOWER(TRIM(??)) IN (${normalizedNames.map(() => '?').join(',')})`,
            [dbColumn, ...normalizedNames]
          );

        // Map for fast lookup
        const existingMap = new Map(
          existingRows.map(r => [
            String(r[dbColumn]).trim().toLowerCase(),
            r[idColumn]
          ])
        );

        // Find missing
        const missing = rawNames.filter(
          name => !existingMap.has(String(name).trim().toLowerCase())
        );

        if (missing.length > 0) {
          errorCollector.push(...missing);
        }

        return existingMap;
      }

      // ----------------------------------------
      // BRAND / UOM / MERCHANDISE checks
      // ----------------------------------------
      await validateNames({
        trx: knex,
        excelData,
        excelKey: "Brand",
        tableName: HEADS.NAME,
        dbColumn: HEADS.COLUMNS.CATEOGORY_NAME,
        idColumn: HEADS.COLUMNS.ID,
        errorCollector: errorBrandNames
      });

      await validateNames({
        trx: knex,
        excelData,
        excelKey: "BrandCompany",
        tableName: TYPEDESIGN.NAME,
        dbColumn: TYPEDESIGN.COLUMNS.TYPE_NAME,
        idColumn: TYPEDESIGN.COLUMNS.ID,
        errorCollector: errorBrandCompanyNames
      });

      await validateNames({
        trx: knex,
        excelData,
        excelKey: "Unit",
        tableName: UNITS.NAME,
        dbColumn: UNITS.COLUMNS.UNITS_SHORT_NAME,
        idColumn: UNITS.COLUMNS.ID,
        errorCollector: errorUOMNames
      });

      await validateNames({
        trx: knex,
        excelData,
        excelKey: "Merchandise",
        tableName: MERCHANT_CATEGORY.NAME,
        dbColumn: MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME,
        idColumn: MERCHANT_CATEGORY.COLUMNS.ID,
        errorCollector: errorMerchantCategoryNames
      });


      // ----------------------------------------
      // BARCODE CHECK
      // ----------------------------------------
      const uploadedBarcodes = [];
      for (const p of excelData) {
        const productCode = String(p.Product_Code || "").trim();
        for (const field of ["Barcode", "Barcode1", "Barcode2", "Barcode3", "Barcode4"]) {
          const bc = String(p[field] || "").trim();
          if (bc) uploadedBarcodes.push({ barcode: bc, product_code: productCode, field });
        }
      }

      // Duplicate barcode check within Excel
      const duplicates = findDuplicateBarcodes(uploadedBarcodes);
      if (duplicates.length > 0) {
        errorBarcodes.push(...duplicates);
      }

      // DB barcode check
      const invalidBarcodes = await validateBarcodeDB(knex, uploadedBarcodes, dbProductCodes);
      if (invalidBarcodes.length > 0) {
        errorBarcodes.push(...invalidBarcodes);
      }

      // ----------------------------------------
      // FINAL RESPONSE TRANSFORMATION
      // ----------------------------------------
      const result = transformExcelResult({
        excelData,
        errorCodes,
        errorNames,
        errorCategoryNames,
        errorSubCategoryNames,
        errorBrandNames,
        errorBrandCompanyNames,
        errorUOMNames,
        errorMerchantCategoryNames,
        errorBarcodes
      });

      return result;

    } catch (error) {
      console.error("Validation Failed:", error);
      if (error._code == 404 || error._code == 400) {
        throw error;
      }

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Product excel import failed.",
        code: "EXCEL_IMPORT_FAILED"
      });
    }
  }


  async function postItemImportRepo({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    const { company_id, status, type_id } = params;
    const { uploadExcelData } = excelImportRepo(fastify);
    const excelColumnData = await uploadExcelData.call(knex, {
      body,
      params,
      logTrace
    });
    const excelColumns = excelColumnData.headers;
    const excelData = excelColumnData.data;
    const { outlet, warehouse, company } = body;

    const parseIfArrayOrJSON = (input) => {
      const value = input?.value ?? input;

      // Handle arrays directly
      if (Array.isArray(value)) return value;

      // If it's already a plain object, return it
      if (typeof value === 'object' && value !== null) return value;

      try {
        if (typeof value === "string") {
          if (value.trim() === '[object Object]') {
            console.warn("Received invalid stringified object. Please check data source.");
            return {};
          }

          // Try to fix unquoted keys
          const fixed = value.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
          return JSON.parse(fixed);
        }

        return [];
      } catch (e) {
        console.error("Failed to parse input:", value);
        return [];
      }
    };



    const outletDetails = parseIfArrayOrJSON(outlet);
    const warehouseDetails = parseIfArrayOrJSON(warehouse);
    const companyDetails = parseIfArrayOrJSON(company);


    console.log(outletDetails, "outlet");
    console.log(warehouseDetails, "warehouse")
    console.log(companyDetails, "company")

    // get item query
    try {
      const typeMismatchCodes = [];
      const errorMessages = [];

      // Step 1: Define required columns
      const requiredColumns = [
        "Product_Code",
        "Product_Name",
        "MRP",
        "GST",
        "CESS",
        "Main_Category",
        "Sub_Category",
        "Merchandise",
        "Brand",
        "BrandCompany",
        "Unit",
        "HSN",
        "Batch",
        "Barcode",
        "Barcode1",
        "Barcode2",
        "Barcode3",
        "Barcode4"
      ];
      console.log("excelColumns", excelColumns)
      // Step 3: Check if any required column is missing
      const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
      if (missingColumns.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Missing required columns: ${missingColumns.join(", ")}`,
          property: "",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // Step 4: Extract uploaded product codes
      const uploadedCodes = excelData.map(p => String(p.Product_Code).trim());
      const uploadedProductNames = excelData.map(p => String(p.Product_Name).toLowerCase().trim());

      // Step 5: Get existing products from DB
      const dbProductsRaw = await knex(ITEM.NAME)
        .select(ITEM.COLUMNS.PRODUCT_CODE, ITEM.COLUMNS.PRODUCT_NAME, ITEM.COLUMNS.TYPE_ID);

      const dbProductCodes = dbProductsRaw.map(p => p[ITEM.COLUMNS.PRODUCT_CODE]);
      const dbProductNames = dbProductsRaw.map(p => p[ITEM.COLUMNS.PRODUCT_NAME].toLowerCase());

      // Step 6: Validate product codes
      if (Number(status) === 1) {
        // Insert → codes must not exist
        let invalidCodes = uploadedCodes.filter(code => dbProductCodes.includes(code));
        if (invalidCodes.length > 0) {
          errorMessages.push(`Product Code Already Exists: ${invalidCodes.join(', ')}`);
        }
      } else {
        // Update → codes must exist
        let invalidCodes = uploadedCodes.filter(code => !dbProductCodes.includes(code));
        if (invalidCodes.length > 0) {
          errorMessages.push(`Product Code Does Not Exist: ${invalidCodes.join(', ')}`);
        }
      }

      // Step 7: Check type mismatch (only if status != 1)
      const parsedTypeId = Number(type_id);
      if (Number(status) !== 1) {
        for (const product of dbProductsRaw) {
          if (uploadedCodes.includes(product[ITEM.COLUMNS.PRODUCT_CODE])) {
            if (product[ITEM.COLUMNS.TYPE_ID] !== parsedTypeId) {
              typeMismatchCodes.push(product[ITEM.COLUMNS.PRODUCT_CODE]);
            }
          }
        }
        if (typeMismatchCodes.length > 0) {
          errorMessages.push(`Type mismatch for codes: ${typeMismatchCodes.join(', ')}`);
        }
      }

      // Step 8: Check product names
      if (Number(status) === 1) {
        // Insert → names must be unique
        const existingNames = uploadedProductNames.filter(name => dbProductNames.includes(name));
        if (existingNames.length > 0) {
          errorMessages.push(`Product Name Already Exists : ${existingNames.join(', ')}`);
        }
      }


      // Finally, if any errors collected, throw once
      if (errorMessages.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: errorMessages.join(" | "),  // Combine with separator
          code: "VALIDATION_ERRORS"
        });
      }

      // STEP 9: Unique, cleaned category names from Excel
      const categoryNames = [...new Set(
        excelData
          .map(p => String(p.Main_Category || "").trim().toLowerCase())
          .filter(Boolean)
      )];

      // Helper → Fetch categories in safe chunks
      async function fetchInChunks(trx, table, column, values, chunkSize = 300) {
        const result = [];

        for (let i = 0; i < values.length; i += chunkSize) {
          const chunk = values.slice(i, i + chunkSize);

          const placeholders = chunk.map(() => '?').join(',');

          const rows = await trx(table)
            .select("id", column)
            .whereRaw(`LOWER(TRIM(${column})) IN (${placeholders})`, chunk);

          result.push(...rows);
        }

        return result;
      }

      // STEP 10: Fetch existing categories efficiently
      const existingCategoryRows = await fetchInChunks(
        trx,
        MAIN_CATEGORY.NAME,
        MAIN_CATEGORY.COLUMNS.CATEGORY_NAME,
        categoryNames
      );

      // STEP 11: Build map for fast lookup
      const existingCategoryMap = new Map(
        existingCategoryRows.map(c => [
          String(c[MAIN_CATEGORY.COLUMNS.CATEGORY_NAME]).trim().toLowerCase(),
          c[MAIN_CATEGORY.COLUMNS.ID]
        ])
      );

      // STEP 12: Detect missing ones
      const missingCategories = categoryNames.filter(
        name => !existingCategoryMap.has(name)
      );

      // STEP 13: Report missing categories
      if (missingCategories.length > 0) {
        errorMessages.push(`Main Category Not Found: ${missingCategories.join(', ')}`);
      }

      // Step 14: Fetch existing sub category IDs 
      const subCategoryKeysFromExcel = excelData.map(p => {
        const subName = String(p.Sub_Category).trim().toLowerCase();
        const mainName = String(p.Main_Category).trim().toLowerCase();
        const categoryId = existingCategoryMap.get(mainName);
        return {
          key: `${subName}|${categoryId}`,
          subName: p.Sub_Category,
          mainName: p.Main_Category,
          categoryId,
        };
      });

      // Step 15: Validate if any main category is missing before proceeding
      const invalidMainCategories = subCategoryKeysFromExcel.filter(sc => !sc.categoryId);
      if (invalidMainCategories.length > 0) {
        const names = invalidMainCategories.map(i => i.mainName).join(", ");
        errorMessages.push(`Main Category Not Found for: ${names}`)
      }

      // Step 16: Fetch existing subcategories from DB
      const categoryIds = Array.from(existingCategoryMap.values());
      const subCategoryData = await trx(SUB_CATEGORY.NAME)
        .select(
          SUB_CATEGORY.COLUMNS.ID,
          SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME,
          SUB_CATEGORY.COLUMNS.CATEGORY_ID
        )
        .whereIn(SUB_CATEGORY.COLUMNS.CATEGORY_ID, categoryIds);

      // Step 17: Create existing subcategory map for fast lookup
      const existingSubCategoryMap = new Map(
        subCategoryData.map(s => [
          `${String(s[SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME]).trim().toLowerCase()}|${s[SUB_CATEGORY.COLUMNS.CATEGORY_ID]}`,
          s[SUB_CATEGORY.COLUMNS.ID]
        ])
      );

      // Step 18: Validate missing subcategories
      const missingSubcategories = subCategoryKeysFromExcel.filter(
        item => !existingSubCategoryMap.has(item.key)
      );

      if (missingSubcategories.length > 0) {
        const errors = missingSubcategories.map(sc =>
          `SubCategory "${sc.subName}" not found under Main Category "${sc.mainName}"`
        );
        errorMessages.push(...errors);
      }

      // Step-19: Fetch existing brand IDs based on brand names (lowercase + trim)
      const brandNames = excelData.map(p => String(p.Brand).trim().toLowerCase());

      // Fetch existing brands from DB with case-insensitive check
      const existingBrandRows = await trx(HEADS.NAME)
        .select(HEADS.COLUMNS.ID, HEADS.COLUMNS.CATEOGORY_NAME)
        .whereRaw(
          `LOWER(TRIM(??)) IN (${brandNames.map(() => '?').join(',')})`,
          [HEADS.COLUMNS.CATEOGORY_NAME, ...brandNames]
        );

      // Create map of existing brands
      const existingBrandsMap = new Map(
        existingBrandRows.map(b => [
          String(b[HEADS.COLUMNS.CATEOGORY_NAME]).trim().toLowerCase(),
          b[HEADS.COLUMNS.ID]
        ])
      );

      //Find missing brands
      const missingBrands = brandNames.filter(name => !existingBrandsMap.has(name));

      //Throw dynamic error if any brand is missing
      if (missingBrands.length > 0) {
        errorMessages.push(`Brand(s) Not Found: ${missingBrands.join(', ')}`);
      }


      // Step-20: Normalize company brand names from Excel (trim + lowercase)
      const companyBrandNamesRaw = excelData.map(p => p.BrandCompany);
      const normalizedCompanyBrandNames = companyBrandNamesRaw.map(name =>
        String(name).trim().toLowerCase()
      );

      // Step-21: Fetch existing company brand names from DB (case-insensitive)
      const existingCompanyBrandsRows = await trx(TYPEDESIGN.NAME)
        .select(TYPEDESIGN.COLUMNS.ID, TYPEDESIGN.COLUMNS.TYPE_NAME)
        .whereRaw(
          `LOWER(TRIM(??)) IN (${normalizedCompanyBrandNames.map(() => '?').join(',')})`,
          [TYPEDESIGN.COLUMNS.TYPE_NAME, ...normalizedCompanyBrandNames]
        );

      // Step-22: Create a map of existing company brands
      const existingCompanyBrandsMap = new Map(
        existingCompanyBrandsRows.map(b => [
          String(b[TYPEDESIGN.COLUMNS.TYPE_NAME]).trim().toLowerCase(),
          b[TYPEDESIGN.COLUMNS.ID]
        ])
      );

      // Find missing company brand names
      const missingCompanyBrands = normalizedCompanyBrandNames.filter(name => !existingCompanyBrandsMap.has(name));

      // Optional: For better error reporting with original values
      const missingOriginalNames = companyBrandNamesRaw.filter(name =>
        !existingCompanyBrandsMap.has(String(name).trim().toLowerCase())
      );

      // Throw dynamic error if any company brand is missing
      if (missingOriginalNames.length > 0) {
        errorMessages.push(`Company Brand(s) Not Found: ${missingOriginalNames.join(', ')}`);
      }



      //Step-23: Fetch existing unit ids
      const unitNamesRaw = excelData.map(p => p.Unit);
      const normalizedUnitNames = unitNamesRaw.map(name => String(name).trim().toLowerCase());

      // Fetch existing units (case-insensitive)
      const existingUnitRows = await trx(UNITS.NAME)
        .select(UNITS.COLUMNS.ID, UNITS.COLUMNS.UNITS_SHORT_NAME)
        .whereRaw(
          `LOWER(TRIM(${UNITS.COLUMNS.UNITS_SHORT_NAME})) IN (${normalizedUnitNames.map(() => '?').join(',')})`,
          normalizedUnitNames
        );

      // Create unit map
      const existingUnitsMap = new Map(
        existingUnitRows.map(u => [
          String(u[UNITS.COLUMNS.UNITS_SHORT_NAME]).trim().toLowerCase(),
          u[UNITS.COLUMNS.ID]
        ])
      );

      // Find missing units
      const missingUnits = unitNamesRaw.filter(
        name => !existingUnitsMap.has(String(name).trim().toLowerCase())
      );

      // Throw error for missing units
      if (missingUnits.length > 0) {
        errorMessages.push(`Unit(s) Not Found: ${missingUnits.join(', ')}`);
      }


      //Step-24: Fetch existing  ids
      // Normalize merchant category names
      const merchantCategoryRaw = excelData.map(p => p.Merchandise);
      const normalizedMerchantNames = merchantCategoryRaw.map(name => String(name).trim().toLowerCase());

      // Fetch existing merchant categories
      const existingMerchantRows = await trx(MERCHANT_CATEGORY.NAME)
        .select(MERCHANT_CATEGORY.COLUMNS.ID, MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME)
        .whereRaw(
          `LOWER(TRIM(${MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME})) IN (${normalizedMerchantNames.map(() => '?').join(',')})`,
          normalizedMerchantNames
        );

      // Create merchant category map
      const existingMerchantCategoryMap = new Map(
        existingMerchantRows.map(m => [
          String(m[MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME]).trim().toLowerCase(),
          m[MERCHANT_CATEGORY.COLUMNS.ID]
        ])
      );

      // Find missing merchant categories
      const missingMerchants = merchantCategoryRaw.filter(
        name => !existingMerchantCategoryMap.has(String(name).trim().toLowerCase())
      );

      // Throw error for missing merchant categories
      if (missingMerchants.length > 0) {
        errorMessages.push(`Merchandise Category(s) Not Found: ${missingMerchants.join(', ')}`);
      }

      // ✅ Step 25: Extract all uploaded barcodes (remove blanks)
      const uploadedBarcodes = [];

      for (const p of excelData) {
        const productCode = String(p.Product_Code || '').trim();
        const barcodeFields = ["Barcode", "Barcode1", "Barcode2", "Barcode3", "Barcode4"];

        for (const field of barcodeFields) {
          const cleanBarcode = String(p[field] || '').trim();

          if (cleanBarcode.length > 0) {
            uploadedBarcodes.push({
              barcode: cleanBarcode,
              product_code: productCode,
              field_name: field, // 👈 track which column
            });
          }
        }
      }

      console.log(uploadedBarcodes, "→ uploaded barcodes");

      // ✅ Step 25.1: Detect duplicate barcodes inside Excel
      const seenBarcodes = new Map();
      const duplicateBarcodes = [];

      for (const { barcode, product_code, field_name } of uploadedBarcodes) {
        const cleanBarcode = barcode.trim();

        if (seenBarcodes.has(cleanBarcode)) {
          const firstEntry = seenBarcodes.get(cleanBarcode);
          duplicateBarcodes.push({
            barcode: cleanBarcode,
            message: `${cleanBarcode} duplicated in Excel for product_code ${product_code}`,
            field: field_name,
          });
        } else {
          seenBarcodes.set(cleanBarcode, { product_code, field_name });
        }
      }

      if (duplicateBarcodes.length > 0) {
        console.log(duplicateBarcodes, "→ duplicate barcodes in Excel");
        const shortMsg = duplicateBarcodes.map(i => i.message).join(', ');
        errorMessages.push(`Duplicate barcodes : ${shortMsg}`);
      }

      // ✅ Step 26: Fetch DB barcodes
      const dbBarcodeRaw = await trx(BARCODE_LIST.NAME).select(
        BARCODE_LIST.COLUMNS.ID,
        BARCODE_LIST.COLUMNS.BARCODE,
        BARCODE_LIST.COLUMNS.PRODUCT_CODE
      );

      // ✅ Convert DB data into a map for fast lookup
      const dbBarcodeMap = new Map(
        dbBarcodeRaw.map(p => [
          String(p[BARCODE_LIST.COLUMNS.BARCODE]).trim(),
          String(p[BARCODE_LIST.COLUMNS.PRODUCT_CODE]).trim(),
        ])
      );

      const invalidBarcodes = [];

      for (const { barcode, product_code, field_name } of uploadedBarcodes) {
        const cleanBarcode = String(barcode).trim();
        const cleanProductCode = String(product_code).trim();
        const dbProductCode = dbBarcodeMap.get(cleanBarcode);
        const isProductCodeAvailable = dbProductCodes.includes(cleanBarcode); // ✅ Check if product_code exists in DB


        // ✅ Condition 1: Barcode already linked to another product in DB
        if (dbProductCode && dbProductCode !== cleanProductCode) {
          invalidBarcodes.push({
            barcode: cleanBarcode,
            message: `${cleanBarcode} already linked in DB to product_code ${dbProductCode}`,
            field: field_name,
          });
          continue;
        }

        // ✅ Condition 2: Excel mismatch (barcode ≠ product_code)
        // 👉 Only check if product_code exists in DB
        if (isProductCodeAvailable && cleanBarcode !== cleanProductCode) {
          invalidBarcodes.push({
            barcode: cleanBarcode,
            message: `${cleanBarcode} Excel mismatch — got product_code ${cleanProductCode}`,
            field: field_name,
          });
        }

        console.log(dbProductCode, cleanProductCode, "→ barcode check details");
      }

      // ✅ Step 27: Throw error if any invalid barcodes found
      if (invalidBarcodes.length > 0) {
        const shortMsg = invalidBarcodes.map(i => i.message).join(', ');
        errorMessages.push(`Invalid barcodes: ${shortMsg}`);
      }

      // ✅ Final throw at the end
      if (errorMessages.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: errorMessages.join(" | "), // Combine all error messages
          code: "VALIDATION_ERRORS",
        });
      }

      const productsToInsert = [];
      const productsEditToInsert = [];
      const outletMappings = [];
      const warehouseMappings = [];
      const companyMappings = [];
      const barcodeMappings = [];
      const productsToUpdate = [];
      const outletMappingKeySet = new Set();   // prevent duplicate inserts
      const itemEditKeySet = new Set();        // prevent duplicate item_edit inserts


      // Step 25: Get current max ID once (only if you need to assign IDs manually)
      const result = await knex(ITEM.NAME).max("id as max_id");
      let maxId = result?.[0]?.max_id ?? 0;
      const result2 = await knex(ITEM.NAME).max("outlet_product_id as max_id");
      let outletProductMaxId = result2?.[0]?.max_id ?? 0;
      // Step 26: Process each product and its variants
      for (const product of excelData) {
        const {
          Product_Code,
          Product_Name,
          MRP,
          GST,
          CESS,
          Main_Category,
          Sub_Category,
          Merchandise,
          Brand,
          BrandCompany,
          Unit,
          HSN,
          Batch,
          Expiry_Type,
          Expiry_Value,
          Barcode,
          Barcode1,
          Barcode2,
          Barcode3,
          Barcode4
        } = product;

        const rawBarcodes = [Barcode, Barcode1, Barcode2, Barcode3, Barcode4];
        const barcodeDetails = rawBarcodes
          .map(code => ({ barcode: String(code || '').trim() }))

        console.log(`Processing product: ${Product_Code}`);

        const normalizedMainCategory = String(Main_Category).trim().toLowerCase();
        const existingCategoryId = existingCategoryMap.get(normalizedMainCategory);

        const normalizedSubCategoryKey = `${String(Sub_Category).trim().toLowerCase()}|${existingCategoryId}`;
        const existingSubCategoryId = existingSubCategoryMap.get(normalizedSubCategoryKey);

        const existingBrandId = existingBrandsMap.get(String(Brand).trim().toLowerCase());
        const existingCompanyBrandId = existingCompanyBrandsMap.get(String(BrandCompany).trim().toLowerCase());
        const existingMerchantId = existingMerchantCategoryMap.get(String(Merchandise).trim().toLowerCase());
        const existingUnitId = existingUnitsMap.get(String(Unit).trim().toLowerCase());

        const productDataObject = {
          [ITEM.COLUMNS.PRODUCT_CODE]: String(Product_Code),
          [ITEM.COLUMNS.SHORT_NAME]: String(Product_Name)?.trim() || null,
          [ITEM.COLUMNS.PRO_DESCRIPTION]: String(Product_Name)?.trim() || null,
          [ITEM.COLUMNS.REGIONAL_NAME]: String(Product_Name)?.trim() || null,
          [ITEM.COLUMNS.PRODUCT_NAME]: String(Product_Name)?.trim() || null,
          [ITEM.COLUMNS.COMPANY_ID]: company_id || 1,
          [ITEM.COLUMNS.TYPE_ID]: type_id || 0,
          [ITEM.COLUMNS.MAIN_CATEGORY_ID]: existingCategoryId || 0,
          [ITEM.COLUMNS.MERCHANT_CATEGORY_ID]: existingMerchantId || 0,
          [ITEM.COLUMNS.SUB_CATEGORY_ID]: existingSubCategoryId || 0,
          [ITEM.COLUMNS.HEAD_ID]: existingBrandId || 0,
          [ITEM.COLUMNS.TYPEDESIGN_ID]: existingCompanyBrandId || 0,
          [ITEM.COLUMNS.MAIN_UOM_ID]: existingUnitId || 0,
          [ITEM.COLUMNS.UOM_ID]: existingUnitId || 0,
          [ITEM.COLUMNS.MRP]: MRP,
          [ITEM.COLUMNS.PURCHASE_RATE]: 0,
          [ITEM.COLUMNS.SALE_RATE]: MRP,
          [ITEM.COLUMNS.WHOLESALE_RATE]: 0,
          [ITEM.COLUMNS.GST]: GST,
          [ITEM.COLUMNS.CESS]: CESS,
          [ITEM.COLUMNS.HSN]: HSN,
          [ITEM.COLUMNS.OPENING_STOCK]: 0,
          [ITEM.COLUMNS.BALANCE]: 0,
          [ITEM.COLUMNS.MIN_STOCK]: 0,
          [ITEM.COLUMNS.INCHARGE_ID]: 0,
          [ITEM.COLUMNS.TRAY_ID]: 0,
          [ITEM.COLUMNS.EXPIRY_TYPE_ID]: Expiry_Type === "Month"
            ? 1 : Expiry_Type === "Days" ? 2 : 1,
          [ITEM.COLUMNS.EXPIRY_VALUE]: String(Expiry_Value || 1),
          [ITEM.COLUMNS.MBQ]: 0,
          [ITEM.COLUMNS.SHRINKAGE]: 0,
          [ITEM.COLUMNS.CASE_QTY]: 1,
          [ITEM.COLUMNS.PUTAWAY]: 0,
          [ITEM.COLUMNS.BULK_ITEM]: false,
          [ITEM.COLUMNS.RETURNABLE_ITEM]: false,
          [ITEM.COLUMNS.PURCHASE]: true,
          [ITEM.COLUMNS.MIN_STOCK_WARNING]: false,
          [ITEM.COLUMNS.BATCH_ITEM]: String(Batch) === "Y" ? true : false,
          [ITEM.COLUMNS.ALLOW_NEG_STK]: false,
          [ITEM.COLUMNS.GST_INCLUSIVE]: false,
          [ITEM.COLUMNS.SALES_MARGIN_NEW]: false,
          [ITEM.COLUMNS.WSCALE]: false,
          [ITEM.COLUMNS.CONVERSION_FACTOR]: 1,
          [ITEM.COLUMNS.DISCOUNT]: 0,
          [ITEM.COLUMNS.MAIN_PRODUCT_ID]: 0,
          [ITEM.COLUMNS.MAIN_PRODUCT_QTY]: 0,
          [ITEM.COLUMNS.PARENT_PRODUCT_ID]: 0,
          [ITEM.COLUMNS.PRODUCT_WEIGHT]: 0,
          [ITEM.COLUMNS.PACK_PRODUCT_ID]: 0,
          [ITEM.COLUMNS.PACK_QTY]: 0,
          [ITEM.COLUMNS.SESSION_ID]: 0,
          [ITEM.COLUMNS.PRIORITY]: 0,
          [ITEM.COLUMNS.IS_ACTIVE]: true,
          [ITEM.COLUMNS.CREATED_BY]: userDetails.id
        };

        const outletProductObject = {
          [OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_RATE]: 0,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE]: MRP,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.MRP]: MRP,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.GST]: GST,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.CESS]: CESS,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.HSN]: HSN,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.MBQ]: 0,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.MBQ_DAYS]: 0,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_MARGIN]: 0,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.BARCODE]: Barcode || '',
          [OUTLET_PRODUCT_MAPPING.COLUMNS.BARCODE1]: Barcode1 || '',
          [OUTLET_PRODUCT_MAPPING.COLUMNS.BARCODE2]: Barcode2 || '',
          [OUTLET_PRODUCT_MAPPING.COLUMNS.BARCODE3]: Barcode3 || '',
          [OUTLET_PRODUCT_MAPPING.COLUMNS.BARCODE4]: Barcode4 || '',
          [OUTLET_PRODUCT_MAPPING.COLUMNS.PACK_QTY]: outlet.pack_qty || 0,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: outlet.outlet_opng_stock || 0,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: outlet.outlet_balnc_stock || 0,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK]: outlet.outlet_min_stock || 0,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK]: outlet.outlet_allow_neg_stk ?? false,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE]: outlet.outlet_wscale ?? false,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE]: true,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_NON_SALEABLE]: true,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: company_id
        };

        const itemEditObject = {
          [ITEM_EDIT.COLUMNS.CLIENT_ID]: 1,
          [ITEM_EDIT.COLUMNS.PRODUCT_CODE]: String(Product_Code),
          [ITEM_EDIT.COLUMNS.PRODUCT_NAME]: String(Product_Name)?.trim() || null,
          [ITEM_EDIT.COLUMNS.PRODUCT_TYPE_ID]: type_id || 0,
          [ITEM_EDIT.COLUMNS.MAIN_CATEGORY_ID]: existingCategoryId || 0,
          [ITEM_EDIT.COLUMNS.MERCHANT_CATEGORY_ID]: existingMerchantId || 0,
          [ITEM_EDIT.COLUMNS.SUB_CATEGORY_ID]: existingSubCategoryId || 0,
          [ITEM_EDIT.COLUMNS.BRAND_ID]: existingBrandId || 0,
          [ITEM_EDIT.COLUMNS.BRAND_COMPANY_ID]: existingCompanyBrandId || 0,
          [ITEM_EDIT.COLUMNS.UOM_ID]: existingUnitId || 0,
          [ITEM_EDIT.COLUMNS.MRP]: MRP,
          [ITEM_EDIT.COLUMNS.SALE_RATE]: MRP,
          [ITEM_EDIT.COLUMNS.GST]: GST,
          [ITEM_EDIT.COLUMNS.CESS]: CESS,
          [ITEM_EDIT.COLUMNS.HSN]: HSN,
          [ITEM_EDIT.COLUMNS.BATCH_ITEM]: String(Batch) === "Y",
          [ITEM_EDIT.COLUMNS.BARCODE]: Barcode || '',
          [ITEM_EDIT.COLUMNS.BARCODE1]: Barcode1 || '',
          [ITEM_EDIT.COLUMNS.BARCODE2]: Barcode2 || '',
          [ITEM_EDIT.COLUMNS.BARCODE3]: Barcode3 || '',
          [ITEM_EDIT.COLUMNS.BARCODE4]: Barcode4 || ''
        };

        console.log(`Processing Max product id: ${maxId}`);
        switch (Number(status)) {
          case 1:
            console.log("insert");

            // 1️⃣ Generate new IDs
            maxId++;
            outletProductMaxId++;
            const newProductId = maxId;
            const newOutletProductId = outletProductMaxId;

            // 2️⃣ Insert product with outlet_product_id
            productsToInsert.push({
              ...productDataObject,
              [ITEM.COLUMNS.CREATED_AT]: new Date(),
              [ITEM.COLUMNS.ID]: newProductId,
              [ITEM.COLUMNS.OUTLET_PRODUCT_ID]: newOutletProductId, // ✅ store same ID
            });

            // 3️⃣ Prepare outlet mapping rows
            if (outletDetails?.length > 0) {
              console.log("outlet");

              // Step 1: Get next outlet mapping sequence
              for (const outlet of outletDetails) {
                const outletId = outlet.outlet_id;

                // Step 2: Check existing outlet mapping
                const existingOutletMapping = await trx(OUTLET_PRODUCT_MAPPING.NAME)
                  .where({
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outletId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: company_id,
                  })
                  .first();

                let shouldAddToItemEdit = false;

                if (existingOutletMapping) {
                  // ✅ Case 1: Mapping already exists
                  if (existingOutletMapping) {
                    // Reactivate inactive mapping
                    await trx(OUTLET_PRODUCT_MAPPING.NAME)
                      .where({ [OUTLET_PRODUCT_MAPPING.COLUMNS.ID]: existingOutletMapping.id })
                      .update({
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
                      });

                    shouldAddToItemEdit = true; // only add if it was reactivated
                  }
                } else {
                  // ✅ Case 2: Insert new mapping
                  outletMappings.push({
                    ...outletProductObject,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID]: newOutletProductId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: newProductId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outletId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_AT]: new Date(),
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true
                  });

                  shouldAddToItemEdit = true; // only add for new mappings
                }

                // ✅ Add to ITEM_EDIT only for reactivated or new mappings
                if (shouldAddToItemEdit) {
                  // 🔍 Check if ITEM_EDIT already exists
                  const existingEdit = await trx(ITEM_EDIT.NAME)
                    .where({
                      [ITEM_EDIT.COLUMNS.PRODUCT_ID]: newProductId,
                      [ITEM_EDIT.COLUMNS.LOCATION_ID]: outletId,
                      [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: newOutletProductId
                    })
                    .first();

                  // CASE 1: Exists and is_inserted = true → skip
                  if (existingEdit) {
                    await trx(ITEM_EDIT.NAME)
                      .where({ [ITEM_EDIT.COLUMNS.ID]: existingEdit.id })
                      .update({
                        ...itemEditObject,
                        [ITEM_EDIT.COLUMNS.MODE]: 0,
                        [ITEM_EDIT.COLUMNS.STATUS]: 0,
                        [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                        [ITEM_EDIT.COLUMNS.IS_INSERTED]: false,
                        [ITEM_EDIT.COLUMNS.UPDATED_AT]: new Date(),
                        [ITEM_EDIT.COLUMNS.UPDATED_BY]: userDetails.id,
                      });

                    continue; // Do not insert below
                  }


                  // CASE 2: No row exists → INSERT new
                  productsEditToInsert.push({
                    ...itemEditObject,
                    [ITEM_EDIT.COLUMNS.LOCATION_ID]: outletId,
                    [ITEM_EDIT.COLUMNS.PRODUCT_ID]: newProductId,
                    [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: newOutletProductId,
                    [ITEM_EDIT.COLUMNS.MODE]: 0,
                    [ITEM_EDIT.COLUMNS.STATUS]: 0,
                    [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                    [ITEM_EDIT.COLUMNS.CREATED_AT]: new Date(),
                    [ITEM_EDIT.COLUMNS.CREATED_BY]: userDetails.id,
                    [ITEM_EDIT.COLUMNS.IS_INSERTED]: false
                  });
                }
              }
            }

            // 4 Prepare warehouse mapping rows
            if (warehouseDetails?.length > 0) {
              console.log("warehouse");

              // Step 1: Get next warehouse mapping sequence
              // const result = await trx.raw(`SELECT nextval('warehouse_products_mapping_id_seq')`);
              // let nextId = Number(result.rows?.[0]?.nextval || 1);

              for (const wh of warehouseDetails) {
                const warehouseId = wh.warehouse_id;

                // Step 2: Check existing warehouse mapping
                const existingWarehouseMapping = await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
                  .where({
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouseId,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: company_id,
                  })
                  .first();

                let shouldAddToItemEdit = false;

                if (existingWarehouseMapping) {
                  // ✅ Case 1: Mapping already exists
                  if (existingWarehouseMapping) {
                    // Reactivate inactive mapping
                    await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
                      .where({ [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.ID]: existingWarehouseMapping.id })
                      .update({
                        [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true,
                        [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
                        [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
                      });

                    shouldAddToItemEdit = true; // only add if it was reactivated
                  }
                } else {
                  // ✅ Case 2: Insert new mapping
                  warehouseMappings.push({
                    // [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.ID]: nextId++,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: newProductId,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouseId,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: company_id,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_AT]: new Date(),
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true
                  });

                  shouldAddToItemEdit = true; // only add for new mappings
                }

                // ✅ Add to ITEM_EDIT only for reactivated or new mappings
                if (shouldAddToItemEdit) {
                  // 🔍 Check if ITEM_EDIT already exists
                  const existingEdit = await trx(ITEM_EDIT.NAME)
                    .where({
                      [ITEM_EDIT.COLUMNS.PRODUCT_ID]: newProductId,
                      [ITEM_EDIT.COLUMNS.LOCATION_ID]: -warehouseId,
                      [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: newOutletProductId
                    })
                    .first();

                  // CASE 1: Exists and is_inserted = true → skip
                  if (existingEdit) {
                    await trx(ITEM_EDIT.NAME)
                      .where({ [ITEM_EDIT.COLUMNS.ID]: existingEdit.id })
                      .update({
                        ...itemEditObject,
                        [ITEM_EDIT.COLUMNS.MODE]: 0,
                        [ITEM_EDIT.COLUMNS.STATUS]: 0,
                        [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                        [ITEM_EDIT.COLUMNS.IS_INSERTED]: false,
                        [ITEM_EDIT.COLUMNS.UPDATED_AT]: new Date(),
                        [ITEM_EDIT.COLUMNS.UPDATED_BY]: userDetails.id,
                      });

                    continue; // Do not insert below
                  }


                  // CASE 2: No row exists → INSERT new
                  productsEditToInsert.push({
                    ...itemEditObject,
                    [ITEM_EDIT.COLUMNS.LOCATION_ID]: -warehouseId,
                    [ITEM_EDIT.COLUMNS.PRODUCT_ID]: newProductId,
                    [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: newOutletProductId,
                    [ITEM_EDIT.COLUMNS.MODE]: 0,
                    [ITEM_EDIT.COLUMNS.STATUS]: 0,
                    [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                    [ITEM_EDIT.COLUMNS.CREATED_AT]: new Date(),
                    [ITEM_EDIT.COLUMNS.CREATED_BY]: userDetails.id,
                    [ITEM_EDIT.COLUMNS.IS_INSERTED]: false
                  });
                }
              }
            }

            // ✅ Step 5: Prepare Company mapping rows
            if (companyDetails?.length > 0) {
              console.log("company");

              // Step 1: Get next company mapping sequence
              // const seqResult = await trx.raw(`SELECT nextval('company_products_mapping_id_seq')`);
              // let nextCompanyId = Number(seqResult.rows?.[0]?.nextval || 1);

              for (const comp of companyDetails) {
                const compId = comp.company_id ?? company_id;

                // Step 2: Check if mapping already exists
                const existingMapping = await trx(COMPANY_PRODUCTS_MAPPING.NAME)
                  .where({
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: compId,
                  })
                  .first();

                if (existingMapping) {
                  // ✅ Case 1: Already exists — reactivate if inactive
                  if (!existingMapping.is_active) {
                    await trx(COMPANY_PRODUCTS_MAPPING.NAME)
                      .where({ [COMPANY_PRODUCTS_MAPPING.COLUMNS.ID]: existingMapping.id })
                      .update({
                        [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true,
                        [COMPANY_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
                        [COMPANY_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
                      });
                  }
                } else {
                  // ✅ Case 2: Insert new mapping
                  companyMappings.push({
                    // [COMPANY_PRODUCTS_MAPPING.COLUMNS.ID]: nextCompanyId++,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: newProductId,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: compId,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_AT]: new Date(),
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true
                  });
                }
              }
            }


            // ✅ Step 6: Prepare Barcode Details rows
            if (barcodeDetails?.length > 0) {
              console.log("Processing Barcodes for:", Product_Code);

              for (const b of barcodeDetails) {
                const code = String(b?.barcode || '').trim();
                if (!code) continue; // skip empty

                // Step 2: Check if barcode already exists
                const existingBarcode = await trx(BARCODE_LIST.NAME)
                  .where({
                    [BARCODE_LIST.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [BARCODE_LIST.COLUMNS.BARCODE]: code,
                    [BARCODE_LIST.COLUMNS.COMPANY_ID]: company_id,
                  })
                  .first();

                if (existingBarcode) {
                  // ✅ Case 1: Already exists — reactivate if inactive
                  if (!existingBarcode.is_active) {
                    await trx(BARCODE_LIST.NAME)
                      .where({ [BARCODE_LIST.COLUMNS.ID]: existingBarcode.id })
                      .update({
                        [BARCODE_LIST.COLUMNS.IS_ACTIVE]: true,
                        [BARCODE_LIST.COLUMNS.UPDATED_AT]: new Date(),
                        [BARCODE_LIST.COLUMNS.UPDATED_BY]: userDetails.id,
                      });
                  }
                } else {
                  // ✅ Case 2: Insert new barcode mapping
                  barcodeMappings.push({
                    [BARCODE_LIST.COLUMNS.PROD_ID]: newProductId,
                    [BARCODE_LIST.COLUMNS.OUTLET_PRODUCT_ID]: newOutletProductId,
                    [BARCODE_LIST.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [BARCODE_LIST.COLUMNS.BARCODE]: code,
                    [BARCODE_LIST.COLUMNS.COMPANY_ID]: company_id,
                    [BARCODE_LIST.COLUMNS.CREATED_BY]: userDetails.id,
                    [BARCODE_LIST.COLUMNS.CREATED_AT]: trx.fn.now(),
                    [BARCODE_LIST.COLUMNS.IS_ACTIVE]: true,
                  });
                }
              }

              console.log(`✅ Prepared and inserted ${barcodeMappings.length} barcodes for ${Product_Code}`);
            }

            break;
          case 2:
            console.log("update")
            // ✅ Step 1: Get current item info
            const [{ id: update_product_id, outlet_product_id: updatedOutletProductId }] = await trx(ITEM.NAME)
              .select(ITEM.COLUMNS.ID, ITEM.COLUMNS.OUTLET_PRODUCT_ID)
              .where(ITEM.COLUMNS.PRODUCT_CODE, Product_Code)
              .andWhere(ITEM.COLUMNS.COMPANY_ID, company_id)
              .limit(1);

            console.log("update", update_product_id, updatedOutletProductId)
            const updatePayload = {
              [ITEM.COLUMNS.SHORT_NAME]: String(Product_Name)?.trim() || null,
              [ITEM.COLUMNS.PRO_DESCRIPTION]: String(Product_Name)?.trim() || null,
              [ITEM.COLUMNS.REGIONAL_NAME]: String(Product_Name)?.trim() || null,
              [ITEM.COLUMNS.PRODUCT_NAME]: String(Product_Name)?.trim() || null,
              [ITEM.COLUMNS.COMPANY_ID]: company_id || 1,
              [ITEM.COLUMNS.TYPE_ID]: type_id || 0,
              [ITEM.COLUMNS.MAIN_CATEGORY_ID]: existingCategoryId || 0,
              [ITEM.COLUMNS.MERCHANT_CATEGORY_ID]: existingMerchantId || 0,
              [ITEM.COLUMNS.SUB_CATEGORY_ID]: existingSubCategoryId || 0,
              [ITEM.COLUMNS.HEAD_ID]: existingBrandId || 0,
              [ITEM.COLUMNS.TYPEDESIGN_ID]: existingCompanyBrandId || 0,
              [ITEM.COLUMNS.MAIN_UOM_ID]: existingUnitId || 0,
              [ITEM.COLUMNS.UOM_ID]: existingUnitId || 0,
              [ITEM.COLUMNS.MRP]: MRP,
              [ITEM.COLUMNS.GST]: GST,
              [ITEM.COLUMNS.CESS]: CESS,
              [ITEM.COLUMNS.HSN]: HSN,
              [ITEM.COLUMNS.EXPIRY_TYPE_ID]: Expiry_Type === "Month"
                ? 1 : Expiry_Type === "Days" ? 2 : 1,
              [ITEM.COLUMNS.EXPIRY_VALUE]: String(Expiry_Value || 1),
              [ITEM.COLUMNS.BATCH_ITEM]: String(Batch) === "Y" ? true : false
            };

            productsToUpdate.push({
              ...updatePayload,
              [ITEM.COLUMNS.ID]: update_product_id,
              [ITEM.COLUMNS.UPDATED_AT]: new Date(),
              [ITEM.COLUMNS.UPDATED_BY]: userDetails.id
            });

            // 2 Prepare outlet mapping rows
            if (outletDetails?.length > 0) {
              console.log("outlet");
              for (const outlet of outletDetails) {
                const outletId = Number(outlet.outlet_id);
                const companyId = Number(company_id);

                // 🔑 Unique key (must match DB unique index)
                const mappingKey = `${outletId}|${updatedOutletProductId}|${Product_Code}|${companyId}`;

                // 🔍 Step 1: Check existing outlet mapping (MATCH UNIQUE INDEX)
                const existingOutletMapping = await trx(OUTLET_PRODUCT_MAPPING.NAME)
                  .where({
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: update_product_id,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outletId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: companyId,
                  })
                  .first();

                let shouldAddToItemEdit = false;

                // ✅ CASE 1: Mapping exists → UPDATE only
                if (existingOutletMapping) {
                  await trx(OUTLET_PRODUCT_MAPPING.NAME)
                    .where({
                      [OUTLET_PRODUCT_MAPPING.COLUMNS.ID]: existingOutletMapping.id,
                    })
                    .update({
                      ...outletProductObject,
                      [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true,
                      [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
                      [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
                    });

                  shouldAddToItemEdit = true;
                }

                // ✅ CASE 2: Mapping does NOT exist → INSERT (once only)
                else if (!outletMappingKeySet.has(mappingKey)) {
                  outletMappingKeySet.add(mappingKey);

                  outletMappings.push({
                    ...outletProductObject,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: update_product_id,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID]: updatedOutletProductId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outletId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: companyId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_AT]: trx.fn.now(),
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true,
                  });

                  shouldAddToItemEdit = true;
                }

                // 🔁 ITEM_EDIT handling (unique per outlet + product)
                if (shouldAddToItemEdit) {
                  const itemEditKey = `${outletId}|${update_product_id}|${updatedOutletProductId}`;

                  if (!itemEditKeySet.has(itemEditKey)) {
                    itemEditKeySet.add(itemEditKey);

                    const existingEdit = await trx(ITEM_EDIT.NAME)
                      .where({
                        [ITEM_EDIT.COLUMNS.PRODUCT_ID]: update_product_id,
                        [ITEM_EDIT.COLUMNS.LOCATION_ID]: outletId,
                        [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: updatedOutletProductId,
                      })
                      .first();

                    // 🔄 UPDATE existing ITEM_EDIT
                    if (existingEdit) {
                      await trx(ITEM_EDIT.NAME)
                        .where({ [ITEM_EDIT.COLUMNS.ID]: existingEdit.id })
                        .update({
                          ...itemEditObject,
                          [ITEM_EDIT.COLUMNS.MODE]: 1,
                          [ITEM_EDIT.COLUMNS.STATUS]: 0,
                          [ITEM_EDIT.COLUMNS.IS_INSERTED]: false,
                          [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                          [ITEM_EDIT.COLUMNS.UPDATED_AT]: trx.fn.now(),
                          [ITEM_EDIT.COLUMNS.UPDATED_BY]: userDetails.id,
                        });
                    }
                    // ➕ INSERT new ITEM_EDIT
                    else {
                      productsEditToInsert.push({
                        ...itemEditObject,
                        [ITEM_EDIT.COLUMNS.LOCATION_ID]: outletId,
                        [ITEM_EDIT.COLUMNS.PRODUCT_ID]: newProductId,
                        [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: newOutletProductId,
                        [ITEM_EDIT.COLUMNS.MODE]: 1,
                        [ITEM_EDIT.COLUMNS.STATUS]: 0,
                        [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                        [ITEM_EDIT.COLUMNS.CREATED_AT]: trx.fn.now(),
                        [ITEM_EDIT.COLUMNS.CREATED_BY]: userDetails.id,
                        [ITEM_EDIT.COLUMNS.IS_INSERTED]: false,
                      });
                    }

                    console.log("OUTLET INSERT KEYS:", [...outletMappingKeySet]);
                    console.log("ITEM_EDIT INSERT KEYS:", [...itemEditKeySet]);

                  }
                }
              }
            }


            // 3 Prepare warehouse mapping rows
            if (warehouseDetails?.length > 0) {
              console.log("warehouse");

              // Step 1: Get next warehouse mapping sequence
              // const result = await trx.raw(`SELECT nextval('warehouse_products_mapping_id_seq')`);
              // let nextId = Number(result.rows?.[0]?.nextval || 1);

              for (const wh of warehouseDetails) {
                const warehouseId = wh.warehouse_id;

                // Step 2: Check existing warehouse mapping
                const existingWarehouseMapping = await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
                  .where({
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouseId,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: company_id,
                  })
                  .first();

                let shouldAddToItemEdit = false;

                if (existingWarehouseMapping) {
                  // ✅ Case 1: Mapping already exists
                  if (existingWarehouseMapping) {
                    // Reactivate inactive mapping
                    await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
                      .where({ [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.ID]: existingWarehouseMapping.id })
                      .update({
                        [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true,
                        [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
                        [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
                      });

                    shouldAddToItemEdit = true; // only add if it was reactivated
                  }
                } else {
                  // ✅ Case 2: Insert new mapping
                  warehouseMappings.push({
                    // [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.ID]: nextId++,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: update_product_id,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouseId,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: company_id,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_AT]: new Date(),
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true
                  });

                  shouldAddToItemEdit = true; // only add for new mappings
                }

                // ✅ Add to ITEM_EDIT only for reactivated or new mappings
                if (shouldAddToItemEdit) {
                  // 🔍 Check if ITEM_EDIT already exists
                  const existingEdit = await trx(ITEM_EDIT.NAME)
                    .where({
                      [ITEM_EDIT.COLUMNS.PRODUCT_ID]: update_product_id,
                      [ITEM_EDIT.COLUMNS.LOCATION_ID]: -warehouseId,
                      [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: updatedOutletProductId
                    })
                    .first();

                  // CASE 1: Exists and is_inserted = true → skip
                  if (existingEdit) {
                    await trx(ITEM_EDIT.NAME)
                      .where({ [ITEM_EDIT.COLUMNS.ID]: existingEdit.id })
                      .update({
                        ...itemEditObject,
                        [ITEM_EDIT.COLUMNS.MODE]: 1,
                        [ITEM_EDIT.COLUMNS.STATUS]: 0,
                        [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                        [ITEM_EDIT.COLUMNS.IS_INSERTED]: false,
                        [ITEM_EDIT.COLUMNS.UPDATED_AT]: new Date(),
                        [ITEM_EDIT.COLUMNS.UPDATED_BY]: userDetails.id,
                      });

                    continue; // Do not insert below
                  }


                  // CASE 2: No row exists → INSERT new
                  productsEditToInsert.push({
                    ...itemEditObject,
                    [ITEM_EDIT.COLUMNS.LOCATION_ID]: -warehouseId,
                    [ITEM_EDIT.COLUMNS.PRODUCT_ID]: update_product_id,
                    [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: updatedOutletProductId,
                    [ITEM_EDIT.COLUMNS.MODE]: 1,
                    [ITEM_EDIT.COLUMNS.STATUS]: 0,
                    [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                    [ITEM_EDIT.COLUMNS.CREATED_AT]: new Date(),
                    [ITEM_EDIT.COLUMNS.CREATED_BY]: userDetails.id,
                    [ITEM_EDIT.COLUMNS.IS_INSERTED]: false
                  });
                }
              }
            }


            // ✅ Step 4: Prepare Company mapping rows
            if (companyDetails?.length > 0) {
              console.log("company");

              // Step 1: Get next company mapping sequence
              // const seqResult = await trx.raw(`SELECT nextval('company_products_mapping_id_seq')`);
              // let nextCompanyId = Number(seqResult.rows?.[0]?.nextval || 1);

              for (const comp of companyDetails) {
                const compId = comp.company_id ?? company_id;

                // Step 2: Check if mapping already exists
                const existingMapping = await trx(COMPANY_PRODUCTS_MAPPING.NAME)
                  .where({
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: compId,
                  })
                  .first();

                if (existingMapping) {
                  // ✅ Case 1: Already exists — reactivate if inactive
                  if (!existingMapping.is_active) {
                    await trx(COMPANY_PRODUCTS_MAPPING.NAME)
                      .where({ [COMPANY_PRODUCTS_MAPPING.COLUMNS.ID]: existingMapping.id })
                      .update({
                        [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true,
                        [COMPANY_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
                        [COMPANY_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
                      });
                  }
                } else {
                  // ✅ Case 2: Insert new mapping
                  companyMappings.push({
                    // [COMPANY_PRODUCTS_MAPPING.COLUMNS.ID]: nextCompanyId++,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: update_product_id,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: compId,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_AT]: new Date(),
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
                    [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true
                  });
                }
              }
            }


            // ✅ Step 5: Prepare Barcode Details rows
            if (barcodeDetails?.length > 0) {
              console.log("Processing Barcodes for:", Product_Code);

              for (const b of barcodeDetails) {
                const code = String(b?.barcode || '').trim();
                if (!code) continue; // skip empty

                // Step 2: Check if barcode already exists
                const existingBarcode = await trx(BARCODE_LIST.NAME)
                  .where({
                    [BARCODE_LIST.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [BARCODE_LIST.COLUMNS.BARCODE]: code,
                    [BARCODE_LIST.COLUMNS.COMPANY_ID]: company_id,
                  })
                  .first();

                if (existingBarcode) {
                  // ✅ Case 1: Already exists — reactivate if inactive
                  if (!existingBarcode.is_active) {
                    await trx(BARCODE_LIST.NAME)
                      .where({ [BARCODE_LIST.COLUMNS.ID]: existingBarcode.id })
                      .update({
                        [BARCODE_LIST.COLUMNS.IS_ACTIVE]: true,
                        [BARCODE_LIST.COLUMNS.UPDATED_AT]: new Date(),
                        [BARCODE_LIST.COLUMNS.UPDATED_BY]: userDetails.id,
                      });
                  }
                } else {
                  // ✅ Case 2: Insert new barcode mapping
                  barcodeMappings.push({
                    [BARCODE_LIST.COLUMNS.PROD_ID]: update_product_id,
                    [BARCODE_LIST.COLUMNS.OUTLET_PRODUCT_ID]: updatedOutletProductId,
                    [BARCODE_LIST.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [BARCODE_LIST.COLUMNS.BARCODE]: code,
                    [BARCODE_LIST.COLUMNS.COMPANY_ID]: company_id,
                    [BARCODE_LIST.COLUMNS.CREATED_BY]: userDetails.id,
                    [BARCODE_LIST.COLUMNS.CREATED_AT]: trx.fn.now(),
                    [BARCODE_LIST.COLUMNS.IS_ACTIVE]: true,
                  });
                }
              }

              console.log(`✅ Prepared and inserted ${barcodeMappings.length} barcodes for ${Product_Code}`);
            }
            break;
          case 3:
            console.log("actived outlet")
            // ✅ Step 1: Get current item info
            const [{ id: active_product_id, outlet_product_id: activeOutletProductId }] =
              await trx(ITEM.NAME)
                .select(ITEM.COLUMNS.ID, ITEM.COLUMNS.OUTLET_PRODUCT_ID)
                .where(ITEM.COLUMNS.PRODUCT_CODE, Product_Code)
                .andWhere(ITEM.COLUMNS.COMPANY_ID, company_id)
                .limit(1);

            // ✅ Step 2: Prepare outlet mapping rows
            if (outletDetails?.length > 0) {
              console.log("outlet");

              // Step 1: Get next outlet mapping sequence
              // const seqResult = await trx.raw(`SELECT nextval('outlet_products_mapping_id_seq')`);
              // let nextMapId = Number(seqResult.rows?.[0]?.nextval || 1);

              for (const outlet of outletDetails) {
                const outletId = outlet.outlet_id;

                // Step 2: Check existing outlet mapping
                const existingOutletMapping = await trx(OUTLET_PRODUCT_MAPPING.NAME)
                  .where({
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outletId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: company_id,
                  })
                  .first();

                let shouldAddToItemEdit = false;

                if (existingOutletMapping) {
                  // ✅ Case 1: Mapping already exists
                  if (existingOutletMapping) {
                    // Reactivate inactive mapping
                    await trx(OUTLET_PRODUCT_MAPPING.NAME)
                      .where({ [OUTLET_PRODUCT_MAPPING.COLUMNS.ID]: existingOutletMapping.id })
                      .update({
                        ...outletProductObject,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true,
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
                        [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
                      });

                    shouldAddToItemEdit = true; // only add if it was reactivated
                  }
                } else {
                  // ✅ Case 2: Insert new mapping
                  outletMappings.push({
                    ...outletProductObject,
                    // [OUTLET_PRODUCT_MAPPING.COLUMNS.ID]: nextMapId++,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID]: activeOutletProductId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: active_product_id,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: active_product_id,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outletId,
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_AT]: trx.fn.now(),
                    [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true
                  });

                  shouldAddToItemEdit = true; // only add for new mappings
                }

                // ✅ Add to ITEM_EDIT only for reactivated or new mappings
                if (shouldAddToItemEdit) {
                  // 🔍 Check if ITEM_EDIT already exists
                  const existingEdit = await trx(ITEM_EDIT.NAME)
                    .where({
                      [ITEM_EDIT.COLUMNS.PRODUCT_ID]: active_product_id,
                      [ITEM_EDIT.COLUMNS.LOCATION_ID]: outletId,
                      [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: activeOutletProductId
                    })
                    .first();

                  // CASE 1: Exists and is_inserted = true → skip
                  if (existingEdit) {
                    await trx(ITEM_EDIT.NAME)
                      .where({ [ITEM_EDIT.COLUMNS.ID]: existingEdit.id })
                      .update({
                        ...itemEditObject,
                        [ITEM_EDIT.COLUMNS.MODE]: 0,
                        [ITEM_EDIT.COLUMNS.STATUS]: 0,
                        [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                        [ITEM_EDIT.COLUMNS.IS_INSERTED]: false,
                        [ITEM_EDIT.COLUMNS.UPDATED_AT]: new Date(),
                        [ITEM_EDIT.COLUMNS.UPDATED_BY]: userDetails.id,
                      });

                    continue; // Do not insert below
                  }


                  // CASE 2: No row exists → INSERT new
                  productsEditToInsert.push({
                    ...itemEditObject,
                    [ITEM_EDIT.COLUMNS.LOCATION_ID]: outletId,
                    [ITEM_EDIT.COLUMNS.PRODUCT_ID]: active_product_id,
                    [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: activeOutletProductId,
                    [ITEM_EDIT.COLUMNS.MODE]: 0,
                    [ITEM_EDIT.COLUMNS.STATUS]: 0,
                    [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                    [ITEM_EDIT.COLUMNS.CREATED_AT]: new Date(),
                    [ITEM_EDIT.COLUMNS.CREATED_BY]: userDetails.id,
                    [ITEM_EDIT.COLUMNS.IS_INSERTED]: false
                  });
                }

              }
            }


            // ✅ Step 3: Prepare Warehouse mapping rows
            if (warehouseDetails?.length > 0) {
              console.log("warehouse");

              // Step 1: Get next warehouse mapping sequence
              // const result = await trx.raw(`SELECT nextval('warehouse_products_mapping_id_seq')`);
              // let nextId = Number(result.rows?.[0]?.nextval || 1);

              for (const wh of warehouseDetails) {
                const warehouseId = wh.warehouse_id;

                // Step 2: Check existing warehouse mapping
                const existingWarehouseMapping = await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
                  .where({
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouseId,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: company_id,
                  })
                  .first();

                let shouldAddToItemEdit = false;

                if (existingWarehouseMapping) {
                  // ✅ Case 1: Mapping already exists
                  if (existingWarehouseMapping) {
                    // Reactivate inactive mapping
                    await trx(WAREHOUSE_PRODUCTS_MAPPING.NAME)
                      .where({ [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.ID]: existingWarehouseMapping.id })
                      .update({
                        [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true,
                        [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
                        [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
                      });

                    shouldAddToItemEdit = true; // only add if it was reactivated
                  }
                } else {
                  // ✅ Case 2: Insert new mapping
                  warehouseMappings.push({
                    // [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.ID]: nextId++,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID]: active_product_id,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouseId,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID]: company_id,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_AT]: new Date(),
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
                    [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true
                  });

                  shouldAddToItemEdit = true; // only add for new mappings
                }

                // ✅ Add to ITEM_EDIT only for reactivated or new mappings
                if (shouldAddToItemEdit) {
                  // 🔍 Check if ITEM_EDIT already exists
                  const existingEdit = await trx(ITEM_EDIT.NAME)
                    .where({
                      [ITEM_EDIT.COLUMNS.PRODUCT_ID]: active_product_id,
                      [ITEM_EDIT.COLUMNS.LOCATION_ID]: -warehouseId,
                      [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: activeOutletProductId
                    })
                    .first();

                  // CASE 1: Exists and is_inserted = true → skip
                  if (existingEdit) {
                    await trx(ITEM_EDIT.NAME)
                      .where({ [ITEM_EDIT.COLUMNS.ID]: existingEdit.id })
                      .update({
                        ...itemEditObject,
                        [ITEM_EDIT.COLUMNS.MODE]: 0,
                        [ITEM_EDIT.COLUMNS.STATUS]: 0,
                        [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                        [ITEM_EDIT.COLUMNS.IS_INSERTED]: false,
                        [ITEM_EDIT.COLUMNS.UPDATED_AT]: new Date(),
                        [ITEM_EDIT.COLUMNS.UPDATED_BY]: userDetails.id,
                      });

                    continue; // Do not insert below
                  }


                  // CASE 2: No row exists → INSERT new
                  productsEditToInsert.push({
                    ...itemEditObject,
                    [ITEM_EDIT.COLUMNS.LOCATION_ID]: -warehouseId,
                    [ITEM_EDIT.COLUMNS.PRODUCT_ID]: active_product_id,
                    [ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID]: activeOutletProductId,
                    [ITEM_EDIT.COLUMNS.MODE]: 0,
                    [ITEM_EDIT.COLUMNS.STATUS]: 0,
                    [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
                    [ITEM_EDIT.COLUMNS.CREATED_AT]: new Date(),
                    [ITEM_EDIT.COLUMNS.CREATED_BY]: userDetails.id,
                    [ITEM_EDIT.COLUMNS.IS_INSERTED]: false
                  });
                }
              }
            }

            // ✅ Step 4: Prepare Barcode Details rows
            if (barcodeDetails?.length > 0) {
              console.log("Processing Barcodes for:", Product_Code);

              for (const b of barcodeDetails) {
                const code = String(b?.barcode || '').trim();
                if (!code) continue; // skip empty

                // Step 2: Check if barcode already exists
                const existingBarcode = await trx(BARCODE_LIST.NAME)
                  .where({
                    [BARCODE_LIST.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [BARCODE_LIST.COLUMNS.BARCODE]: code,
                    [BARCODE_LIST.COLUMNS.COMPANY_ID]: company_id,
                  })
                  .first();

                if (existingBarcode) {
                  // ✅ Case 1: Already exists — reactivate if inactive
                  if (!existingBarcode.is_active) {
                    await trx(BARCODE_LIST.NAME)
                      .where({ [BARCODE_LIST.COLUMNS.ID]: existingBarcode.id })
                      .update({
                        [BARCODE_LIST.COLUMNS.IS_ACTIVE]: true,
                        [BARCODE_LIST.COLUMNS.UPDATED_AT]: new Date(),
                        [BARCODE_LIST.COLUMNS.UPDATED_BY]: userDetails.id,
                      });
                  }
                } else {
                  // ✅ Case 2: Insert new barcode mapping
                  barcodeMappings.push({
                    [BARCODE_LIST.COLUMNS.PROD_ID]: active_product_id,
                    [BARCODE_LIST.COLUMNS.OUTLET_PRODUCT_ID]: activeOutletProductId,
                    [BARCODE_LIST.COLUMNS.PRODUCT_CODE]: Product_Code,
                    [BARCODE_LIST.COLUMNS.BARCODE]: code,
                    [BARCODE_LIST.COLUMNS.COMPANY_ID]: company_id,
                    [BARCODE_LIST.COLUMNS.CREATED_BY]: userDetails.id,
                    [BARCODE_LIST.COLUMNS.CREATED_AT]: trx.fn.now(),
                    [BARCODE_LIST.COLUMNS.IS_ACTIVE]: true,
                  });
                }
              }

              console.log(`✅ Prepared and inserted ${barcodeMappings.length} barcodes for ${Product_Code}`);
            }

            break;
          default:
            throw CustomError.create({
              httpCode: StatusCodes.BAD_REQUEST,
              message: `Invalid Status Type`,
              property: "Status Type",
              code: "INVALID_STATUS_TYPE"
            });
        }
      }

      await insertInBatches(trx, ITEM.NAME, productsToInsert,
        [
          ITEM.COLUMNS.ID,
          ITEM.COLUMNS.PRODUCT_CODE,
          ITEM.COLUMNS.COMPANY_ID
        ],
        {
          [ITEM.COLUMNS.UPDATED_BY]: userDetails.id,
          [ITEM.COLUMNS.UPDATED_AT]: knex.fn.now(),
          [ITEM.COLUMNS.IS_ACTIVE]: true
        }
      );

      // console.log("productsEditToInsert", productsEditToInsert)
      await insertInBatches(trx, ITEM_EDIT.NAME, productsEditToInsert,
        [
          ITEM_EDIT.COLUMNS.PRODUCT_ID,
          ITEM_EDIT.COLUMNS.PRODUCT_CODE,
          ITEM_EDIT.COLUMNS.LOCATION_ID,
          ITEM_EDIT.COLUMNS.OUTLET_PRODUCT_ID
        ],
        {
          [ITEM_EDIT.COLUMNS.UPDATED_BY]: userDetails.id,
          [ITEM_EDIT.COLUMNS.UPDATED_AT]: knex.fn.now(),
          [ITEM_EDIT.COLUMNS.IS_ACTIVE]: true,
          [ITEM_EDIT.COLUMNS.MODE]: trx.raw('EXCLUDED.mode') // <-- only for this use case
        }
      );

      await insertInBatches(trx, OUTLET_PRODUCT_MAPPING.NAME, outletMappings,
        [
          OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID,
          OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID,
          OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE,
          OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID
        ],
        {
          [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
          [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
          [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true
        }
      );

      await insertInBatches(trx, WAREHOUSE_PRODUCTS_MAPPING.NAME, warehouseMappings,
        [
          WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID,
          WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID,
          WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID
        ],
        {
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
          [WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true
        }
      );

      await insertInBatches(trx, COMPANY_PRODUCTS_MAPPING.NAME, companyMappings,
        [
          COMPANY_PRODUCTS_MAPPING.COLUMNS.COMPANY_ID,
          COMPANY_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID
        ],
        {
          [COMPANY_PRODUCTS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
          [COMPANY_PRODUCTS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
          [COMPANY_PRODUCTS_MAPPING.COLUMNS.IS_ACTIVE]: true
        }
      );


      await insertInBatches(trx, BARCODE_LIST.NAME, barcodeMappings,
        [
          BARCODE_LIST.COLUMNS.PROD_ID,
          BARCODE_LIST.COLUMNS.PRODUCT_CODE,
          BARCODE_LIST.COLUMNS.BARCODE
        ],
        {
          [BARCODE_LIST.COLUMNS.UPDATED_BY]: userDetails.id,
          [BARCODE_LIST.COLUMNS.UPDATED_AT]: knex.fn.now(),
          [BARCODE_LIST.COLUMNS.IS_ACTIVE]: true
        }
      );


      await updateInBatches(
        trx,
        ITEM.NAME,
        productsToUpdate,     // [{id: 1, name: "Pen"}, {id: 2, name: "Book"}]
        [ITEM.COLUMNS.ID],    // ['id']
        {
          [ITEM.COLUMNS.UPDATED_BY]: userDetails.id,
          [ITEM.COLUMNS.UPDATED_AT]: knex.fn.now(),
          [ITEM.COLUMNS.IS_ACTIVE]: true,
        }
      );


      await trx.commit();
      console.log("Transaction completed successfully!");
      return { "success": true }

    } catch (error) {
      // Rollback transaction in case of any failure
      await trx.rollback();
      console.error("Transaction Failed:", error);

      if (error._code == 404 || error._code == 400) {
        throw error;
      }

      // Default to internal server error if it's not a known custom error
      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Product excel import failed.",
        property: "",
        code: "EXCEL_IMPORT_FAILED"
      });

    }
  }


  async function getOutletProductOrderDaysRepo({ params, logTrace, userDetails, queryString }) {
    const knex = this;
    const { outlet_id, supplier_id, page_size, current_page } = params;
    const { search } = queryString;
    let query = knex
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as product_code`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUNDAY}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MONDAY}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.TUESDAY}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WEDNESDAY}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.THURSDAY}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.FRIDAY}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SATURDAY}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
      ])
      .from(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
      .innerJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
      )
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
      .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`, supplier_id)
      .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`, supplier_id)
      .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
      .orderBy(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, "ASC");

    if (typeof search === "string" && search.trim().length > 0) {
      query.andWhere(function () {
        this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search.trim()}%`)
          .orWhereRaw(`CAST(${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} AS TEXT) ILIKE ?`, [`%${search.trim()}%`]);
      });
    }

    const response = await query.paginate({
      pageSize: page_size, // Customize as needed
      currentPage: current_page // Customize as needed
    });

    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product Mapping Outlet Order Days Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function putItemOutletOrderDaysRepo({ body, params, userDetails, fastify }) {
    const knex = this;
    const { company_id, outlet_id, supplier_id } = params;

    const updateData = {
      [OUTLET_PRODUCT_MAPPING.COLUMNS.SUNDAY]: body.sunday,
      [OUTLET_PRODUCT_MAPPING.COLUMNS.MONDAY]: body.monday,
      [OUTLET_PRODUCT_MAPPING.COLUMNS.TUESDAY]: body.tuesday,
      [OUTLET_PRODUCT_MAPPING.COLUMNS.WEDNESDAY]: body.wednesday,
      [OUTLET_PRODUCT_MAPPING.COLUMNS.THURSDAY]: body.thursday,
      [OUTLET_PRODUCT_MAPPING.COLUMNS.FRIDAY]: body.friday,
      [OUTLET_PRODUCT_MAPPING.COLUMNS.SATURDAY]: body.saturday,
      [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
      [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: new Date()
    };

    await knex(OUTLET_PRODUCT_MAPPING.NAME)
      .where({
        [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: company_id,
        [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
        [OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
        [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: body.product_id,
        [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: body.product_code
      })
      .update(updateData);

    // Emit socket event
    // fastify.io.emit("supplierOutletMappingUpdated", {
    //   company_id,
    //   outlet_id,
    //   supplier_id,
    //   updateData
    // });

    return { status: true };
  }

  // async function skuPriceUpload({ body, params, logTrace, query, userDetails }) {
  //   const knex = this;
  //   const trx = await knex.transaction();
  //   const { uploadExcelData } = excelImportRepo(fastify);

  //   try {
  //     // Step 1: Upload and extract Excel data
  //     const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
  //     const excelColumns = excelColumnData.headers.map(h =>
  //       h.toLowerCase().trim().replace(/\s+/g, '_')
  //     );
  //     const excelData = excelColumnData.data;
  //     console.log("excelColumns", excelColumns);

  //     // Step 2: Define required columns
  //     const requiredColumns = [
  //       "skucode",
  //       "mrp",
  //       "fixedmargin%",
  //       "vendordiscounttype",
  //       "vendordiscountvalue"
  //     ];

  //     // Step 3: Validate required columns
  //     const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
  //     if (missingColumns.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: `Missing required columns: ${missingColumns.join(", ")}`,
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     // Step 4: Validate data presence
  //     if (!excelData.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: "No records found in Excel.",
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     // Step 5: Collect all unique SKU codes
  //     const skuCodes = [...new Set(excelData.map(r => r.SKUCode))];

  //     // Step 6: Fetch matching items
  //     const existingItems = await knex(ITEM.NAME)
  //       .select(ITEM.COLUMNS.ID, ITEM.COLUMNS.PRODUCT_CODE)
  //       .whereIn(ITEM.COLUMNS.PRODUCT_CODE, skuCodes)
  //       .andWhere(ITEM.COLUMNS.IS_ACTIVE, true);

  //     const existingMap = Object.fromEntries(existingItems.map(i => [i.pro_code, i.id]));

  //     // Step 7: Prepare updates
  //     let updateCount = 0;

  //     for (const row of excelData) {
  //       const productId = existingMap[row.SKUCode];
  //       if (!productId) continue; // Skip if SKU not found in DB

  //       // Normalize VendorDiscountType
  //       const discountType = (row.VendorDiscountType || "").toString().trim().toLowerCase();

  //       // Convert logic: % → 0, value → 1
  //       let discountValueType = null;
  //       if (discountType === "%" || discountType === "percent" || discountType === "percentage") {
  //         discountValueType = 0;
  //       } else if (discountType === "value" || discountType === "amount") {
  //         discountValueType = 1;
  //       }

  //       await trx(ITEM.NAME)
  //         .update({
  //           [ITEM.COLUMNS.MRP]: row.MRP,
  //           [ITEM.COLUMNS.FIXEDMARGIN]: row["FixedMargin%"],
  //           [ITEM.COLUMNS.VENDORDISCOUNTTYPE]: discountValueType,
  //           [ITEM.COLUMNS.VENDORDISCOUNTVALUE]: row.VendorDiscountvalue,
  //           [ITEM.COLUMNS.UPDATED_BY]: userDetails.id,
  //           [ITEM.COLUMNS.UPDATED_AT]: knex.fn.now()
  //         })
  //         .where(ITEM.COLUMNS.PRODUCT_CODE, row.SKUCode);

  //       updateCount++;
  //     }

  //     if (updateCount === 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: "No valid SKU codes found to update.",
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     await trx.commit();
  //     console.log(`✅ Updated ${updateCount} item records successfully.`);
  //     return { success: true, updatedRecords: updateCount };

  //   } catch (error) {
  //     await trx.rollback();
  //     console.error("❌ Transaction Failed:", error);

  //     if (error._code === 404 || error._code === 400) throw error;

  //     throw CustomError.create({
  //       httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //       message: "Import failed.",
  //       code: "EXCEL_IMPORT_FAILED"
  //     });
  //   }
  // }


  async function skuPriceUpload({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    const { uploadExcelData } = excelImportRepo(fastify);

    try {
      let { outlet_id } = body;
      console.log(outlet_id, 'OUTLETS');
      console.log(typeof outlet_id, 'TYPE OF OUTLETS');
      // ✅ Normalize outlet_id
      if (Array.isArray(outlet_id)) {
        outlet_id = outlet_id.map(id => id.toString().replace(/["']/g, "").trim());
      } else if (typeof outlet_id === "string") {
        outlet_id = outlet_id
          .split(",")
          .map(id => id.replace(/["']/g, "").trim())
          .filter(Boolean);
      } else if (typeof outlet_id === "object" && outlet_id?.value) {
        outlet_id = outlet_id.value
          .split(",")
          .map(id => id.replace(/["']/g, "").trim())
          .filter(Boolean);
      } else {
        throw CustomError.create({
          httpCode: 400,
          message: "Invalid outlet_id format",
          code: "INVALID_INPUT"
        });
      }

      // ✅ Step 1: Upload and parse Excel
      const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
      const excelData = excelColumnData.data;

      // ✅ Expected headers
      const requiredColumns = [
        "SKUCode",
        "MRP",
        "FixedMargin%",
        "VendorDiscountType",
        "VendorDiscountvalue"
      ];

      const missingColumns = requiredColumns.filter(
        col => !excelColumnData.headers.includes(col)
      );
      if (missingColumns.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Missing required columns: ${missingColumns.join(", ")}`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      if (!excelData.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "No records found in Excel.",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      console.log("🟢 Outlet IDs:", outlet_id);
      const summary = [];
      // Containers
      const unapprovedPo = [];
      const pendingPurchaseMemo = [];

      // ✅ Step 2: Process each outlet
      for (const outletIdRaw of outlet_id) {
        const outletId = Number(outletIdRaw);

        // Reset per outlet
        const uploadSuccesSkucode = [];


        const skuCodes = [...new Set(excelData.map(r => r.SKUCode).filter(Boolean))];

        const existingItems = await trx(OUTLET_PRODUCT_MAPPING.NAME)
          .select(
            OUTLET_PRODUCT_MAPPING.COLUMNS.ID,
            OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE
          )
          .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE, skuCodes)
          .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outletId)
          .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE, true);

        console.log(`📦 existingItems for outlet ${outletId}:`, existingItems.length);

        if (!existingItems.length) {
          summary.push({
            outlet_id: outletId,
            total_count: excelData.length,
            success_count: 0,
            missed_count: excelData.length
          });
          continue;
        }

        const existingMap = Object.fromEntries(
          existingItems.map(i => [i.product_code || i.pro_code, i.id])
        );

        let successCount = 0;
        let missedCount = 0;

        // ✅ Step 3: Update matching rows
        for (const row of excelData) {
          const sku = row.SKUCode;
          if (!sku) {
            missedCount++;
            continue;
          }

          const productId = existingMap[sku];
          if (!productId) {
            missedCount++;
            continue;
          }

          // Prepare the update object dynamically
          const updateData = {};

          // Update only if MRP has a value
          if (row.MRP !== undefined && row.MRP !== null && row.MRP !== "") {
            updateData[OUTLET_PRODUCT_MAPPING.COLUMNS.MRP] = row.MRP;
          }

          // Update only if FixedMargin% has a value
          if (row["FixedMargin%"] !== undefined && row["FixedMargin%"] !== null && row["FixedMargin%"] !== "") {
            updateData[OUTLET_PRODUCT_MAPPING.COLUMNS.FIXEDMARGIN] = row["FixedMargin%"];
          }

          // VendorDiscountType logic (only if not empty)
          if (row.VendorDiscountType && row.VendorDiscountType.toString().trim() !== "") {
            const discountType = row.VendorDiscountType.toString().trim().toLowerCase();
            if (["%", "percent", "percentage"].includes(discountType))
              updateData[OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTTYPE] = 1;
            else if (["value", "amount"].includes(discountType))
              updateData[OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTTYPE] = 0;
          }

          // VendorDiscountvalue logic (only if not empty)
          if (row.VendorDiscountvalue !== undefined && row.VendorDiscountvalue !== null && row.VendorDiscountvalue !== "") {
            updateData[OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTVALUE] = row.VendorDiscountvalue;
          }

          // Skip update if no valid fields exist
          if (Object.keys(updateData).length === 0) {
            missedCount++;
            continue;
          }

          // Always update metadata
          updateData[OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY] = userDetails.id;
          updateData[OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT] = trx.fn.now();

          // Execute update
          const updateCount = await trx(OUTLET_PRODUCT_MAPPING.NAME)
            .update(updateData)
            .where(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE, sku)
            .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outletId);

          if (updateCount > 0) {
            successCount++;
            uploadSuccesSkucode.push(sku)
            console.log("✅ Updated:", { outletId, sku, updateData });
          } else {
            missedCount++;
          }
        }

        summary.push({
          outlet_id: outletId,
          total_count: excelData.length,
          success_count: successCount,
          missed_count: missedCount
        });

        function groupPoData(poList) {
          const map = new Map();

          for (const row of poList) {
            const key = `${row.po_no}-${row.supplier_id}-${row.outlet_id}`;

            if (!map.has(key)) {
              map.set(key, {
                po_no: row.po_no,
                po_date: row.po_date,
                supplier_id: row.supplier_id,
                supplier_name: row.supplier_name,
                outlet_id: row.outlet_id,
                outlet_name: row.outlet_name,
                brand_company_id: row.brand_company_id,
                brand_company_name: row.brand_company_name,
                productDetails: []
              });
            }

            map.get(key).productDetails.push({
              prod_code: row.prod_code,
              mrp: row.mrp
            });
          }

          return Array.from(map.values());
        }


        // Fetch unapproved PO details only for successful SKUs
        if (uploadSuccesSkucode.length > 0) {

          // -------- Unapproved Purchase Orders (approval = 0) -------- //
          const unapprovedPoDetails = await trx(OUTLET_PO_DETAILS.NAME)
            .select(
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO} as po_no`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_DATE} as po_date`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID} as supplier_id`,
              `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE} as prod_code`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID} as brand_company_id`,
              `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID} as outlet_id`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_NAME} as outlet_name`,
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MRP} as mrp`
            )
            .innerJoin(
              `${OUTLET_PO_MASTER.NAME}`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`,
              `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`
            )
            .innerJoin(
              `${OUTLET_PRODUCT_MAPPING.NAME}`,
              function () {
                this.on(
                  `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
                  `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`
                )
                  .andOn(
                    `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE}`,
                    `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE}`
                  );
              }
            )
            .innerJoin(
              `${TYPEDESIGN.NAME}`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID}`,
              `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
            )
            .innerJoin(
              `${SUPPLIER.NAME}`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID}`,
              `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .whereIn(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE}`, uploadSuccesSkucode)
            .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, outletId)
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, 0);

          if (unapprovedPoDetails.length > 0) {
            console.log("unapprovedPoDetails", unapprovedPoDetails)
            const grouped = groupPoData(unapprovedPoDetails);
            unapprovedPo.push(...grouped);
          }

          // -------- Pending Purchase Memo (approval = 1 AND memo = true) -------- //
          const pendingMemoDetails = await trx(OUTLET_PO_DETAILS.NAME)
            .select(
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO} as po_no`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_DATE} as po_date`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID} as supplier_id`,
              `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE} as prod_code`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID} as brand_company_id`,
              `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID} as outlet_id`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_NAME} as outlet_name`,
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MRP} as mrp`,
              `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_NO} as invoice_no`,
              `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_DATE} as invoice_date`
            )
            .innerJoin(
              `${OUTLET_PO_MASTER.NAME}`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`,
              `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`
            )
            .innerJoin(
              `${OUTLET_PRODUCT_MAPPING.NAME}`,
              function () {
                this.on(
                  `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
                  `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`
                )
                  .andOn(
                    `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE}`,
                    `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE}`
                  );
              }
            )
            .innerJoin(
              `${OUTLET_PURCHASE_MEMO_MASTER.NAME}`,
              `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
              `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO}`
            )
            .innerJoin(
              `${TYPEDESIGN.NAME}`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID}`,
              `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
            )
            .innerJoin(
              `${SUPPLIER.NAME}`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID}`,
              `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .whereIn(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE}`, uploadSuccesSkucode)
            .andWhere(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, outletId)
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, 1)
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_MEMO_COMPLETE}`, true);

          if (pendingMemoDetails.length > 0) {
            const grouped = groupPoData(pendingMemoDetails);
            pendingPurchaseMemo.push(...grouped);
          }
        }
      }

      await trx.commit();
      console.log("✅ SKU price upload summary:", summary);



      return {
        success: true,
        message: "SKU Price update completed.",
        data: summary,
        unApprovedPurchaseOrderDetail: unapprovedPo,
        pendingPurchaseMemo: pendingPurchaseMemo
      };


    } catch (error) {
      await trx.rollback();
      console.error("❌ Transaction Failed:", error);

      if (error._code === 404 || error._code === 400) throw error;

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Import failed.",
        code: "EXCEL_IMPORT_FAILED"
      });
    }
  }





  // async function skuPriceList({ logTrace, queryparams, params }) {
  //   const knex = this;
  //   // get item query
  //   const query = knex
  //     .select([
  //       `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as SKUCode`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.MRP} as MRP`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.FIXEDMARGIN} as FixedMargin%`,
  //       // Translate vendordiscountvalue: 0 => %, 1 => value
  //       knex.raw(`
  //       CASE 
  //         WHEN ${ITEM.NAME}.${ITEM.COLUMNS.VENDORDISCOUNTTYPE} = 0 THEN '%'
  //         WHEN ${ITEM.NAME}.${ITEM.COLUMNS.VENDORDISCOUNTTYPE} = 1 THEN 'value'
  //         ELSE NULL
  //       END AS "VendorDiscountType"
  //     `),
  //       `${ITEM.NAME}.${ITEM.COLUMNS.VENDORDISCOUNTVALUE} as VendorDiscountvalue`,
  //     ])
  //     .from(`${ITEM.NAME} as ${ITEM.NAME}`)
  //     // .orderBy(ITEM.COLUMNS.PRODUCT_CODE, "ASC");
  //     .orderBy(ITEM.COLUMNS.UPDATED_AT, "ASC");


  //   logQuery({
  //     logger: fastify.log,
  //     query,
  //     context: "Get Item",
  //     logTrace
  //   });
  //   const response = await query;
  //   if (!response.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "Item not found",
  //       property: "",
  //       code: "NOT_FOUND"
  //     });
  //   }
  //   return response;
  // }

  async function skuPriceList({ body, params, logTrace, query, userDetails }) {
    const knex = this;

    try {

      let { outlet_id } = body;

      if (!outlet_id) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "Missing outlet_id in request body",
          code: "INVALID_INPUT"
        });
      }

      // Convert string to array
      if (typeof outlet_id === "string") {
        outlet_id = outlet_id
          .split(",")
          .map(id => id.replace(/["']/g, "").trim())
          .filter(Boolean);
      } else if (!Array.isArray(outlet_id)) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "Invalid outlet_id format. Expected array or comma-separated string.",
          code: "INVALID_INPUT"
        });
      }

      // --- Query ---
      const query = knex
        .select([
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID} as outlet_id`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE} as SKUCode`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MRP} as MRP`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.FIXEDMARGIN} as FixedMargin`,
          knex.raw(`
      CASE 
        WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTTYPE} = 0 THEN '%'
        WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTTYPE} = 1 THEN 'value'
        ELSE NULL
      END AS "VendorDiscountType"
    `),
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTVALUE} as VendorDiscountvalue`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as bank_id`
        ])
        .from(`${OUTLET_PRODUCT_MAPPING.NAME}`)
        .leftJoin(
          `${OUTLETS.NAME}`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
        )
        .whereIn(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
          outlet_id
        )
        .andWhere(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE}`,
          '!=',
          0
        )
        .andWhere(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
          true
        )
        .orderBy(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT}`,
          "ASC"
        );

      logQuery({
        logger: fastify.log,
        query,
        context: "Get SKU Price List",
        logTrace
      });

      const response = await query;

      console.log('response', response);


      if (!response.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "No SKU records found for the selected outlets",
          code: "NOT_FOUND"
        });
      }

      // --- Group by outlet_id ---
      const groupedArray = Object.values(
        response.reduce((acc, row) => {
          if (!acc[row.outlet_id]) {
            acc[row.outlet_id] = {
              outlet_id: row.outlet_id,
              outlet_name: row.outlet_name,
              bank_id: row.bank_id,
              records: []
            };
          }

          acc[row.outlet_id].records.push({
            outlet_id: row.outlet_id,
            outlet_name: row.outlet_name,
            bank_id: row.bank_id,
            SKUCode: row.SKUCode,
            MRP: row.MRP,
            FixedMargin: row.FixedMargin,
            VendorDiscountType: row.VendorDiscountType,
            VendorDiscountvalue: row.VendorDiscountvalue
          });

          return acc;
        }, {})
      );

      return {
        success: true,
        message: "SKU Price List fetched successfully",
        data: groupedArray
      };
    } catch (error) {
      console.error("❌ SKU Price List Error:", error);
      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to fetch SKU Price List",
        code: "FETCH_FAILED"
      });
    }
  }

  async function updatePricePoRepo({ params, body, userDetails, financialYear }) {
    const knex = this;
    const { purchaseOrderDetails, purchaseMemoDetails } = body;
    const { company_id } = params;

    const trx = await knex.transaction();

    try {
      // -------------------------------
      // Step 1: Update Purchase Order Details
      // -------------------------------
      if (purchaseOrderDetails?.length > 0) {
        for (const po of purchaseOrderDetails) {
          const { po_no, supplier_id, outlet_id, productDetails } = po;

          // Fetch GST type for supplier
          const supplierDetails = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
            .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.GST_TYPE)
            .where({
              [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
              [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id
            })
            .first();
          const gst_type = Number(supplierDetails?.gst_type || 0);

          // Fetch existing PO detail rows
          const existingRows = await trx(OUTLET_PO_DETAILS.NAME)
            .select("*")
            .where({
              [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
              [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id,
              [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
              [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id
            });

          if (!existingRows.length) continue;

          // Update each product row
          for (const prod of productDetails) {
            const prod_code = String(prod.prod_code);

            const row = existingRows.find(r => String(r.prod_code) === prod_code);
            if (!row) continue;

            const existingProdRows = await trx(OUTLET_PRODUCT_MAPPING.NAME)
              .select(
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE} as prod_code`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.FIXEDMARGIN} as fixedmargin`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTTYPE} as vendordiscounttype`,
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTVALUE} as vendordiscountvalue`,
              )
              .where({
                [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: prod_code,
                [OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
                [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
                [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: company_id
              });

            if (!existingProdRows.length) continue;

            const row1 = existingProdRows.find(r => String(r.prod_code) === prod_code);
            if (!row1) continue;

            const mrp = Number(prod.mrp);

            let rate = Number(row.purchase_rate) || 0;
            const margin = Number(row1.fixedmargin) || 0;
            const discountType = Number(row1.vendordiscounttype) || 0;
            const discountValue = Number(row1.vendordiscountvalue) || 0;

            // Apply margin + discount
            if (margin > 0) {
              rate = mrp - (mrp * margin / 100);
              if (discountType === 1) rate -= (rate * discountValue / 100);
              else if (discountType === 0) rate -= discountValue;
            }

            rate = Number(rate.toFixed(2));

            const qty = Number(row.quantity || 0);
            const gst = Number(row.gst || 0);

            const gstAmount = Number((rate * gst / 100).toFixed(2));
            const landingRate = rate + gstAmount;
            const amount = Number((rate * qty).toFixed(2));

            const cgst = gst_type === 2 ? gst / 2 : 0;
            const sgst = gst_type === 2 ? gst / 2 : 0;
            const igst = gst_type === 1 ? gst : 0;

            await trx(OUTLET_PO_DETAILS.NAME)
              .where({ id: row.id })
              .update({
                [OUTLET_PO_DETAILS.COLUMNS.MRP]: mrp,
                [OUTLET_PO_DETAILS.COLUMNS.GST]: gst_type === 1 ? igst : gst,
                [OUTLET_PO_DETAILS.COLUMNS.CGST]: cgst,
                [OUTLET_PO_DETAILS.COLUMNS.SGST]: sgst,
                [OUTLET_PO_DETAILS.COLUMNS.IGST]: igst,
                [OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT]: gst_type === 2 ? qty * gstAmount : qty * gstAmount,
                [OUTLET_PO_DETAILS.COLUMNS.RATE]: rate,
                [OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE]: landingRate,
                [OUTLET_PO_DETAILS.COLUMNS.CP]: rate,
                [OUTLET_PO_DETAILS.COLUMNS.AMOUNT]: amount,
                [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
                [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
                [OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN]: margin,
                [OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE]: discountType,
                [OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE]: discountValue,
                [OUTLET_PO_DETAILS.COLUMNS.PO_SYNC]: 0
              });
          }

          // Recalculate totals
          const updatedRows = await trx(OUTLET_PO_DETAILS.NAME)
            .select("*")
            .where({
              [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
              [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id,
              [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
              [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id
            });

          let subTotalAmt = 0;
          let totalGstAmt = 0;
          let totalCessAmt = 0;
          let grandTotalAmt = 0;

          for (const row of updatedRows) {
            const rate = Number(row.rate);
            const qty = Number(row.quantity || 0);
            const gst = Number(row.gst || 0);
            const cess = Number(row.cess || 0);

            // console.log("subTotalAmt", rate)
            // console.log("totalGstAmt", qty)
            // console.log("totalCessAmt", gst)
            // console.log("grandTotalAmt", cess)

            const lineSubTotal = rate * qty;
            const gstAmount = lineSubTotal * (gst / 100);
            const cessAmount = cess * qty;

            // console.log("subTotalAmt", lineSubTotal)
            // console.log("totalGstAmt", gstAmount)
            // console.log("totalCessAmt", gst)
            // console.log("grandTotalAmt", cessAmount)

            subTotalAmt += lineSubTotal;
            totalGstAmt += gstAmount;
            totalCessAmt += cessAmount;
            grandTotalAmt += lineSubTotal + gstAmount + cessAmount;
          }
          // console.log("subTotalAmt", subTotalAmt)
          // console.log("totalGstAmt", totalGstAmt)
          // console.log("totalCessAmt", totalCessAmt)
          // console.log("grandTotalAmt", grandTotalAmt)

          const roundedGrand = Math.round(grandTotalAmt);
          const roundOff = Number((roundedGrand - grandTotalAmt).toFixed(2));

          await trx(OUTLET_PO_MASTER.NAME)
            .where({
              [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
              [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
              [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id
            })
            .update({
              [OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: Number(subTotalAmt),
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: gst_type === 2 ? totalGstAmt : 0,
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_IGST_AMT]: gst_type === 1 ? totalGstAmt : 0,
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: totalCessAmt,
              [OUTLET_PO_MASTER.COLUMNS.ROFF]: roundOff,
              [OUTLET_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: roundedGrand,
              [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
              [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
              [OUTLET_PO_MASTER.COLUMNS.PO_SYNC]: 0
            });
        }
      }

      // -------------------------------
      // Step 2: Update Purchase Memo Details
      // -------------------------------
      // if (purchaseMemoDetails?.length > 0) {
      //   for (const memo of purchaseMemoDetails) {
      //     const { po_no, supplier_id, outlet_id, invoice_no, productDetails } = memo;

      //     // 1) Get GST type
      //     const supplierDetails = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
      //       .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.GST_TYPE)
      //       .where({
      //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
      //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id
      //       })
      //       .first();

      //     const gst_type = Number(supplierDetails?.gst_type || 0); // 1 = IGST, 2 = CGST+SGST

      //     // 2) Fetch existing memo rows with CORRECT memo_master_id
      //     const existingRows = await trx(OUTLET_PURCHASE_MEMO_DETAILS.NAME)
      //       .select(
      //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE} as prod_code`,
      //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.RATE} as purchase_rate`,
      //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN} as fixedmargin`,
      //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE} as vendordiscounttype`,
      //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE} as vendordiscountvalue`,
      //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GST} as gst`,
      //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CESS} as cess`,
      //         `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.ID} as id`,
      //         `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.RECIVED_QTY} as quantity`,
      //         `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ID} as memo_master_id`
      //       )
      //       .innerJoin(
      //         OUTLET_PO_DETAILS.NAME,
      //         `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PO_NO}`,
      //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`
      //       )
      //       .innerJoin(
      //         OUTLET_PURCHASE_MEMO_MASTER.NAME,
      //         `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_PURCHASE_MEMO_MST_ID}`,
      //         `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ID}`
      //       )
      //       .where({
      //         [`${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.po_no`]: po_no,
      //         [`${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.supplier_id`]: supplier_id,
      //         [`${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.outlet_id`]: outlet_id,
      //         [`${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.company_id`]: company_id,
      //         // [`${OUTLET_PURCHASE_MEMO_MASTER.NAME}.invoice_no`]: invoice_no
      //       });

      //     if (!existingRows.length) continue;

      //     const memoMasterId = Number(existingRows[0]?.memo_master_id);
      //     if (!memoMasterId) continue; // safety check

      //     // -------------------------------------------------------
      //     // 3) Update each product in memo
      //     // -------------------------------------------------------
      //     for (const prod of productDetails) {
      //       const prod_code = String(prod.prod_code);
      //       const mrp = Number(prod.mrp);

      //       const rows = existingRows.filter(
      //         r => String(r.prod_code) === prod_code
      //       );

      //       if (!rows.length) continue;

      //       for (const row of rows) {

      //         const existingProdRows = await trx(OUTLET_PRODUCT_MAPPING.NAME)
      //           .select(
      //             `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE} as prod_code`,
      //             `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.FIXEDMARGIN} as fixedmargin`,
      //             `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTTYPE} as vendordiscounttype`,
      //             `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTVALUE} as vendordiscountvalue`,
      //           )
      //           .where({
      //             [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: prod_code,
      //             [OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
      //             [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
      //             [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: company_id
      //           });

      //         if (!existingProdRows.length) continue;

      //         const row1 = existingProdRows.find(r => String(r.prod_code) === prod_code);
      //         if (!row1) continue;

      //         console.log('row1----------------', row1);

      //         const qty = Number(row.quantity || 0);
      //         const baseRate = Number(row.purchase_rate || 0);

      //         let rate = baseRate;
      //         const margin = Number(row1.fixedmargin || 0);
      //         const discountType = Number(row1.vendordiscounttype || 0);
      //         const discountValue = Number(row1.vendordiscountvalue || 0);

      //         // Margin & discount calculations
      //         if (margin > 0) {
      //           rate = mrp - (mrp * margin / 100);
      //           if (discountType === 1) rate -= rate * (discountValue / 100); // percentage
      //           else if (discountType === 0) rate -= discountValue; // value
      //         }

      //         rate = Number(rate.toFixed(2));

      //         const gst = Number(row.gst || 0);
      //         const cess = Number(row.cess || 0);

      //         const cgst = gst_type === 2 ? gst / 2 : 0;
      //         const sgst = gst_type === 2 ? gst / 2 : 0;
      //         const igst = gst_type === 1 ? gst : 0;

      //         const lineSubTotal = rate * qty;
      //         const gstAmount = Number((lineSubTotal * gst / 100).toFixed(2));
      //         const amount = Number(lineSubTotal.toFixed(2));
      //         const landingRate = rate + gstAmount;
      //         // Update details table
      //         const up = await trx(OUTLET_PURCHASE_MEMO_DETAILS.NAME)
      //           .where({ [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.ID]: row.id })
      //           .update({
      //             [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.MRP]: mrp,
      //             [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.GST]: gst_type === 1 ? igst : gst,
      //             [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CGST]: cgst,
      //             [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SGST]: sgst,
      //             [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.IGST]: igst,
      //             [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.GST_AMOUNT]: gstAmount,
      //             [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PURCHASE_RATE]: rate,
      //             [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.AMOUNT]: amount,
      //             [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
      //             [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.UPDATED_AT]: new Date()
      //           });

      //         console.log('---------up------------', up);

      //         const updated = await trx(OUTLET_PO_DETAILS.NAME)
      //           .where({
      //             [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
      //             [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
      //             [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
      //             [OUTLET_PO_DETAILS.COLUMNS.PROD_CODE]: prod_code,
      //           })
      //           .update({
      //             [OUTLET_PO_DETAILS.COLUMNS.MRP]: mrp,
      //             [OUTLET_PO_DETAILS.COLUMNS.GST]: gst_type === 1 ? igst : gst,
      //             [OUTLET_PO_DETAILS.COLUMNS.CGST]: cgst,
      //             [OUTLET_PO_DETAILS.COLUMNS.SGST]: sgst,
      //             [OUTLET_PO_DETAILS.COLUMNS.IGST]: igst,
      //             [OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT]: gst_type === 2 ? qty * gstAmount : qty * gstAmount,
      //             [OUTLET_PO_DETAILS.COLUMNS.RATE]: rate,
      //             [OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE]: landingRate,
      //             [OUTLET_PO_DETAILS.COLUMNS.CP]: rate,
      //             [OUTLET_PO_DETAILS.COLUMNS.AMOUNT]: amount,
      //             [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
      //             [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
      //             [OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN]: margin,
      //             [OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE]: discountType,
      //             [OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE]: discountValue,
      //             [OUTLET_PO_DETAILS.COLUMNS.PO_SYNC]: 0
      //           });

      //         console.log('rows updated:', updated);

      //       }

      //     }

      //     // -------------------------------------------------------
      //     // 4) Recalculate memo totals
      //     // -------------------------------------------------------
      //     const updatedRows = await trx(OUTLET_PURCHASE_MEMO_DETAILS.NAME)
      //       .select("*")
      //       .where({
      //         [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PO_NO]: po_no,
      //         [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id,
      //         [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
      //         [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
      //         [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_PURCHASE_MEMO_MST_ID]: memoMasterId
      //       });

      //     let subTotal = 0;
      //     let gstTotal = 0;
      //     let cessTotal = 0;

      //     for (const item of updatedRows) {
      //       const qty = Number(item.recived_qty || 0);
      //       const rate = Number(item.purchase_rate || 0);
      //       const gst = Number(item.gst || 0);
      //       const cess = Number(item.cess || 0);

      //       const line = qty * rate;
      //       subTotal += line;
      //       gstTotal += line * (gst / 100);
      //       cessTotal += qty * cess;
      //     }

      //     const grandTotal = subTotal + gstTotal + cessTotal;
      //     const roundedGrand = Math.round(grandTotal);
      //     const roundOff = Number((roundedGrand - grandTotal).toFixed(2));

      //     // -------------------------------------------------------
      //     // 5) Update memo master
      //     // -------------------------------------------------------
      //     await trx(OUTLET_PURCHASE_MEMO_MASTER.NAME)
      //       .where({ [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ID]: memoMasterId })
      //       .update({
      //         [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotal,
      //         [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_GST_AMT]: gst_type === 2 ? gstTotal : 0,
      //         [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_IGST_AMT]: gst_type === 1 ? gstTotal : 0,
      //         [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_CESS_AMT]: cessTotal,
      //         [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ROFF]: roundOff,
      //         [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: roundedGrand,
      //         [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
      //         [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
      //       });

      //     await trx(OUTLET_PO_MASTER.NAME)
      //       .where({
      //         [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
      //         [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
      //         [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id
      //       })
      //       .update({
      //         [OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: Number(subTotal),
      //         [OUTLET_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: gst_type === 2 ? gstTotal : 0,
      //         [OUTLET_PO_MASTER.COLUMNS.TOTAL_IGST_AMT]: gst_type === 1 ? gstTotal : 0,
      //         [OUTLET_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: cessTotal,
      //         [OUTLET_PO_MASTER.COLUMNS.ROFF]: roundOff,
      //         [OUTLET_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: roundedGrand,
      //         [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
      //         [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
      //         [OUTLET_PO_MASTER.COLUMNS.PO_SYNC]: 0
      //       });
      //   }
      // }

      if (purchaseMemoDetails?.length > 0) {
        for (const memo of purchaseMemoDetails) {
          const { po_no, supplier_id, outlet_id, invoice_no, productDetails } = memo;

          // 1) Get GST type
          const supplierDetails = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
            .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.GST_TYPE)
            .where({
              [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
              [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id
            })
            .first();

          const gst_type = Number(supplierDetails?.gst_type || 0); // 1 = IGST, 2 = CGST+SGST

          // 2) Fetch existing memo rows with CORRECT memo_master_id
          const existingRows = await trx(OUTLET_PURCHASE_MEMO_DETAILS.NAME)
            .select(
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE} as prod_code`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.RATE} as purchase_rate`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN} as fixedmargin`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE} as vendordiscounttype`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE} as vendordiscountvalue`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GST} as gst`,
              `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CESS} as cess`,
              `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.ID} as id`,
              `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.RECIVED_QTY} as quantity`,
              `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ID} as memo_master_id`
            )
            .innerJoin(
              OUTLET_PO_DETAILS.NAME,
              function () {
                this.on(
                  `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PO_NO}`,
                  '=',
                  `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`
                ).andOn(
                  `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PROD_CODE}`,
                  '=',
                  `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE}`
                );
              }
            )
            .innerJoin(
              OUTLET_PURCHASE_MEMO_MASTER.NAME,
              `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_PURCHASE_MEMO_MST_ID}`,
              `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ID}`
            )
            .where({
              [`${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.po_no`]: po_no,
              [`${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.supplier_id`]: supplier_id,
              [`${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.outlet_id`]: outlet_id,
              [`${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.company_id`]: company_id
            });

          if (!existingRows.length) continue;

          const memoMasterId = Number(existingRows[0]?.memo_master_id);
          if (!memoMasterId) continue; // safety check

          // -------------------------------------------------------
          // 2.1) Fetch product mapping ONCE per memo
          // -------------------------------------------------------
          const productMapRows = await trx(OUTLET_PRODUCT_MAPPING.NAME)
            .select(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE} as prod_code`,
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.FIXEDMARGIN} as fixedmargin`,
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTTYPE} as vendordiscounttype`,
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTVALUE} as vendordiscountvalue`
            )
            .where({
              [OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
              [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
              [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: company_id
            });

          const productMap = {};
          for (const p of productMapRows) {
            productMap[String(p.prod_code)] = p;
          }

          // -------------------------------------------------------
          // 3) Update each product in memo
          // -------------------------------------------------------
          for (const prod of productDetails) {
            const prod_code = String(prod.prod_code);
            const mrp = Number(prod.mrp);

            // only rows for this prod_code
            const rows = existingRows.filter(
              r => String(r.prod_code) === prod_code
            );

            if (!rows.length) continue;

            const row1 = productMap[prod_code];
            if (!row1) continue;

            console.log('row1----------------', row1);

            const margin = Number(row1.fixedmargin || 0);
            const discountType = Number(row1.vendordiscounttype || 0);
            const discountValue = Number(row1.vendordiscountvalue || 0);

            for (const row of rows) {
              const qty = Number(row.quantity || 0);
              const baseRate = Number(row.purchase_rate || 0);

              let rate = baseRate;

              // Margin & discount calculations
              if (margin > 0) {
                rate = mrp - (mrp * margin / 100);
                if (discountType === 1) rate -= rate * (discountValue / 100); // percentage
                else if (discountType === 0) rate -= discountValue; // value
              }

              rate = Number(rate.toFixed(2));

              const gst = Number(row.gst || 0);
              const cess = Number(row.cess || 0);

              const cgst = gst_type === 2 ? gst / 2 : 0;
              const sgst = gst_type === 2 ? gst / 2 : 0;
              const igst = gst_type === 1 ? gst : 0;

              const lineSubTotal = rate * qty;

              console.log('-------linesubtotal', lineSubTotal)
              const gstAmountPerItem = Number((rate * gst / 100).toFixed(2));
              const gstAmount = Number((lineSubTotal * gst / 100).toFixed(2));

              console.log('-------gstAmount', gstAmount)

              const amount = Number(lineSubTotal.toFixed(2));
              const landingRate = rate + gstAmountPerItem;

              console.log('-------landingRate', landingRate)


              // Update details table
              const up = await trx(OUTLET_PURCHASE_MEMO_DETAILS.NAME)
                .where({ [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.ID]: row.id })
                .update({
                  [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.MRP]: mrp,
                  [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.GST]: gst_type === 1 ? igst : gst,
                  [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.CGST]: cgst,
                  [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SGST]: sgst,
                  [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.IGST]: igst,
                  [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.GST_AMOUNT]: gstAmount,
                  [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PURCHASE_RATE]: rate,
                  [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.AMOUNT]: amount,
                  [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
                  [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.UPDATED_AT]: new Date()
                });

              console.log('---------up------------', up);

              const updated = await trx(OUTLET_PO_DETAILS.NAME)
                .where({
                  [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
                  [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                  [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
                  [OUTLET_PO_DETAILS.COLUMNS.PROD_CODE]: prod_code
                })
                .update({
                  [OUTLET_PO_DETAILS.COLUMNS.MRP]: mrp,
                  [OUTLET_PO_DETAILS.COLUMNS.GST]: gst_type === 1 ? igst : gst,
                  [OUTLET_PO_DETAILS.COLUMNS.CGST]: cgst,
                  [OUTLET_PO_DETAILS.COLUMNS.SGST]: sgst,
                  [OUTLET_PO_DETAILS.COLUMNS.IGST]: igst,
                  [OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT]: gstAmount,
                  [OUTLET_PO_DETAILS.COLUMNS.RATE]: rate,
                  [OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE]: landingRate,
                  [OUTLET_PO_DETAILS.COLUMNS.CP]: rate,
                  [OUTLET_PO_DETAILS.COLUMNS.AMOUNT]: amount,
                  [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
                  [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
                  [OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN]: margin,
                  [OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE]: discountType,
                  [OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE]: discountValue,
                  [OUTLET_PO_DETAILS.COLUMNS.PO_SYNC]: 0
                });

              console.log('rows updated:', updated);
            }
          }

          // -------------------------------------------------------
          // 4) Recalculate memo totals
          // -------------------------------------------------------
          const updatedRows = await trx(OUTLET_PURCHASE_MEMO_DETAILS.NAME)
            .select("*")
            .where({
              [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PO_NO]: po_no,
              [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id,
              [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
              [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
              [OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_PURCHASE_MEMO_MST_ID]: memoMasterId
            });

          let subTotal = 0;
          let gstTotal = 0;
          let cessTotal = 0;

          for (const item of updatedRows) {
            const qty = Number(item.recived_qty || 0);
            const rate = Number(item.purchase_rate || 0);
            const gst = Number(item.gst || 0);
            const cess = Number(item.cess || 0);

            const line = qty * rate;
            subTotal += line;
            gstTotal += line * (gst / 100);
            cessTotal += qty * cess;
          }

          const grandTotal = subTotal + gstTotal + cessTotal;
          const roundedGrand = Math.round(grandTotal);
          const roundOff = Number((roundedGrand - grandTotal).toFixed(2));

          // -------------------------------------------------------
          // 5) Update memo master
          // -------------------------------------------------------
          await trx(OUTLET_PURCHASE_MEMO_MASTER.NAME)
            .where({ [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ID]: memoMasterId })
            .update({
              [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotal,
              [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_GST_AMT]: gst_type === 2 ? gstTotal : 0,
              [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_IGST_AMT]: gst_type === 1 ? gstTotal : 0,
              [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.TOTAL_CESS_AMT]: cessTotal,
              [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.ROFF]: roundOff,
              [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: roundedGrand,
              [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
              [OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
            });

          await trx(OUTLET_PO_MASTER.NAME)
            .where({
              [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
              [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
              [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id
            })
            .update({
              [OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: Number(subTotal),
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: gst_type === 2 ? gstTotal : 0,
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_IGST_AMT]: gst_type === 1 ? gstTotal : 0,
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: cessTotal,
              [OUTLET_PO_MASTER.COLUMNS.ROFF]: roundOff,
              [OUTLET_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: roundedGrand,
              [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
              [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
              [OUTLET_PO_MASTER.COLUMNS.PO_SYNC]: 0
            });
        }
      }

      // Commit transaction
      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback();
      console.error("Transaction Failed:", error);
      throw CustomError.create({
        httpCode: 500,
        message: "Outlet Purchase Order transaction failed.",
        code: "TRANSACTION_FAILED"
      });
    }
  }

  return {
    getItem,
    postItem,
    putItem,
    deleteItem,
    getItemInfo,
    getItemPaginate,
    putItemActiveStatusRepo,
    postItemImportRepo,
    postItemExcelValidation,
    getItemCodeInfo,
    itemSearch,
    getItemImportStatusRepo,
    getItemStatusRepo,
    itemBarcodeSearch,
    getItemsSearchClosingStock,
    getBarcodeIssueSearch,
    getItemOutlet,
    getItemInfoWithProcode,
    putItemDiscount,
    getItemPurchaseProduct,
    getItemDetailsOutletsSalesProduct,
    getSubWarehouseStocks,
    getWarehouseMappingListRepo,
    getItemParentList,
    getItemExportRepo,
    getOutletProductOrderDaysRepo,
    putItemOutletOrderDaysRepo,
    skuPriceUpload,
    skuPriceList,
    updatePricePoRepo
  }
}

module.exports = itemRepo;
