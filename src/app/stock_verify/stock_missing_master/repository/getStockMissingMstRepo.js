const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { STOCKMISSINGMST, STOCKMISSINGMSTDETAILS, STOCKLEDGER, OUTLETSTOCKLEDGER, STOCK_VERIFY_SETTING, STOCK_SCAN } = require("../../commons");
const { SALESDETAILS, SALESMASTER } = require("../../../sales/commons");
const { ITEM, OUTLET_PRODUCT_MAPPING, } = require("../../../catalog/commons");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { BARCODE_CONFIG, BARCODE_LIST } = require("../../../accounts/barcode/commons/constant")


function getStockMissingMstRepo(fastify) {

  async function postStockMissingMst({ params, body, logTrace, userDetails }) {
    const knex = this;

    //***************************** 1. stock missing master insert  **************************************    
    var stockMissingMst_Data = {
      docno: body.docno,
      docdate: body.docdate,
      partycode: body.partycode,
      amount: body.amount,
      subtotal_amount: body.subtotal_amount,
      gst_per: body.gst_per,
      gst_amt: body.gst_amt,
      cess_per: body.cess_per,
      cess_amt: body.cess_amt,
      roff: body.roff,
      mode: body.mode,
      outstanding: body.outstanding,
      company_id: body.company_id,
      sales_doc_no: body.sales_doc_no,
    }

    const stockMissingMst_Data_insert = await knex(`${STOCKMISSINGMST.NAME}`).returning("id").insert
      ({
        [STOCKMISSINGMST.COLUMNS.DOCDATE]: stockMissingMst_Data.docdate,
        [STOCKMISSINGMST.COLUMNS.PARTYCODE]: stockMissingMst_Data.partycode,
        [STOCKMISSINGMST.COLUMNS.AMOUNT]: stockMissingMst_Data.amount,
        [STOCKMISSINGMST.COLUMNS.SUBTOTAL_AMOUNT]: stockMissingMst_Data.subtotal_amount,
        [STOCKMISSINGMST.COLUMNS.GST_PER]: stockMissingMst_Data.gst_per,
        [STOCKMISSINGMST.COLUMNS.GST_AMT]: stockMissingMst_Data.gst_amt,
        [STOCKMISSINGMST.COLUMNS.CESS_PER]: stockMissingMst_Data.cess_per,
        [STOCKMISSINGMST.COLUMNS.CESS_AMT]: stockMissingMst_Data.cess_amt,
        [STOCKMISSINGMST.COLUMNS.ROFF]: stockMissingMst_Data.roff,
        [STOCKMISSINGMST.COLUMNS.MODE]: stockMissingMst_Data.mode,
        [STOCKMISSINGMST.COLUMNS.OUTSTANDING]: stockMissingMst_Data.outstanding,
        [STOCKMISSINGMST.COLUMNS.COMPANY_ID]: stockMissingMst_Data.company_id
      });


    var stockMissingMst_id = stockMissingMst_Data_insert[0].id;

    var stockMissingMst_id_string = 'WSM' + stockMissingMst_Data_insert[0].id;

    const stockMissingMst_Data_update = await knex(`${STOCKMISSINGMST.NAME}`)
      .where(`${STOCKMISSINGMST.COLUMNS.ID}`, stockMissingMst_id)
      .update({
        [STOCKMISSINGMST.COLUMNS.DOCNO]: stockMissingMst_id_string
      });

    //***************************** 2. stockMissingDetails insert  **************************************


    if (body.stock_missing_details.length > 0) {

      for (var i = 0; i < body.stock_missing_details.length; i++) {
        var stockMissingDetails = body.stock_missing_details[i];
        var is_verify_ck1 = stockMissingDetails.is_verify;

        var stockMissingDetails_Data = {
          docdate: stockMissingDetails.docdate,
          prodid: stockMissingDetails.prodid,
          dis_per: stockMissingDetails.dis_per,
          dis_amt: stockMissingDetails.dis_amt,
          mrp: stockMissingDetails.mrp,
          rate: stockMissingDetails.rate,
          qty: stockMissingDetails.qty,
          gst_per: stockMissingDetails.gst_per,
          gst_amt: stockMissingDetails.gst_amt,
          cess_per: stockMissingDetails.cess_per,
          cess_amt: stockMissingDetails.cess_amt,
          barcode: stockMissingDetails.barcode,
          barcode_to: stockMissingDetails.barcode_to,
          company_id: stockMissingDetails.company_id,
          head_id: stockMissingDetails.head_id,
          type_id: stockMissingDetails.type_id,
          subcat_id: stockMissingDetails.subcat_id,
          cat_id: stockMissingDetails.cat_id,
          uom_id: stockMissingDetails.uom_id,
          igst_per: stockMissingDetails.igst_per,

        }


        if (is_verify_ck1 == "false") {

          const query_insert2 = await knex(`${STOCKMISSINGMSTDETAILS.NAME}`).insert
            ({
              [STOCKMISSINGMSTDETAILS.COLUMNS.DOCNO]: stockMissingMst_id_string,
              [STOCKMISSINGMSTDETAILS.COLUMNS.STOCK_MISSING_MST_ID]: stockMissingMst_id,
              [STOCKMISSINGMSTDETAILS.COLUMNS.DOCDATE]: stockMissingDetails_Data.docdate,
              [STOCKMISSINGMSTDETAILS.COLUMNS.PRODID]: stockMissingDetails_Data.prodid,
              [STOCKMISSINGMSTDETAILS.COLUMNS.DIS_PER]: stockMissingDetails_Data.dis_per,
              [STOCKMISSINGMSTDETAILS.COLUMNS.DIS_AMT]: stockMissingDetails_Data.dis_amt,
              [STOCKMISSINGMSTDETAILS.COLUMNS.MRP]: stockMissingDetails_Data.mrp,
              [STOCKMISSINGMSTDETAILS.COLUMNS.RATE]: stockMissingDetails_Data.rate,
              [STOCKMISSINGMSTDETAILS.COLUMNS.QTY]: stockMissingDetails_Data.qty,
              [STOCKMISSINGMSTDETAILS.COLUMNS.GST_PER]: stockMissingDetails_Data.gst_per,
              [STOCKMISSINGMSTDETAILS.COLUMNS.GST_AMT]: stockMissingDetails_Data.gst_amt,
              [STOCKMISSINGMSTDETAILS.COLUMNS.CESS_PER]: stockMissingDetails_Data.cess_per,
              [STOCKMISSINGMSTDETAILS.COLUMNS.CESS_AMT]: stockMissingDetails_Data.cess_amt,
              [STOCKMISSINGMSTDETAILS.COLUMNS.BARCODE]: stockMissingDetails_Data.barcode,
              [STOCKMISSINGMSTDETAILS.COLUMNS.BARCODE_TO]: stockMissingDetails_Data.barcode_to,
              [STOCKMISSINGMSTDETAILS.COLUMNS.COMPANY_ID]: stockMissingDetails_Data.company_id,
              [STOCKMISSINGMSTDETAILS.COLUMNS.HEAD_ID]: stockMissingDetails_Data.head_id,
              [STOCKMISSINGMSTDETAILS.COLUMNS.TYPE_ID]: stockMissingDetails_Data.type_id,
              [STOCKMISSINGMSTDETAILS.COLUMNS.SUBCAT_ID]: stockMissingDetails_Data.subcat_id,
              [STOCKMISSINGMSTDETAILS.COLUMNS.CAT_ID]: stockMissingDetails_Data.cat_id,
              [STOCKMISSINGMSTDETAILS.COLUMNS.UOM_ID]: stockMissingDetails_Data.uom_id,
              [STOCKMISSINGMSTDETAILS.COLUMNS.IGST_PER]: stockMissingDetails_Data.igst_per ? stockMissingDetails_Data.igst_per : 0,
              [STOCKMISSINGMSTDETAILS.COLUMNS.CREATED_BY]: 2
            });

        }

      }
    }


    if (body.is_individual === 1) {

      if (body.stock_missing_details.length > 0) {

        for (var i = 0; i < body.stock_missing_details.length; i++) {

          var stockMissingDetails = body.stock_missing_details[i];
          var is_verify_ck1 = stockMissingDetails.is_verify;
          var barcode = stockMissingDetails.barcode;

          if (is_verify_ck1 == "false") {

            // console.log(barcode, "barcode");
            // console.log(is_verify_ck1, "is_verify_ck1");

            const updateQuery = await knex(BARCODE_LIST.NAME)
              .where((query) => {
                query.where(`${BARCODE_LIST.COLUMNS.BARCODE}`, barcode);

              })
              .update(`${BARCODE_LIST.COLUMNS.IS_VERIFIED}`, 2);
          }
          else {

            const updateQuery = await knex(BARCODE_LIST.NAME)
              .where((query) => {
                query.where(`${BARCODE_LIST.COLUMNS.BARCODE}`, barcode);

              })
              .update(`${BARCODE_LIST.COLUMNS.IS_VERIFIED}`, 1);

          }

        }

      }

      if (body.verifiedCode.length > 0) {

        for (var i = 0; i < body.verifiedCode.length; i++) {
          var verifiedBarcode = body.verifiedCode[i];

          console.log(verifiedBarcode, "verifiedBarcode");

          const updateQuery = await knex(BARCODE_LIST.NAME)
            .where((query) => {
              query.where(`${BARCODE_LIST.COLUMNS.BARCODE}`, verifiedBarcode);

            })
            .update(`${BARCODE_LIST.COLUMNS.IS_VERIFIED}`, 1);
        }

      }

    }


    //***************************  4. stock_ledger create and update ****************************************

    if (body.stock_missing_details.length > 0) {
      for (var i = 0; i < body.stock_missing_details.length; i++) {

        var stockMissingDetails = body.stock_missing_details[i];

        if (stockMissingMst_Data.mode == "sales") {

          const stockLedgerQuery = knex(STOCKLEDGER.NAME)
            .where({
              [STOCKLEDGER.COLUMNS.PROD_ID]: stockMissingDetails.prodid,
            })
            .andWhere(STOCKLEDGER.COLUMNS.DATE, stockMissingDetails.docdate);

          const existsResponseStock = await stockLedgerQuery;

          if (existsResponseStock.length > 0) {

            const queryUpdate = await knex(STOCKLEDGER.NAME)
              .where({
                [STOCKLEDGER.COLUMNS.PROD_ID]: stockMissingDetails.prodid,
              })
              .andWhere(STOCKLEDGER.COLUMNS.DATE, stockMissingDetails.docdate)
              .update({
                [STOCKLEDGER.COLUMNS.SALES_IN_QTY]: knex.raw(
                  `${STOCKLEDGER.COLUMNS.SALES_IN_QTY} - ${stockMissingDetails.qty}`
                ),
              });
          }


        }
        if (stockMissingMst_Data.mode == "transfer") {
          const stockLedgerQuery = knex(STOCKLEDGER.NAME)
            .where({
              [STOCKLEDGER.COLUMNS.PROD_ID]: stockMissingDetails.prodid,
            })
            .andWhere(STOCKLEDGER.COLUMNS.DATE, stockMissingDetails.docdate);

          const existsResponseStock = await stockLedgerQuery;
          if (existsResponseStock.length > 0) {
            const queryUpdate = await knex(STOCKLEDGER.NAME)
              .where({
                [STOCKLEDGER.COLUMNS.PROD_ID]: stockMissingDetails.prodid,
              })
              .andWhere(STOCKLEDGER.COLUMNS.DATE, stockMissingDetails.docdate)
              .update({
                [STOCKLEDGER.COLUMNS.TR_OUT_QTY]: knex.raw(
                  `${STOCKLEDGER.COLUMNS.TR_OUT_QTY} - ${stockMissingDetails.qty}`
                ),
              });
          }


        }

        //************************************ 5. item ************************************************

        const itemUpdate = await knex(`${ITEM.NAME}`)
          .where(`${ITEM.COLUMNS.ID}`, stockMissingDetails.prodid)
          .update({
            [ITEM.COLUMNS.BALANCE]: knex.raw(
              `${ITEM.COLUMNS.BALANCE} + ${stockMissingDetails.qty}`
            ),
          });
        // ************************************** 6. out let products *********************

        const outletProductUpdate = await knex(`${OUTLET_PRODUCT_MAPPING.NAME}`)
          .where(`${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`, stockMissingDetails.prodid)
          .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, stockMissingMst_Data.partycode)
          .update({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: knex.raw(
              `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} - ${stockMissingDetails.qty}`
            ),
          });

      }
    }

    // ********************************  7. outlet stockledger    ***************************************



    if (body.amount) {
      await knex(`${OUTLETS.NAME}`)
        .where(`${OUTLETS.COLUMNS.ID}`, body.partycode)
        .update({
          [OUTLETS.COLUMNS.BALANCE]: knex.raw(
            `${OUTLETS.COLUMNS.BALANCE} - ${body.amount}`
          )
        });
    }
    const stockVerifySettingQuery = knex(STOCK_VERIFY_SETTING.NAME)


    const stockVerifySettingQueryExistsResponse = await stockVerifySettingQuery;

    const isVerifyValue = stockVerifySettingQueryExistsResponse[0].is_verify;



    if (isVerifyValue == true) {


      if (body.stock_missing_details.length > 0) {
        for (var i = 0; i < body.stock_missing_details.length; i++) {

          var stockMissingDetails = body.stock_missing_details[i];
          var is_verify_ck2 = stockMissingDetails.is_verify;

          if (is_verify_ck2 == "true") {




            if (stockMissingMst_Data.mode == "sales") {

              const outletStockLedgerQuery = knex(OUTLETSTOCKLEDGER.NAME)
                .where({
                  [OUTLETSTOCKLEDGER.COLUMNS.PRODID]: stockMissingDetails.prodid,
                })
                .andWhere(OUTLETSTOCKLEDGER.COLUMNS.DATE, stockMissingDetails.docdate);

              const existsResponseOutletStock = await outletStockLedgerQuery;

              if (existsResponseOutletStock.length > 0) {
                const queryUpdate = await knex(OUTLETSTOCKLEDGER.NAME)
                  .where({
                    [OUTLETSTOCKLEDGER.COLUMNS.PRODID]: stockMissingDetails.prodid,
                  })
                  .andWhere(OUTLETSTOCKLEDGER.COLUMNS.DATE, stockMissingDetails.docdate)
                  .andWhere(OUTLETSTOCKLEDGER.COLUMNS.OUTLETID, stockMissingMst_Data.partycode)
                  .update({
                    [OUTLETSTOCKLEDGER.COLUMNS.SALES_IN_QTY]: knex.raw(
                      `${OUTLETSTOCKLEDGER.COLUMNS.SALES_IN_QTY} + ${stockMissingDetails.qty}`,
                    ),
                    [OUTLETSTOCKLEDGER.COLUMNS.RECEIVED_IN_QTY]: knex.raw(
                      `${OUTLETSTOCKLEDGER.COLUMNS.RECEIVED_IN_QTY} + ${stockMissingDetails.qty}`
                    )
                  });
              }
              else {

                const outletStock_ledger_Data =
                {
                  date: stockMissingDetails.docdate,
                  prodid: stockMissingDetails.prodid,
                  outletid: stockMissingMst_Data.partycode,
                  purchase_qty: 0,
                  sale_qty: 0,
                  purchase_return_qty: 0,
                  wastage_qty: 0,
                  adjust_qty: 0,
                  free_qty: 0,
                  sales_in_qty: 0 + `${stockMissingDetails.qty}`,
                  received_in_qty: 0 + `${stockMissingDetails.qty}`,
                  sales_return_qty: 0,
                  tr_in_qty: 0,
                  tr_out_qty: 0,
                  company_id: stockMissingDetails.company_id
                }


                const outlet_stock_ledger_insert = await knex(`${OUTLETSTOCKLEDGER.NAME}`).insert({
                  [OUTLETSTOCKLEDGER.COLUMNS.DATE]: outletStock_ledger_Data.date,
                  [OUTLETSTOCKLEDGER.COLUMNS.OUTLETID]: outletStock_ledger_Data.outletid,
                  [OUTLETSTOCKLEDGER.COLUMNS.PRODID]: outletStock_ledger_Data.prodid,
                  [OUTLETSTOCKLEDGER.COLUMNS.PARCHASE_QTY]: outletStock_ledger_Data.purchase_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.SALE_QTY]: outletStock_ledger_Data.sale_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.PURCHASE_RETURN_QTY]: outletStock_ledger_Data.purchase_return_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.WASTAGE_QTY]: outletStock_ledger_Data.wastage_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.ADJUST_QTY]: outletStock_ledger_Data.adjust_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.FREE_QTY]: outletStock_ledger_Data.free_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.SALES_IN_QTY]: outletStock_ledger_Data.sales_in_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.RECEIVED_IN_QTY]: outletStock_ledger_Data.received_in_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: outletStock_ledger_Data.sales_return_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.TR_IN_QTY]: outletStock_ledger_Data.tr_in_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.TR_OUT_QTY]: outletStock_ledger_Data.tr_out_qty,
                  [OUTLETSTOCKLEDGER.COLUMNS.COMPANY_ID]: outletStock_ledger_Data.company_id
                });
              }


            }


            if (stockMissingMst_Data.mode == "transfer") {
              const outletStockLedgerQuery = knex(OUTLETSTOCKLEDGER.NAME)
                .where({
                  [OUTLETSTOCKLEDGER.COLUMNS.PRODID]: stockMissingDetails.prodid,
                })
                .andWhere(OUTLETSTOCKLEDGER.COLUMNS.DATE, stockMissingDetails.docdate);

              const existsResponseOutletStock = await outletStockLedgerQuery;

              if (existsResponseOutletStock.length > 0) {

                const queryUpdate = await knex(OUTLETSTOCKLEDGER.NAME)
                  .where({
                    [OUTLETSTOCKLEDGER.COLUMNS.PRODID]: stockMissingDetails.prodid,
                  })
                  .andWhere(OUTLETSTOCKLEDGER.COLUMNS.DATE, stockMissingDetails.docdate)
                  .andWhere(OUTLETSTOCKLEDGER.COLUMNS.OUTLETID, stockMissingMst_Data.partycode)
                  .update({
                    [OUTLETSTOCKLEDGER.COLUMNS.TR_IN_QTY]: knex.raw(
                      `${OUTLETSTOCKLEDGER.COLUMNS.TR_IN_QTY} - ${stockMissingDetails.qty}`
                    ),
                    [OUTLETSTOCKLEDGER.COLUMNS.RECEIVED_IN_QTY]: knex.raw(
                      `${OUTLETSTOCKLEDGER.COLUMNS.RECEIVED_IN_QTY} - ${stockMissingDetails.qty}`
                    )
                  });
              }


            }
            else {
              const outletStock_ledger_Data =
              {
                date: stockMissingDetails.docdate,
                prodid: stockMissingDetails.prodid,
                outletid: stockMissingMst_Data.partycode,
                purchase_qty: 0,
                sale_qty: 0,
                purchase_return_qty: 0,
                wastage_qty: 0,
                adjust_qty: 0,
                free_qty: 0,
                sales_in_qty: 0,
                received_in_qty: 0 + `${stockMissingDetails.qty}`,
                sales_return_qty: 0,
                tr_in_qty: 0 + `${stockMissingDetails.qty}`,
                tr_out_qty: 0,
                company_id: stockMissingDetails.company_id
              }

              const outlet_stock_ledger_insert = await knex(`${OUTLETSTOCKLEDGER.NAME}`).insert({
                [OUTLETSTOCKLEDGER.COLUMNS.DATE]: outletStock_ledger_Data.date,
                [OUTLETSTOCKLEDGER.COLUMNS.OUTLETID]: outletStock_ledger_Data.outletid,
                [OUTLETSTOCKLEDGER.COLUMNS.PRODID]: outletStock_ledger_Data.prodid,
                [OUTLETSTOCKLEDGER.COLUMNS.PARCHASE_QTY]: outletStock_ledger_Data.purchase_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.SALE_QTY]: outletStock_ledger_Data.sale_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.PURCHASE_RETURN_QTY]: outletStock_ledger_Data.purchase_return_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.WASTAGE_QTY]: outletStock_ledger_Data.wastage_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.ADJUST_QTY]: outletStock_ledger_Data.adjust_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.FREE_QTY]: outletStock_ledger_Data.free_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.SALES_IN_QTY]: outletStock_ledger_Data.sales_in_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.RECEIVED_IN_QTY]: outletStock_ledger_Data.received_in_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: outletStock_ledger_Data.sales_return_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.TR_IN_QTY]: outletStock_ledger_Data.tr_in_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.TR_OUT_QTY]: outletStock_ledger_Data.tr_out_qty,
                [OUTLETSTOCKLEDGER.COLUMNS.COMPANY_ID]: outletStock_ledger_Data.company_id
              });

            }

          }

        }
      }

      const sales_master_update = await knex(SALESMASTER.NAME)
        .where(SALESMASTER.COLUMNS.DOCNO, stockMissingMst_Data.sales_doc_no)
        .update({
          [SALESDETAILS.COLUMNS.IS_STOCK_VERIFY]: true
        });


      const sales_details_update = await knex(SALESDETAILS.NAME)
        .where(SALESDETAILS.COLUMNS.DOCNO, stockMissingMst_Data.sales_doc_no)
        .update({
          [SALESDETAILS.COLUMNS.IS_STOCK_VERIFY]: true
        });
    }


    return { success: true, docno: stockMissingMst_id_string };
  }


  async function postStockScan({ params, body, logTrace, userDetails }) {
    const knex = this;

    const {
      docno, docdate, barcode, pro_code,
      prodid,
      description, mrp, gst_per, rate,
      dis_per, qty, gst_amt, amount, sales_details_id, outlet_id, received_in_qty
    } = body;

    console.log(qty, "qty");
    console.log(docno, "docno");
    console.log(received_in_qty, "received_in_qty");
    console.log(outlet_id, "outlet_id");
    console.log(prodid, "prodid");
    console.log(received_in_qty, "received_in_qty");


    const addQtyInOutletProductQty = await knex(`${OUTLET_PRODUCT_MAPPING.NAME}`)
      .where(`${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
      .where(`${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`, prodid)
      .update({
        [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: knex.raw(
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} + ${received_in_qty}`
        )
      })

    const addRecievedQtyInSalesDetailsQty = await knex(`${SALESDETAILS.NAME}`)
      .where(`${SALESDETAILS.COLUMNS.ID}`, sales_details_id)
      .where(`${SALESDETAILS.COLUMNS.DOCNO}`, docno)
      .update({
        [SALESDETAILS.COLUMNS.RECEIVED_IN_QTY]: received_in_qty
      })

    const record = knex(STOCK_SCAN.NAME)
      .select('*')
      // .where(STOCK_SCAN.COLUMNS.BARCODE, barcode)
      .where({
        [STOCK_SCAN.COLUMNS.DOCNO]: docno,
      })
      .andWhere({
        [STOCK_SCAN.COLUMNS.PRODID]: prodid,
      })
      .andWhere({
        [STOCK_SCAN.COLUMNS.OUTLET_ID]: outlet_id,
      })
      .first()

    const responseScanData = await record

    if (!responseScanData) {

      const queryInsert = await knex(STOCK_SCAN.NAME).insert({
        [STOCK_SCAN.COLUMNS.DOCNO]: docno,
        [STOCK_SCAN.COLUMNS.DOCDATE]: docdate,
        [STOCK_SCAN.COLUMNS.BARCODE]: barcode,
        [STOCK_SCAN.COLUMNS.PRODID]: prodid,
        [STOCK_SCAN.COLUMNS.PRO_CODE]: pro_code,
        [STOCK_SCAN.COLUMNS.DESCRIPTION]: description,
        [STOCK_SCAN.COLUMNS.MRP]: mrp,
        [STOCK_SCAN.COLUMNS.GST_PER]: gst_per,
        [STOCK_SCAN.COLUMNS.RATE]: rate,
        [STOCK_SCAN.COLUMNS.DIS_PER]: dis_per,
        [STOCK_SCAN.COLUMNS.QTY]: received_in_qty,
        [STOCK_SCAN.COLUMNS.GST_AMT]: gst_amt,
        [STOCK_SCAN.COLUMNS.AMOUNT]: amount,
        [STOCK_SCAN.COLUMNS.SALES_DETAILS_ID]: sales_details_id,
        [STOCK_SCAN.COLUMNS.OUTLET_ID]: outlet_id
      });
    }

    // else {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_FOUND,
    //     message: "barcode already scaned",
    //     property: "",
    //     code: "NOT_FOUND"
    //   });
    // }


    const countOfStockScanQuery = knex(STOCK_SCAN.NAME)
      .count('* as total')
      .where({
        [STOCK_SCAN.COLUMNS.DOCNO]: docno,
      })
      .andWhere({
        [STOCK_SCAN.COLUMNS.PRODID]: prodid,
      })
      .andWhere({
        [STOCK_SCAN.COLUMNS.OUTLET_ID]: outlet_id,
      })

    const countOfStockScan = await countOfStockScanQuery

    const countOfStocksTable = countOfStockScan[0].total

    const finalCountOfStocksTable = Number(countOfStocksTable)

    console.log(finalCountOfStocksTable, "finalCountOfStocksTable");

    const countOfSalesDetailsQuery = knex(SALESDETAILS.NAME)
      .count('* as total')
      .where({
        [SALESDETAILS.COLUMNS.DOCNO]: docno,
      })

    const countOfSalesDetails = await countOfSalesDetailsQuery


    const countOfSalesDetailsTable = countOfSalesDetails[0].total

    const finalCountOfSalesDetails = Number(countOfSalesDetailsTable)
    console.log(finalCountOfSalesDetails, "finalCountOfSalesDetails");


    if (finalCountOfStocksTable == finalCountOfSalesDetails) {

      const stockVerifySalesDetailQuery = await knex(SALESMASTER.NAME)
        .update({
          [SALESMASTER.COLUMNS.IS_STOCK_VERIFY]: true
        })
        .where({
          [SALESMASTER.COLUMNS.DOCNO]: docno,
        })
    }


    return { success: true }
  }


  return {
    postStockMissingMst,
    postStockScan
  };
}

module.exports = getStockMissingMstRepo;
