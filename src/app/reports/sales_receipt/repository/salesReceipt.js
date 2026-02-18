const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { RECEIPT_MASTER, RECEIPT_DETAIL } = require("../../../receipt/commons/constants");
const { SALESMASTER } = require("../../../sales/commons");
const { SUPPLIER } = require("../../../catalog/commons");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { OUTLETS } = require("../../../outlet_sales/outlet_sales_master/commons/constants")



function salesReceiptRepo(fastify) {
  async function getSalesReceiptReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${RECEIPT_MASTER.NAME}.*`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD1}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD2}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD3}`,
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
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BALANCE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COMPANY_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ISGST}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FRANCHISETYPE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BALANCE}`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${RECEIPT_MASTER.NAME} as ${RECEIPT_MASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${RECEIPT_MASTER.NAME}.${RECEIPT_MASTER.COLUMNS.SUPPLIER_ID}`,
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
      .whereRaw(
        `DATE(${RECEIPT_MASTER.NAME}.${RECEIPT_MASTER.COLUMNS.DATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${RECEIPT_MASTER.NAME}.${RECEIPT_MASTER.COLUMNS.DATE}) <= ?`,
        [body.to_date]
      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${RECEIPT_MASTER.NAME}.${RECEIPT_MASTER.COLUMNS.SUPPLIER_ID}`,
        body.customer
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Sales Receipt Details",
      logTrace
    });
    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Warehouse Receipt Details Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const receiptDetails = await Promise.all(
      response.map(async receipt => {
        const receipt_lines = await knex
          .select([
            `${RECEIPT_DETAIL.NAME}.*`,
          ])
          .from(`${RECEIPT_DETAIL.NAME} as ${RECEIPT_DETAIL.NAME}`)
          .where(
            `${RECEIPT_DETAIL.NAME}.${RECEIPT_DETAIL.COLUMNS.RM_ID}`,
            receipt.id
          );

        return { ...receipt, receipt_lines };
      })
    );

    return receiptDetails;
  }

  return {
    getSalesReceiptReport
  };
}

module.exports = salesReceiptRepo;
