const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CLOSINGEXPENCES_WH_MST,
  CLOSINGEXPENCES_WH_DETAILS } = require("../../commons");
// const { OUTLET } = require("\app\accounts\outlets\commons\constants.js");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { CLOSINGCASH_WH_MST } = require("../../../closing_cash_warehouse/commons");


function getClosingExpencesMstRepo(fastify) {

  async function postClosingExpencesWhMst({ params, body, logTrace, userDetails }) {
    const knex = this;


    const query1 = knex(CLOSINGEXPENCES_WH_MST.NAME)
      .where(CLOSINGEXPENCES_WH_MST.COLUMNS.DATE, body.date)
      .where(CLOSINGEXPENCES_WH_MST.COLUMNS.WAREHOUSE_ID, body.warehouse_id)


    logQuery({
      logger: fastify.log,
      query: query1,
      context: "Expences Close",
      logTrace
    });

    const exists_response = await query1;
    if (exists_response.length > 0) {
      // throw CustomError.create({
      //   httpCode: StatusCodes.NOT_ACCEPTABLE,
      //   message: `Expences Close already done for this dats of ${body.date} `,
      //   property: "",
      //   code: "NOT_ACCEPTABLE"
      // });


      const deleteQueryClosingExpencesMst = await knex(CLOSINGEXPENCES_WH_MST.NAME)
        .where(CLOSINGEXPENCES_WH_MST.COLUMNS.DATE, body.date)
        .where(CLOSINGEXPENCES_WH_MST.COLUMNS.WAREHOUSE_ID, body.warehouse_id)

        .del();

      const deleteQueryClosingExpencesDetail = await knex(CLOSINGEXPENCES_WH_DETAILS.NAME)
        .where(CLOSINGEXPENCES_WH_DETAILS.COLUMNS.DATE, body.date)
        .where(CLOSINGEXPENCES_WH_DETAILS.COLUMNS.WAREHOUSE_ID, body.warehouse_id)

        .del();

    }

    //***********************1. stock missing master insert  **********   
    var ClosingExpencesMst_Data = {
      date: body.date,
      warehouse_id: body.warehouse_id,
      salesman_id: body.salesman_id,
      opening_balance: body.opening_balance,
      expences_amount: body.expences_amount,
      closing_balance: body.closing_balance,
      total_amount: body.total_amount
    }

    const ClosingExpencesMst_Data_insert = await knex(`${CLOSINGEXPENCES_WH_MST.NAME}`).returning("id").insert
      ({
        [CLOSINGEXPENCES_WH_MST.COLUMNS.DATE]: ClosingExpencesMst_Data.date,
        [CLOSINGEXPENCES_WH_MST.COLUMNS.WAREHOUSE_ID]: ClosingExpencesMst_Data.warehouse_id,
        [CLOSINGEXPENCES_WH_MST.COLUMNS.SALESMAN_ID]: ClosingExpencesMst_Data.salesman_id,
        [CLOSINGEXPENCES_WH_MST.COLUMNS.OPENING_BALANCE]: ClosingExpencesMst_Data.opening_balance,
        [CLOSINGEXPENCES_WH_MST.COLUMNS.EXPENCES_AMOUNT]: ClosingExpencesMst_Data.expences_amount,
        [CLOSINGEXPENCES_WH_MST.COLUMNS.CLOSING_BALANCE]: ClosingExpencesMst_Data.closing_balance,
        [CLOSINGEXPENCES_WH_MST.COLUMNS.TOTAL_AMOUNT]: ClosingExpencesMst_Data.total_amount

      });


    var closing_expences_wh_mst_id = ClosingExpencesMst_Data_insert[0].id;

    //*************** 2. closing_Expences_details insert  **********

    if (body.closing_expences_wh_details.length > 0) {

      for (var i = 0; i < body.closing_expences_wh_details.length; i++) {
        var closing_expences_wh_details = body.closing_expences_wh_details[i];

        var closing_expences_wh_details_Data = {
          warehouse_id: body.warehouse_id,
          closing_expences_wh_mst_id: closing_expences_wh_mst_id,
          date: closing_expences_wh_details.date,
          denomination: closing_expences_wh_details.denomination,
          count: closing_expences_wh_details.count,
          total: closing_expences_wh_details.total
        }


        const query_insert2 = await knex(`${CLOSINGEXPENCES_WH_DETAILS.NAME}`).insert
          ({
            [CLOSINGEXPENCES_WH_DETAILS.COLUMNS.CLOSING_EXPENCES_WH_MST_ID]: closing_expences_wh_details_Data.closing_expences_wh_mst_id,
            [CLOSINGEXPENCES_WH_DETAILS.COLUMNS.WAREHOUSE_ID]: closing_expences_wh_details_Data.warehouse_id,
            [CLOSINGEXPENCES_WH_DETAILS.COLUMNS.DATE]: closing_expences_wh_details_Data.date,
            [CLOSINGEXPENCES_WH_DETAILS.COLUMNS.DENOMINATION]: closing_expences_wh_details_Data.denomination,
            [CLOSINGEXPENCES_WH_DETAILS.COLUMNS.COUNT]: closing_expences_wh_details_Data.count,
            [CLOSINGEXPENCES_WH_DETAILS.COLUMNS.TOTAL]: closing_expences_wh_details_Data.total,
            [CLOSINGEXPENCES_WH_DETAILS.COLUMNS.CREATED_BY]: 2
          });

      }
    }


    return { success: true };
  }

  async function postClosingExpencesMstGetOne({ params, body, logTrace, userDetails }) {
    const knex = this;

    const query1 = knex(CLOSINGEXPENCES_WH_MST.NAME)
      .where(CLOSINGEXPENCES_WH_MST.COLUMNS.DATE, body.date)
      .where(CLOSINGEXPENCES_WH_MST.COLUMNS.WAREHOUSE_ID, body.warehouse_id)


    logQuery({
      logger: fastify.log,
      query: query1,
      context: "Warehouse Expences Close",
      logTrace
    });
    const response = await query1

    const closingExpencesDetails = await Promise.all(
      response.map(async closing_expences => {
        const closing_expences_lines = await knex
          .select([
            `${CLOSINGEXPENCES_WH_DETAILS.NAME}.*`
          ])
          .from(`${CLOSINGEXPENCES_WH_DETAILS.NAME} as ${CLOSINGEXPENCES_WH_DETAILS.NAME}`)

          .where(
            `${CLOSINGEXPENCES_WH_DETAILS.NAME}.${CLOSINGEXPENCES_WH_DETAILS.COLUMNS.CLOSING_EXPENCES_WH_MST_ID}`,
            closing_expences.id
          );

        return { ...closing_expences, closing_expences_lines };
      })
    );


    return closingExpencesDetails
  }

  async function postClosingBankAmount({ params, body, logTrace, userDetails }) {
    const knex = this;

    const warehouse_id = body.warehouse_id

    const query1 = await knex(CLOSINGEXPENCES_WH_MST.NAME)
      .where(CLOSINGEXPENCES_WH_MST.COLUMNS.WAREHOUSE_ID, warehouse_id)
      .sum(`${CLOSINGEXPENCES_WH_MST.COLUMNS.TOTAL_AMOUNT} as total_amount_sum`)


    const closing_expence_total_amount = query1[0].total_amount_sum


    // const query2 = await knex(OUTLETS.NAME)
    //   .where(OUTLETS.COLUMNS.ID, outlet_id);

    // const wallet_balance = query2[0].wallet_balance


    const sumQuery = await knex(CLOSINGCASH_WH_MST.NAME)
      .where(CLOSINGCASH_WH_MST.COLUMNS.WAREHOUSE_ID, warehouse_id)
      .sum(`${CLOSINGCASH_WH_MST.COLUMNS.TOTAL_CARD} as total_card_sum`)
      .sum(`${CLOSINGCASH_WH_MST.COLUMNS.TOTAL_UPI} as total_upi_sum`);


    const total_cards_sum = sumQuery[0].total_card_sum
    const total_upis_sum = sumQuery[0].total_upi_sum

    const total_card_sum = parseInt(total_cards_sum, 10)
    const total_upi_sum = parseInt(total_upis_sum, 10)


    const bank_amount = total_card_sum + total_upi_sum


    return {
      // "wallet_balance": wallet_balance,
      "bank_amount": bank_amount,
      "closing_expence_total_amount": closing_expence_total_amount
    };
  }
  return {
    postClosingExpencesWhMst,
    postClosingBankAmount,
    postClosingExpencesMstGetOne
  };
}

module.exports = getClosingExpencesMstRepo;
