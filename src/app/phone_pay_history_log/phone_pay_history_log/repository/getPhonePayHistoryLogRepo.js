const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { PHONE_PAY_HISTORY_LOG } = require("../../commons");



function getPhonePayHistoryLogRepo(fastify) {

  async function postPhonePayHistoryLog({ params, body, logTrace, userDetails }) {
    const knex = this;

    // const response_json = JSON.parse(body.response_json);
    // const request_json = JSON.parse(body.request_json);

    var PhonePayHistoryLog_Data = {
      docno: body.docno,
      transaction_date: body.transaction_date,
      merchant_order_id: body.merchant_order_id,
      transaction_id: body.transaction_id,
      response_json: body.response_json,
      request_json: body.request_json,
      phone_no: body.phone_no
    }

    const query = knex(`${PHONE_PAY_HISTORY_LOG.NAME}`)
      .insert
      ({
        [PHONE_PAY_HISTORY_LOG.COLUMNS.DOCNO]: PhonePayHistoryLog_Data.docno,
        [PHONE_PAY_HISTORY_LOG.COLUMNS.TRANSACTION_DATE]: PhonePayHistoryLog_Data.transaction_date,
        [PHONE_PAY_HISTORY_LOG.COLUMNS.MERCHANT_ORDER_ID]: PhonePayHistoryLog_Data.merchant_order_id,
        [PHONE_PAY_HISTORY_LOG.COLUMNS.TRANSACTION_ID]: PhonePayHistoryLog_Data.transaction_id,
        [PHONE_PAY_HISTORY_LOG.COLUMNS.RESPONSE_JSON]: PhonePayHistoryLog_Data.response_json,
        [PHONE_PAY_HISTORY_LOG.COLUMNS.REQUEST_JSON]: PhonePayHistoryLog_Data.request_json,
        [PHONE_PAY_HISTORY_LOG.COLUMNS.PHONE_NO]: PhonePayHistoryLog_Data.phone_no

      });

    const query1 = await query

    logQuery({
      logger: fastify.log,
      query: query,
      context: "Phone Pay History Log",
      logTrace
    });



    return { success: true };
  }

  return {
    postPhonePayHistoryLog
  };
}

module.exports = getPhonePayHistoryLogRepo;
