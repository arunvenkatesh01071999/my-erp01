const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CLOSINGCASH_WH_MST, CLOSINGCASH_WH_DETAILS } = require("../../commons");



function getClosingCashMstRepo(fastify) {

  async function postClosingCashWarehouseMst({ params, body, logTrace, userDetails }) {
    const knex = this;


    const query1 = knex(CLOSINGCASH_WH_MST.NAME)
      .where(CLOSINGCASH_WH_MST.COLUMNS.DATE, body.date)
      .where(CLOSINGCASH_WH_MST.COLUMNS.WAREHOUSE_ID, body.warehouse_id);

    logQuery({
      logger: fastify.log,
      query: query1,
      context: "Cash Close Warehouse",
      logTrace
    });
    const exists_response = await query1;
    if (exists_response.length > 0) {
      // throw CustomError.create({
      //   httpCode: StatusCodes.NOT_ACCEPTABLE,
      //   message: `Cash Close already done for this dats of ${body.date} `,
      //   property: "",
      //   code: "NOT_ACCEPTABLE"
      // });

      const deleteQueryClosingCashMst = await knex(CLOSINGCASH_WH_MST.NAME)
        .where(CLOSINGCASH_WH_MST.COLUMNS.DATE, body.date)
        .where(CLOSINGCASH_WH_MST.COLUMNS.WAREHOUSE_ID, body.warehouse_id)
        .del();

      const deleteQueryClosingCashDetail = await knex(CLOSINGCASH_WH_DETAILS.NAME)
        .where(CLOSINGCASH_WH_DETAILS.COLUMNS.DATE, body.date)
        .where(CLOSINGCASH_WH_DETAILS.COLUMNS.WAREHOUSE_ID, body.warehouse_id)
        .del();

    }

    //************* 1. closing cash warehouse master insert  *********************    
    var ClosingCashMst_Data = {
      warehouse_id: body.warehouse_id,
      date: body.date,
      total: body.total,
      amount_be_deposited: body.amount_be_deposited,
      next_day_balance: body.next_day_balance

    }

    const ClosingCashMst_Data_insert = await knex(`${CLOSINGCASH_WH_MST.NAME}`).returning("id").insert
      ({
        [CLOSINGCASH_WH_MST.COLUMNS.WAREHOUSE_ID]: ClosingCashMst_Data.warehouse_id,
        [CLOSINGCASH_WH_MST.COLUMNS.DATE]: ClosingCashMst_Data.date,
        [CLOSINGCASH_WH_MST.COLUMNS.TOTAL]: ClosingCashMst_Data.total,
        [CLOSINGCASH_WH_MST.COLUMNS.AMOUNT_TO_BE_DEPOSITED]: ClosingCashMst_Data.amount_be_deposited,
        [CLOSINGCASH_WH_MST.COLUMNS.NEXT_DAY_BALANCE]: ClosingCashMst_Data.next_day_balance,

      });


    var closing_cash_wh_mst_id = ClosingCashMst_Data_insert[0].id;


    //****************** 2. closing_cash warehouse details insert  ********************



    if (body.closing_cash_wh_details.length > 0) {

      for (var i = 0; i < body.closing_cash_wh_details.length; i++) {
        var closing_cash_wh_details = body.closing_cash_wh_details[i];
        // var is_verify_ck1 = stockMissingDetails.is_verify;

        var closing_cash_wh_details_Data = {
          closing_cash_wh_mst_id: closing_cash_wh_mst_id,
          date: closing_cash_wh_details.date,
          denomination: closing_cash_wh_details.denomination,
          count: closing_cash_wh_details.count,
          total: closing_cash_wh_details.total,
          warehouse_id: closing_cash_wh_details.warehouse_id
        }



        const query_insert2 = await knex(`${CLOSINGCASH_WH_DETAILS.NAME}`).insert
          ({
            [CLOSINGCASH_WH_DETAILS.COLUMNS.CLOSING_CASH_WH_MST_ID]: closing_cash_wh_details_Data.closing_cash_wh_mst_id,
            [CLOSINGCASH_WH_DETAILS.COLUMNS.DATE]: closing_cash_wh_details_Data.date,
            [CLOSINGCASH_WH_DETAILS.COLUMNS.DENOMINATION]: closing_cash_wh_details_Data.denomination,
            [CLOSINGCASH_WH_DETAILS.COLUMNS.COUNT]: closing_cash_wh_details_Data.count,
            [CLOSINGCASH_WH_DETAILS.COLUMNS.TOTAL]: closing_cash_wh_details_Data.total,
            [CLOSINGCASH_WH_DETAILS.COLUMNS.WAREHOUSE_ID]: closing_cash_wh_details_Data.warehouse_id,
            [CLOSINGCASH_WH_DETAILS.COLUMNS.CREATED_BY]: 2
          });


      }
    }


    return { success: true };
  }

  return {
    postClosingCashWarehouseMst
  };
}

module.exports = getClosingCashMstRepo;
