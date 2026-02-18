const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLET_TO_OUTLET_TRANSFER_MASTER,
  OUTLET_TO_OUTLET_TRANSFER_DETAILS, BARCODE_LIST,
  OUTLET_PRODUCT_MAPPING } = require("../commons/constants")

const { SALESMASTER,
  SALESDETAILS } = require("../../../sales/commons")

const { OUTLETS, OUTLETTYPE } = require("../../../accounts/outlets/commons/constants");

function getOutletToOutletTransferMasterRepo(fastify) {

  async function postOutletToOutletTransferMaster({ params, body, logTrace, userDetails }) {
    const knex = this;

    const OutletToOutletTransferMaster_Data = {
      status: body.status,
      from_outlet_id: body.from_outlet_id,
      to_outlet_id: body.to_outlet_id,
      docdate: body.docdate,
      user_id: body.user_id,
      outletid: body.outletid,
      amount: body.amount,
      subtotal_amount: body.subtotal_amount,
      gst_per: body.gst_per,
      gst_amt: body.gst_amt,
      cess_per: body.cess_per,
      cess_amt: body.cess_amt,
      roff: body.roff,
      is_credit: body.is_credit,
      company_id: body.company_id
    }

    const OutletToOutletTransferMaster_Data_insert = await knex(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}`).returning("id").insert
      ({
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.DOCDATE]: OutletToOutletTransferMaster_Data.docdate,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.STATUS]: OutletToOutletTransferMaster_Data.status,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.FROM_OUTLET_ID]: OutletToOutletTransferMaster_Data.from_outlet_id,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.TO_OUTLET_ID]: OutletToOutletTransferMaster_Data.to_outlet_id,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.USER_ID]: OutletToOutletTransferMaster_Data.user_id,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.OUTLETID]: OutletToOutletTransferMaster_Data.outletid,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.AMOUNT]: OutletToOutletTransferMaster_Data.amount,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.SUBTOTAL_AMOUNT]: OutletToOutletTransferMaster_Data.subtotal_amount,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.GST_PER]: OutletToOutletTransferMaster_Data.gst_per,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.GST_AMT]: OutletToOutletTransferMaster_Data.gst_amt,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.CESS_PER]: OutletToOutletTransferMaster_Data.cess_per,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.CESS_AMT]: OutletToOutletTransferMaster_Data.cess_amt,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.ROFF]: OutletToOutletTransferMaster_Data.roff,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_CREDIT]: OutletToOutletTransferMaster_Data.is_credit,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.COMPANY_ID]: OutletToOutletTransferMaster_Data.company_id,

      });



    var OutletToOutletTransferMaster_id = OutletToOutletTransferMaster_Data_insert[0].id;


    var OutletToOutletTransferMaster_id_string = 'OTR' + OutletToOutletTransferMaster_Data_insert[0].id;

    const ot_ot_docno_Data_update = await knex(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}`)
      .where(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.ID}`, OutletToOutletTransferMaster_id)
      .update({
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.DOCNO]: OutletToOutletTransferMaster_id_string
      });



    if (Array.isArray(body.outlet_to_outlet_details)) {
      body.outlet_to_outlet_details.forEach(async outlet_to_outlet_details => {

        var outlet_to_outlet_details_data = {
          docdate: outlet_to_outlet_details.docdate,
          from_outlet_id: outlet_to_outlet_details.from_outlet_id,
          to_outlet_id: outlet_to_outlet_details.to_outlet_id,
          outletid: outlet_to_outlet_details.outletid,
          prodid: outlet_to_outlet_details.prodid,
          dis_per: outlet_to_outlet_details.dis_per,
          dis_amt: outlet_to_outlet_details.dis_amt,
          rate: outlet_to_outlet_details.rate,
          mrp: outlet_to_outlet_details.mrp,
          qty: outlet_to_outlet_details.qty,
          gst_per: outlet_to_outlet_details.gst_per,
          gst_amt: outlet_to_outlet_details.gst_amt,
          cess_per: outlet_to_outlet_details.cess_per,
          cess_amt: outlet_to_outlet_details.cess_amt,
          barcode: outlet_to_outlet_details.barcode,
          company_id: outlet_to_outlet_details.company_id,
          head_id: outlet_to_outlet_details.head_id,
          type_id: outlet_to_outlet_details.type_id,
          subcat_id: outlet_to_outlet_details.subcat_id,
          cat_id: outlet_to_outlet_details.cat_id,
          uom_id: outlet_to_outlet_details.uom_id,
          pro_code: outlet_to_outlet_details.pro_code,
          opng_stock: outlet_to_outlet_details.opng_stock,
          balnc_stock: outlet_to_outlet_details.balnc_stock
        }

        const query_insert2 = await knex(`${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}`).insert
          ({
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.DOCNO]: OutletToOutletTransferMaster_id_string,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.OUTLET_TO_OUTLET_TRANSFER_MASTER_ID]: OutletToOutletTransferMaster_id,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.FROM_OUTLET_ID]: outlet_to_outlet_details_data.from_outlet_id,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.TO_OUTLET_ID]: outlet_to_outlet_details_data.to_outlet_id,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.OUTLETID]: outlet_to_outlet_details_data.outletid,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.DOCDATE]: outlet_to_outlet_details_data.docdate,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.PRODID]: outlet_to_outlet_details_data.prodid,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.DIS_PER]: outlet_to_outlet_details_data.dis_per,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.DIS_AMT]: outlet_to_outlet_details_data.dis_amt,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.MRP]: outlet_to_outlet_details_data.mrp,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.RATE]: outlet_to_outlet_details_data.rate,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.QTY]: outlet_to_outlet_details_data.qty,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.GST_PER]: outlet_to_outlet_details_data.gst_per,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.GST_AMT]: outlet_to_outlet_details_data.gst_amt,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.CESS_PER]: outlet_to_outlet_details_data.cess_per,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.CESS_AMT]: outlet_to_outlet_details_data.cess_amt,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.BARCODE]: outlet_to_outlet_details_data.barcode,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.COMPANY_ID]: outlet_to_outlet_details_data.company_id,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.HEAD_ID]: outlet_to_outlet_details_data.head_id,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.TYPE_ID]: outlet_to_outlet_details_data.type_id,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.SUBCAT_ID]: outlet_to_outlet_details_data.subcat_id,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.CAT_ID]: outlet_to_outlet_details_data.cat_id,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.UOM_ID]: outlet_to_outlet_details_data.uom_id,
            [OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.CREATED_BY]: 2
          });


        const outletProductMappingGet = knex(OUTLET_PRODUCT_MAPPING.NAME)
          .where({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: outlet_to_outlet_details_data.prodid,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet_to_outlet_details_data.to_outlet_id,
          });


        const existsResponseOutletProductMapping = await outletProductMappingGet;


        if (existsResponseOutletProductMapping.length == 0) {

          const query_insert2 = await knex(`${OUTLET_PRODUCT_MAPPING.NAME}`).insert
            ({

              [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: outlet_to_outlet_details_data.pro_code,
              [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet_to_outlet_details_data.to_outlet_id,
              [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: outlet_to_outlet_details_data.prodid,
              [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: outlet_to_outlet_details_data.opng_stock,
              [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: outlet_to_outlet_details_data.balnc_stock,
              [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: outlet_to_outlet_details_data.company_id,
              [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: 2,
            })

        }

        const checkOutletOwnership = (outlet_id) =>
          knex(`${OUTLETTYPE.NAME}`)
            .select('*')
            .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
            .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, outlet_id)
            .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.GSTIN}`, '33ADTFS0509A1ZE')

        const [fromOutletOwned, toOutletOwned] = await Promise.all([
          checkOutletOwnership(outlet_to_outlet_details_data.from_outlet_id),
          checkOutletOwnership(outlet_to_outlet_details_data.to_outlet_id)
        ]);


        const barcode_update = await knex(`${BARCODE_LIST.NAME}`)
          .where(`${BARCODE_LIST.COLUMNS.OUTLET_ID}`, outlet_to_outlet_details_data.from_outlet_id)
          .where(`${BARCODE_LIST.COLUMNS.BARCODE}`, outlet_to_outlet_details_data.barcode)
          .where(`${BARCODE_LIST.COLUMNS.PROD_ID}`, outlet_to_outlet_details_data.prodid)
          .update({
            [BARCODE_LIST.COLUMNS.OUTLET_ID]: (fromOutletOwned.length !== 0 && toOutletOwned.length !== 0)
              ? outlet_to_outlet_details_data.to_outlet_id
              : null
          });

        if (fromOutletOwned.length !== 0 && toOutletOwned.length !== 0) {
          const ot_ot_isowwned_Data_update = await knex(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}`)
            .where(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.ID}`, OutletToOutletTransferMaster_id)
            .update({
              [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_OWNED]: true
            });
        }

      })

    }

    return { success: true }
  }

  async function postOutletToOutletTransferMasterIsOwned({ params, body, logTrace, userDetails }) {
    const knex = this;

    const id = userDetails.id

    const outletToOutletTransferMaster_Data = {
      docno: body.docno,
      outletid: body.outletid,
      is_approved: body.is_approved,
      is_approved_date: body.is_approved_date,
      is_approved_by: id
    }
    const ot_ot_is_owned_update = await knex(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}`)
      .where(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.DOCNO}`, outletToOutletTransferMaster_Data.docno)
      // .where(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.FROM_OUTLET_ID}`, outletToOutletTransferMaster_Data.outletid)
      .update({
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_APPROVED]: outletToOutletTransferMaster_Data.is_approved,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_APPROVED_DATE]: outletToOutletTransferMaster_Data.is_approved_date,
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.IS_APPROVED_BY]: outletToOutletTransferMaster_Data.is_approved_by
      });
    // console.log(ot_ot_is_owned_update, "ot_ot_is_owned_update");


    const ot_ot_barcode_get = await knex(`${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}`)
      .where(`${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.DOCNO}`, outletToOutletTransferMaster_Data.docno)
    // .where(`${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.OUTLETID}`, outletToOutletTransferMaster_Data.outletid)


    const barcodes = ot_ot_barcode_get.map(item => item.barcode);
    const to_outlet = ot_ot_barcode_get[0].to_outlet_id

    const update_barcode = await knex(`${BARCODE_LIST.NAME}`)
      .whereIn(`${BARCODE_LIST.COLUMNS.BARCODE}`, barcodes)
      .update({
        [BARCODE_LIST.COLUMNS.OUTLET_ID]: to_outlet
      })


    const ot_ot_master_get_query = await knex(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}`)
      .where(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.DOCNO}`, outletToOutletTransferMaster_Data.docno)

    const ot_ot_master_get_data = ot_ot_master_get_query[0]

    const salesMaster_Data = {
      docdate: ot_ot_master_get_data.is_approved_date,
      partycode: ot_ot_master_get_data.to_outlet_id,
      amount: ot_ot_master_get_data.amount,
      subtotal_amount: ot_ot_master_get_data.subtotal_amount,
      gst_per: ot_ot_master_get_data.gst_per,
      gst_amt: ot_ot_master_get_data.gst_amt,
      cess_per: ot_ot_master_get_data.cess_per,
      cess_amt: ot_ot_master_get_data.cess_amt,
      roff: ot_ot_master_get_data.roff,
      mode: ot_ot_master_get_data.mode || null,
      outstanding: ot_ot_master_get_data.outstanding || 0,
      company_id: ot_ot_master_get_data.company_id || 0
    }

    const salesMaster_Data_insert = await knex(`${SALESMASTER.NAME}`).returning("id").insert({
      [SALESMASTER.COLUMNS.DOCDATE]: salesMaster_Data.docdate,
      [SALESMASTER.COLUMNS.PARTYCODE]: salesMaster_Data.partycode,
      [SALESMASTER.COLUMNS.AMOUNT]: salesMaster_Data.amount,
      [SALESMASTER.COLUMNS.SUBTOTAL_AMOUNT]: salesMaster_Data.subtotal_amount,
      [SALESMASTER.COLUMNS.GST_PER]: salesMaster_Data.gst_per,
      [SALESMASTER.COLUMNS.GST_AMT]: salesMaster_Data.gst_amt,
      [SALESMASTER.COLUMNS.CESS_PER]: salesMaster_Data.cess_per,
      [SALESMASTER.COLUMNS.CESS_AMT]: salesMaster_Data.cess_amt,
      [SALESMASTER.COLUMNS.ROFF]: salesMaster_Data.roff,
      [SALESMASTER.COLUMNS.MODE]: salesMaster_Data.mode,
      [SALESMASTER.COLUMNS.OUTSTANDING]: salesMaster_Data.outstanding,
      [SALESMASTER.COLUMNS.COMPANY_ID]: salesMaster_Data.company_id
    });

    const salesMaster_id = salesMaster_Data_insert[0].id;

    // const docno_unique = await new Promise((resolve, reject) => {
    //   const outlet_id = salesMaster_Data.partycode;

    //   knex
    //     .select([`${OUTLETS.NAME}.${OUTLETS.COLUMNS.REF_DOC_NO}`])
    //     .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
    //     .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, outlet_id)
    //     .then((ref_doc_no_query) => {
    //       const ref_doc_no_res = ref_doc_no_query[0]?.ref_doc_no;
    //       if (!ref_doc_no_res) {
    //         return reject(
    //           CustomError.create({
    //             httpCode: StatusCodes.NOT_FOUND,
    //             message: "Outlet ref doc no is not found",
    //             property: "",
    //             code: "NOT_FOUND",
    //           })
    //         );
    //       }

    //       let docnoQuery, prefix = ref_doc_no_res;

    //       docnoQuery = knex(SALESMASTER.NAME)
    //         .select('id', 'docno')
    //         .where('docno', 'like', `${prefix}%`)
    //         .orderBy(SALESMASTER.COLUMNS.ID, 'desc')
    //         .limit(1);

    //       return docnoQuery.then((docno_res) => {
    //         if (docno_res.length === 0) {
    //           return knex(SALESMASTER.NAME)
    //             .select('id', 'docno')
    //             .where('docno', 'like', 'WS%')
    //             .orderBy(SALESMASTER.COLUMNS.ID, 'desc')
    //             .limit(1)
    //             .then((ws_res) => {
    //               const numericPart = parseInt(ws_res[0].docno.replace(/\D/g, ''), 10);
    //               resolve({ Docno: `${prefix}${numericPart + 1}` });
    //             });
    //         } else {

    //           const numericPart = parseInt(docno_res[0].docno.replace(/\D/g, ''), 10);
    //           resolve({ Docno: `${prefix}${numericPart + 1}` });
    //         }
    //       });
    //     })
    //     .catch((error) => {
    //       reject(
    //         CustomError.create({
    //           httpCode: StatusCodes.NOT_FOUND,
    //           message: "Outlet ref doc no is not found",
    //           property: "",
    //           code: "NOT_FOUND",
    //         })
    //       );
    //     });
    // });
    const docno_unique = await new Promise((resolve, reject) => {
      const outlet_id = salesMaster_Data.partycode;

      knex
        .select(`${OUTLETS.NAME}.*`)
        .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
        .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, outlet_id)
        .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.GSTIN}`, '33ADTFS0509A1ZE')
        .then((ref_doc_no_query) => {
          const prefix = ref_doc_no_query.length > 0 ? 'DC ' : 'SRE WS '


          return knex(SALESMASTER.NAME)
            .select('id', 'docno')
            .where('docno', 'like', `${prefix}%`)
            .orderBy(SALESMASTER.COLUMNS.ID, 'desc')
            .limit(1)
            .then((latestDocQuery) => {
              let Docno;

              if (latestDocQuery.length === 0) {
                // Docno = `${prefix}300`;
                prefix == 'DC ' ? Docno = `${prefix}300` : Docno = `${prefix}320`

              } else {
                const latestDocno = latestDocQuery[0].docno;
                const numericPart = parseInt(latestDocno.replace(/\D/g, ''), 10) || 0;
                Docno = `${prefix}${numericPart + 1}`;
              }

              resolve({ Docno });
            });
        })
        .catch((error) => {
          reject(
            CustomError.create({
              httpCode: StatusCodes.NOT_FOUND,
              message: "Data not found",
              property: "",
              code: "NOT_FOUND",
            })
          );
        });
    })
    const salesMaster_id_string = docno_unique.Docno;

    console.log(salesMaster_id_string, "salesMaster_id_string");


    await knex(`${SALESMASTER.NAME}`)
      .where(`${SALESMASTER.COLUMNS.ID}`, salesMaster_id)
      .update({
        [SALESMASTER.COLUMNS.DOCNO]: salesMaster_id_string
      });

    const ot_ot_details_get_query = await knex(`${OUTLET_TO_OUTLET_TRANSFER_DETAILS.NAME}`)
      .where(`${OUTLET_TO_OUTLET_TRANSFER_DETAILS.COLUMNS.DOCNO}`, outletToOutletTransferMaster_Data.docno)

    if (ot_ot_details_get_query.length > 0) {

      for (var i = 0; i < ot_ot_details_get_query.length; i++) {
        var salesDetail = ot_ot_details_get_query[i];

        var salesDetails_Data = {
          docdate: salesDetail.docdate,
          prodid: salesDetail.prodid,
          dis_per: salesDetail.dis_per,
          dis_amt: salesDetail.dis_amt,
          mrp: salesDetail.mrp,
          rate: salesDetail.rate,
          qty: salesDetail.qty,
          gst_per: salesDetail.gst_per,
          gst_amt: salesDetail.gst_amt,
          cess_per: salesDetail.cess_per,
          cess_amt: salesDetail.cess_amt,
          barcode: salesDetail.barcode,
          barcode_to: salesDetail.barcode,
          company_id: salesDetail.company_id,
          head_id: salesDetail.head_id,
          type_id: salesDetail.type_id,
          subcat_id: salesDetail.subcat_id,
          cat_id: salesDetail.cat_id,
          uom_id: salesDetail.uom_id,
          igst_per: salesDetail.igst_per || 0
        }
        const query_insert2 = await knex(`${SALESDETAILS.NAME}`).insert
          ({
            [SALESDETAILS.COLUMNS.DOCNO]: salesMaster_id_string,
            [SALESDETAILS.COLUMNS.SALES_MST_ID]: salesMaster_id,
            [SALESDETAILS.COLUMNS.DOCDATE]: salesDetails_Data.docdate,
            [SALESDETAILS.COLUMNS.PRODID]: salesDetails_Data.prodid,
            [SALESDETAILS.COLUMNS.DIS_PER]: salesDetails_Data.dis_per,
            [SALESDETAILS.COLUMNS.DIS_AMT]: salesDetails_Data.dis_amt,
            [SALESDETAILS.COLUMNS.MRP]: salesDetails_Data.mrp,
            [SALESDETAILS.COLUMNS.RATE]: salesDetails_Data.rate,
            [SALESDETAILS.COLUMNS.QTY]: salesDetails_Data.qty,
            [SALESDETAILS.COLUMNS.GST_PER]: salesDetails_Data.gst_per,
            [SALESDETAILS.COLUMNS.GST_AMT]: salesDetails_Data.gst_amt,
            [SALESDETAILS.COLUMNS.CESS_PER]: salesDetails_Data.cess_per,
            [SALESDETAILS.COLUMNS.CESS_AMT]: salesDetails_Data.cess_amt,
            [SALESDETAILS.COLUMNS.BARCODE]: salesDetails_Data.barcode,
            [SALESDETAILS.COLUMNS.BARCODE_TO]: salesDetails_Data.barcode_to,
            [SALESDETAILS.COLUMNS.COMPANY_ID]: salesDetails_Data.company_id,
            [SALESDETAILS.COLUMNS.HEAD_ID]: salesDetails_Data.head_id,
            [SALESDETAILS.COLUMNS.TYPE_ID]: salesDetails_Data.type_id,
            [SALESDETAILS.COLUMNS.SUBCAT_ID]: salesDetails_Data.subcat_id,
            [SALESDETAILS.COLUMNS.CAT_ID]: salesDetails_Data.cat_id,
            [SALESDETAILS.COLUMNS.UOM_ID]: salesDetails_Data.uom_id,
            [SALESDETAILS.COLUMNS.IGST_PER]: salesDetails_Data.igst_per ? salesDetails_Data.igst_per : 0,
            [SALESDETAILS.COLUMNS.CREATED_BY]: 2
          });

      }
    }

    const ot_ot_is_trans_doc_update = await knex(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.NAME}`)
      .where(`${OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.DOCNO}`, outletToOutletTransferMaster_Data.docno)
      .update({
        [OUTLET_TO_OUTLET_TRANSFER_MASTER.COLUMNS.ISSUE_TRANS_DOC_NO]: salesMaster_id_string,
      });
    return { success: true }
  }
  return {
    postOutletToOutletTransferMaster,
    postOutletToOutletTransferMasterIsOwned
  };
}

module.exports = getOutletToOutletTransferMasterRepo;
