const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CLOSINGEXPENCESMST,
  CLOSINGEXPENCESDETAILS } = require("../../../closing_expences/commons");

const {
  SALESMAN
} = require("../../../catalog/commons");
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

function closingExpencesRepo(fastify) {
  async function getclosingExpencesReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${CLOSINGEXPENCESMST.NAME}.*`,
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

        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANCODE}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SHORT_NAME} as sales_man_short_name`

      ])
      .from(`${CLOSINGEXPENCESMST.NAME} as ${CLOSINGEXPENCESMST.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
        `${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.SALESMAN_ID}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`
      )

      .whereRaw(
        `DATE(${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.DATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.DATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(`${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.ID}`, "DESC");

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.OUTLET_ID}`,
        body.customer
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Closing Expences",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Closing expences data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const closingExpencesDetails = await Promise.all(
      response.map(async closing_expences => {
        const closing_expences_lines = await knex
          .select([
            `${CLOSINGEXPENCESDETAILS.NAME}.*`
          ])
          .from(`${CLOSINGEXPENCESDETAILS.NAME} as ${CLOSINGEXPENCESDETAILS.NAME}`)

          .where(
            `${CLOSINGEXPENCESDETAILS.NAME}.${CLOSINGEXPENCESDETAILS.COLUMNS.CLOSING_EXPENCES_MST_ID}`,
            closing_expences.id
          );

        return { ...closing_expences, closing_expences_lines };
      })
    );

    return closingExpencesDetails;
  }

  return {
    getclosingExpencesReport
  };
}

module.exports = closingExpencesRepo;
