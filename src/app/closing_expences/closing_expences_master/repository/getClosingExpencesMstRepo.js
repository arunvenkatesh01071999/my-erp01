const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CLOSINGEXPENCESMST, CLOSINGEXPENCESDETAILS } = require("../../commons");
// const { OUTLET } = require("\app\accounts\outlets\commons\constants.js");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { CLOSINGCASHMST, CLOSINGCASHDETAILS } = require("../../../closing_cash/commons");


function getClosingExpencesMstRepo(fastify) {

  async function postClosingExpencesMst({ params, body, logTrace, userDetails }) {
    const knex = this;


    const query1 = knex(CLOSINGEXPENCESMST.NAME)
      .where(CLOSINGEXPENCESMST.COLUMNS.DATE, body.date)
      .where(CLOSINGEXPENCESMST.COLUMNS.OUTLET_ID, body.outlet_id);


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


      const deleteQueryClosingExpencesMst = await knex(CLOSINGEXPENCESMST.NAME)
        .where(CLOSINGEXPENCESMST.COLUMNS.DATE, body.date)
        .where(CLOSINGEXPENCESMST.COLUMNS.OUTLET_ID, body.outlet_id)
        .del();

      const deleteQueryClosingExpencesDetail = await knex(CLOSINGEXPENCESDETAILS.NAME)
        .where(CLOSINGEXPENCESDETAILS.COLUMNS.DATE, body.date)
        .where(CLOSINGEXPENCESDETAILS.COLUMNS.OUTLET_ID, body.outlet_id)
        .del();

    }

    //***************************** 1. stock missing master insert  **************************************    
    var ClosingExpencesMst_Data = {
      date: body.date,
      opening_balance: body.opening_balance,
      expences_amount: body.expences_amount,
      closing_balance: body.closing_balance,
      total_amount: body.total_amount,
      outlet_id: body.outlet_id,
      salesman_id: body.salesman_id
    }

    const ClosingExpencesMst_Data_insert = await knex(`${CLOSINGEXPENCESMST.NAME}`).returning("id").insert
      ({
        [CLOSINGEXPENCESMST.COLUMNS.DATE]: ClosingExpencesMst_Data.date,
        [CLOSINGEXPENCESMST.COLUMNS.OPENING_BALANCE]: ClosingExpencesMst_Data.opening_balance,
        [CLOSINGEXPENCESMST.COLUMNS.EXPENCES_AMOUNT]: ClosingExpencesMst_Data.expences_amount,
        [CLOSINGEXPENCESMST.COLUMNS.CLOSING_BALANCE]: ClosingExpencesMst_Data.closing_balance,
        [CLOSINGEXPENCESMST.COLUMNS.TOTAL_AMOUNT]: ClosingExpencesMst_Data.total_amount,
        [CLOSINGEXPENCESMST.COLUMNS.OUTLET_ID]: ClosingExpencesMst_Data.outlet_id,
        [CLOSINGEXPENCESMST.COLUMNS.SALESMAN_ID]: ClosingExpencesMst_Data.salesman_id,



      });



    // WALLET_BALANCE - ClosingExpencesMst_Data.total_amount


    var ClosingExpencesMst_id = ClosingExpencesMst_Data_insert[0].id;

    // ************** wallet balance update

    const outlet_wallet_update = await knex(`${OUTLETS.NAME}`)
      .where(`${OUTLETS.COLUMNS.ID}`, ClosingExpencesMst_Data.outlet_id)
      .update({
        [OUTLETS.COLUMNS.WALLET_BALANCE]: knex.raw(
          `${OUTLETS.COLUMNS.WALLET_BALANCE} - ${ClosingExpencesMst_Data.expences_amount}`
        ),
      });


    //***************************** 2. closing_Expences_details insert  **************************************


    // console.log(ClosingExpencesMst_id, "ClosingExpencesMst_id");

    if (body.closing_expences_details.length > 0) {

      for (var i = 0; i < body.closing_expences_details.length; i++) {
        var closing_expences_details = body.closing_expences_details[i];
        // var is_verify_ck1 = stockMissingDetails.is_verify;

        var closing_Expences_details_Data = {
          closing_Expences_mst_id: ClosingExpencesMst_id,
          date: closing_expences_details.date,
          denomination: closing_expences_details.denomination,
          count: closing_expences_details.count,
          total: closing_expences_details.total,
          outlet_id: closing_expences_details.outlet_id,
          salesman_id: closing_expences_details.salesman_id,
        }



        const query_insert2 = await knex(`${CLOSINGEXPENCESDETAILS.NAME}`).insert
          ({
            [CLOSINGEXPENCESDETAILS.COLUMNS.CLOSING_EXPENCES_MST_ID]: closing_Expences_details_Data.closing_Expences_mst_id,
            [CLOSINGEXPENCESDETAILS.COLUMNS.DATE]: closing_Expences_details_Data.date,
            [CLOSINGEXPENCESDETAILS.COLUMNS.DENOMINATION]: closing_Expences_details_Data.denomination,
            [CLOSINGEXPENCESDETAILS.COLUMNS.COUNT]: closing_Expences_details_Data.count,
            [CLOSINGEXPENCESDETAILS.COLUMNS.TOTAL]: closing_Expences_details_Data.total,
            [CLOSINGEXPENCESDETAILS.COLUMNS.OUTLET_ID]: closing_Expences_details_Data.outlet_id,
            [CLOSINGEXPENCESDETAILS.COLUMNS.SALESMAN_ID]: closing_Expences_details_Data.salesman_id,

            [CLOSINGEXPENCESDETAILS.COLUMNS.CREATED_BY]: 2
          });


      }
    }


    return { success: true };
  }

  // async function postClosingExpencesMstGetOne({ params, body, logTrace, userDetails }) {
  //   const knex = this;

  //   // const query1 = knex(CLOSINGEXPENCESMST.NAME)

  //   //   .where(CLOSINGEXPENCESMST.COLUMNS.DATE, body.date)
  //   //   .where(CLOSINGEXPENCESMST.COLUMNS.OUTLET_ID, body.outlet_id);

  //   const query1 = knex
  //     .select([
  //       `${CLOSINGEXPENCESMST.NAME}.*`,
  //       `${CLOSINGEXPENCESDETAILS.NAME}.${CLOSINGEXPENCESDETAILS.COLUMNS.DENOMINATION}`,
  //       `${CLOSINGEXPENCESDETAILS.NAME}.${CLOSINGEXPENCESDETAILS.COLUMNS.COUNT}`,
  //       `${CLOSINGEXPENCESDETAILS.NAME}.${CLOSINGEXPENCESDETAILS.COLUMNS.TOTAL}`
  //     ])
  //     .from(`${CLOSINGEXPENCESMST.NAME} as ${CLOSINGEXPENCESMST.NAME}`)
  //     .leftJoin(
  //       `${CLOSINGEXPENCESDETAILS.NAME} as ${CLOSINGEXPENCESDETAILS.NAME}`,
  //       `${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.ID}`,
  //       `${CLOSINGEXPENCESDETAILS.NAME}.${CLOSINGEXPENCESDETAILS.COLUMNS.CLOSING_EXPENCES_MST_ID}`
  //     )
  //     .where(
  //       `${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.DATE}`,
  //       body.date
  //     )
  //     .andWhere(
  //       `${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.OUTLET_ID}`,
  //       body.outlet_id
  //     )



  //   logQuery({
  //     logger: fastify.log,
  //     query: query1,
  //     context: "Outlet Expences Close",
  //     logTrace
  //   });
  //   const response = await query1

  //   return response
  // }

  async function postClosingExpencesMstGetOne({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${CLOSINGEXPENCESMST.NAME}.*`,
      ])
      .from(`${CLOSINGEXPENCESMST.NAME} as ${CLOSINGEXPENCESMST.NAME}`)
      .where(
        `${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.DATE}`,
        body.date
      )
      .andWhere(
        `${CLOSINGEXPENCESMST.NAME}.${CLOSINGEXPENCESMST.COLUMNS.OUTLET_ID}`,
        body.outlet_id
      )


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

  async function postClosingBankAmount({ params, body, logTrace, userDetails }) {
    const knex = this;

    const outlet_id = body.outlet_id

    const query1 = await knex(CLOSINGEXPENCESMST.NAME)
      .where(CLOSINGEXPENCESMST.COLUMNS.OUTLET_ID, outlet_id)
      .sum(`${CLOSINGEXPENCESMST.COLUMNS.TOTAL_AMOUNT} as total_amount_sum`)


    const closing_expence_total_amount = query1[0].total_amount_sum


    const query2 = await knex(OUTLETS.NAME)
      .where(OUTLETS.COLUMNS.ID, outlet_id);

    const wallet_balance = query2[0].wallet_balance


    const sumQuery = await knex(CLOSINGCASHMST.NAME)
      .where(CLOSINGCASHMST.COLUMNS.OUTLET_ID, outlet_id)
      .sum(`${CLOSINGCASHMST.COLUMNS.TOTAL_CARD} as total_card_sum`)
      .sum(`${CLOSINGCASHMST.COLUMNS.TOTAL_UPI} as total_upi_sum`);


    const total_cards_sum = sumQuery[0].total_card_sum
    const total_upis_sum = sumQuery[0].total_upi_sum

    const total_card_sum = parseInt(total_cards_sum, 10)
    const total_upi_sum = parseInt(total_upis_sum, 10)


    const bank_amount = total_card_sum + total_upi_sum


    return {
      "wallet_balance": wallet_balance,
      "bank_amount": bank_amount,
      "closing_expence_total_amount": closing_expence_total_amount
    };
  }
  return {
    postClosingExpencesMst,
    postClosingBankAmount,
    postClosingExpencesMstGetOne
  };
}

module.exports = getClosingExpencesMstRepo;
