const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { ITEM, OUTLET_PRODUCT_MAPPING, WAREHOUSE } = require("../../../catalog/commons")
const { INDENT_MASTER, INDENT_DETAILS } = require("../../commons")
const { OUTLETS } = require("../../../accounts/outlets/commons/constants")
const { OUTLETSALESDETAILS } = require("../../../outlet_sales/outlet_sales_master/commons/constants");
const { WAREHOUSE_STOCKS } = require("../../../packing_issue/commons");
const { SALESDETAILS } = require(".././../../sales/commons");


const { MAIN_CATEGORY } = require("../../../catalog/category/commons/constants");
const { SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { COMPANY } = require("../../../accounts/company/commons/constants");

function indentOrderRepo(fastify) {

  async function postIndentOrderProduct({ params, body, logTrace, userDetails }) {
    const knex = this;

    const IndentOrderData = {
      [INDENT_MASTER.COLUMNS.INDENT_DATE]: body.indent_date,
      [INDENT_MASTER.COLUMNS.WH_ID]: body.wh_id,
      [INDENT_MASTER.COLUMNS.TOTAL_ITEMS]: body.total_items,
      [INDENT_MASTER.COLUMNS.TOTAL_ORDER_QTY]: body.total_order_qty,
      [INDENT_MASTER.COLUMNS.TOTAL_AMT]: body.total_amt,
      [INDENT_MASTER.COLUMNS.TOTAL_GST]: body.total_gst,
      [INDENT_MASTER.COLUMNS.IS_APPROVED_BY]: userDetails.id,
      [INDENT_MASTER.COLUMNS.MANUAL_FLAG]: body?.manual_flag ?? false,
      [INDENT_MASTER.COLUMNS.AUTO_FLAG]: body?.auto_flag ?? false,
      [INDENT_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
      [INDENT_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id
    };

    const indentOrderInsertQuery = await knex(INDENT_MASTER.NAME)
      .returning(INDENT_MASTER.COLUMNS.ID)
      .insert(IndentOrderData);

    const indentOrderId = indentOrderInsertQuery[0].id;

    // const indent_no = `IO_${indentOrderId}`;
    const indent_no = indentOrderId;

    await knex(INDENT_MASTER.NAME)
      .where(INDENT_MASTER.COLUMNS.ID, indentOrderId)
      .update({
        [INDENT_MASTER.COLUMNS.INDENT_NO]: indent_no,
      });

    if (body.indent_order_details && body.indent_order_details.length > 0) {
      for (const detail of body.indent_order_details) {
        const indentOrderDetailsData = {
          [INDENT_DETAILS.COLUMNS.INDENT_MST_ID]: indentOrderId,
          [INDENT_DETAILS.COLUMNS.INDENT_NO]: indent_no,
          [INDENT_DETAILS.COLUMNS.INDENT_DATE]: body.indent_date,
          [INDENT_DETAILS.COLUMNS.PROD_ID]: detail.prod_id,
          [INDENT_DETAILS.COLUMNS.ORDER_QTY]: detail.order_qty,
          [INDENT_DETAILS.COLUMNS.CAT_ID]: detail.cat_id,
          [INDENT_DETAILS.COLUMNS.SUB_CAT_ID]: detail.sub_cat_id,
          [INDENT_DETAILS.COLUMNS.HEAD_ID]: detail.head_id,
          [INDENT_DETAILS.COLUMNS.TYPE_DESIGN_ID]: detail.type_design_id,
          [INDENT_DETAILS.COLUMNS.UOM_ID]: detail.uom_id,
          [INDENT_DETAILS.COLUMNS.MRP]: detail.mrp,
          [INDENT_DETAILS.COLUMNS.GST]: detail.gst,
          [INDENT_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
        };

        await knex(INDENT_DETAILS.NAME).insert(indentOrderDetailsData);
      }
    }

    return { success: true, indent_no };
  }

  async function getIndentOrderProductIndentNo({ params, body, logTrace, userDetails }) {
    const knex = this;

    const query = knex(INDENT_MASTER.NAME).returning("id")
      .orderBy(INDENT_MASTER.COLUMNS.ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Indent Master",
      logTrace
    });

    const response = await query;

    const docno = Number(response[0].indent_no) + 1 || 1;

    const Docno = docno

    return { Docno };
  }

  async function getIndentOrderProductMinStock({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { outlet_id } = params;

    // Check if the outlet exists
    const existingOutlet = await knex(OUTLETS.NAME)
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, outlet_id)
      .first();

    console.log(existingOutlet, "existing outlet");

    if (!existingOutlet) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet not found",
        code: "OUTLET_NOT_FOUND",
      });
    }

    let query;

    if (Number(existingOutlet.for_indent) === 1) {
      query = knex(OUTLET_PRODUCT_MAPPING.NAME)
        .select(
          `${ITEM.NAME}.*`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK} as outlet_opening_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as outlet_balance_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK} as outlet_min_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK} as outlet_allow_neg_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE} as outlet_wscale`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_WARN_STOCK} as outlet_min_warn_stock`
        )
        .leftJoin(
          `${ITEM.NAME} as ${ITEM.NAME}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
        )
        .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
        .whereRaw(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK} > ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK}`
        );
    } else if (Number(existingOutlet.for_indent) === 2) {
      console.log("false");

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const formattedYesterday = yesterday.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      console.log(formattedYesterday, 'yesterday')
      query = knex(OUTLET_PRODUCT_MAPPING.NAME)
        .select(
          `${ITEM.NAME}.*`,
          knex.raw(`COALESCE(SUM(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.QTY}), 0) as order_qty`), // Ensure sum is 0 if no sales
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK} as outlet_opening_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as outlet_balance_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK} as outlet_min_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK} as outlet_allow_neg_stock`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE} as outlet_wscale`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_WARN_STOCK} as outlet_min_warn_stock`
        )
        .leftJoin(
          `${ITEM.NAME} as ${ITEM.NAME}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
        )
        .leftJoin(
          `${SALESDETAILS.NAME} as ${SALESDETAILS.NAME}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
          `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`
        )
        .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
        .whereRaw(`DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) = ?`, [formattedYesterday])
        .groupBy([
          `${ITEM.NAME}.${ITEM.COLUMNS.ID}`, // Group by product ID to remove duplicates
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_WARN_STOCK}`,
        ]);
    } else {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "Invalid outlet type",
        code: "INVALID_OUTLET_TYPE",
      });
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get item",
      logTrace,
    });

    const pageSize = params.page_size || 10;
    const currentPage = params.current_page || 1;

    const response = await query.paginate({
      pageSize,
      currentPage,
    });
    console.log(response, "response")
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Data not found",
        code: "NOT_FOUND",
      });
    }

    if (response.meta.pagination.total_pages < currentPage) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        code: "NOT_ACCEPTABLE",
      });
    }

    return response;
  }



  async function getIndentOrderProductDetails({ body, params, query, logTrace }) {
    const knex = this;
    const { indent_no } = params;
    const { indent } = query;
    const query1 = knex
      .select([
        `${INDENT_MASTER.NAME}.*`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID} as warehouse_id`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WAREHOUSE_NAME} as warehouse_name`
      ])
      .from(`${INDENT_MASTER.NAME} as ${INDENT_MASTER.NAME}`)
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.WH_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )
      .where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.INDENT_NO}`,
        indent_no
      )
    if (Number(indent) === 0) {
      query1.where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.AUTO_FLAG}`,
        true
      )
    }

    if (Number(indent) === 1) {
      query1.where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.MANUAL_FLAG}`,
        true
      )
    }
    // Log the query for debugging
    const response = await query1;
    if (!response.length) {
      return [];
    }

    const indentOrderDetails = await Promise.all(
      response.map(async indent => {
        const indent_details_lines = await knex
          .select([
            `${INDENT_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.SHORT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE} as pur_rate`,
            `${ITEM.NAME}.${ITEM.COLUMNS.SALE_RATE} as sale_rate`,
            `${ITEM.NAME}.${ITEM.COLUMNS.WHOLESALE_RATE} as wholesale_rate`,
            `${ITEM.NAME}.${ITEM.COLUMNS.MRP} as mrp`,
            `${ITEM.NAME}.${ITEM.COLUMNS.GST} as gst`,
            `${ITEM.NAME}.${ITEM.COLUMNS.CESS} as cess`,
            `${ITEM.NAME}.${ITEM.COLUMNS.HSN} as hsn`,
            `${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID} as type`,
            `${ITEM.NAME}.${ITEM.COLUMNS.DISCOUNT} as discount`,
            `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.ORDER_QTY} as qty`
          ])
          .from(`${INDENT_DETAILS.NAME} as ${INDENT_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${WAREHOUSE_STOCKS.NAME} as ${WAREHOUSE_STOCKS.NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
            `${WAREHOUSE_STOCKS.NAME}.${WAREHOUSE_STOCKS.COLUMNS.PROD_ID}`
          )
          .where(
            `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.INDENT_MST_ID}`,
            indent.id
          );

        return { ...indent, indent_details_lines };

      })
    );

    return indentOrderDetails;
  }

  async function getIndentOrderProductDetailsAll({ body, params, logTrace }) {
    const knex = this;
    // const { indent_no } = params;

    const query = knex
      .select([
        `${INDENT_MASTER.NAME}.*`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID} as warehouse_id`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WHNAME} as warehouse_name`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME} as warehouse_short_name`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD1}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD2}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD4}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PINCODE}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PHONE}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.MOBILE}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.EMAIL}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.WEBSITE}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.GSTIN}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FSSAI}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKACNO}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKNAME}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ACNAME}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IFSCCODE}`,
        // `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ISGST}`,
        // `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.OUTLETTYPE} as outlet_type_name`,
        // `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        // `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        // `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${INDENT_MASTER.NAME} as ${INDENT_MASTER.NAME}`)
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.WH_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )
    // .leftJoin(
    //   `${USERS.NAME} as ${USERS.NAME}`,
    //   `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.IS_APPROVED_BY}`,
    //   `${USERS.NAME}.${USERS.COLUMNS.ID}`
    // )
    // .leftJoin(
    //   `${STATES.NAME} as ${STATES.NAME}`,
    //   `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`,
    //   `${STATES.NAME}.${STATES.COLUMNS.ID}`
    // )
    // .leftJoin(
    //   `${CITIES.NAME} as ${CITIES.NAME}`,
    //   `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`,
    //   `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
    // )
    // .leftJoin(
    //   `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
    //   `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`,
    //   `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
    // )
    // .leftJoin(
    //   `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
    //   `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
    //   `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
    // )
    // .whereRaw(
    //   `DATE(${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.PODATE}) >= ?`,
    //   [params.from_date]
    // )
    // .whereRaw(
    //   `DATE(${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.PODATE}) <= ?`,
    //   [params.to_date]
    // )
    // .where(
    //   `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.INDENT_NO}`,
    //   indent_no
    // )
    // .orderBy(`${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.ID}`, "DESC");


    // if (Number(params.approved) && Number(params.approved) == 1) {
    //   query.where(
    //     `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.IS_APPROVED}`,
    //     false
    //   );
    // }

    // if (Number(params.approved) && Number(params.approved) == 2) {
    //   query.where(
    //     `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.IS_APPROVED}`,
    //     true
    //   );
    // }

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

    const indentOrderDetails = await Promise.all(
      response.map(async indent => {
        const indent_details_lines = await knex
          .select([
            `${INDENT_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.SHORT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            // `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            // `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            // `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            // `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            // `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${INDENT_DETAILS.NAME} as ${INDENT_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          // .leftJoin(
          //   `${UNITS.NAME} as ${UNITS.NAME}`,
          //   `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.UOM_ID}`,
          //   `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          // )
          // .leftJoin(
          //   `${HEADS.NAME} as ${HEADS.NAME}`,
          //   `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.HEAD_ID}`,
          //   `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
          // )
          // .leftJoin(
          //   `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
          //   `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.TYPE_DESIGN_ID}`,
          //   `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
          // )
          // .leftJoin(
          //   `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
          //   `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.CAT_ID}`,
          //   `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
          // )
          // .leftJoin(
          //   `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
          //   `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.SUB_CAT_ID}`,
          //   `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
          // )
          .where(
            `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.INDENT_MST_ID}`,
            indent.id
          );

        return { ...indent, indent_details_lines };

      })
    );

    return indentOrderDetails;
  }

  async function getIndentOrderProductSalesBased({ params, body, logTrace, userDetails }) {
    const knex = this;

    const { outlet_id, from_date } = params;

    const query = knex(OUTLETSALESDETAILS.NAME)
      .select(
        `${ITEM.NAME}.*`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK} as outlet_opening_stock`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as outlet_balance_stock`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK} as outlet_min_stock`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK} as outlet_allow_neg_stock`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE} as outlet_wscale`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_WARN_STOCK} as outlet_min_warn_stock`
      )
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`
      )
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
      .whereRaw(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK} > ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK}`);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get item",
      logTrace
    });

    const response = await query.paginate({
      pageSize: params.page_size,
      currentPage: params.current_page
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "data not found",
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

    return response;
  }


  async function getIndentOrderWarehouseOutletList({ params, body, logTrace, userDetails }) {
    const knex = this;

    const { wh_id } = params;

    const query = knex(WAREHOUSE.NAME)
      .select(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD1} as outlet_add1`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD2} as outlet_add2`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD3} as outlet_add3`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD4} as outlet_add4`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.WH_ID}`
      )
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.WH_ID}`, wh_id)


    logQuery({
      logger: fastify.log,
      query,
      context: "Get data",
      logTrace
    });
    const response = await query

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getIndentOrderOutletWarehouseList({ params, body, logTrace, userDetails }) {
    const knex = this;

    const { outlet_id } = params;

    const query = knex(OUTLETS.NAME)
      .select(
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID} as warehouse_id`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WHNAME} as warehouse_name`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME} as warehouse_short_name`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD1} as warehouse_add1`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD2} as warehouse_add2`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD3} as warehouse_add3`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD4} as warehouse_add4`
      )
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.WH_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, outlet_id)


    logQuery({
      logger: fastify.log,
      query,
      context: "Get data",
      logTrace
    });
    const response = await query

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getIndentOrderDetails({ body, params, query, logTrace }) {
    const knex = this;
    const { wh_id, outlet_id, indent } = params;
    const query1 = knex
      .select([
        `${INDENT_MASTER.NAME}.*`
      ])
      .from(`${INDENT_MASTER.NAME} as ${INDENT_MASTER.NAME}`)
      .where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.WH_ID}`,
        wh_id
      )
      .where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.OUTLET_ID}`,
        outlet_id
      )
      .where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.IS_TRANSFER}`,
        false
      )
    if (Number(indent) === 0) {
      query1.where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.AUTO_FLAG}`,
        true
      )
    }

    if (Number(indent) === 1) {
      query1.where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.MANUAL_FLAG}`,
        true
      )
    }
    query1.orderBy(`${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.ID}`, "DESC");

    // Log the query for debugging
    const response = await query1;
    if (!response.length) {
      return [];
    }

    const indentOrderDetails = await Promise.all(
      response.map(async indent => {
        const indent_details_lines = await knex
          .select([
            `${INDENT_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.SHORT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
          ])
          .from(`${INDENT_DETAILS.NAME} as ${INDENT_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(
            `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.INDENT_MST_ID}`,
            indent.id
          );

        return { ...indent, indent_details_lines };

      })
    );

    return indentOrderDetails;
  }

  async function getItemForIndentorder({ logTrace, params }) {
    const knex = this;
    const { company_id } = params;

    const query = knex
      .select([
        `${ITEM.NAME}.*`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.FULLNAME} as company_name`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_category_name`,
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
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
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      // ✅ filter by company_id
      .where(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, company_id)
      // ✅ only items where IS_INDENT_APPLICABLE = 1
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_INDENT_APPLICABLE}`, 1)
      // ✅ order by ID ascending
      .orderBy(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Item for Indent Order",
      logTrace,
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `No items found for company_id ${company_id}`,
        property: "",
        code: "NOT_FOUND",
      });
    }

    return response;
  }

  async function getIndentDetails({ body, params, query, logTrace }) {
    const knex = this;
    const { wh_id, outlet_id, indent, date, companyid } = params;
    console.log("outlet_id", outlet_id);
    const query1 = knex
      .select([
        `${INDENT_MASTER.NAME}.*`
      ])
      .from(`${INDENT_MASTER.NAME} as ${INDENT_MASTER.NAME}`)
      .where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.WH_ID}`,
        wh_id
      )
      .where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.OUTLET_ID}`,
        outlet_id
      )
      .where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.INDENT_DATE}`,
        date
      )
      .where(
        `${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.COMPANY_ID}`,
        companyid
      )

    query1.orderBy(`${INDENT_MASTER.NAME}.${INDENT_MASTER.COLUMNS.ID}`, "DESC");

    // Log the query for debugging
    const response = await query1;
    if (!response.length) {
      return [];
    }

    const indentOrderDetails = await Promise.all(
      response.map(async indent => {
        const indent_details_lines = await knex
          .select([
            `${INDENT_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.SHORT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`
          ])
          .from(`${INDENT_DETAILS.NAME} as ${INDENT_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          )
          .where(
            `${INDENT_DETAILS.NAME}.${INDENT_DETAILS.COLUMNS.INDENT_MST_ID}`,
            indent.id
          );

        return { ...indent, indent_details_lines };

      })
    );

    return indentOrderDetails;
  }
  return {
    postIndentOrderProduct,
    getIndentOrderProductIndentNo,
    getIndentOrderProductMinStock,
    getIndentOrderProductDetails,
    getIndentOrderProductDetailsAll,
    getIndentOrderProductSalesBased,
    getIndentOrderWarehouseOutletList,
    getIndentOrderOutletWarehouseList,
    getIndentOrderDetails,
    getItemForIndentorder,
    getIndentDetails
  };
}

module.exports = indentOrderRepo
