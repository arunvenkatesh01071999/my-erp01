const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { WASTAGEMASTER, WASTAGEDETAIL, STOCKLEDGER, WASTAGEOUTLETMASTER, WASTAGEOUTLETDETAIL } = require("../../commons");
const { ITEM, OUTLET_PRODUCT_MAPPING } = require("../../../catalog/commons");
const partyledgerRepo = require("../../../partyledger/repository/partyledger");

function wastageOutletMasterRepo(fastify) {

  async function postWastageOutletMaster({ params, body, logTrace, userDetails }) {
    const knex = this;

    //***************************** 1. WastageMaster insert  **************************************    
    const WastageMaster_Data = {
      date: body.date,
      amount: body.amount,
      totalqty: body.totalQty,
      company_id: body.company_id,
      uid: body.uid,
      outlet_id: body.outlet_id,

    }
    //  console.log(WastageMaster_Data,"WastageMaster_Data");

    const WastageMaster_Data_insert = await knex(`${WASTAGEOUTLETMASTER.NAME}`).returning("id").insert
      ({
        [WASTAGEOUTLETMASTER.COLUMNS.DATE]: WastageMaster_Data.date,
        [WASTAGEOUTLETMASTER.COLUMNS.AMOUNT]: WastageMaster_Data.amount,
        [WASTAGEOUTLETMASTER.COLUMNS.TOTALQTY]: WastageMaster_Data.totalqty,
        [WASTAGEOUTLETMASTER.COLUMNS.COMPANY_ID]: WastageMaster_Data.company_id,
        [WASTAGEOUTLETMASTER.COLUMNS.UID]: WastageMaster_Data.uid,
        [WASTAGEOUTLETMASTER.COLUMNS.OUTLET_ID]: WastageMaster_Data.outlet_id

      });


    var wastageMaster_id = WastageMaster_Data_insert[0].id;

    // var WastageMaster_id_string = 'WM'+WastageMaster_Data_insert[0].id;

    // const WastageMaster_Data_update = await knex(`${WastageMaster.NAME}`)
    //  .where(`${WastageMaster.COLUMNS.ID}`, WastageMaster_id)
    //   .update({
    //             [WastageMaster.COLUMNS.DOCNO]: WastageMaster_id_string
    //           });

    //***************************** 2. salesDetails insert  **************************************    

    if (body.wastage_outlet_detail.length > 0) {

      for (var i = 0; i < body.wastage_outlet_detail.length; i++) {
        var wastage_outlet_detail = body.wastage_outlet_detail[i];

        var wastage_detail_Data = {
          wom_id: wastageMaster_id,
          date: wastage_outlet_detail.date,
          outlet_id: wastage_outlet_detail.outlet_id,
          prodid: wastage_outlet_detail.prodid,
          qty: wastage_outlet_detail.qty,
          rate: wastage_outlet_detail.rate,
          amount: wastage_outlet_detail.amount,
          reason: wastage_outlet_detail.reason,
          company_id: wastage_outlet_detail.company_id
        }
        // console.log(wastage_detail_Data, "wastage_detail_Data");

        const query_insert2 = await knex(`${WASTAGEOUTLETDETAIL.NAME}`).insert
          ({
            [WASTAGEOUTLETDETAIL.COLUMNS.WOM_ID]: wastage_detail_Data.wom_id,
            [WASTAGEOUTLETDETAIL.COLUMNS.DATE]: wastage_detail_Data.date,
            [WASTAGEOUTLETDETAIL.COLUMNS.OUTLET_ID]: wastage_detail_Data.outlet_id,
            [WASTAGEOUTLETDETAIL.COLUMNS.PRODID]: wastage_detail_Data.prodid,
            [WASTAGEOUTLETDETAIL.COLUMNS.OUTLET_ID]: wastage_detail_Data.outlet_id,
            [WASTAGEOUTLETDETAIL.COLUMNS.QTY]: wastage_detail_Data.qty,
            [WASTAGEOUTLETDETAIL.COLUMNS.RATE]: wastage_detail_Data.rate,
            [WASTAGEOUTLETDETAIL.COLUMNS.AMOUNT]: wastage_detail_Data.amount,
            [WASTAGEOUTLETDETAIL.COLUMNS.REASON]: wastage_detail_Data.reason,
            [WASTAGEOUTLETDETAIL.COLUMNS.COMPANY_ID]: wastage_detail_Data.company_id,
            [WASTAGEOUTLETDETAIL.COLUMNS.CREATED_BY]: 2
          });

      }
    }


    //***************************  4. stock_ledger create and update ****************************************

    if (body.wastage_outlet_detail.length > 0) {
      for (var i = 0; i < body.wastage_outlet_detail.length; i++) {

        var wastage_outlet_detail = body.wastage_outlet_detail[i];

        const stockLedgerQuery = knex(STOCKLEDGER.NAME)
          .where({
            [STOCKLEDGER.COLUMNS.PROD_ID]: wastage_outlet_detail.prodid,
          })
          .andWhere(STOCKLEDGER.COLUMNS.DATE, wastage_outlet_detail.date);

        const existsResponseStock = await stockLedgerQuery;

        if (existsResponseStock.length > 0) {

          const queryUpdate = await knex(STOCKLEDGER.NAME)
            .where({
              [STOCKLEDGER.COLUMNS.PROD_ID]: wastage_outlet_detail.prodid,
            })
            .andWhere(STOCKLEDGER.COLUMNS.DATE, wastage_outlet_detail.date)
            .update({
              [STOCKLEDGER.COLUMNS.WASTAGE_QTY]: knex.raw(
                `${STOCKLEDGER.COLUMNS.WASTAGE_QTY} + ${wastage_outlet_detail.qty}`
              ),
            });
        }
        else {
          const stock_ledger_Data =
          {
            date: wastage_outlet_detail.date,
            prodid: wastage_outlet_detail.prodid,
            purchase_qty: 0,
            sale_qty: 0,
            purchase_return_qty: 0,
            wastage_qty: 0 + `${wastage_outlet_detail.qty}`,
            adjust_qty: 0,
            free_qty: 0,
            sales_in_qty: 0,
            sales_return_qty: 0,
            tr_in_qty: 0,
            tr_out_qty: 0,
            company_id: wastage_outlet_detail.company_id
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

  return {
    postWastageOutletMaster
  };
}

module.exports = wastageOutletMasterRepo;
