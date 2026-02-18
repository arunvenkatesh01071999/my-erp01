const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SALESMASTER, SALESDETAILS, SALESRETURNMASTER, SALESRETURNDETAILS } = require("../../../sales/commons");

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

function salesRepo(fastify) {
  async function getSalesReturnReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${SALESRETURNMASTER.NAME}.*`,
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
      .from(`${SALESRETURNMASTER.NAME} as ${SALESRETURNMASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${SALESRETURNMASTER.NAME}.${SALESRETURNMASTER.COLUMNS.PARTYCODE}`,
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
        `DATE(${SALESRETURNMASTER.NAME}.${SALESRETURNMASTER.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${SALESRETURNMASTER.NAME}.${SALESRETURNMASTER.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${SALESRETURNMASTER.NAME}.${SALESRETURNMASTER.COLUMNS.PARTYCODE}`,
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
            `${SALESRETURNDETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${SALESRETURNDETAILS.NAME} as ${SALESRETURNDETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${SALESRETURNDETAILS.NAME}.${SALESRETURNDETAILS.COLUMNS.PRODID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${SALESRETURNDETAILS.NAME}.${SALESRETURNDETAILS.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          )
          .leftJoin(
            `${HEADS.NAME} as ${HEADS.NAME}`,
            `${SALESRETURNDETAILS.NAME}.${SALESRETURNDETAILS.COLUMNS.HEAD_ID}`,
            `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
          )
          .leftJoin(
            `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
            `${SALESRETURNDETAILS.NAME}.${SALESRETURNDETAILS.COLUMNS.TYPE_ID}`,
            `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
          )
          .leftJoin(
            `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
            `${SALESRETURNDETAILS.NAME}.${SALESRETURNDETAILS.COLUMNS.CAT_ID}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
          )
          .leftJoin(
            `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
            `${SALESRETURNDETAILS.NAME}.${SALESRETURNDETAILS.COLUMNS.SUBCAT_ID}`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
          )
          .where(
            `${SALESRETURNDETAILS.NAME}.${SALESRETURNDETAILS.COLUMNS.SALES_MST_ID}`,
            sales.id
          );

        return { ...sales, sales_lines };
      })
    );

    return salesdetails;
  }

  return {
    getSalesReturnReport
  };
}

module.exports = salesRepo;
