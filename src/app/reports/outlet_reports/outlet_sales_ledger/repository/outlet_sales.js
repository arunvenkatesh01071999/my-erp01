const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../../errorHandler");
const { logQuery } = require("../../../../commons/helpers");
const { OUTLETSALESMASTER, OUTLETSALESDETAILS } = require("../../../../outlet_sales/outlet_sales_master/commons/constants");
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

function getOutletSalesRepo(fastify) {

  async function getOutletSaleByYear({ params, logTrace }) {
    const knex = this;

    const query = knex(OUTLETSALESMASTER.NAME)
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
    if (params.outlet_id && params.outlet_id !== 0) {
      query.where(`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`, params.outlet_id);
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get   year sales",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Sales  not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function getOutletSalesByMonth({ params, logTrace }) {
    const knex = this;

    const query = knex(OUTLETSALESMASTER.NAME)
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
    if (params.outlet_id && params.outlet_id !== 0) {
      query.where(`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`, params.outlet_id);
    }

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
  async function getOutletSalesPaginateByDate({
    params,
    logTrace,
    page_size,
    current_page
  }) {
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
      .from(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
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
        `DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.CREATED_AT}) >= ?`,
        [params.date]
      )
      .whereRaw(
        `DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.CREATED_AT}) <= ?`,
        [params.date]
      );
    if (params.outlet_id && params.outlet_id !== 0) {
      query.where(`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`, params.outlet_id);
    }


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Sales",
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
        message: "Outlet Sales not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const outlet_sales_details = await Promise.all(
      response.data.map(async outlet_sales => {
        const outlet_sales_lines = await knex
          .select([
            `${OUTLETSALESDETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
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
            outlet_sales.docno
          );

        return { ...outlet_sales, outlet_sales_lines };
      })
    );
    return {
      data: outlet_sales_details,
      meta: response.meta
    };



  }
  async function getallOutletsSales({ params, logTrace }) {
    const knex = this;

    const query = knex(OUTLETSALESMASTER.NAME)
      .select(
        'b.id as outlet_id',
        'b.code',
        'b.short_name',
        'b.fullname',
        knex.raw('COUNT(*) as bills'),
        knex.raw('SUM(amount) as total'),
        knex.raw(`SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.CASH_AMOUNT}) AS total_cash_amount`),
        knex.raw(`SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.CARD_AMOUNT}) AS total_card_amount`),
        knex.raw(`SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.UPI_AMOUNT}) AS total_upi_amount`),
        knex.raw(`SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.RETURN_AMOUNT}) AS total_return_amount`),
        knex.raw(`SUM(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.AMOUNT}) AS total_amount`),
        knex.raw(`COUNT(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.ID}) AS total_invoices`),
        'b.fullname as outlet_fullname', // Adjusted reference
        'b.short_name as outlet_shortname', // Adjusted reference
        'b.code as outlet_code' // Adjusted reference
      )
      .leftJoin('public.outlets as b', 'b.id', '=', `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`)
      .groupBy('b.code', 'b.short_name', 'b.fullname', 'b.id')
      .orderBy('b.code');



    // Conditionally add filters based on provided parameters
    if (params.from_year && params.to_year) {
      query.whereBetween(
        knex.raw(`EXTRACT(year FROM ${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.CREATED_AT})`),
        [params.from_year, params.to_year]
      );
    }

    if (params.outlet_id && params.outlet_id !== 0) {
      query.where(`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`, params.outlet_id);
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get year sales",
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

  return {

    getOutletSaleByYear,
    getOutletSalesByMonth,
    getOutletSalesPaginateByDate,
    getallOutletsSales

  };
}

module.exports = getOutletSalesRepo;
