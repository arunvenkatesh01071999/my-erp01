const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { PARTY_LEDGER } = require("../commons/constants");

function partyledgerRepo(fastify) {
  async function updatePartyLedger({ logTrace, body, partyLedger_data }) {
    const knex = this;
    const existingStock = await knex(PARTY_LEDGER.NAME)
      .where({
        [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: partyLedger_data.partycode,
        [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: partyLedger_data.cdocdate,
        [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: partyLedger_data.type,
        [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: partyLedger_data.payment_type,
        [PARTY_LEDGER.COLUMNS.COMPANY_ID]: partyLedger_data.company_id
      })
      .first();

    if (existingStock) {
      await knex(PARTY_LEDGER.NAME)
        .where({
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: partyLedger_data.partycode,
          [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: partyLedger_data.cdocdate,
          [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: partyLedger_data.type,
          [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: partyLedger_data.payment_type,
          [PARTY_LEDGER.COLUMNS.COMPANY_ID]: partyLedger_data.company_id,
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: partyLedger_data.purchaseId
        })
        .update({
          [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: partyLedger_data.partycode,
          [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: partyLedger_data.cdocdate,
          [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: partyLedger_data.docno,
          [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: partyLedger_data.type,
          [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: partyLedger_data.mode,
          [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: knex.raw(
            `${PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT} - ? + ?`,
            [parseFloat(partyLedger_data.existing_amount) || 0, parseFloat(partyLedger_data.debit) || 0] // ✅ Single array
          ),
          [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: partyLedger_data.check_no || "",
          [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: partyLedger_data.cdocdate,
          [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: partyLedger_data.credit,
          [PARTY_LEDGER.COLUMNS.REMARKS]: partyLedger_data.remark,
          [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: partyLedger_data.payment_type,
          [PARTY_LEDGER.COLUMNS.COMPANY_ID]: partyLedger_data.company_id
        });
    } else {
      await knex(PARTY_LEDGER.NAME).insert({
        [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: partyLedger_data.purchaseId,
        [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: partyLedger_data.partycode,
        [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: partyLedger_data.cdocdate,
        [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: partyLedger_data.docno,
        [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: partyLedger_data.type,
        [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: partyLedger_data.mode,
        [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: partyLedger_data.check_no || "",
        [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: partyLedger_data.cdocdate,
        [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: partyLedger_data.credit,
        [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: partyLedger_data.debit,
        [PARTY_LEDGER.COLUMNS.REMARKS]: partyLedger_data.remark,
        [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: partyLedger_data.payment_type,
        [PARTY_LEDGER.COLUMNS.COMPANY_ID]: partyLedger_data.company_id,
      });
    }
  }

  return {
    updatePartyLedger
  };
}

module.exports = partyledgerRepo;
