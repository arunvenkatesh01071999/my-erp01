const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CLOSINGCASHMST, CLOSINGCASHDETAILS } = require("../../commons");



function getClosingCashMstRepo(fastify) {

  async function postClosingCashMst({ params, body, logTrace, userDetails }) {
    const knex = this;


    const query1 = knex(CLOSINGCASHMST.NAME)
      .where(CLOSINGCASHMST.COLUMNS.DATE, body.date)
      .where(CLOSINGCASHMST.COLUMNS.OUTLET_ID, body.outlet_id);

    logQuery({
      logger: fastify.log,
      query: query1,
      context: "Cash Close",
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

      const deleteQueryClosingCashMst = await knex(CLOSINGCASHMST.NAME)
        .where(CLOSINGCASHMST.COLUMNS.DATE, body.date)
        .where(CLOSINGCASHMST.COLUMNS.OUTLET_ID, body.outlet_id)
        .del();

      const deleteQueryClosingCashDetail = await knex(CLOSINGCASHDETAILS.NAME)
        .where(CLOSINGCASHDETAILS.COLUMNS.DATE, body.date)
        .where(CLOSINGCASHDETAILS.COLUMNS.OUTLET_ID, body.outlet_id)
        .del();

    }

    //***************************** 1. stock missing master insert  **************************************    
    var ClosingCashMst_Data = {
      date: body.date,
      total: body.total,
      outlet_id: body.outlet_id,
      salesman_id: body.salesman_id,
      total_invoices: body.total_invoices,
      total_sales: body.total_sales,
      total_card: body.total_card,
      total_cash: body.total_cash,
      total_upi: body.total_upi,
      total_return: body.total_return,
      total_return_used: body.total_return_used,
      total_loyalty: body.total_loyalty,
      total_return_count: body.total_return_count,
      avg_bills: body.avg_bills,
      amount_be_deposited: body.amount_be_deposited,
      next_day_balance: body.next_day_balance,
      total_less_amount: body.total_less_amount

    }

    const ClosingCashMst_Data_insert = await knex(`${CLOSINGCASHMST.NAME}`).returning("id").insert
      ({
        [CLOSINGCASHMST.COLUMNS.DATE]: ClosingCashMst_Data.date,
        [CLOSINGCASHMST.COLUMNS.TOTAL]: ClosingCashMst_Data.total,
        [CLOSINGCASHMST.COLUMNS.OUTLET_ID]: ClosingCashMst_Data.outlet_id,
        [CLOSINGCASHMST.COLUMNS.SALESMAN_ID]: ClosingCashMst_Data.salesman_id,
        [CLOSINGCASHMST.COLUMNS.TOTAL_INVOICES]: ClosingCashMst_Data.total_invoices,
        [CLOSINGCASHMST.COLUMNS.TOTAL_SALES]: ClosingCashMst_Data.total_sales,
        [CLOSINGCASHMST.COLUMNS.TOTAL_CARD]: ClosingCashMst_Data.total_card,
        [CLOSINGCASHMST.COLUMNS.TOTAL_CASH]: ClosingCashMst_Data.total_cash,
        [CLOSINGCASHMST.COLUMNS.TOTAL_UPI]: ClosingCashMst_Data.total_upi,
        [CLOSINGCASHMST.COLUMNS.TOTAL_RETURN]: ClosingCashMst_Data.total_return,
        [CLOSINGCASHMST.COLUMNS.TOTAL_RETURN_USED]: ClosingCashMst_Data.total_return_used,
        [CLOSINGCASHMST.COLUMNS.TOTAL_LOYALTY]: ClosingCashMst_Data.total_loyalty,
        [CLOSINGCASHMST.COLUMNS.TOTAL_RETURN_COUNT]: ClosingCashMst_Data.total_return_count,
        [CLOSINGCASHMST.COLUMNS.AVG_BILLS]: ClosingCashMst_Data.avg_bills,
        [CLOSINGCASHMST.COLUMNS.AMOUNT_TO_BE_DEPOSITED]: ClosingCashMst_Data.amount_be_deposited,
        [CLOSINGCASHMST.COLUMNS.NEXT_DAY_BALANCE]: ClosingCashMst_Data.next_day_balance,
        [CLOSINGCASHMST.COLUMNS.TOTAL_LESS_AMOUNT]: ClosingCashMst_Data.total_less_amount,



      });


    var ClosingCashMst_id = ClosingCashMst_Data_insert[0].id;


    //***************************** 2. closing_cash_details insert  **************************************


    // console.log(ClosingCashMst_id, "ClosingCashMst_id");

    if (body.closing_cash_details.length > 0) {

      for (var i = 0; i < body.closing_cash_details.length; i++) {
        var closing_cash_details = body.closing_cash_details[i];
        // var is_verify_ck1 = stockMissingDetails.is_verify;

        var closing_cash_details_Data = {
          closing_cash_mst_id: ClosingCashMst_id,
          date: closing_cash_details.date,
          denomination: closing_cash_details.denomination,
          count: closing_cash_details.count,
          total: closing_cash_details.total,
          outlet_id: closing_cash_details.outlet_id,
          salesman_id: closing_cash_details.salesman_id,
        }



        const query_insert2 = await knex(`${CLOSINGCASHDETAILS.NAME}`).insert
          ({
            [CLOSINGCASHDETAILS.COLUMNS.CLOSING_CASH_MST_ID]: closing_cash_details_Data.closing_cash_mst_id,
            [CLOSINGCASHDETAILS.COLUMNS.DATE]: closing_cash_details_Data.date,
            [CLOSINGCASHDETAILS.COLUMNS.DENOMINATION]: closing_cash_details_Data.denomination,
            [CLOSINGCASHDETAILS.COLUMNS.COUNT]: closing_cash_details_Data.count,
            [CLOSINGCASHDETAILS.COLUMNS.TOTAL]: closing_cash_details_Data.total,
            [CLOSINGCASHDETAILS.COLUMNS.OUTLET_ID]: closing_cash_details_Data.outlet_id,
            [CLOSINGCASHDETAILS.COLUMNS.SALESMAN_ID]: closing_cash_details_Data.salesman_id,

            [CLOSINGCASHDETAILS.COLUMNS.CREATED_BY]: 2
          });

      }
    }


    return { success: true };
  }

  return {
    postClosingCashMst
  };
}

module.exports = getClosingCashMstRepo;
