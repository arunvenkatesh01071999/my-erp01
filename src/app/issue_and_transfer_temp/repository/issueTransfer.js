const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { ISSUE_TRANSFER_TEMP } = require("../commons")
const { ITEM } = require("../../catalog/commons")
const { OUTLETS } = require("../../accounts/outlets/commons/constants");
const { SALESDETAILS } = require("../../sales/commons");


function issueTransferRepo(fastify) {


  async function getIssueTransferTempDetails({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { docno, outlet_id } = body;

    const query = knex
      .distinct([
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.ID}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.ADDRESS}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.AMOUNT}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.BARCODE_FROM}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.DOCDATE}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.BARCODE_TO}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.DIS_PER}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.DOCNO}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.GST_AMT}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.GST_IN}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.GST_PER}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.MODE}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.MRP}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.PROD_ID}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.QTY}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.SALE_RATE}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.UPDATED_AT}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE} as outlet_code`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_shortname`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_fullname`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEADID} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.CESS} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.HSN} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.GST} `


      ])
      .from(`${ISSUE_TRANSFER_TEMP.NAME} as ${ISSUE_TRANSFER_TEMP.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.PROD_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .where(
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.DOCNO}`,
        docno
      )
      .where(
        `${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID}`,
        outlet_id
      )
      .orderBy(`${ISSUE_TRANSFER_TEMP.NAME}.${ISSUE_TRANSFER_TEMP.COLUMNS.UPDATED_AT}`, 'ASC')

    const response = await query

    if (response.length == 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Date Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const totalQty = response.reduce((total, item) => total + parseInt(item.qty, 10), 0);

    return {
      data: response,
      totalQty: totalQty
    }


  }

  async function postIssueTransferTemp({ params, body, logTrace, userDetails }) {
    const knex = this;

    var outlet_id = body.outlet_id
    var docno = body.docno
    var docdate = body.docdate
    var mode = body.mode
    var address = body.address
    var gst_in = body.gst_in
    var barcode_from = body.barcode_from
    var barcode_to = body.barcode_to
    var prod_id = body.prod_id
    var mrp = body.mrp
    var dis_per = body.dis_per
    var gst_per = body.gst_per
    var gst_amt = body.gst_amt
    var qty = body.qty
    var amount = body.amount
    var sale_rate = body.sale_rate


    var issue_transfer_temp_data = {
      outlet_id: outlet_id,
      docno: docno,
      docdate: docdate,
      mode: mode,
      address: address,
      gst_in: gst_in,
      barcode_from: barcode_from,
      barcode_to: barcode_to,
      prod_id: prod_id,
      mrp: mrp,
      dis_per: dis_per,
      gst_per: gst_per,
      gst_amt: gst_amt,
      qty: qty,
      amount: amount,
      sale_rate: sale_rate
    }

    // console.log(issue_transfer_temp_data, "issue_transfer_temp_data");

    const issueTransferTempQuery = knex(ISSUE_TRANSFER_TEMP.NAME)
      .where({
        [ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID]: issue_transfer_temp_data.outlet_id,
        [ISSUE_TRANSFER_TEMP.COLUMNS.DOCNO]: issue_transfer_temp_data.docno,
        // [ISSUE_TRANSFER_TEMP.COLUMNS.DOCDATE]: issue_transfer_temp_data.docdate,
        [ISSUE_TRANSFER_TEMP.COLUMNS.BARCODE_FROM]: issue_transfer_temp_data.barcode_from

      })

    const existsResponseIssueTransferTemp = await issueTransferTempQuery;

    if (existsResponseIssueTransferTemp.length === 0) {

      var issue_transfer_insert_new = await knex(`${ISSUE_TRANSFER_TEMP.NAME}`).insert({
        [ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID]: issue_transfer_temp_data.outlet_id,
        [ISSUE_TRANSFER_TEMP.COLUMNS.DOCNO]: issue_transfer_temp_data.docno,
        [ISSUE_TRANSFER_TEMP.COLUMNS.DOCDATE]: issue_transfer_temp_data.docdate,
        [ISSUE_TRANSFER_TEMP.COLUMNS.MODE]: issue_transfer_temp_data.mode,
        [ISSUE_TRANSFER_TEMP.COLUMNS.ADDRESS]: issue_transfer_temp_data.address,
        [ISSUE_TRANSFER_TEMP.COLUMNS.GST_IN]: issue_transfer_temp_data.gst_in,
        [ISSUE_TRANSFER_TEMP.COLUMNS.BARCODE_FROM]: issue_transfer_temp_data.barcode_from,
        [ISSUE_TRANSFER_TEMP.COLUMNS.BARCODE_TO]: issue_transfer_temp_data.barcode_to,
        [ISSUE_TRANSFER_TEMP.COLUMNS.PROD_ID]: issue_transfer_temp_data.prod_id,
        [ISSUE_TRANSFER_TEMP.COLUMNS.MRP]: issue_transfer_temp_data.mrp,
        [ISSUE_TRANSFER_TEMP.COLUMNS.DIS_PER]: issue_transfer_temp_data.dis_per,
        [ISSUE_TRANSFER_TEMP.COLUMNS.GST_PER]: issue_transfer_temp_data.gst_per,
        [ISSUE_TRANSFER_TEMP.COLUMNS.GST_AMT]: issue_transfer_temp_data.gst_amt,
        [ISSUE_TRANSFER_TEMP.COLUMNS.QTY]: issue_transfer_temp_data.qty,
        [ISSUE_TRANSFER_TEMP.COLUMNS.AMOUNT]: issue_transfer_temp_data.amount,
        [ISSUE_TRANSFER_TEMP.COLUMNS.SALE_RATE]: issue_transfer_temp_data.sale_rate

      });
    }
    else {

      var issue_transfer_update = await knex(`${ISSUE_TRANSFER_TEMP.NAME}`)
        .update({
          [ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID]: issue_transfer_temp_data.outlet_id,
          [ISSUE_TRANSFER_TEMP.COLUMNS.DOCNO]: issue_transfer_temp_data.docno,
          [ISSUE_TRANSFER_TEMP.COLUMNS.DOCDATE]: issue_transfer_temp_data.docdate,
          [ISSUE_TRANSFER_TEMP.COLUMNS.MODE]: issue_transfer_temp_data.mode,
          [ISSUE_TRANSFER_TEMP.COLUMNS.ADDRESS]: issue_transfer_temp_data.address,
          [ISSUE_TRANSFER_TEMP.COLUMNS.GST_IN]: issue_transfer_temp_data.gst_in,
          [ISSUE_TRANSFER_TEMP.COLUMNS.BARCODE_FROM]: issue_transfer_temp_data.barcode_from,
          [ISSUE_TRANSFER_TEMP.COLUMNS.BARCODE_TO]: issue_transfer_temp_data.barcode_to,
          [ISSUE_TRANSFER_TEMP.COLUMNS.PROD_ID]: issue_transfer_temp_data.prod_id,
          [ISSUE_TRANSFER_TEMP.COLUMNS.MRP]: issue_transfer_temp_data.mrp,
          [ISSUE_TRANSFER_TEMP.COLUMNS.DIS_PER]: issue_transfer_temp_data.dis_per,
          [ISSUE_TRANSFER_TEMP.COLUMNS.GST_PER]: issue_transfer_temp_data.gst_per,
          [ISSUE_TRANSFER_TEMP.COLUMNS.GST_AMT]: issue_transfer_temp_data.gst_amt,
          [ISSUE_TRANSFER_TEMP.COLUMNS.QTY]: issue_transfer_temp_data.qty,
          [ISSUE_TRANSFER_TEMP.COLUMNS.AMOUNT]: issue_transfer_temp_data.amount,
          // [ISSUE_TRANSFER_TEMP.COLUMNS.RATE]: issue_transfer_temp_data.rate
          [ISSUE_TRANSFER_TEMP.COLUMNS.SALE_RATE]: issue_transfer_temp_data.sale_rate


        })
        .where({
          [ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID]: issue_transfer_temp_data.outlet_id,
          [ISSUE_TRANSFER_TEMP.COLUMNS.DOCNO]: issue_transfer_temp_data.docno,
          // [ISSUE_TRANSFER_TEMP.COLUMNS.DOCDATE]: issue_transfer_temp_data.docdate,
          [ISSUE_TRANSFER_TEMP.COLUMNS.BARCODE_FROM]: issue_transfer_temp_data.barcode_from
        })




    }


    return { success: true };
  }

  async function deleteIssueTransferTemp({ params, body, logTrace, userDetails }) {
    const knex = this;


    var outlet_id = body.outlet_id
    var docno = body.docno
    var id = body.id


    const issueTransferTempQuery = knex(ISSUE_TRANSFER_TEMP.NAME)
      .where({
        [ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
        [ISSUE_TRANSFER_TEMP.COLUMNS.DOCNO]: docno,
        [ISSUE_TRANSFER_TEMP.COLUMNS.ID]: id


      })

    const existsResponseIssueTransferTemp = await issueTransferTempQuery;


    if (existsResponseIssueTransferTemp.length != 0) {

      var issue_transfer_temp_delete = await knex(`${ISSUE_TRANSFER_TEMP.NAME}`)
        .where({
          [ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
          [ISSUE_TRANSFER_TEMP.COLUMNS.DOCNO]: docno,
          [ISSUE_TRANSFER_TEMP.COLUMNS.ID]: id


        })
        .del();

    } else {

      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Data Not Found",
        property: "",
        code: "NOT_FOUND"
      });

    }


    return { success: true };
  }

  async function deleteAllIssueTransferTemp({ params, body, logTrace, userDetails }) {
    const knex = this;


    var outlet_id = body.outlet_id
    var docno = body.docno


    const issueTransferTempQuery = knex(ISSUE_TRANSFER_TEMP.NAME)
      .where({
        [ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
        [ISSUE_TRANSFER_TEMP.COLUMNS.DOCNO]: docno

      })

    const existsResponseIssueTransferTemp = await issueTransferTempQuery;


    if (existsResponseIssueTransferTemp.length != 0) {

      var issue_transfer_temp_delete = await knex(`${ISSUE_TRANSFER_TEMP.NAME}`)
        .where({
          [ISSUE_TRANSFER_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
          [ISSUE_TRANSFER_TEMP.COLUMNS.DOCNO]: docno

        })
        .del();

    } else {

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
    postIssueTransferTemp,
    getIssueTransferTempDetails,
    deleteIssueTransferTemp,
    deleteAllIssueTransferTemp
  };
}


module.exports = issueTransferRepo;
