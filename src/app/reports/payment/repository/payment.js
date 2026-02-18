const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { PAYMENT_DETAIL, PAYMENT_MASTER } = require("../../../payment/commons/constants")
// const { PURCHASE_MST } = require("../../../purchase/commons")
const { SUPPLIER } = require("../../../catalog/commons");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");


function paymentRepo(fastify) {
  async function getPaymentReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${PAYMENT_MASTER.NAME}.*`,
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
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`,
        `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.DOCNO} as purchase_docno`,
      ])
      .from(`${PAYMENT_MASTER.NAME} as ${PAYMENT_MASTER.NAME}`)
      .leftJoin(
        `${PURCHASE_MST.NAME} as ${PURCHASE_MST.NAME}`,
        `${PAYMENT_MASTER.NAME}.${PAYMENT_MASTER.COLUMNS.ID}`,
        `${PURCHASE_MST.NAME}.${PURCHASE_MST.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${PAYMENT_MASTER.NAME}.${PAYMENT_MASTER.COLUMNS.SUPPLIER_ID}`,
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
        `DATE(${PAYMENT_MASTER.NAME}.${PAYMENT_MASTER.COLUMNS.DATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${PAYMENT_MASTER.NAME}.${PAYMENT_MASTER.COLUMNS.DATE}) <= ?`,
        [body.to_date]
      );

    // Conditionally add filters based on provided parameters
    if (body.customer && body.customer !== 0) {
      query.where(
        `${PAYMENT_MASTER.NAME}.${PAYMENT_MASTER.COLUMNS.SUPPLIER_ID}`,
        body.customer
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Payment details",
      logTrace
    });
    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Payment details not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const paymentdetails = await Promise.all(
      response.map(async payment => {
        const payment_lines = await knex
          .select([
            `${PAYMENT_DETAIL.NAME}.*`,
          ])
          .from(`${PAYMENT_DETAIL.NAME} as ${PAYMENT_DETAIL.NAME}`)
          .where(
            `${PAYMENT_DETAIL.NAME}.${PAYMENT_DETAIL.COLUMNS.PM_ID}`,
            payment.id
          );

        return { ...payment, payment_lines };
      })
    );

    return paymentdetails;




  }


  return {
    getPaymentReport
  };
}

module.exports = paymentRepo;