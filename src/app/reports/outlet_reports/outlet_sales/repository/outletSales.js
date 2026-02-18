const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../../errorHandler");
const { logQuery } = require("../../../../commons/helpers");
const { OUTLETSALESMASTER, OUTLETSALESDETAILS } = require("../../../../outlet_sales/outlet_sales_master/commons/constants");
const { CLOSINGCASHMST, CLOSINGCASHDETAILS } = require("../../../../closing_cash/commons")
const { CLOSINGCASH_WH_MST,
  CLOSINGCASH_WH_DETAILS } = require("../../../../closing_cash_warehouse/commons")
const { BARCODE_LIST } = require("../../../../accounts/barcode/commons/constant")

const {
  MAIN_CATEGORY
} = require("../../../../catalog/category/commons/constants");
const { SUB_CATEGORY } = require("../../../../catalog/category/commons/constants");
const { UNITS } = require("../../../../catalog/units/commons/constants");
const { OUTLETS, OUTLETTYPE } = require("../../../../accounts/outlets/commons/constants");
const { STATES } = require("../../../../masterData/commons/constants");
const { CITIES } = require("../../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../../masterData/commons/constants");
const { ITEM } = require("../../../../catalog/commons");
const { HEADS } = require("../../../../catalog/commons");
const { TYPEDESIGN } = require("../../../../catalog/commons");
const { SALESMAN } = require("../../../../catalog/commons");


function outletSalesRepo(fastify) {

  async function outletSalesOutletWiseCurrentDateReport({ body, params, logTrace, queryString }) {
    const knex = this;

    const currentDate = new Date().toISOString().split('T')[0];

    const query = knex
      // .select([
      //   knex.raw(`SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.CASH_AMOUNT}) AS total_cash_amount`),
      //   knex.raw(`SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.CARD_AMOUNT}) AS total_card_amount`),
      //   knex.raw(`SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.UPI_AMOUNT}) AS total_upi_amount`),
      //   knex.raw(`SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.RETURN_AMOUNT}) AS total_return_amount`),
      //   knex.raw(`SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.AMOUNT}) AS total_amount`),
      //   knex.raw(`COUNT(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.ID}) AS total_invoices`),
      //   `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
      //   `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
      //   `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`
      // ])
      .select([
        knex.raw(`COALESCE(SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.CASH_AMOUNT}), 0) AS total_cash_amount`),
        knex.raw(`COALESCE(SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.CARD_AMOUNT}), 0) AS total_card_amount`),
        knex.raw(`COALESCE(SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.UPI_AMOUNT}), 0) AS total_upi_amount`),
        knex.raw(`COALESCE(SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.RETURN_AMOUNT}), 0) AS total_return_amount`),
        knex.raw(`COALESCE(SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.AMOUNT}), 0) AS total_amount`),
        knex.raw(`COALESCE(COUNT(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.ID}), 0) AS total_invoices`),
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`
      ])
      .from(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      // .whereRaw(
      //   `DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}) = ?`,
      //   [currentDate]
      // )
      .whereRaw(
        `DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}) >= ?`,
        [queryString.fromdate]
      )
      .whereRaw(
        `DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}) <= ?`,
        [queryString.todate]
      )

      // .whereRaw(
      //   `DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}) = ?`,
      //   ['2024-10-28']
      // )
      .orderBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`, "ASC")
      .groupBy(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`
      );

    if (queryString.outletid !== 'all') {
      query.where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        queryString.outletid
      );
    }


    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Sales data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const outletSalesWithAverage = response.map(row => ({
      ...row,
      average_amount: row.total_invoices > 0
        ? parseFloat(row.total_amount) / parseInt(row.total_invoices, 10)
        : 0
    }));
    console.log("outletSalesWithAverage", outletSalesWithAverage);

    const overallTotals = outletSalesWithAverage.reduce((totals, row) => {
      totals.total_cash_amount += isNaN(parseFloat(row.total_cash_amount)) ? 0 : parseFloat(row.total_cash_amount);
      totals.total_card_amount += isNaN(parseFloat(row.total_card_amount)) ? 0 : parseFloat(row.total_card_amount);
      totals.total_upi_amount += isNaN(parseFloat(row.total_upi_amount)) ? 0 : parseFloat(row.total_upi_amount);
      totals.total_return_amount += isNaN(parseFloat(row.total_return_amount)) ? 0 : parseFloat(row.total_return_amount);
      totals.total_amount += isNaN(parseFloat(row.total_amount)) ? 0 : parseFloat(row.total_amount);
      totals.total_invoices += isNaN(parseInt(row.total_invoices, 10)) ? 0 : parseInt(row.total_invoices, 10);
      return totals;
    }, {
      total_cash_amount: 0,
      total_card_amount: 0,
      total_upi_amount: 0,
      total_return_amount: 0,
      total_amount: 0,
      total_invoices: 0,
    });
    overallTotals.total_average = overallTotals.total_invoices > 0
      ? overallTotals.total_amount / overallTotals.total_invoices
      : 0;

    return { outletSales: outletSalesWithAverage, overallTotals };
  }

  async function getOutletSalesReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${OUTLETSALESMASTER.NAME}.*`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD1}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD2}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD4}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PINCODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PHONE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.MOBILE} as outlet_mobile`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.EMAIL}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.WEBSITE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.GSTIN}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FSSAI}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKACNO}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ACNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IFSCCODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ISGST}`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.OUTLETTYPE} as outlet_type_name`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANCODE}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SHORT_NAME} as sales_man_short_name`,
      ])
      .from(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.SALESMAN_ID}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`
      )
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
      )
      .whereRaw(
        `DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.ID}`, "DESC");


    if (Number(body.customer) && Number(body.customer) !== 0) {
      query.where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        body.customer
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Sales",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Sales data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const outletSalesdetails = await Promise.all(
      response.map(async outletSales => {
        const outletSales_lines = await knex
          .select([
            `${OUTLETSALESDETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${OUTLETSALESDETAILS.NAME} as ${OUTLETSALESDETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          )
          .leftJoin(
            `${HEADS.NAME} as ${HEADS.NAME}`,
            `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.HEAD_ID}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
          )
          .leftJoin(
            `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
            `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.TYPE_ID}`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
          )
          .leftJoin(
            `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
            `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
          )
          .leftJoin(
            `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
            `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
          )
          .where(
            `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
            outletSales.docno
          );

        return { ...outletSales, outletSales_lines };
      })
    );


    return outletSalesdetails;
  }
  async function getOutletSalesItemwiseReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex(OUTLETSALESDETAILS.NAME)
      .select(
        knex.raw("prodid"),
        knex.raw("sum(qty) as qty"),
        knex.raw("round(sum((outlet_sales_details.mrp - outlet_sales_details.mrp*dis_per/100)*qty), 2) as amount"),
        // knex.raw("round(sum((rate - rate*dis_per/100)*qty), 2) as amount"),
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.ID}`

      )
      .join(`${ITEM.NAME} as ${ITEM.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)

      .join(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`)

      .join(`${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`)

      .whereRaw(
        `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .groupBy(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.ID}`

      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        body.customer
      );
    }
    if (body.category && body.category !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`,
        body.category
      );
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`,
        body.subcategory
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Itemwise Outlet Sales",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Sales not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  async function getOutletSalesItemwiseBreakupReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex(OUTLETSALESDETAILS.NAME)
      .select(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`,
        knex.raw("sum(qty) as qty"),
        knex.raw("round(sum((outlet_sales_details.mrp - outlet_sales_details.mrp*dis_per/100)*qty), 2) as amount"),
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
      )
      .join(`${ITEM.NAME} as ${ITEM.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)

      .join(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`)

      .whereRaw(
        `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`, "DESC")
      .groupBy(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`,
      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        body.customer
      );
    }
    if (body.category && body.category !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`,
        body.category
      );
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`,
        body.subcategory
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Itemwise Outlet Sales",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Sales not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  async function outletSalesItemWiseAllReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex(OUTLETSALESDETAILS.NAME)
      .select(
        knex.raw("prodid"),
        knex.raw("sum(qty) as qty"),
        knex.raw("round(sum((rate - rate*dis_per/100)*qty), 2) as amount"),
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE} as outlet_code`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
      )
      .leftJoin(`${ITEM.NAME} as ${ITEM.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)

      .leftJoin(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`)

      .leftJoin(`${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`)

      .leftJoin(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`)

      .leftJoin(`${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.TYPE_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`)

      .leftJoin(`${HEADS.NAME} as ${HEADS.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)

      .leftJoin(`${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`)

      .whereRaw(
        `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .groupBy(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE} `,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        body.customer
      );
    }
    if (body.category && body.category !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`,
        body.category
      );
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`,
        body.subcategory
      );
    }
    if (body.type && body.type !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.TYPE_ID}`,
        body.type
      );
    }
    if (body.head && body.head !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.HEAD_ID}`,
        body.head
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Itemwise sales",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Sales not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  async function getOutletSalesGroupwiseAllReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex(OUTLETSALESDETAILS.NAME)
      .select(

        knex.raw("sum(qty) as qty"),
        knex.raw("round(sum((rate - rate*dis_per/100)*qty), 2) as amount"),
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE} as outlet_code`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
      )

      .leftJoin(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`)

      .leftJoin(`${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`)

      .leftJoin(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`)

      .leftJoin(`${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.TYPE_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`)

      .leftJoin(`${HEADS.NAME} as ${HEADS.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)

      .leftJoin(`${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`)

      .whereRaw(
        `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .groupBy(
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE} `,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        body.customer
      );
    }
    if (body.category && body.category !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`,
        body.category
      );
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`,
        body.subcategory
      );
    }
    if (body.type && body.type !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.TYPE_ID}`,
        body.type
      );
    }
    if (body.head && body.head !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.HEAD_ID}`,
        body.head
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Groupwise sales",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Groupwise Sales not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  async function outletSalesOverview({ body, params, logTrace }) {
    const knex = this;

    const query = knex('outlet_sales_master as a')
      .select(
        'a.outletid',
        knex.raw(
          `COALESCE((SELECT COUNT(*) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid), 0) as total_invoices`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid), 0) as total_sales`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(cash_amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid  ), 0) as total_cash`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(card_amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid  ), 0) as total_card`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(upi_amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid  ), 0) as total_upi`
        ),
        // knex.raw(
        //   `COALESCE((SELECT SUM(return_amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid  ), 0) as total_return`
        // ),
        knex.raw(
          `COALESCE((SELECT SUM(amount) FROM public.outlet_sales_return_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid), 0) as total_return`
        ),
        //       knex.raw(`((SELECT SUM(amount) 
        // FROM public.outlet_sales_return_master as b WHERE
        // b.docno = REGEXP_REPLACE(b.return_billno, '[/\-]', '_', 'g') 
        // AND 
        // b.outletid = a.outletid), 0) as total_return`),
        knex.raw(
          `COALESCE((SELECT SUM(amount) FROM public.outlet_sales_return_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid AND b.is_refund = true), 0) as total_return_by_cash`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(return_amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid  ), 0) as total_return_used`
        ),
        //       knex.raw(`COALESCE((SELECT SUM(amount) 
        // FROM public.outlet_sales_return_master as b WHERE
        // b.docno = REGEXP_REPLACE(b.return_billno, '[/\-]', '_', 'g') 
        // AND 
        // b.outletid = a.outletid AND b.is_refund = true), 0) as total_return_used`),
        knex.raw(
          `COALESCE((SELECT SUM(loyalty_redem) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid), 0) as total_loyalty`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(loyalty_redem) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid and b.mode='upi' ), 0) as total_loyalty_upi`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(loyalty_redem) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid and b.mode='cash'), 0) as total_loyalty_cash`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(loyalty_redem) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid and b.mode='mixed'), 0) as total_loyalty_mixed`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(loyalty_redem) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid and b.mode='card'), 0) as total_loyalty_card`
        ),
        knex.raw(
          `COALESCE((SELECT COUNT(*) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid and   b.return_amount>0  ), 0) as total_return_count`
        ),
        knex.raw(
          `COALESCE((SELECT COUNT(*) FROM public.outlet_sales_return_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid AND b.is_refund = true), 0) as total_return_cash_count`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(less_amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid and b.mode='cash'), 0) as less_amount_cash`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(less_amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid and b.mode='card'), 0) as less_amount_card`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(less_amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid and b.mode='upi'), 0) as less_amount_upi`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(less_amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid and b.mode='mixed'), 0) as less_amount_mixed`
        ),
        knex.raw(
          `COALESCE((SELECT SUM(less_amount) FROM public.outlet_sales_master as b WHERE b.docdate = a.docdate AND b.outletid = a.outletid  ), 0) as total_less_amount`
        )

      )
      .where('a.docdate', params.date)
      .andWhere('a.outletid', params.outletid)
      .distinct();

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Sales Overview",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Sales Overview not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response[0];
  }
  async function outletSalesItemWiseBreakupReportbyprodid({ body, params, logTrace }) {
    const knex = this;

    const query = knex(OUTLETSALESDETAILS.NAME)
      .select(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`,
        knex.raw("sum(qty) as qty"),
        knex.raw("round(sum((outlet_sales_details.mrp - outlet_sales_details.mrp*dis_per/100)*qty), 2) as amount"),
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
      )
      .join(`${ITEM.NAME} as ${ITEM.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)

      .join(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`)

      .whereRaw(
        `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`, "DESC")
      .groupBy(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`,
      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        body.customer
      );
    }
    if (body.category && body.category !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`,
        body.category
      );
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`,
        body.subcategory
      );
    }
    if (body.prodid && body.prodid !== 0) {
      query.where(
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        body.prodid
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Itemwise Outlet Sales",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Sales not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getCashCloseDenominatonByDate({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${CLOSINGCASHMST.NAME}.*`,
      ])
      .from(`${CLOSINGCASHMST.NAME} as ${CLOSINGCASHMST.NAME}`)
      .where(
        `${CLOSINGCASHMST.NAME}.${CLOSINGCASHMST.COLUMNS.DATE}`,
        params.date
      )
      .andWhere(
        `${CLOSINGCASHMST.NAME}.${CLOSINGCASHMST.COLUMNS.OUTLET_ID}`,
        params.outletid
      )


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Closing Cash",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      // throw CustomError.create({
      //   httpCode: StatusCodes.NOT_FOUND,
      //   message: "Closing cash data not found",
      //   property: "",
      //   code: "NOT_FOUND"
      // });
      return []
    }

    const closingCashDetails = await Promise.all(
      response.map(async closing_cash => {
        const closing_cash_lines = await knex
          .select([
            `${CLOSINGCASHDETAILS.NAME}.*`
          ])
          .from(`${CLOSINGCASHDETAILS.NAME} as ${CLOSINGCASHDETAILS.NAME}`)

          .where(
            `${CLOSINGCASHDETAILS.NAME}.${CLOSINGCASHDETAILS.COLUMNS.CLOSING_CASH_MST_ID}`,
            closing_cash.id
          );

        return { ...closing_cash, closing_cash_lines };
      })
    );

    return closingCashDetails;
  }

  // async function getOutletSalesBranchwiseReport({ body, params, logTrace }) {
  //   const knex = this;

  //   const selectFields = [
  //     knex.raw("SUM(??) as qty", `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.QTY}`)
  //   ];
  //   const groupByColumns = [];

  //   if (body.customer && body.customer !== 0) {
  //     selectFields.push(
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
  //     );
  //     groupByColumns.push(
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
  //     );
  //   }
  //   else {
  //     // Include all outlets if no specific customer filter
  //     selectFields.push(
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
  //     );
  //     groupByColumns.push(
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
  //     );
  //   }
  //   if (body.category && body.category !== 0) {
  //     selectFields.push(`${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`);
  //     groupByColumns.push(`${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`);
  //   }
  //   if (body.subcategory && body.subcategory !== 0) {
  //     selectFields.push(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`);
  //     groupByColumns.push(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`);
  //   }
  //   if (body.head && body.head !== 0) {
  //     selectFields.push(`${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`);
  //     groupByColumns.push(`${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`);
  //   }
  //   if (body.type && body.type !== 0) {
  //     selectFields.push(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`);
  //     groupByColumns.push(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`);
  //   }

  //   const query = knex(OUTLETSALESDETAILS.NAME)
  //     .select(selectFields)
  //     .join(`${ITEM.NAME} as ${ITEM.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`, `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
  //     .join(`${OUTLETS.NAME} as ${OUTLETS.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID}`, `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`)
  //     .join(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID}`, `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`)

  //     .join(`${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`, `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`)

  //     .join(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`, `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`)

  //     .join(`${HEADS.NAME} as ${HEADS.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.HEAD_ID}`, `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)

  //     .join(`${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.TYPE_ID}`, `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`)

  //     .whereRaw(`DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) >= ?`, [body.from_date])
  //     .whereRaw(`DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) <= ?`, [body.to_date])
  //     .groupBy(groupByColumns);

  //   if (body.customer && body.customer !== 0) {
  //     query.where(`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`, body.customer);
  //   }
  //   if (body.category && body.category !== 0) {
  //     query.where(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`, body.category);
  //   }
  //   if (body.subcategory && body.subcategory !== 0) {
  //     query.where(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`, body.subcategory);
  //   }
  //   if (body.head && body.head !== 0) {
  //     query.where(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.HEAD_ID}`, body.head);
  //   }
  //   if (body.type && body.type !== 0) {
  //     query.where(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.TYPE_ID}`, body.type);
  //   }

  //   logQuery({
  //     logger: fastify.log,
  //     query,
  //     context: "Get branchwise Outlet Sales",
  //     logTrace
  //   });

  //   const response = await query;

  //   if (!response.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "Data not found",
  //       property: "",
  //       code: "NOT_FOUND"
  //     });
  //   }

  //   const totalQty = response.reduce((sum, record) => sum + parseFloat(record.qty), 0);

  //   return { totalQty, data: response };
  // }

  async function getOutletSalesBranchwiseReport({ body, params, logTrace }) {
    const knex = this;

    const selectFields = [
      knex.raw(`ARRAY_AGG(DISTINCT ${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.BARCODE}) as solded_barcodes`),
    ]
    const groupByColumns = [];

    if (body.customer && body.customer !== 0) {
      selectFields.push(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
      );
      groupByColumns.push(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
      );
    }
    else {
      // Include all outlets if no specific customer filter
      selectFields.push(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
      );
      groupByColumns.push(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
      );
    }
    if (body.category && body.category !== 0) {
      selectFields.push(`${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`);
      groupByColumns.push(`${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`);
    }
    if (body.subcategory && body.subcategory !== 0) {
      selectFields.push(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`);
      groupByColumns.push(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`);
    }
    if (body.head && body.head !== 0) {
      selectFields.push(`${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`);
      groupByColumns.push(`${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`);
    }
    if (body.type && body.type !== 0) {
      selectFields.push(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`);
      groupByColumns.push(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`);
    }

    const query = knex(OUTLETSALESDETAILS.NAME)
      .select(selectFields)
      .join(`${ITEM.NAME} as ${ITEM.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`, `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
      .join(`${OUTLETS.NAME} as ${OUTLETS.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID}`, `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`)
      .join(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID}`, `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`)

      .join(`${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`, `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`)

      .join(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`, `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`)

      .join(`${HEADS.NAME} as ${HEADS.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.HEAD_ID}`, `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)

      .join(`${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`, `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.TYPE_ID}`, `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`)

      .whereRaw(`DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) >= ?`, [body.from_date])
      .whereRaw(`DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) <= ?`, [body.to_date])
      .groupBy(groupByColumns);

    if (body.customer && body.customer !== 0) {
      query.where(`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`, body.customer);
    }
    if (body.category && body.category !== 0) {
      query.where(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`, body.category);
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`, body.subcategory);
    }
    if (body.head && body.head !== 0) {
      query.where(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.HEAD_ID}`, body.head);
    }
    if (body.type && body.type !== 0) {
      query.where(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.TYPE_ID}`, body.type);
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get branchwise Outlet Sales",
      logTrace
    });

    const response1 = await query;
    const response = response1[0];


    if (!response1.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // console.log(response1, "response1");

    const updatedData = response1.map(({ solded_barcodes, ...rest }) => ({
      ...rest,
      qty: solded_barcodes.length,
    }));
    const totalQty = updatedData.reduce((sum, record) => sum + parseFloat(record.qty), 0);


    return { totalQty, data: updatedData };
  }



  async function getOutletSalesBranchwisePhysicalStockReport({ body, params, logTrace }) {
    const knex = this;

    const selectFields = [
      knex.raw(`COUNT(??) AS qty`, [`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`])
    ];

    const groupByColumns = [];

    if (body.customer && body.customer !== 0) {
      selectFields.push(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
      );
      groupByColumns.push(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
      );
    } else {
      // Include all outlets if no specific customer filter
      selectFields.push(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
      );
      groupByColumns.push(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
      );
    }

    if (body.category && body.category !== 0) {
      selectFields.push(`${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`);
      groupByColumns.push(`${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`);
    }
    if (body.subcategory && body.subcategory !== 0) {
      selectFields.push(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`);
      groupByColumns.push(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`);
    }
    if (body.head && body.head !== 0) {
      selectFields.push(`${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`);
      groupByColumns.push(`${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`);
    }
    if (body.type && body.type !== 0) {
      selectFields.push(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`);
      groupByColumns.push(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`);
    }
    // if (groupByColumns.length === 0) {
    //   groupByColumns.push(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`); // Fallback column to group by
    // }

    const query = knex(BARCODE_LIST.NAME)
      .select(selectFields)
      .leftJoin(`${ITEM.NAME} as ${ITEM.NAME}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
      .leftJoin(`${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`)
      .leftJoin(`${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)
      .leftJoin(`${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`)
      .leftJoin(`${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`)
      .leftJoin(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`, false)
      .groupBy(groupByColumns);

    if (body.customer && body.customer !== 0) {
      query.where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`, body.customer);
    }
    if (body.category && body.category !== 0) {
      query.where(`${ITEM.NAME}.${ITEM.COLUMNS.CATID}`, body.category);
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(`${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`, body.subcategory);
    }
    if (body.head && body.head !== 0) {
      query.where(`${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`, body.head);
    }
    if (body.type && body.type !== 0) {
      query.where(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`, body.type);
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get branchwise Outlet Sales",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const query1 = knex(BARCODE_LIST.NAME)
      .count(`* as count`)
      .whereNull(`${BARCODE_LIST.COLUMNS.OUTLET_ID}`);

    const response1 = await query1;
    const totalQty = response.reduce((sum, record) => sum + parseFloat(record.qty), 0);
    const totalWhereHouseQty = response1[0].count;

    return { totalQty, totalWhereHouseQty, data: response };
  }
  async function getWarehouseCashCloseDenominatonByDate({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${CLOSINGCASH_WH_MST.NAME}.*`,
      ])
      .from(`${CLOSINGCASH_WH_MST.NAME} as ${CLOSINGCASH_WH_MST.NAME}`)
      .where(
        `${CLOSINGCASH_WH_MST.NAME}.${CLOSINGCASH_WH_MST.COLUMNS.DATE}`,
        params.date
      )

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Closing Cash",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      // throw CustomError.create({
      //   httpCode: StatusCodes.NOT_FOUND,
      //   message: "Closing cash data not found",
      //   property: "",
      //   code: "NOT_FOUND"
      // });
      return []
    }

    const closingCashDetails = await Promise.all(
      response.map(async closing_cash => {
        const closing_cash_lines = await knex
          .select([
            `${CLOSINGCASH_WH_DETAILS.NAME}.*`
          ])
          .from(`${CLOSINGCASH_WH_DETAILS.NAME} as ${CLOSINGCASH_WH_DETAILS.NAME}`)

          .where(
            `${CLOSINGCASH_WH_DETAILS.NAME}.${CLOSINGCASH_WH_DETAILS.COLUMNS.CLOSING_CASH_WH_MST_ID}`,
            closing_cash.id
          );

        return { ...closing_cash, closing_cash_lines };
      })
    );

    return closingCashDetails;
  }

  return {
    getOutletSalesReport,
    getOutletSalesItemwiseReport,
    getOutletSalesItemwiseBreakupReport,
    outletSalesItemWiseAllReport,
    getOutletSalesGroupwiseAllReport,
    outletSalesOverview,
    outletSalesItemWiseBreakupReportbyprodid,
    getCashCloseDenominatonByDate,
    getOutletSalesBranchwiseReport,
    getOutletSalesBranchwisePhysicalStockReport,
    outletSalesOutletWiseCurrentDateReport,
    getWarehouseCashCloseDenominatonByDate
  };
}

module.exports = outletSalesRepo;
