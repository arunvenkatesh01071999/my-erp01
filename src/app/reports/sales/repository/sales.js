const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SALESMASTER, SALESDETAILS } = require("../../../sales/commons");
const {
  MAIN_CATEGORY
} = require("../../../catalog/category/commons/constants");
const { SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
// const { OUTLETTYPE } = require("../../../outlet_sales/outlet_sales_master/commons/constants");

const { UNITS } = require("../../../catalog/units/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { OUTLETTYPE } = require("../../../accounts/outlets/commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { ITEM } = require("../../../catalog/commons");
const { HEADS } = require("../../../catalog/commons");
const { TYPEDESIGN } = require("../../../catalog/commons");

function salesRepo(fastify) {
  async function getSalesReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${SALESMASTER.NAME}.*`,
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
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.MOBILE}`,
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
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${SALESMASTER.NAME} as ${SALESMASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
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
        `DATE(${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.ID}`, "DESC");



    if (body.customer && body.customer !== 0) {
      query.where(
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
        body.customer
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Sales",
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

    const salesdetails = await Promise.all(
      response.map(async sales => {
        const sales_lines = await knex
          .select([
            `${SALESDETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${SALESDETAILS.NAME} as ${SALESDETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          )
          .leftJoin(
            `${HEADS.NAME} as ${HEADS.NAME}`,
            `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.HEAD_ID}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
          )
          .leftJoin(
            `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
            `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.TYPE_ID}`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
          )
          .leftJoin(
            `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
            `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
          )
          .leftJoin(
            `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
            `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
          )
          .where(
            `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SALES_MST_ID}`,
            sales.id
          );

        return { ...sales, sales_lines };

      })
    );

    return salesdetails;
  }
  async function getSalesItemwiseReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex(SALESDETAILS.NAME)
      .select(
        knex.raw("prodid"),
        knex.raw("sum(qty) as qty"),
        knex.raw("round(sum((rate - rate*dis_per/100)*qty), 2) as amount"),
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
      )
      .join(`${ITEM.NAME} as ${ITEM.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)

      .join(`${SALESMASTER.NAME} as ${SALESMASTER.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SALES_MST_ID}`,
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.ID}`)

      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .groupBy(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
        body.customer
      );
    }
    if (body.category && body.category !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
        body.category
      );
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
        body.subcategory
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

  async function getSalesItemwiseBreakupReportProdid({ body, params, logTrace }) {
    const knex = this;

    const query = knex(SALESDETAILS.NAME)
      .select(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`,
        knex.raw("sum(qty) as qty"),
        knex.raw("round(sum((rate - rate*dis_per/100)*qty), 2) as amount"),
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
      )
      .join(`${ITEM.NAME} as ${ITEM.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)

      .join(`${SALESMASTER.NAME} as ${SALESMASTER.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SALES_MST_ID}`,
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.ID}`)

      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`, "DESC")
      .groupBy(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`,
      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
        body.customer
      );
    }
    if (body.category && body.category !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
        body.category
      );
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
        body.subcategory
      );
    }
    if (body.prodid && body.prodid !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        body.prodid
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

  async function getSalesItemwiseBreakupReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex(SALESDETAILS.NAME)
      .select(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`,
        knex.raw("sum(qty) as qty"),
        knex.raw("round(sum((rate - rate*dis_per/100)*qty), 2) as amount"),
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
      )
      .join(`${ITEM.NAME} as ${ITEM.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)

      .join(`${SALESMASTER.NAME} as ${SALESMASTER.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SALES_MST_ID}`,
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.ID}`)

      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`, "DESC")
      .groupBy(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`,
      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
        body.customer
      );
    }
    if (body.category && body.category !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
        body.category
      );
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
        body.subcategory
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
  async function getSalesItemwiseAllReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex(SALESDETAILS.NAME)
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
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)

      .leftJoin(`${SALESMASTER.NAME} as ${SALESMASTER.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SALES_MST_ID}`,
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.ID}`)

      .leftJoin(`${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`)

      .leftJoin(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`)

      .leftJoin(`${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.TYPE_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`)

      .leftJoin(`${HEADS.NAME} as ${HEADS.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)

      .leftJoin(`${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`)

      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .groupBy(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
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
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
        body.customer
      );
    }
    if (body.category && body.category !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
        body.category
      );
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
        body.subcategory
      );
    }
    if (body.type && body.type !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.TYPE_ID}`,
        body.type
      );
    }
    if (body.head && body.head !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.HEAD_ID}`,
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
  async function getSalesGroupwiseAllReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex(SALESDETAILS.NAME)
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

      .leftJoin(`${SALESMASTER.NAME} as ${SALESMASTER.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SALES_MST_ID}`,
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.ID}`)

      .leftJoin(`${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`)

      .leftJoin(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`)

      .leftJoin(`${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.TYPE_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`)

      .leftJoin(`${HEADS.NAME} as ${HEADS.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`)

      .leftJoin(`${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`)

      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
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
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
        body.customer
      );
    }
    if (body.category && body.category !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
        body.category
      );
    }
    if (body.subcategory && body.subcategory !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
        body.subcategory
      );
    }
    if (body.type && body.type !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.TYPE_ID}`,
        body.type
      );
    }
    if (body.head && body.head !== 0) {
      query.where(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.HEAD_ID}`,
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

  async function getSalesOutletTypeReport({ body, params, logTrace }) {
    const knex = this;

    const query = knex(OUTLETTYPE.NAME)

    //   knex
    // .from('books')


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Sales Outlet Type",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Type not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }


  async function getSalesTransferReport({ body, params, logTrace }) {
    const knex = this;


    const query = knex(SALESDETAILS.NAME)
      .select(

        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCNO}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.GST_PER}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
        knex.raw("sum(item.pur_rate*qty) as amount"),
        knex.raw("sum((item.pur_rate*qty*sales_details.gst_per/100)) as gst_amt"),
        knex.raw("sum(qty) as qty"),
        knex.raw("sum((item.pur_rate*qty*sales_details.igst_per/100)) as igst_amt"),
        knex.raw("sum((item.pur_rate*qty*sales_details.cess_per/100)) as cess_amt"),

      )
      .innerJoin(`${ITEM.NAME} as ${ITEM.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
      .innerJoin(`${SALESMASTER.NAME} as ${SALESMASTER.NAME}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SALES_MST_ID}`,
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.ID}`)
      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .groupBy(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCNO}`,
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.GST_PER}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
      )
      .orderBy(
        `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.GST_PER}`, "ASC",

      );

    if (body.customer && body.customer !== 0) {
      query.where(
        `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
        body.customer
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Sales Details Transfer",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Sales Details Transfer Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  return {
    getSalesReport,
    getSalesItemwiseReport,
    getSalesItemwiseBreakupReport,
    getSalesItemwiseAllReport,
    getSalesGroupwiseAllReport,
    getSalesItemwiseBreakupReportProdid,
    getSalesOutletTypeReport,
    getSalesTransferReport
  };
}

module.exports = salesRepo;
