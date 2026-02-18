const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { WASTAGEMASTER, WASTAGEDETAIL, STOCKLEDGER } = require("../../commons");
const { ITEM, OUTLET_PRODUCT_MAPPING } = require("../../../catalog/commons");
const partyledgerRepo = require("../../../partyledger/repository/partyledger");

function wastageMasterRepo(fastify) {

  async function postWastageMaster({ params, body, logTrace, userDetails }) {
    const knex = this;

    //***************************** 1. WastageMaster insert  **************************************    
    const WastageMaster_Data = {
      date: body.date,
      amount: body.amount,
      totalqty: body.totalQty,
      company_id: body.company_id,
    }
    console.log(WastageMaster_Data, "WastageMaster_Data");

    const WastageMaster_Data_insert = await knex(`${WASTAGEMASTER.NAME}`).returning("id").insert
      ({
        [WASTAGEMASTER.COLUMNS.DATE]: WastageMaster_Data.date,
        [WASTAGEMASTER.COLUMNS.AMOUNT]: WastageMaster_Data.amount,
        [WASTAGEMASTER.COLUMNS.TOTALQTY]: WastageMaster_Data.totalqty,
        [WASTAGEMASTER.COLUMNS.COMPANY_ID]: WastageMaster_Data.company_id
      });


    var wastageMaster_id = WastageMaster_Data_insert[0].id;

    // var WastageMaster_id_string = 'WM'+WastageMaster_Data_insert[0].id;

    // const WastageMaster_Data_update = await knex(`${WastageMaster.NAME}`)
    //  .where(`${WastageMaster.COLUMNS.ID}`, WastageMaster_id)
    //   .update({
    //             [WastageMaster.COLUMNS.DOCNO]: WastageMaster_id_string
    //           });

    //***************************** 2. salesDetails insert  **************************************    

    if (body.wastage_detail.length > 0) {

      for (var i = 0; i < body.wastage_detail.length; i++) {
        var wastage_detail = body.wastage_detail[i];

        var wastage_detail_Data = {
          wm_id: wastageMaster_id,
          date: wastage_detail.date,
          prodid: wastage_detail.prodid,
          qty: wastage_detail.qty,
          rate: wastage_detail.rate,
          amount: wastage_detail.amount,
          reason: wastage_detail.reason,
          company_id: wastage_detail.company_id
        }
        console.log(wastage_detail_Data, "wastage_detail_Data");

        const query_insert2 = await knex(`${WASTAGEDETAIL.NAME}`).insert
          ({
            [WASTAGEDETAIL.COLUMNS.WM_ID]: wastage_detail_Data.wm_id,
            [WASTAGEDETAIL.COLUMNS.DATE]: wastage_detail_Data.date,
            [WASTAGEDETAIL.COLUMNS.PRODID]: wastage_detail_Data.prodid,
            [WASTAGEDETAIL.COLUMNS.QTY]: wastage_detail_Data.qty,
            [WASTAGEDETAIL.COLUMNS.RATE]: wastage_detail_Data.rate,
            [WASTAGEDETAIL.COLUMNS.AMOUNT]: wastage_detail_Data.amount,
            [WASTAGEDETAIL.COLUMNS.REASON]: wastage_detail_Data.reason,
            [WASTAGEDETAIL.COLUMNS.COMPANY_ID]: wastage_detail_Data.company_id,
            [WASTAGEDETAIL.COLUMNS.CREATED_BY]: 2
          });

      }
    }


    //***************************  4. stock_ledger create and update ****************************************

    if (body.wastage_detail.length > 0) {
      for (var i = 0; i < body.wastage_detail.length; i++) {

        var wastage_detail = body.wastage_detail[i];

        const stockLedgerQuery = knex(STOCKLEDGER.NAME)
          .where({
            [STOCKLEDGER.COLUMNS.PROD_ID]: wastage_detail.prodid,
          })
          .andWhere(STOCKLEDGER.COLUMNS.DATE, wastage_detail.date);

        const existsResponseStock = await stockLedgerQuery;

        if (existsResponseStock.length > 0) {

          const queryUpdate = await knex(STOCKLEDGER.NAME)
            .where({
              [STOCKLEDGER.COLUMNS.PROD_ID]: wastage_detail.prodid,
            })
            .andWhere(STOCKLEDGER.COLUMNS.DATE, wastage_detail.date)
            .update({
              [STOCKLEDGER.COLUMNS.WASTAGE_QTY]: knex.raw(
                `${STOCKLEDGER.COLUMNS.WASTAGE_QTY} + ${wastage_detail.qty}`
              ),
            });
        }
        else {
          const stock_ledger_Data =
          {
            date: wastage_detail.date,
            prodid: wastage_detail.prodid,
            purchase_qty: 0,
            sale_qty: 0,
            purchase_return_qty: 0,
            wastage_qty: 0 + `${wastage_detail.qty}`,
            adjust_qty: 0,
            free_qty: 0,
            sales_in_qty: 0,
            sales_return_qty: 0,
            tr_in_qty: 0,
            tr_out_qty: 0,
            company_id: wastage_detail.company_id
          }

          const stock_ledger_insert = await knex(`${STOCKLEDGER.NAME}`).insert({
            [STOCKLEDGER.COLUMNS.DATE]: stock_ledger_Data.date,
            [STOCKLEDGER.COLUMNS.PROD_ID]: stock_ledger_Data.prodid,
            [STOCKLEDGER.COLUMNS.PARCHASE_QTY]: stock_ledger_Data.purchase_qty,
            [STOCKLEDGER.COLUMNS.SALE_QTY]: stock_ledger_Data.sale_qty,
            [STOCKLEDGER.COLUMNS.PURCHASE_RETURN_QTY]: stock_ledger_Data.purchase_return_qty,
            [STOCKLEDGER.COLUMNS.WASTAGE_QTY]: stock_ledger_Data.wastage_qty,
            [STOCKLEDGER.COLUMNS.ADJUST_QTY]: stock_ledger_Data.adjust_qty,
            [STOCKLEDGER.COLUMNS.FREE_QTY]: stock_ledger_Data.free_qty,
            [STOCKLEDGER.COLUMNS.SALES_IN_QTY]: stock_ledger_Data.sales_in_qty,
            [STOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: stock_ledger_Data.sales_return_qty,
            [STOCKLEDGER.COLUMNS.TR_IN_QTY]: stock_ledger_Data.tr_in_qty,
            [STOCKLEDGER.COLUMNS.TR_OUT_QTY]: stock_ledger_Data.tr_out_qty,
            [STOCKLEDGER.COLUMNS.COMPANY_ID]: stock_ledger_Data.company_id
          });
        }

      }
    }



    return { success: true };
  }

  async function getWastageDocno({ logTrace }) {
    const knex = this;

    const query = knex(WASTAGEMASTER.NAME).returning("id")
      .orderBy(WASTAGEMASTER.COLUMNS.ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Wastage Docno",
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
    postWastageMaster,
    getWastageDocno
  };
}

module.exports = wastageMasterRepo;
