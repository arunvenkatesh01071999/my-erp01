const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");


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
const { ITEM } = require("../../../catalog/commons");
const { HEADS } = require("../../../catalog/commons");
const { TYPEDESIGN } = require("../../../catalog/commons");

const { OUTLETSALESRETURNMASTER,
  OUTLETSALESRETURNDETAILS, OUTLETSALESMASTER, OUTLETSALESDETAILS, OUTLETSTOCKLEDGER, SALESMANLEDGER } = require("../../../outlet_sales/outlet_sales_return_master/commons/constants");

function outletSalesRepo(fastify) {
  async function getoutletSalesReturnReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${OUTLETSALESRETURNMASTER.NAME}.*`,
      ])
      .from(`${OUTLETSALESRETURNMASTER.NAME} as ${OUTLETSALESRETURNMASTER.NAME}`)
      .whereRaw(
        `DATE(${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${OUTLETSALESRETURNMASTER.COLUMNS.ID}`, 'DESC');


    if (body.customer && body.customer !== 0) {
      query.where(
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.OUTLETID}`,
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

    const salesdetails = await Promise.all(
      response.map(async sales => {
        const outlet_sales_lines = await knex
          .select([
            `${OUTLETSALESRETURNDETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${OUTLETSALESRETURNDETAILS.NAME} as ${OUTLETSALESRETURNDETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.PRODID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          )
          .leftJoin(
            `${HEADS.NAME} as ${HEADS.NAME}`,
            `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.HEAD_ID}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
          )
          .leftJoin(
            `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
            `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.TYPE_ID}`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
          )
          .leftJoin(
            `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
            `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.CAT_ID}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
          )
          .leftJoin(
            `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
            `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.SUBCAT_ID}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
          )
          .where(
            `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DOCNO}`,
            sales.docno
          );

        return { ...sales, outlet_sales_lines };
      })
    );

    return salesdetails;
  }

  return {
    getoutletSalesReturnReport
  };
}

module.exports = outletSalesRepo;

// is_refund = false
