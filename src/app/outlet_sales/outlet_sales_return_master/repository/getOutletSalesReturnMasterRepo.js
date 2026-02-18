const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLETSALESRETURNMASTER, OUTLETMEMBERS, OUTLETSALESRETURNDETAILS, OUTLETSALESMASTER, OUTLETSALESDETAILS, OUTLETSTOCKLEDGER, SALESMANLEDGER } = require("../commons/constants");
const { OUTLETS, OUTLETTYPE, FRANCHISETYPE } = require("../commons/constants");


const { OUTLET_PRODUCT_MAPPING, ITEM, TYPEDESIGN, HEADS } = require("../../../catalog/commons");
const { MAIN_CATEGORY, SUB_CATEGORY } = require("../../../catalog/subcategory/commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { COMPANY } = require("../../../accounts/company/commons/constants");

const partyledgerRepo = require("../../../partyledger/repository/partyledger");
const { BARCODE_LIST } = require("../../../accounts/barcode/commons/constant");
const { SALESMASTER } = require("../../../sales/commons");

function getOutletSalesReturnMasterRepo(fastify) {

  async function postOutletSalesReturnMaster({ params, body, logTrace, financialYear, userDetails }) {
    const knex = this;

    //***************************** 1. OutletSalesReturnMaster insert  **************************************    
    const outletSalesReturnMaster_Data = {
      docdate: body.docdate,
      salesman_id: body.salesman_id,
      outletid: body.outletid,
      amount: body.amount,
      subtotal_amount: body.subtotal_amount,
      gst_per: body.gst_per,
      gst_amt: body.gst_amt,
      cess_per: body.cess_per,
      cess_amt: body.cess_amt,
      roff: body.roff,
      // is_credit: body.is_credit,
      outstanding: body.outstanding,
      bill_no: body.bill_no,
      company_id: body.company_id,
      mobile: body.mobile,
      party_name: body.party_name,
      address: body.address,
      gst_in: body.gst_in,
      is_cash: body.is_cash, // is_cash 1 = true (is_refund)
      discount_amount: body.discount_amount
    }
    let is_refund = false

    if (outletSalesReturnMaster_Data.is_cash == 1) {
      is_refund = true
    }

    const outletSalesReturnMaster_Data_insert = await knex(`${OUTLETSALESRETURNMASTER.NAME}`)
      .returning("id")
      .insert({
        [OUTLETSALESRETURNMASTER.COLUMNS.DOCDATE]: outletSalesReturnMaster_Data.docdate,
        [OUTLETSALESRETURNMASTER.COLUMNS.SALESMAN_ID]: outletSalesReturnMaster_Data.salesman_id,
        [OUTLETSALESRETURNMASTER.COLUMNS.OUTLETID]: outletSalesReturnMaster_Data.outletid,
        [OUTLETSALESRETURNMASTER.COLUMNS.AMOUNT]: outletSalesReturnMaster_Data.amount,
        [OUTLETSALESRETURNMASTER.COLUMNS.SUBTOTAL_AMOUNT]: outletSalesReturnMaster_Data.subtotal_amount,
        [OUTLETSALESRETURNMASTER.COLUMNS.GST_PER]: outletSalesReturnMaster_Data.gst_per,
        [OUTLETSALESRETURNMASTER.COLUMNS.GST_AMT]: outletSalesReturnMaster_Data.gst_amt,
        [OUTLETSALESRETURNMASTER.COLUMNS.CESS_PER]: outletSalesReturnMaster_Data.cess_per,
        [OUTLETSALESRETURNMASTER.COLUMNS.CESS_AMT]: outletSalesReturnMaster_Data.cess_amt,
        [OUTLETSALESRETURNMASTER.COLUMNS.ROFF]: outletSalesReturnMaster_Data.roff,
        // [OUTLETSALESRETURNMASTER.COLUMNS.IS_CREDIT]: outletSalesReturnMaster_Data.is_credit,
        [OUTLETSALESRETURNMASTER.COLUMNS.OUTSTANDING]: outletSalesReturnMaster_Data.outstanding,
        [OUTLETSALESRETURNMASTER.COLUMNS.BILL_NO]: outletSalesReturnMaster_Data.bill_no,
        [OUTLETSALESRETURNMASTER.COLUMNS.COMPANY_ID]: outletSalesReturnMaster_Data.company_id,
        [OUTLETSALESRETURNMASTER.COLUMNS.MOBILE]: outletSalesReturnMaster_Data.mobile,
        [OUTLETSALESRETURNMASTER.COLUMNS.PARTY_NAME]: outletSalesReturnMaster_Data.party_name,
        [OUTLETSALESRETURNMASTER.COLUMNS.ADDRESS]: outletSalesReturnMaster_Data.address,
        [OUTLETSALESRETURNMASTER.COLUMNS.GET_IN]: outletSalesReturnMaster_Data.gst_in,
        [OUTLETSALESRETURNMASTER.COLUMNS.IS_REFUND]: is_refund,
        [OUTLETSALESRETURNMASTER.COLUMNS.DISCOUNT_AMOUNT]: outletSalesReturnMaster_Data.discount_amount,

      });

    let outlet_short_name = 'OSR';

    const short_name = await knex(OUTLETS.NAME)
      .where(OUTLETS.COLUMNS.ID, outletSalesReturnMaster_Data.outletid)
      .select(OUTLETS.COLUMNS.SHORTNAME);

    outlet_short_name = short_name[0].short_name

    var query_for_outletId_with_outletSales_ID = await knex(OUTLETSALESRETURNMASTER.NAME)
      .count('id as count')
      .where(OUTLETSALESRETURNMASTER.COLUMNS.OUTLETID, outletSalesReturnMaster_Data.outletid);


    var outletSalesReturnMaster_id = Number(query_for_outletId_with_outletSales_ID[0]['count'])


    var outletSalesReturnMaster_ids = outletSalesReturnMaster_Data_insert[0].id;



    var outletSalesReturnMaster_id_docno = `${outlet_short_name}_${financialYear}_${outletSalesReturnMaster_id}`
    // var outletSalesReturnMaster_id_docno = 'OSR' + outletSalesReturnMaster_id




    const outletSalesReturnMaster_Data_update = await knex(`${OUTLETSALESRETURNMASTER.NAME}`)
      .where(`${OUTLETSALESRETURNMASTER.COLUMNS.ID}`, outletSalesReturnMaster_ids)
      .update({
        [OUTLETSALESRETURNMASTER.COLUMNS.DOCNO]: outletSalesReturnMaster_id_docno
      });




    // ************************************ salesman ledger ********************************  

    const outletSalesManLedgerGet = knex(SALESMANLEDGER.NAME)
      .where({
        [SALESMANLEDGER.COLUMNS.SALESMAN_ID]: outletSalesReturnMaster_Data.salesman_id,
        [SALESMANLEDGER.COLUMNS.DOCDATE]: outletSalesReturnMaster_Data.docdate,
      });


    const existsResponseOutletSalesmanLedger = await outletSalesManLedgerGet;

    if (existsResponseOutletSalesmanLedger.length == 0) {
      const outlet_Member_Data_Insert = await knex(`${SALESMANLEDGER.NAME}`).insert
        ({
          [SALESMANLEDGER.COLUMNS.DOCDATE]: outletSalesReturnMaster_Data.docdate,
          [SALESMANLEDGER.COLUMNS.SALESMAN_ID]: outletSalesReturnMaster_Data.salesman_id,
          [SALESMANLEDGER.COLUMNS.RETURN]: outletSalesReturnMaster_Data.amount,
          [SALESMANLEDGER.COLUMNS.OUTLETID]: outletSalesReturnMaster_Data.outletid,
        });
    }
    else {

      const outletSalesmanLedgerUpdate = await knex(`${SALESMANLEDGER.NAME}`)
        .where(`${SALESMANLEDGER.COLUMNS.SALESMAN_ID}`, outletSalesReturnMaster_Data.salesman_id)
        .andWhere(SALESMANLEDGER.COLUMNS.DOCDATE, outletSalesReturnMaster_Data.docdate)
        .update({
          [SALESMANLEDGER.COLUMNS.RETURN]: knex.raw(
            `${SALESMANLEDGER.COLUMNS.RETURN} + ${outletSalesReturnMaster_Data.amount}`
          ),
        });
    }

    // ***************************************** outlet member ****************

    if (outletSalesReturnMaster_Data.mobile) {

      const outletMemberGet = knex(OUTLETMEMBERS.NAME)
        .where({
          [OUTLETMEMBERS.COLUMNS.MOBILE]: outletSalesReturnMaster_Data.mobile,
        })

      const existsResponseOutletMember = await outletMemberGet;

      if (existsResponseOutletMember.length == 0) {
        const outlet_Member_Data_Insert = await knex(`${OUTLETMEMBERS.NAME}`).insert
          ({
            [OUTLETMEMBERS.COLUMNS.MOBILE]: outletSalesReturnMaster_Data.mobile,
            [OUTLETMEMBERS.COLUMNS.PARTY_NAME]: outletSalesReturnMaster_Data.party_name,
            [OUTLETMEMBERS.COLUMNS.ADDRESS]: outletSalesReturnMaster_Data.address,
            [OUTLETMEMBERS.COLUMNS.GET_IN]: outletSalesReturnMaster_Data.gst_in
          });
      }
    }

    //***************************** 2. salesDetails insert  **************************************    



    if (Array.isArray(body.outlet_sales_return_details)) {
      body.outlet_sales_return_details.forEach(async outlet_sales_return_details => {

        var outlet_sales_return_details_data = {
          docdate: outlet_sales_return_details.docdate,
          outletid: outlet_sales_return_details.outletid,
          prodid: outlet_sales_return_details.prodid,
          dis_per: outlet_sales_return_details.dis_per,
          dis_amt: outlet_sales_return_details.dis_amt,
          rate: outlet_sales_return_details.rate,
          mrp: outlet_sales_return_details.mrp,
          qty: outlet_sales_return_details.qty,
          gst_per: outlet_sales_return_details.gst_per,
          gst_amt: outlet_sales_return_details.gst_amt,
          cess_per: outlet_sales_return_details.cess_per,
          cess_amt: outlet_sales_return_details.cess_amt,
          barcode: outlet_sales_return_details.barcode,
          company_id: outlet_sales_return_details.company_id,
          head_id: outlet_sales_return_details.head_id,
          type_id: outlet_sales_return_details.type_id,
          subcat_id: outlet_sales_return_details.subcat_id,
          cat_id: outlet_sales_return_details.cat_id,
          uom_id: outlet_sales_return_details.uom_id,
          igst_per: outlet_sales_return_details.igst_per

        }

        // console.log(outlet_sales_return_details_data, "outlet_sales_return_details_data");
        const query_insert2 = await knex(`${OUTLETSALESRETURNDETAILS.NAME}`).insert
          ({
            [OUTLETSALESRETURNDETAILS.COLUMNS.DOCNO]: outletSalesReturnMaster_id_docno,
            [OUTLETSALESRETURNDETAILS.COLUMNS.OUTLETID]: outlet_sales_return_details_data.outletid,
            [OUTLETSALESRETURNDETAILS.COLUMNS.DOCDATE]: outlet_sales_return_details_data.docdate,
            [OUTLETSALESRETURNDETAILS.COLUMNS.PRODID]: outlet_sales_return_details_data.prodid,
            [OUTLETSALESRETURNDETAILS.COLUMNS.DIS_PER]: outlet_sales_return_details_data.dis_per,
            [OUTLETSALESRETURNDETAILS.COLUMNS.DIS_AMT]: outlet_sales_return_details_data.dis_amt,
            [OUTLETSALESRETURNDETAILS.COLUMNS.MRP]: outlet_sales_return_details_data.mrp,
            [OUTLETSALESRETURNDETAILS.COLUMNS.RATE]: outlet_sales_return_details_data.rate,
            [OUTLETSALESRETURNDETAILS.COLUMNS.QTY]: outlet_sales_return_details_data.qty,
            [OUTLETSALESRETURNDETAILS.COLUMNS.GST_PER]: outlet_sales_return_details_data.gst_per,
            [OUTLETSALESRETURNDETAILS.COLUMNS.GST_AMT]: outlet_sales_return_details_data.gst_amt,
            [OUTLETSALESRETURNDETAILS.COLUMNS.CESS_PER]: outlet_sales_return_details_data.cess_per,
            [OUTLETSALESRETURNDETAILS.COLUMNS.CESS_AMT]: outlet_sales_return_details_data.cess_amt,
            [OUTLETSALESRETURNDETAILS.COLUMNS.BARCODE]: outlet_sales_return_details_data.barcode,
            [OUTLETSALESRETURNDETAILS.COLUMNS.COMPANY_ID]: outlet_sales_return_details_data.company_id,
            [OUTLETSALESRETURNDETAILS.COLUMNS.HEAD_ID]: outlet_sales_return_details_data.head_id,
            [OUTLETSALESRETURNDETAILS.COLUMNS.TYPE_ID]: outlet_sales_return_details_data.type_id,
            [OUTLETSALESRETURNDETAILS.COLUMNS.SUBCAT_ID]: outlet_sales_return_details_data.subcat_id,
            [OUTLETSALESRETURNDETAILS.COLUMNS.CAT_ID]: outlet_sales_return_details_data.cat_id,
            [OUTLETSALESRETURNDETAILS.COLUMNS.UOM_ID]: outlet_sales_return_details_data.uom_id,
            [OUTLETSALESRETURNDETAILS.COLUMNS.IGST_PER]: outlet_sales_return_details_data.igst_per ? outlet_sales_return_details_data.igst_per : 0,
            [OUTLETSALESRETURNDETAILS.COLUMNS.CREATED_BY]: 2
          });

        const barcode_update = await knex(`${BARCODE_LIST.NAME}`)
          .where(`${BARCODE_LIST.COLUMNS.BARCODE}`, outlet_sales_return_details_data.barcode)
          .update({
            [BARCODE_LIST.COLUMNS.IS_SOLD]: false
          });


      })

    }

    //********************************** 3. partyLedger insert ************************************


    var partyLedger_data = {
      edate: outletSalesReturnMaster_Data.docdate,
      partycode: outletSalesReturnMaster_Data.outletid,
      debit: outletSalesReturnMaster_Data.amount,
      credit: 0,
      type: outletSalesReturnMaster_id_docno,
      // mode:OutletSalesReturnMaster_Data.mode,  //empty
      company_id: outletSalesReturnMaster_Data.company_id
    }


    const { updatePartyLedger } = partyledgerRepo(fastify);
    const updatePartyLedger_response = await updatePartyLedger.call(knex,
      {
        logTrace,
        partyLedger_data
      });

    //***************************  4. out let products ****************************************

    if (Array.isArray(body.outlet_sales_return_details)) {
      body.outlet_sales_return_details.forEach(async outlet_sales_return_details => {

        const outletProductUpdate = await knex(`${OUTLET_PRODUCT_MAPPING.NAME}`)
          .where(`${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE}`, outlet_sales_return_details.prodid)
          .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outletSalesReturnMaster_Data.outletid)
          .update({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: knex.raw(
              `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} + ${outlet_sales_return_details.qty}`
            ),
          });

      })

    }

    // ********************************  5. outlet stockledger    ***************************************

    if (Array.isArray(body.outlet_sales_return_details)) {
      body.outlet_sales_return_details.forEach(async outlet_sales_return_details => {

        const outletStockLedgerQuery = knex(OUTLETSTOCKLEDGER.NAME)
          .where({
            [OUTLETSTOCKLEDGER.COLUMNS.PRODID]: outlet_sales_return_details.prodid,
          })
          .andWhere(OUTLETSTOCKLEDGER.COLUMNS.DATE, outlet_sales_return_details.docdate);

        const existsResponseOutletStock = await outletStockLedgerQuery;

        if (existsResponseOutletStock.length > 0) {
          const queryUpdate = await knex(OUTLETSTOCKLEDGER.NAME)
            .where({
              [OUTLETSTOCKLEDGER.COLUMNS.PRODID]: outlet_sales_return_details.prodid,
            })
            .andWhere(OUTLETSTOCKLEDGER.COLUMNS.DATE, outlet_sales_return_details.docdate)
            .andWhere(OUTLETSTOCKLEDGER.COLUMNS.OUTLETID, outletSalesReturnMaster_Data.outletid)
            .update({
              [OUTLETSTOCKLEDGER.COLUMNS.TR_IN_QTY]: knex.raw(
                `${OUTLETSTOCKLEDGER.COLUMNS.TR_IN_QTY} + ${outlet_sales_return_details.qty}`
              ),
            });
        }
        else {
          const outletStock_ledger_Data = {
            date: outlet_sales_return_details.docdate,
            prodid: outlet_sales_return_details.prodid,
            outletid: outlet_sales_return_details.outletid,
            purchase_qty: 0,
            sale_qty: 0,
            purchase_return_qty: 0,
            wastage_qty: 0,
            adjust_qty: 0,
            free_qty: 0,
            sales_in_qty: 0,
            sales_return_qty: 0,
            tr_in_qty: 0 + `${outlet_sales_return_details.qty}`,
            tr_out_qty: 0,
            company_id: outlet_sales_return_details.company_id
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

    return { success: true };
  }

  async function getOutletSalesReturnDocNo({ params, logTrace, financialYear }) {
    const knex = this;

    let query;

    console.log(financialYear, "financialYear");

    let outlet_short_name = 'OSR';

    if (params.outlet_id) {

      const short_name = await knex(OUTLETS.NAME)
        .where(OUTLETS.COLUMNS.ID, params.outlet_id)
        .select(OUTLETS.COLUMNS.SHORTNAME);

      outlet_short_name = short_name[0].short_name

      // query = knex(OUTLETSALESMASTER.NAME).returning("id")
      //   .where(OUTLETSALESMASTER.COLUMNS.OUTLETID, params.outlet_id)
      //   .orderBy(OUTLETSALESMASTER.COLUMNS.ID, 'desc')
      //   .limit(1);
      query = knex(OUTLETSALESRETURNMASTER.NAME)
        .count('id as count')
        .where(OUTLETSALESRETURNMASTER.COLUMNS.OUTLETID, params.outlet_id);


    } else {

      // query = knex(OUTLETSALESMASTER.NAME).returning("id")
      //   .orderBy(OUTLETSALESMASTER.COLUMNS.ID, 'desc')
      //   .limit(1);
      // console.log(query, "query");
      query = knex(OUTLETSALESRETURNMASTER.NAME)
        .count('id as count');

    }

    // const query = knex(OUTLETSALESRETURNMASTER.NAME).returning("id")
    //   .orderBy(OUTLETSALESRETURNMASTER.COLUMNS.ID, 'desc')
    //   .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Account Master",
      logTrace
    });

    const response = await query;
    const count = response[0].count;


    if (response.length === 0) {
      // return { Docno: "1" };
      let doc_first = `${outlet_short_name}_${financialYear}_1`
      return { Docno: doc_first };
    }

    const docno = Number(response[0].count);
    // const docno = response[0].id;


    const numericPart = docno;

    // const docno = response[0].docno;
    // const numericPart = parseInt(docno.replace(/\D/g, ''), 10);

    if (isNaN(numericPart)) {
      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Invalid docno format in response",
        property: "",
        code: "INVALID_DOCNO_FORMAT"
      });
    }

    // const Docno = `OSR${numericPart + 1}`;
    const Docno = `${outlet_short_name}_${financialYear}_${numericPart + 1}`;
    return { Docno };
  }
  async function getOutletSalesReturnByOutletId({ params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${OUTLETSALESDETAILS.NAME}.*`,
        `${OUTLETS.NAME}.*`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.IS_CREDIT}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.SALESMAN_ID}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.LOYALTY_REDEM}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.RETURN_AMOUNT}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.LESS_AMOUNT}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} AS description`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
      ])
      .from(OUTLETSALESDETAILS.NAME)
      .leftJoin(
        OUTLETSALESMASTER.NAME,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
        '=',
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`
      )
      .leftJoin(
        OUTLETS.NAME,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        '=',
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        ITEM.NAME,
        `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
        '=',
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .where(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID}`, params.outletid)
      .where(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`, params.billno);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Sales Return Info",
      logTrace
    });
    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Already Returned",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getOutletSalesReturnByBillNo({ prod_id, billno, logTrace }) {
    const knex = this;

    // console.log(billno, "billno");
    // console.log(prod_id, "prod_id");
    const query = knex
      .select([
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.QTY} AS osaqty`,

      ])
      .from(OUTLETSALESRETURNDETAILS.NAME)
      .leftJoin(
        `${OUTLETSALESRETURNMASTER.NAME} as ${OUTLETSALESRETURNMASTER.NAME}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DOCNO}`,
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.DOCNO}`
      )
      .where(`${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.BILL_NO}`, billno)
      .where(`${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.PRODID}`, prod_id);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Sales Return Info",
      logTrace
    });
    const response = await query;


    if (!response.length) {
      //console.log(response, "responseyy");
      //console.log(query.toString(), "strrrrrrrrr");
      return { osaqty: 0 };

    }

    return response[0];
  }

  // Your getOutletSalesReturnServiceByOutletId function remains unchanged

  async function getOutletSalesDetails({ logTrace }) {
    const knex = this;
    const query = knex('outlet_sales_master')
      .select('outlet_sales_master.*', 'outlets.*')
      .innerJoin('outlets', 'outlet_sales_master.outletid', '=', 'outlets.id')


    logQuery({
      logger: fastify.log,
      query,
      context: "Get sales details",
      logTrace
    });

    const response = await query;
    console.log(response, "response");

    // if (!response.length) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_FOUND,
    //     message: "DocNo not found",
    //     property: "",
    //     code: "NOT_FOUND"
    //   });
    // }
    return response;
  }

  async function getOutletSalesDocNo({ body, params, logTrace }) {
    const knex = this;
    // const query = knex('outlet_sales_master')
    //   .select('outlet_sales_master.*', 'outlets.*')
    //   .join('outlets', 'outlet_sales_master.outletid', 'outlets.id');
    const outletid = params.outletid


    const query = knex
      .select([
        `${OUTLETSALESMASTER.NAME}.*`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD1}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD2}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD3}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD4}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PINCODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PHONE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.MOBILE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.EMAIL}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.WEBSITE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.GSTIN}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FSSAI}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKACNO}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ACNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IFSCCODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BALANCE}`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.OUTLETTYPE} AS outlettype_name`,
        `${FRANCHISETYPE.NAME}.${FRANCHISETYPE.COLUMNS.FRANCHISETYPE} AS franchisetype_name`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} AS state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} AS city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} AS country_name`,
      ])
      .from(`${OUTLETSALESMASTER.NAME}`)
      .join(`${OUTLETS.NAME}`, `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`, `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`)
      .join(`${STATES.NAME}`, `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`, `${STATES.NAME}.${STATES.COLUMNS.ID}`)
      .join(`${CITIES.NAME}`, `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`, `${CITIES.NAME}.${CITIES.COLUMNS.ID}`)
      .join(`${COUNTRIES.NAME}`, `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`, `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`)
      .join(`${OUTLETTYPE.NAME}`, `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`, `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`)
      .join(`${FRANCHISETYPE.NAME}`, `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FRANCHISETYPE}`, `${FRANCHISETYPE.NAME}.${FRANCHISETYPE.COLUMNS.ID}`)
      .leftJoin(`${OUTLETSALESRETURNMASTER.NAME}`, `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`, `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.BILL_NO}`)
      .where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        outletid
      )
      .whereNot(function () {
        this.whereRaw(
          `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO} IN (SELECT ${OUTLETSALESRETURNMASTER.COLUMNS.BILL_NO} FROM ${OUTLETSALESRETURNMASTER.NAME})`
        );
      })
      .orderBy(`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.ID}`, 'DESC');


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Sales Details",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Sales Details Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getOutletSalesReturnGetallMaster({ body, params, logTrace }) {
    const knex = this;

    const docno = body.docno

    const query = knex
      .select([
        `${OUTLETSALESRETURNMASTER.NAME}.*`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DOCNO}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DOCDATE}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.OUTLETID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.PRODID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DIS_PER}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DIS_AMT}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.MRP}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.RATE}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.QTY}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.GST_PER}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.GST_AMT}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.CESS_PER}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.CESS_AMT}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.BARCODE}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.COMPANY_ID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.HEAD_ID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.TYPE_ID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.SUBCAT_ID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.CAT_ID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.IGST_PER}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.UOM_ID}`,
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
      .from(`${OUTLETSALESRETURNMASTER.NAME} as ${OUTLETSALESRETURNMASTER.NAME}`)
      .leftJoin(
        `${OUTLETSALESRETURNDETAILS.NAME} as ${OUTLETSALESRETURNDETAILS.NAME}`,
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.DOCNO}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DOCNO}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.OUTLETID}`,
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
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.DOCNO}`,
        docno
      );

    const response = await query;

    return response[0]

  }


  async function getOutletSalesReturnGetOneMaster({ body, params, logTrace }) {
    const knex = this;

    const { docno } = body; // Destructure for cleaner access to `docno`

    const validationQuery = knex(OUTLETSALESRETURNMASTER.NAME)
      .where(OUTLETSALESRETURNMASTER.COLUMNS.DOCNO, docno);

    // Log the query for debugging
    logQuery({
      logger: fastify.log,
      query: validationQuery, // Correct parameter name for better clarity
      context: "Validation query",
      logTrace
    });

    // Execute the query and retrieve the response
    const validationQueryResponse = await validationQuery;
    console.log(validationQueryResponse, "validation response")
    if (validationQueryResponse.length !== 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Sales return already processed!",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const query = knex
      .select([
        `${OUTLETSALESRETURNMASTER.NAME}.*`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DOCNO}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DOCDATE}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.OUTLETID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.PRODID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DIS_PER}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DIS_AMT}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.MRP}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.RATE}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.QTY}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.GST_PER}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.GST_AMT}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.CESS_PER}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.CESS_AMT}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.BARCODE}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.COMPANY_ID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.HEAD_ID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.TYPE_ID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.SUBCAT_ID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.CAT_ID}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.IGST_PER}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.UOM_ID}`,
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
      .from(`${OUTLETSALESRETURNMASTER.NAME} as ${OUTLETSALESRETURNMASTER.NAME}`)
      .leftJoin(
        `${OUTLETSALESRETURNDETAILS.NAME} as ${OUTLETSALESRETURNDETAILS.NAME}`,
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.DOCNO}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.DOCNO}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.OUTLETID}`,
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
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.DOCNO}`,
        docno
      )
      .andWhere(
        `${OUTLETSALESRETURNMASTER.NAME}.${OUTLETSALESRETURNMASTER.COLUMNS.IS_REFUND}`,
        false
      )
      .andWhere(
        `${OUTLETSALESRETURNDETAILS.NAME}.${OUTLETSALESRETURNDETAILS.COLUMNS.QTY}`, '>',
        0
      )

    const response = await query;

    if (response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Refund already processed!",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response

  }

  async function updateOsmBycashBill({ params, body, logTrace, userDetails }) {
    const knex = this;

    const docno = body.docno
    const is_refund = body.is_refund

    const byCashOrBillQuery = knex(OUTLETSALESRETURNMASTER.NAME)
      .where({
        [OUTLETSALESRETURNMASTER.COLUMNS.DOCNO]: docno,
      })
    const byCashOrBillResponse = await byCashOrBillQuery;

    if (byCashOrBillResponse.length > 0) {
      const byCashOrBill = await knex(OUTLETSALESRETURNMASTER.NAME)
        .where({
          [OUTLETSALESRETURNMASTER.COLUMNS.DOCNO]: docno,
        })
        .update({
          [OUTLETSALESRETURNMASTER.COLUMNS.IS_REFUND]: is_refund
        });
    }

    const response = await byCashOrBillResponse;

    if (response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Data Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return { success: true };


  }
  return {
    postOutletSalesReturnMaster,
    getOutletSalesReturnDocNo,
    getOutletSalesReturnByOutletId,
    getOutletSalesReturnByBillNo,
    getOutletSalesDetails,
    getOutletSalesDocNo,
    getOutletSalesReturnGetallMaster,
    getOutletSalesReturnGetOneMaster,
    updateOsmBycashBill

  };
}

module.exports = getOutletSalesReturnMasterRepo;
