const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLETSALESMASTER, OUTLETSALESDETAILS, OUTLETSTOCKLEDGER, SALESMANLEDGER } = require("../commons/constants");
const { OUTLETMEMBERS } = require("../../../catalog/commons")
const { OUTLETSALESRETURNMASTER } = require("../../outlet_sales_return_master/commons/constants");
const { CLOSING_STOCK_TEMP } = require("../../../closing_stock/commons");
const { OUTLET_PRODUCT_MAPPING, ITEM, TYPEDESIGN, HEADS, BARCODE_LIST } = require("../../../catalog/commons");
const { MAIN_CATEGORY, SUB_CATEGORY } = require("../../../catalog/subcategory/commons/constants");
const partyledgerRepo = require("../../../partyledger/repository/partyledger");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { COMPANY } = require("../../../accounts/company/commons/constants");
const { SUPPLIER } = require("../../../catalog/commons");
const { OUTLETS, OUTLETTYPE, FRANCHISETYPE } = require("../commons/constants");



function getOutletSalesMasterRepo(fastify) {

  async function postOutletSalesMaster({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    //***************************** 1. OutletSalesMaster insert  **************************************   


    const outletSalesMaster_Data = {
      docdate: body.docdate,
      transaction_id: body.transaction_id,
      transaction_provider: body.transaction_provider,
      transaction_type: body.transaction_type,
      salesman_id: body.salesman_id,
      outletid: body.outletid,
      amount: body.amount,
      subtotal_amount: body.subtotal_amount,
      gst_per: body.gst_per,
      gst_amt: body.gst_amt,
      cess_per: body.cess_per,
      cess_amt: body.cess_amt,
      roff: body.roff,
      is_credit: body.is_credit,
      outstanding: body.outstanding,
      mode: body.mode,
      company_id: body.company_id,
      mobile: body.mobile,
      party_name: body.party_name,
      address: body.address,
      gst_in: body.gst_in,
      loyalty_earned: body.loyalty_earned,
      loyalty_redem: body.loyalty_redem,
      balance_points: body.balance_points,
      return_amount: body.return_amount || 0,
      return_billno: body.return_billno || null,
      cash_amount: body.cash_amount || 0,
      card_amount: body.card_amount || 0,
      upi_amount: body.upi_amount || 0,
      less_amount: body.less_amount || 0,
      discount_amount: body.discount_amount,
      spouse_name: body.spouse_name,
      spouse_dob: body.spouse_dob,
      party_dob: body.party_dob,
      anniversary_date: body.anniversary_date,
      no_of_child: body.no_of_child
    }


    const outletSalesMaster_Data_insert = await knex(`${OUTLETSALESMASTER.NAME}`).returning("id").insert
      ({

        [OUTLETSALESMASTER.COLUMNS.DOCDATE]: outletSalesMaster_Data.docdate,
        [OUTLETSALESMASTER.COLUMNS.TRANSACTION_ID]: outletSalesMaster_Data.transaction_id,
        [OUTLETSALESMASTER.COLUMNS.TRANSACTION_PROVIDER]: outletSalesMaster_Data.transaction_provider,
        [OUTLETSALESMASTER.COLUMNS.TRANSACTION_TYPE]: outletSalesMaster_Data.transaction_type,
        [OUTLETSALESMASTER.COLUMNS.SALESMAN_ID]: outletSalesMaster_Data.salesman_id,
        [OUTLETSALESMASTER.COLUMNS.OUTLETID]: outletSalesMaster_Data.outletid,
        [OUTLETSALESMASTER.COLUMNS.AMOUNT]: outletSalesMaster_Data.amount,
        [OUTLETSALESMASTER.COLUMNS.SUBTOTAL_AMOUNT]: outletSalesMaster_Data.subtotal_amount,
        [OUTLETSALESMASTER.COLUMNS.GST_PER]: outletSalesMaster_Data.gst_per,
        [OUTLETSALESMASTER.COLUMNS.GST_AMT]: outletSalesMaster_Data.gst_amt,
        [OUTLETSALESMASTER.COLUMNS.CESS_PER]: outletSalesMaster_Data.cess_per,
        [OUTLETSALESMASTER.COLUMNS.CESS_AMT]: outletSalesMaster_Data.cess_amt,
        [OUTLETSALESMASTER.COLUMNS.ROFF]: outletSalesMaster_Data.roff,
        [OUTLETSALESMASTER.COLUMNS.IS_CREDIT]: outletSalesMaster_Data.is_credit,
        [OUTLETSALESMASTER.COLUMNS.OUTSTANDING]: outletSalesMaster_Data.outstanding,
        [OUTLETSALESMASTER.COLUMNS.MODE]: outletSalesMaster_Data.mode,
        [OUTLETSALESMASTER.COLUMNS.COMPANY_ID]: outletSalesMaster_Data.company_id,
        [OUTLETSALESMASTER.COLUMNS.MOBILE]: outletSalesMaster_Data.mobile,
        [OUTLETSALESMASTER.COLUMNS.PARTY_NAME]: outletSalesMaster_Data.party_name,
        [OUTLETSALESMASTER.COLUMNS.ADDRESS]: outletSalesMaster_Data.address,
        [OUTLETSALESMASTER.COLUMNS.GET_IN]: outletSalesMaster_Data.gst_in,
        [OUTLETSALESMASTER.COLUMNS.LOYALTY_EARNED]: outletSalesMaster_Data.loyalty_earned,
        [OUTLETSALESMASTER.COLUMNS.LOYALTY_REDEM]: outletSalesMaster_Data.loyalty_redem,
        [OUTLETSALESMASTER.COLUMNS.BALANCE_POINTS]: outletSalesMaster_Data.balance_points,
        [OUTLETSALESMASTER.COLUMNS.RETURN_AMOUNT]: outletSalesMaster_Data.return_amount,
        [OUTLETSALESMASTER.COLUMNS.RETURN_BILLNO]: outletSalesMaster_Data.return_billno,
        [OUTLETSALESMASTER.COLUMNS.CASH_AMOUNT]: outletSalesMaster_Data.cash_amount,
        [OUTLETSALESMASTER.COLUMNS.CARD_AMOUNT]: outletSalesMaster_Data.card_amount,
        [OUTLETSALESMASTER.COLUMNS.UPI_AMOUNT]: outletSalesMaster_Data.upi_amount,
        [OUTLETSALESMASTER.COLUMNS.LESS_AMOUNT]: outletSalesMaster_Data.less_amount,
        [OUTLETSALESMASTER.COLUMNS.DISCOUNT_AMOUNT]: outletSalesMaster_Data.discount_amount


      });



    var outletSalesMaster_id = outletSalesMaster_Data_insert[0].id;

    var outletSalesMaster_id_docno;

    let outlet_short_name = 'OS';

    if (outletSalesMaster_Data.outletid) {

      const short_name = await knex(OUTLETS.NAME)
        .where(OUTLETS.COLUMNS.ID, outletSalesMaster_Data.outletid)
        .select(OUTLETS.COLUMNS.SHORTNAME);

      outlet_short_name = short_name[0].short_name

      var query_for_outletId_with_outletSales_ID = await knex(OUTLETSALESMASTER.NAME)
        .count('id as count')
        .where(OUTLETSALESMASTER.COLUMNS.OUTLETID, body.outletid);

      var outletSales_id = Number(query_for_outletId_with_outletSales_ID[0]['count'])

    }

    outletSalesMaster_id_docno = `${outlet_short_name}_${financialYear}_${outletSales_id}`

    const outletSalesMaster_unique_docno = await knex(`${OUTLETSALESMASTER.NAME}`)
      .where(`${OUTLETSALESMASTER.COLUMNS.DOCNO}`, outletSalesMaster_id_docno)

    if (outletSalesMaster_unique_docno.length === 0) {

      const outletSalesMaster_Data_update = await knex(`${OUTLETSALESMASTER.NAME}`)
        .where(`${OUTLETSALESMASTER.COLUMNS.ID}`, outletSalesMaster_id)
        .update({
          [OUTLETSALESMASTER.COLUMNS.DOCNO]: outletSalesMaster_id_docno
        });
    }
    else {

      function incrementDocNo(docNo) {
        const lastUnderscoreIndex = docNo.lastIndexOf('_');

        const prefix = docNo.substring(0, lastUnderscoreIndex + 1);
        const numericPart = docNo.substring(lastUnderscoreIndex + 1);
        const incrementedNumber = parseInt(numericPart, 10) + 1;
        return prefix + incrementedNumber;
      }
      const updatedDocNo = incrementDocNo(outletSalesMaster_id_docno);
      outletSalesMaster_id_docno = updatedDocNo

      const outletSalesMaster_Data_update = await knex(`${OUTLETSALESMASTER.NAME}`)
        .where(`${OUTLETSALESMASTER.COLUMNS.ID}`, outletSalesMaster_id)
        .update({
          [OUTLETSALESMASTER.COLUMNS.DOCNO]: outletSalesMaster_id_docno
        });

    }


    //************************************ outlet sales return master is_refund update **************************

    // console.log(outletSalesMaster_Data.return_amount, "outletSalesMaster_Data.return_amount");
    // console.log(outletSalesMaster_Data.return_billno, "outletSalesMaster_Data.return_billno");

    if (outletSalesMaster_Data.return_amount > 0 && outletSalesMaster_Data.return_billno != null) {
      const outletSalesReturnMaster_is_refund_update = await knex(`${OUTLETSALESRETURNMASTER.NAME}`)
        .where(`${OUTLETSALESRETURNMASTER.COLUMNS.DOCNO}`, outletSalesMaster_Data.return_billno)
        .update({
          [OUTLETSALESRETURNMASTER.COLUMNS.IS_REFUND]: true
        });
    }

    // ************************************ salesman ledger ********************************  

    const outletSalesManLedgerGet = knex(SALESMANLEDGER.NAME)
      .where({
        [SALESMANLEDGER.COLUMNS.SALESMAN_ID]: outletSalesMaster_Data.salesman_id,
        [SALESMANLEDGER.COLUMNS.DOCDATE]: outletSalesMaster_Data.docdate,
        [SALESMANLEDGER.COLUMNS.OUTLETID]: outletSalesMaster_Data.outletid

      });


    const existsResponseOutletSalesmanLedger = await outletSalesManLedgerGet;

    if (existsResponseOutletSalesmanLedger.length == 0) {
      const outlet_Member_Data_Insert = await knex(`${SALESMANLEDGER.NAME}`).insert
        ({
          [SALESMANLEDGER.COLUMNS.DOCDATE]: outletSalesMaster_Data.docdate,
          [SALESMANLEDGER.COLUMNS.SALESMAN_ID]: outletSalesMaster_Data.salesman_id,
          [SALESMANLEDGER.COLUMNS.SALES]: outletSalesMaster_Data.amount,
          [SALESMANLEDGER.COLUMNS.OUTLETID]: outletSalesMaster_Data.outletid,
        });
    }
    else {

      const outletSalesmanLedgerUpdate = await knex(`${SALESMANLEDGER.NAME}`)
        .where(`${SALESMANLEDGER.COLUMNS.SALESMAN_ID}`, outletSalesMaster_Data.salesman_id)
        .andWhere(SALESMANLEDGER.COLUMNS.DOCDATE, outletSalesMaster_Data.docdate)
        .andWhere(SALESMANLEDGER.COLUMNS.OUTLETID, outletSalesMaster_Data.outletid)

        .update({
          [SALESMANLEDGER.COLUMNS.SALES]: knex.raw(
            `${SALESMANLEDGER.COLUMNS.SALES} + ${outletSalesMaster_Data.amount}`
          ),
        });
    }


    //*********************************** outlet members ************************************

    if (outletSalesMaster_Data.mobile) {

      const outletMemberGet = knex(OUTLETMEMBERS.NAME)
        .where({
          [OUTLETMEMBERS.COLUMNS.MOBILE]: outletSalesMaster_Data.mobile,
        })

      const existsResponseOutletMember = await outletMemberGet;

      if (existsResponseOutletMember.length == 0) {
        const outlet_Member_Data_Insert = await knex(`${OUTLETMEMBERS.NAME}`).insert
          ({
            [OUTLETMEMBERS.COLUMNS.MOBILE]: outletSalesMaster_Data.mobile,
            [OUTLETMEMBERS.COLUMNS.PARTY_NAME]: outletSalesMaster_Data.party_name,
            [OUTLETMEMBERS.COLUMNS.ADDRESS]: outletSalesMaster_Data.address,
            [OUTLETMEMBERS.COLUMNS.GET_IN]: outletSalesMaster_Data.gst_in,
            [OUTLETMEMBERS.COLUMNS.BALANCE_POINTS]: outletSalesMaster_Data.balance_points,
            [OUTLETMEMBERS.COLUMNS.SPOUSE_NAME]: outletSalesMaster_Data.spouse_name,
            [OUTLETMEMBERS.COLUMNS.SPOUSE_DOB]: outletSalesMaster_Data.spouse_dob,
            [OUTLETMEMBERS.COLUMNS.PARTY_DOB]: outletSalesMaster_Data.party_dob,
            [OUTLETMEMBERS.COLUMNS.ANNIVERSARY_DATE]: outletSalesMaster_Data.anniversary_date,
            [OUTLETMEMBERS.COLUMNS.NO_OF_CHILD]: outletSalesMaster_Data.no_of_child
          });
      }
      else {

        const outlet_Member_Data_Update = await knex(OUTLETMEMBERS.NAME)
          .where({
            [OUTLETMEMBERS.COLUMNS.MOBILE]: outletSalesMaster_Data.mobile,
          })
          .update({
            [OUTLETMEMBERS.COLUMNS.BALANCE_POINTS]: outletSalesMaster_Data.balance_points

          });

      }

    }



    //***************************** 2. salesDetails insert  **************************************    



    if (Array.isArray(body.outlet_sales_details)) {
      body.outlet_sales_details.forEach(async outlet_sales_details => {
        var outlet_sales_details_data = {
          docdate: outlet_sales_details.docdate,
          outletid: outlet_sales_details.outletid,
          prodid: outlet_sales_details.prodid,
          dis_per: outlet_sales_details.dis_per,
          dis_amt: outlet_sales_details.dis_amt,
          rate: outlet_sales_details.rate,
          mrp: outlet_sales_details.mrp,
          qty: outlet_sales_details.qty,
          gst_per: outlet_sales_details.gst_per,
          gst_amt: outlet_sales_details.gst_amt,
          cess_per: outlet_sales_details.cess_per,
          cess_amt: outlet_sales_details.cess_amt,
          barcode: outlet_sales_details.barcode,
          company_id: outlet_sales_details.company_id,
          head_id: outlet_sales_details.head_id,
          type_id: outlet_sales_details.type_id,
          subcat_id: outlet_sales_details.subcat_id,
          cat_id: outlet_sales_details.cat_id,
          uom_id: outlet_sales_details.uom_id,
          igst_per: outlet_sales_details.igst_per

        }

        var closing_stock_delete = await knex(`${CLOSING_STOCK_TEMP.NAME}`)
          .where({
            [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: outlet_sales_details_data.barcode
            // [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: closing_stock_Temp_data.outlet_id
          })
          .del();


        const query_insert2 = await knex(`${OUTLETSALESDETAILS.NAME}`).insert
          ({
            [OUTLETSALESDETAILS.COLUMNS.DOCNO]: outletSalesMaster_id_docno,
            [OUTLETSALESDETAILS.COLUMNS.OUTLETID]: outlet_sales_details_data.outletid,
            [OUTLETSALESDETAILS.COLUMNS.DOCDATE]: outlet_sales_details_data.docdate,
            [OUTLETSALESDETAILS.COLUMNS.PRODID]: outlet_sales_details_data.prodid,
            [OUTLETSALESDETAILS.COLUMNS.DIS_PER]: outlet_sales_details_data.dis_per,
            [OUTLETSALESDETAILS.COLUMNS.DIS_AMT]: outlet_sales_details_data.dis_amt,
            [OUTLETSALESDETAILS.COLUMNS.MRP]: outlet_sales_details_data.mrp,
            [OUTLETSALESDETAILS.COLUMNS.RATE]: outlet_sales_details_data.rate,
            [OUTLETSALESDETAILS.COLUMNS.QTY]: outlet_sales_details_data.qty,
            [OUTLETSALESDETAILS.COLUMNS.GST_PER]: outlet_sales_details_data.gst_per,
            [OUTLETSALESDETAILS.COLUMNS.GST_AMT]: outlet_sales_details_data.gst_amt,
            [OUTLETSALESDETAILS.COLUMNS.CESS_PER]: outlet_sales_details_data.cess_per,
            [OUTLETSALESDETAILS.COLUMNS.CESS_AMT]: outlet_sales_details_data.cess_amt,
            [OUTLETSALESDETAILS.COLUMNS.BARCODE]: outlet_sales_details_data.barcode,
            [OUTLETSALESDETAILS.COLUMNS.COMPANY_ID]: outlet_sales_details_data.company_id,
            [OUTLETSALESDETAILS.COLUMNS.HEAD_ID]: outlet_sales_details_data.head_id,
            [OUTLETSALESDETAILS.COLUMNS.TYPE_ID]: outlet_sales_details_data.type_id,
            [OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID]: outlet_sales_details_data.subcat_id,
            [OUTLETSALESDETAILS.COLUMNS.CAT_ID]: outlet_sales_details_data.cat_id,
            [OUTLETSALESDETAILS.COLUMNS.UOM_ID]: outlet_sales_details_data.uom_id,
            [OUTLETSALESDETAILS.COLUMNS.IGST_PER]: outlet_sales_details_data.igst_per ? outlet_sales_details_data.igst_per : 0,
            [OUTLETSALESDETAILS.COLUMNS.CREATED_BY]: 2
          });

        const barcode_update = await knex(`${BARCODE_LIST.NAME}`)
          .where(`${BARCODE_LIST.COLUMNS.BARCODE}`, outlet_sales_details_data.barcode)
          .update({
            [BARCODE_LIST.COLUMNS.IS_SOLD]: true
          });


      })

    }

    //********************************** 3. partyLedger insert ************************************


    var partyLedger_data = {
      edate: outletSalesMaster_Data.docdate,
      partycode: outletSalesMaster_Data.outletid,
      debit: outletSalesMaster_Data.amount,
      credit: 0,
      type: outletSalesMaster_id_docno,
      // mode:OutletSalesMaster_Data.mode,  //empty
      company_id: outletSalesMaster_Data.company_id
    }


    const { updatePartyLedger } = partyledgerRepo(fastify);
    const updatePartyLedger_response = await updatePartyLedger.call(knex,
      {
        logTrace,
        partyLedger_data
      });

    //***************************  4. out let products ****************************************

    if (Array.isArray(body.outlet_sales_details)) {
      body.outlet_sales_details.forEach(async outlet_sales_details => {

        const outletProductUpdate = await knex(`${OUTLET_PRODUCT_MAPPING.NAME}`)
          .where(`${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE}`, outlet_sales_details.prodid)
          .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outletSalesMaster_Data.outletid)
          .update({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: knex.raw(
              `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} - ${outlet_sales_details.qty}`
            ),
          });

      })

    }

    // ********************************  5. outlet stockledger    ***************************************

    if (Array.isArray(body.outlet_sales_details)) {
      body.outlet_sales_details.forEach(async outlet_sales_details => {

        const outletStockLedgerQuery = knex(OUTLETSTOCKLEDGER.NAME)
          .where({
            [OUTLETSTOCKLEDGER.COLUMNS.PRODID]: outlet_sales_details.prodid,
          })
          .andWhere(OUTLETSTOCKLEDGER.COLUMNS.DATE, outlet_sales_details.docdate);

        const existsResponseOutletStock = await outletStockLedgerQuery;

        if (existsResponseOutletStock.length > 0) {
          const queryUpdate = await knex(OUTLETSTOCKLEDGER.NAME)
            .where({
              [OUTLETSTOCKLEDGER.COLUMNS.PRODID]: outlet_sales_details.prodid,
            })
            .andWhere(OUTLETSTOCKLEDGER.COLUMNS.DATE, outlet_sales_details.docdate)
            .andWhere(OUTLETSTOCKLEDGER.COLUMNS.OUTLETID, outletSalesMaster_Data.outletid)
            .update({
              [OUTLETSTOCKLEDGER.COLUMNS.SALE_QTY]: knex.raw(
                `${OUTLETSTOCKLEDGER.COLUMNS.SALE_QTY} + ${outlet_sales_details.qty}`
              ),
            });
          // .update({
          //   [OUTLETSTOCKLEDGER.COLUMNS.SALES_IN_QTY]: knex.raw(
          //     `${OUTLETSTOCKLEDGER.COLUMNS.SALES_IN_QTY} + ${outlet_sales_details.qty}`
          //   ),
          // });
        }
        else {
          const outletStock_ledger_Data = {
            date: outlet_sales_details.docdate,
            prodid: outlet_sales_details.prodid,
            outletid: outlet_sales_details.outletid,
            purchase_qty: 0,
            sale_qty: 0 + `${outlet_sales_details.qty}`,
            purchase_return_qty: 0,
            wastage_qty: 0,
            adjust_qty: 0,
            free_qty: 0,
            sales_in_qty: 0,
            sales_return_qty: 0,
            tr_in_qty: 0,
            tr_out_qty: 0,
            company_id: outlet_sales_details.company_id
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
            [OUTLETSTOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: outletStock_ledger_Data.sales_return_qty,
            [OUTLETSTOCKLEDGER.COLUMNS.TR_IN_QTY]: outletStock_ledger_Data.tr_in_qty,
            [OUTLETSTOCKLEDGER.COLUMNS.TR_OUT_QTY]: outletStock_ledger_Data.tr_out_qty,
            [OUTLETSTOCKLEDGER.COLUMNS.COMPANY_ID]: outletStock_ledger_Data.company_id
          });
        }

      })

    }

    return { success: true, docno: outletSalesMaster_id_docno };
  }


  async function putOutletSalesPayment({ params, body, logTrace, userDetails }) {
    const knex = this;

    console.log("payment outlet sales");


    const outletSalesMaster_Data = {
      outlet_sales_id: body.outlet_sales_id,
      upi_amount: body.upi_amount,
      cash_amount: body.cash_amount,
      card_amount: body.card_amount,
      mode: body.mode,

    }

    console.log(outletSalesMaster_Data, "outletSalesMaster_Data");

    const outletSalesMaster_Data_update = knex(`${OUTLETSALESMASTER.NAME}`)
      .where(`${OUTLETSALESMASTER.COLUMNS.ID}`, outletSalesMaster_Data.outlet_sales_id)
      .update({
        [OUTLETSALESMASTER.COLUMNS.UPI_AMOUNT]: outletSalesMaster_Data.upi_amount,
        [OUTLETSALESMASTER.COLUMNS.CASH_AMOUNT]: outletSalesMaster_Data.cash_amount,
        [OUTLETSALESMASTER.COLUMNS.CARD_AMOUNT]: outletSalesMaster_Data.card_amount,
        [OUTLETSALESMASTER.COLUMNS.MODE]: outletSalesMaster_Data.mode,

      });

    const response = await outletSalesMaster_Data_update


    return { success: true };
  }
  async function getOutletSalesMaster({ params, body, logTrace, userDetails }) {
    const knex = this;

    var code = body.code
    var outlet_id = body.outlet_id

    const query = knex
      .select([
        `${OUTLET_PRODUCT_MAPPING.NAME}.*`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.BARCODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PARCHASE_RATE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SALE_RATE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.WHOLESALE_RATE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.GST}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.OP_STK}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MIN_STOCK}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ALLOW_NEG_STK}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.WSCALE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.VENDOR}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CREATED_AT}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UPDATED_AT}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CREATED_BY}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UPDATED_BY}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`
      ])
      .from(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
      .join(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .join(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM}`, `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .join(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`, `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .join(
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`, `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .join(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`, `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .join(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`, `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .join(
        `${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`, function () {
          this.on(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID}`, '=', `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`)
            .andOn(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, '=', `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`);
        }
      )
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, '=', outlet_id)
      .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, '=', true)
      .andWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, '=', code)
      .andWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`, '=', true)
      .andWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_ACTIVE}`, '=', true)


    const response = await query;

    logQuery({
      logger: fastify.log,
      query,
      context: "Get outlet_sales",
      logTrace
    });

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "outlet_sales data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0]
  }

  async function getOutletSalesDocNo({ params, logTrace, financialYear }) {
    const knex = this;

    let query;

    console.log(financialYear, "financialYear");

    let outlet_short_name = 'OS';

    if (params.outlet_id) {

      const short_name = await knex(OUTLETS.NAME)
        .where(OUTLETS.COLUMNS.ID, params.outlet_id)
        .select(OUTLETS.COLUMNS.SHORTNAME);

      outlet_short_name = short_name[0].short_name

      // query = knex(OUTLETSALESMASTER.NAME).returning("id")
      //   .where(OUTLETSALESMASTER.COLUMNS.OUTLETID, params.outlet_id)
      //   .orderBy(OUTLETSALESMASTER.COLUMNS.ID, 'desc')
      //   .limit(1);
      query = knex(OUTLETSALESMASTER.NAME)
        .count('id as count')
        .where(OUTLETSALESMASTER.COLUMNS.OUTLETID, params.outlet_id);


    }

    else {

      // query = knex(OUTLETSALESMASTER.NAME).returning("id")
      //   .orderBy(OUTLETSALESMASTER.COLUMNS.ID, 'desc')
      //   .limit(1);
      // console.log(query, "query");
      query = knex(OUTLETSALESMASTER.NAME)
        .count('id as count');

    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Sales",
      logTrace
    });


    const response = await query;
    const count = response[0].count;

    console.log(response, "response");


    if (response.length === 0) {

      let doc_first = `${outlet_short_name}_${financialYear}_1`
      return { Docno: doc_first };
    }

    const docno = Number(response[0].count);
    // const docno = response[0].id;


    const numericPart = docno;
    // const numericPart = parseInt(docno.replace(/\D/g, ''), 10);

    if (isNaN(numericPart)) {
      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Invalid docno format in response",
        property: "",
        code: "INVALID_DOCNO_FORMAT"
      });
    }

    // console.log(numericPart, "numericPart");

    const Docno = `${outlet_short_name}_${financialYear}_${numericPart + 1}`;


    return { Docno };
  }

  async function getFetchOutletMembers({ body, logTrace }) {
    const knex = this;

    const query = knex(OUTLETMEMBERS.NAME)
      .where(OUTLETMEMBERS.COLUMNS.MOBILE, body.mobile)
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Members",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Member not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response
  }

  async function getAllOutletSalesDocNo({ body, params, logTrace }) {
    const knex = this;

    const docno = body.docno
    const query = knex
      .select([
        `${OUTLETSALESMASTER.NAME}.*`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DIS_PER}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DIS_AMT}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.MRP}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.RATE}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.QTY}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.GST_PER}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.GST_AMT}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CESS_PER}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CESS_AMT}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.BARCODE}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.COMPANY_ID}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.HEAD_ID}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.TYPE_ID}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.SUBCAT_ID}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.CAT_ID}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.IGST_PER}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE} as outlet_code`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_shortname`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_fullname`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD1} as outlet_add1`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD2} as outlet_add2`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD3} as outlet_add3`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD4} as outlet_add4`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY} as outlet_city`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PINCODE} as outlet_pincode`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE} as outlet_state`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY} as outlet_country`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PHONE} as outlet_phone`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.MOBILE} as outlet_mobile`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.EMAIL} as outlet_email`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.WEBSITE} as outlet_website`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.GSTIN} as outlet_gstin`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FSSAI} as outlet_fssai`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE} as outlet_outlettype`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKACNO} as outlet_bankacno`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKNAME} as outlet_bankname`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ACNAME} as outlet_acname`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IFSCCODE} as outlet_ifsccode`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BALANCE} as outlet_balance`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.OUTLETTYPE} as outlet_type_name`,
        `${FRANCHISETYPE.NAME}.${FRANCHISETYPE.COLUMNS.FRANCHISETYPE} as franchise_type_name`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.CODE} as company_code`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.SHORTNAME} as company_shortname`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.FULLNAME} as company_fullname`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ADD1} as company_add1`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ADD2} as company_add2`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ADD3} as company_add3`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ADD4} as company_add4`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.CITY} as company_city`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.PINCODE} as company_pincode`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.STATE} as company_state`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.COUNTRY} as company_country`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.PHONE} as company_phone`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.MOBILE} as company_mobile`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.EMAIL} as company_email`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.WEBSITE} as company_website`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.GSTIN} as company_gstin`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.FSSAI} as company_fssai`,

      ])
      .from(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`)
      .leftJoin(
        `${OUTLETSALESDETAILS.NAME} as ${OUTLETSALESDETAILS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
      )
      .leftJoin(
        `${FRANCHISETYPE.NAME} as ${FRANCHISETYPE.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FRANCHISETYPE}`,
        `${FRANCHISETYPE.NAME}.${FRANCHISETYPE.COLUMNS.ID}`
      )
      .where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`,
        docno
      );

    const response = await query;
    return Array.isArray(response) && response.length > 0 ? response[0] : [];

  }

  async function deleteOutletSales({ params, body, logTrace, userDetails }) {
    const knex = this;

    const outletSalesMaster_Data_update = knex(`${OUTLETSALESMASTER.NAME}`)
      .where(`${OUTLETSALESMASTER.COLUMNS.ID}`, body.outlet_sales_id)
      .where(`${OUTLETSALESMASTER.COLUMNS.OUTLETID}`, body.outlet_id)
      .update({
        [OUTLETSALESMASTER.COLUMNS.DOCDATE]: null,
      });

    const response = await outletSalesMaster_Data_update

    // const query = knex(OUTLETSALESDETAILS.NAME).where(OUTLETSALESDETAILS.COLUMNS.DOCNO, body.docno);
    //     const exists_response = await query;

    // if (!exists_response.length > 0) {
    //     throw CustomError.create({
    //         httpCode: StatusCodes.NOT_ACCEPTABLE,
    //         message: "outlet sales details not found to delete",
    //         property: "",
    //         code: "NOT_ACCEPTABLE"
    //     });
    // }

    const query = knex(OUTLETSALESDETAILS.NAME)
      .where(OUTLETSALESDETAILS.COLUMNS.DOCNO, body.docno)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete outlet sales details",
      logTrace
    });

    const response2 = await query;
    // if (!response2) {
    //     throw CustomError.create({

    //         httpCode: StatusCodes.NOT_FOUND,
    //         message: "outlet sales details not found",
    //         property: "",
    //         code: "NOT_FOUND"
    //     });
    // }

    return { success: true };
  }
  return {
    postOutletSalesMaster,
    getOutletSalesMaster,
    getOutletSalesDocNo,
    getAllOutletSalesDocNo,
    getFetchOutletMembers,
    putOutletSalesPayment,
    deleteOutletSales
  };
}

module.exports = getOutletSalesMasterRepo;
