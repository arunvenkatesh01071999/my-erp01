const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
// const { PURCHASE_MST,
//   PURCHASE_MST_PONUM,
//   PURCHASE_DETAILS,
//   PARTYLEDGER,
//   STOCKLEDGER,
//   PURCHASERETURNMASTER,
//   PURCHASERETURNDETAIL } = require("../../../purchase/commons");
const {
  MAIN_CATEGORY
} = require("../../../catalog/category/commons/constants");
const { SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { OUTLETTYPE } = require("../../../accounts/outlets/commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { ITEM, HEADS, TYPEDESIGN, SUPPLIER } = require("../../../catalog/commons");

function purchaseRepo(fastify) {

  async function getPurchaseByYear({ params, logTrace }) {
    const knex = this;

    const query = knex(PURCHASE_MST.NAME)
      .select(
        knex.raw("TO_CHAR(created_at, 'Mon') AS month"),
        knex.raw("EXTRACT(month FROM created_at) AS month_number"),
        knex.raw("EXTRACT(year FROM created_at) AS year"),
        knex.raw("COUNT(*) AS no_of_sales"),
        knex.raw("SUM(amount) AS amount")
      )
      .groupByRaw(
        "TO_CHAR(created_at, 'Mon'), EXTRACT(year FROM created_at),EXTRACT(month FROM created_at)"
      )
      .where(knex.raw("EXTRACT(year FROM created_at) >= ?", params.from_year))
      .where(knex.raw("EXTRACT(year FROM created_at) <= ?", params.to_year))
      .orderByRaw("year, month_number");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get year purchase",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchases  not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function getPurchaseByMonth({ params, logTrace }) {
    const knex = this;

    const query = knex(PURCHASE_MST.NAME)
      .select(
        knex.raw("DATE(created_at) AS date"),
        knex.raw("COUNT(*) AS no_of_sales"),
        knex.raw("SUM(amount) AS amount")
      )
      // .where(knex.raw("EXTRACT(month FROM created_at) = ?", params.month))
      .where(knex.raw("TO_CHAR(created_at, 'Mon')  = ?", params.month))
      .where(knex.raw("EXTRACT(year FROM created_at) = ?", params.year))
      .groupByRaw("DATE(created_at)")
      .orderByRaw("DATE(created_at)");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get sales month sales",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Order not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  async function getPurchasePaginateByDate({
    params,
    logTrace,
    page_size,
    current_page
  }) {
    const knex = this;
    const query = knex
      .select([
        `${PURCHASE_MST.NAME}.*`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
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
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
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
      .whereRaw(
        `DATE(${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.CREATED_AT}) >= ?`,
        [params.date]
      )
      .whereRaw(
        `DATE(${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.CREATED_AT}) <= ?`,
        [params.date]
      );



    logQuery({
      logger: fastify.log,
      query,
      context: "Get Purchase",
      logTrace
    });


    const response = await query.paginate({
      pageSize: page_size, // Customize as needed
      currentPage: current_page // Customize as needed
    });
    if (response.meta.pagination.total_pages < current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const purchasedetails = await Promise.all(
      response.data.map(async purchase => {
        const purchase_lines = await knex
          .select([
            `${PURCHASE_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${PURCHASE_DETAILS.NAME} as ${PURCHASE_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          )
          .leftJoin(
            `${HEADS.NAME} as ${HEADS.NAME}`,
            `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.HEAD_ID}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
          )
          .leftJoin(
            `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
            `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.TYPE_ID}`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
          )
          .leftJoin(
            `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
            `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.CAT_ID}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
          )
          .leftJoin(
            `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
            `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.SUBCAT_ID}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
          )
          .where(
            `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.PURMST_ID}`,
            purchase.id
          );
        const po_details = await knex
          .select([
            `${PURCHASE_MST_PONUM.NAME}.*`,

          ])
          .from(`${PURCHASE_MST_PONUM.NAME} as ${PURCHASE_MST_PONUM.NAME}`)

          .where(
            `${PURCHASE_MST_PONUM.NAME}.${PURCHASE_MST_PONUM.COLUMNS.DOCNO}`,
            purchase.docno
          );

        return { ...purchase, purchase_lines, po_details };
      })
    );


    return {
      data: purchasedetails,
      meta: response.meta
    };



  }

  return {
    getPurchaseByYear,
    getPurchaseByMonth,
    getPurchasePaginateByDate
  };
}

module.exports = purchaseRepo;
