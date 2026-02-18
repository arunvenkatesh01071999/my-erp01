const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler")
const { logQuery } = require("../../commons/helpers");
const { PAYMENT_MASTER, PAYMENT_DETAIL } = require("../commons/constants");
const { SUPPLIER } = require("../../catalog/commons");
const { PURCHASE_MST } = require("../../purchase/commons")

const partyledgerRepo = require("../../partyledger/repository/partyledger");

function paymentRepo(fastify) {
  async function postpayment({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query_insert = knex(`${PAYMENT_MASTER.NAME}`)
      .returning("id")
      .insert({
        [PAYMENT_MASTER.COLUMNS.DATE]: body.date,
        [PAYMENT_MASTER.COLUMNS.SUPPLIER_ID]: body.supplierid,
        [PAYMENT_MASTER.COLUMNS.MODE]: body.mode,
        [PAYMENT_MASTER.COLUMNS.AMOUNT]: body.amount,
        [PAYMENT_MASTER.COLUMNS.CHEQUENO]: body.chequeno,
        [PAYMENT_MASTER.COLUMNS.CHEQUEDATE]: body.chequedate,
        [PAYMENT_MASTER.COLUMNS.BANK]: body.bank,
        [PAYMENT_MASTER.COLUMNS.DISCOUNT]: body.discount,
        [PAYMENT_MASTER.COLUMNS.REFNO]: body.refno,
        [PAYMENT_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [PAYMENT_MASTER.COLUMNS.CREATED_BY]: userDetails.id
      });
    const response = await query_insert;
    const pm_id = response[0].id;


    if (Array.isArray(body.payment_details)) {
      body.payment_details.forEach(async element => {
        await knex(`${PAYMENT_DETAIL.NAME}`).insert({
          [PAYMENT_DETAIL.COLUMNS.PM_ID]: pm_id,
          [PAYMENT_DETAIL.COLUMNS.DATE]: element.date,
          [PAYMENT_DETAIL.COLUMNS.INVOICE_NO]: element.invoice_no,
          [PAYMENT_DETAIL.COLUMNS.AMOUNT]: element.amount,
          [PAYMENT_DETAIL.COLUMNS.PENDING_AMOUNT]: element.pending_amount,
          [PAYMENT_DETAIL.COLUMNS.COMPANY_ID]: body.company_id,
          [PAYMENT_DETAIL.COLUMNS.CREATED_BY]: userDetails.id
        });
      });
    } else {
      console.error("payment_details is not an array");
    }

    if (body.amount) {
      await knex(`${SUPPLIER.NAME}`)
        .where(`${SUPPLIER.COLUMNS.COMPANY_ID}`, body.company_id)
        .update({
          [SUPPLIER.COLUMNS.BALANCE]: knex.raw(
            `${SUPPLIER.COLUMNS.BALANCE} - ${body.amount}`
          )
        });
    }
    const partyLedger_data = {
      partycode: body.supplierid,
      debit: '0',
      credit: body.amount,
      type: 'PA-' + pm_id,
      mode: 1,
      company_id: body.company_id
    };

    const { updatePartyLedger } = partyledgerRepo(fastify);
    const updatePartyLedger_response = await updatePartyLedger.call(knex, {
      logTrace,
      partyLedger_data
    });

    if (Array.isArray(body.payment_details)) {
      for (const element of body.payment_details) {
        // if (typeof element.invoice_no === 'number') {
        const itemQuery = knex(PURCHASE_MST.NAME)
          .where({
            [PURCHASE_MST.COLUMNS.PARTYCODE]: body.supplierid,
            [PURCHASE_MST.COLUMNS.DOCNO]: element.invoice_no,
          })
        const existsResponse = await itemQuery;

        if (existsResponse.length > 0) {
          const queryUpdate = await knex(PURCHASE_MST.NAME)
            .where({
              [PURCHASE_MST.COLUMNS.PARTYCODE]: body.supplierid,
            })
            .update({
              [PURCHASE_MST.COLUMNS.OUTSTANDING]: knex.raw(
                `${PURCHASE_MST.COLUMNS.OUTSTANDING} + ${body.amount}`
              ),
            });
        }
        // }
      }
    }
    return { success: true };

  }

  async function getPurchaseMasterByPartyID({ params, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_MST.NAME)
      .where(PURCHASE_MST.COLUMNS.PARTYCODE, params.partyid)
      .where(PURCHASE_MST.COLUMNS.AMOUNT, '>', knex.raw(`??`, [PURCHASE_MST.COLUMNS.OUTSTANDING]));

    logQuery({
      logger: fastify.log,
      query,
      context: "Get PURCHASE Info",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PURCHASE not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getPaymentDocno({ logTrace }) {
    const knex = this;

    const query = knex(PAYMENT_MASTER.NAME).returning("id")
      .orderBy(PAYMENT_MASTER.COLUMNS.ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get payment doc no",
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

    postpayment,
    getPurchaseMasterByPartyID,
    getPaymentDocno

  };
}

module.exports = paymentRepo;
