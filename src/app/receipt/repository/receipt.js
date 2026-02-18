const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler")
const { logQuery } = require("../../commons/helpers");
const { RECEIPT_MASTER, RECEIPT_DETAIL, SALESMASTER } = require("../commons/constants");
const { SUPPLIER } = require("../../catalog/commons");



const partyledgerRepo = require("../../partyledger/repository/partyledger");

function receiptRepo(fastify) {
  async function postreceipt({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query_insert = knex(`${RECEIPT_MASTER.NAME}`)
      .returning("id")
      .insert({
        [RECEIPT_MASTER.COLUMNS.DATE]: body.date,
        [RECEIPT_MASTER.COLUMNS.SUPPLIER_ID]: body.supplierid,
        [RECEIPT_MASTER.COLUMNS.MODE]: body.mode,
        [RECEIPT_MASTER.COLUMNS.AMOUNT]: body.amount,
        [RECEIPT_MASTER.COLUMNS.CHEQUENO]: body.chequeno,
        [RECEIPT_MASTER.COLUMNS.CHEQUEDATE]: body.chequedate,
        [RECEIPT_MASTER.COLUMNS.BANK]: body.bank,
        [RECEIPT_MASTER.COLUMNS.DISCOUNT]: body.discount,
        [RECEIPT_MASTER.COLUMNS.REFNO]: body.refno,
        [RECEIPT_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [RECEIPT_MASTER.COLUMNS.CREATED_BY]: userDetails.id
      });
    const response = await query_insert;
    const rm_id = response[0].id;
    const docno = "RM-" + response[0].id

    if (Array.isArray(body.receipt_details)) {
      body.receipt_details.forEach(async element => {
        await knex(`${RECEIPT_DETAIL.NAME}`).insert({
          [RECEIPT_DETAIL.COLUMNS.RM_ID]: rm_id,
          [RECEIPT_DETAIL.COLUMNS.DATE]: element.date,
          [RECEIPT_DETAIL.COLUMNS.INVOICE_NO]: element.invoice_no,
          [RECEIPT_DETAIL.COLUMNS.AMOUNT]: element.amount,
          [RECEIPT_DETAIL.COLUMNS.PENDING_AMOUNT]: element.pending_amount,
          [RECEIPT_DETAIL.COLUMNS.COMPANY_ID]: body.company_id,
          [RECEIPT_DETAIL.COLUMNS.CREATED_BY]: userDetails.id
        });
      });
    } else {
      console.error("payment_details is not an array");
    }

    const partyLedger_data = {
      edate: body.date,
      partycode: body.supplierid,
      debit: '0',
      credit: body.amount,
      type: docno,
      mode: 1,
      company_id: body.company_id
    };

    const { updatePartyLedger } = partyledgerRepo(fastify);
    const updatePartyLedger_response = await updatePartyLedger.call(knex, {
      logTrace,
      partyLedger_data
    });


    if (Array.isArray(body.receipt_details)) {
      for (const element of body.receipt_details) {
        // if (typeof element.invoice_no === 'number') {
        const itemQuery = knex(SALESMASTER.NAME)
          .where({
            [SALESMASTER.COLUMNS.PARTYCODE]: body.supplierid,
            [SALESMASTER.COLUMNS.DOCNO]: element.invoice_no,
          })
        const existsResponse = await itemQuery;

        if (existsResponse.length > 0) {
          const queryUpdate = await knex(SALESMASTER.NAME)
            .where({
              [SALESMASTER.COLUMNS.PARTYCODE]: body.supplierid,
              [SALESMASTER.COLUMNS.DOCNO]: element.invoice_no,
            })
            .update({
              [SALESMASTER.COLUMNS.OUTSTANDING]: knex.raw(
                `${SALESMASTER.COLUMNS.OUTSTANDING} + ${element.amount}`
              ),
            });
        }
        // }
      }
    }
    return { success: true };

  }

  async function getReceiptByParty({ params, logTrace }) {
    const knex = this;
    const query = knex(SALESMASTER.NAME)
      .where(SALESMASTER.COLUMNS.PARTYCODE, params.partyid)
      .where(SALESMASTER.COLUMNS.AMOUNT, '>', knex.raw(`??`, [SALESMASTER.COLUMNS.OUTSTANDING]));

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SALES Info",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SALES not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getReceiptDocno({ logTrace }) {
    const knex = this;

    const query = knex(RECEIPT_MASTER.NAME).returning("id")
      .orderBy(RECEIPT_MASTER.COLUMNS.ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get receipt doc no",
      logTrace
    });

    const response = await query;

    if (response.length === 0) {
      return { Docno: "1" };
    }

    let Docno = response[0].id;

    Docno = Docno + 1;

    return { Docno };
  }

  return {

    postreceipt,
    getReceiptByParty,
    getReceiptDocno

  };
}


module.exports = receiptRepo;
