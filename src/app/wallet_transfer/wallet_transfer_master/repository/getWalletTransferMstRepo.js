const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { WALLETTRANSFER } = require("../../commons");
const { OUTLETS } = require(".././../../accounts/outlets/commons/constants")



function getWalletTransferMstRepo(fastify) {

  async function postWalletTransferMst({ params, body, logTrace, userDetails }) {
    const knex = this;


    // const query1 = knex(WalletTransferMST.NAME)
    //   .where(WalletTransferMST.COLUMNS.DATE, body.date);
    // logQuery({
    //   logger: fastify.log,
    //   query: query1,
    //   context: "Cash Close",
    //   logTrace
    // });
    // const exists_response = await query1;
    // if (exists_response.length > 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_ACCEPTABLE,
    //     message: `Cash Close already done for this dats of ${body.date} `,
    //     property: "",
    //     code: "NOT_ACCEPTABLE"
    //   });
    // }

    //***************************** 1. stock missing master insert  **************************************    

    var WalletTransferMst_Data = {
      date: body.date,
      outlet_id: body.outlet_id,
      transfer_from: body.transfer_from,
      transfer_to: body.transfer_to,
      transfer_amount: body.transfer_amount,
      description: body.description
    }

    const WalletTransferMst_Data_insert = await knex(`${WALLETTRANSFER.NAME}`)
      .insert
      ({
        [WALLETTRANSFER.COLUMNS.DATE]: WalletTransferMst_Data.date,
        [WALLETTRANSFER.COLUMNS.OUTLET_ID]: WalletTransferMst_Data.outlet_id,
        [WALLETTRANSFER.COLUMNS.TRANSFER_FROM]: WalletTransferMst_Data.transfer_from,
        [WALLETTRANSFER.COLUMNS.TRANSFER_TO]: WalletTransferMst_Data.transfer_to,
        [WALLETTRANSFER.COLUMNS.TRANSFER_AMOUNT]: WalletTransferMst_Data.transfer_amount,
        [WALLETTRANSFER.COLUMNS.DESCRIPTION]: WalletTransferMst_Data.description,

      });


    // logQuery({
    //   logger: fastify.log,
    //   query: WalletTransferMst_Data_insert,
    //   context: "Wallet Transfer",
    //   logTrace
    // });

    const exists_response = await WalletTransferMst_Data_insert;

    // console.log(exists_response, "exists_response");

    if (exists_response.length == 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: `Wallet Transfer Not Created`,
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const wallet_balance_update = await knex(`${OUTLETS.NAME}`)
      .where(`${OUTLETS.COLUMNS.ID}`, WalletTransferMst_Data.outlet_id)
      .update({
        [OUTLETS.COLUMNS.WALLET_BALANCE]: knex.raw(
          `${OUTLETS.COLUMNS.WALLET_BALANCE} + ${WalletTransferMst_Data.transfer_amount}`
        )
      });


    // var WalletTransferMst_id = WalletTransferMst_Data_insert[0].id;


    //***************************** 2. closing_cash_details insert  **************************************


    // console.log(WalletTransferMst_id, "WalletTransferMst_id");

    // if (body.closing_cash_details.length > 0) {

    //   for (var i = 0; i < body.closing_cash_details.length; i++) {
    //     var closing_cash_details = body.closing_cash_details[i];
    //     // var is_verify_ck1 = stockMissingDetails.is_verify;

    //     var closing_cash_details_Data = {
    //       closing_cash_mst_id: WalletTransferMst_id,
    //       date: closing_cash_details.date,
    //       denomination: closing_cash_details.denomination,
    //       count: closing_cash_details.count,
    //       total: closing_cash_details.total,
    //       outlet_id: closing_cash_details.outlet_id,
    //       salesman_id: closing_cash_details.salesman_id,
    //     }



    //     const query_insert2 = await knex(`${WalletTransferDETAILS.NAME}`).insert
    //       ({
    //         [WalletTransferDETAILS.COLUMNS.CLOSING_CASH_MST_ID]: closing_cash_details_Data.closing_cash_mst_id,
    //         [WalletTransferDETAILS.COLUMNS.DATE]: closing_cash_details_Data.date,
    //         [WalletTransferDETAILS.COLUMNS.DENOMINATION]: closing_cash_details_Data.denomination,
    //         [WalletTransferDETAILS.COLUMNS.COUNT]: closing_cash_details_Data.count,
    //         [WalletTransferDETAILS.COLUMNS.TOTAL]: closing_cash_details_Data.total,
    //         [WalletTransferDETAILS.COLUMNS.OUTLET_ID]: closing_cash_details_Data.outlet_id,
    //         [WalletTransferDETAILS.COLUMNS.SALESMAN_ID]: closing_cash_details_Data.salesman_id,

    //         [WalletTransferDETAILS.COLUMNS.CREATED_BY]: 2
    //       });


    //   }
    // }


    return { success: true };
  }

  return {
    postWalletTransferMst
  };
}

module.exports = getWalletTransferMstRepo;
