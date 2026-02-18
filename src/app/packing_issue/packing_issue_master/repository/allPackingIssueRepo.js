const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { PACKING_ISSUE_MASTER, PACKING_ISSUE_DETAILS, STOCKLEDGER, WAREHOUSE_STOCKS } = require("../../commons");
const { PACKING_INWARD_MASTER, PACKING_INWARD_DETAILS, ISSUE_BASED_SETTING } = require("../../commons");
const { ITEM, WAREHOUSE } = require("../../../catalog/commons");
const { STATES, COUNTRIES, CITIES } = require("../../../masterData/commons/constants");



function allPackingIssueRepo(fastify) {

  async function postPackingIssue({ params, body, logTrace, userDetails }) {
    const knex = this;

    const packingIssueData = {
      docno: body.docno,
      docdate: body.docdate,
      wh_id: body.wh_id,
      total_items: body.total_items,
      total_qty: body.total_qty,
      amount: body.amount

    };


    // packing master create 
    const packingIssueDataQuery = await knex(`${PACKING_ISSUE_MASTER.NAME}`).returning("id").insert({
      [PACKING_ISSUE_MASTER.COLUMNS.DOCNO]: packingIssueData.docno,
      [PACKING_ISSUE_MASTER.COLUMNS.DOCDATE]: packingIssueData.docdate,
      [PACKING_ISSUE_MASTER.COLUMNS.WH_ID]: packingIssueData.wh_id,
      [PACKING_ISSUE_MASTER.COLUMNS.TOTAL_ITEMS]: packingIssueData.total_items,
      [PACKING_ISSUE_MASTER.COLUMNS.TOTAL_QTY]: packingIssueData.total_qty,
      [PACKING_ISSUE_MASTER.COLUMNS.AMOUNT]: packingIssueData.amount,
      [PACKING_ISSUE_MASTER.COLUMNS.CREATED_BY]: userDetails.id
    });

    const packingIssueId = packingIssueDataQuery[0].id;

    let docno = `WS_ISSUE${packingIssueId}`;

    const updatePackingIssueDocnoQuery = await knex(`${PACKING_ISSUE_MASTER.NAME}`)
      .where(`${PACKING_ISSUE_MASTER.COLUMNS.ID}`, packingIssueId)
      .update({
        [PACKING_ISSUE_MASTER.COLUMNS.DOCNO]: docno
      });

    // packing detaile create 
    if (body.packing_details.length > 0) {

      for (var i = 0; i < body.packing_details.length; i++) {
        var packing_detail = body.packing_details[i];

        var packingDetailsData = {
          docdate: packing_detail.docdate,
          wh_id: body.wh_id,
          prod_id: packing_detail.prod_id,
          total_qty: packing_detail.total_qty,
          cat_id: packing_detail.cat_id,
          sub_cat_id: packing_detail.sub_cat_id,
          head_id: packing_detail.head_id,
          type_design_id: packing_detail.type_design_id,
          uom_id: packing_detail.uom_id,
          barcode: packing_detail.barcode,
          pur_rate: packing_detail.pur_rate,
          sale_rate: packing_detail.sale_rate,
          wholesale_rate: packing_detail.wholesale_rate,
          mrp: packing_detail.mrp,
          gst: packing_detail.gst,

        }

        const packing_issue_insert = await knex(`${PACKING_ISSUE_DETAILS.NAME}`).insert
          ({
            [PACKING_ISSUE_DETAILS.COLUMNS.DOCNO]: docno,
            [PACKING_ISSUE_DETAILS.COLUMNS.PACKING_ISSUE_MST_ID]: packingIssueId,
            [PACKING_ISSUE_DETAILS.COLUMNS.DOCDATE]: packingDetailsData.docdate,
            [PACKING_ISSUE_DETAILS.COLUMNS.WH_ID]: packingDetailsData.wh_id,
            [PACKING_ISSUE_DETAILS.COLUMNS.PROD_ID]: packingDetailsData.prod_id,
            [PACKING_ISSUE_DETAILS.COLUMNS.TOTAL_QTY]: packingDetailsData.total_qty,
            [PACKING_ISSUE_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
            [PACKING_ISSUE_DETAILS.COLUMNS.CAT_ID]: packingDetailsData.cat_id,
            [PACKING_ISSUE_DETAILS.COLUMNS.SUB_CAT_ID]: packingDetailsData.sub_cat_id,
            [PACKING_ISSUE_DETAILS.COLUMNS.HEAD_ID]: packingDetailsData.head_id,
            [PACKING_ISSUE_DETAILS.COLUMNS.TYPE_DESIGN_ID]: packingDetailsData.type_design_id,
            [PACKING_ISSUE_DETAILS.COLUMNS.UOM_ID]: packingDetailsData.uom_id,
            [PACKING_ISSUE_DETAILS.COLUMNS.BARCODE]: packingDetailsData.barcode,
            [PACKING_ISSUE_DETAILS.COLUMNS.PUR_RATE]: packingDetailsData.pur_rate,
            [PACKING_ISSUE_DETAILS.COLUMNS.SALE_RATE]: packingDetailsData.sale_rate,
            [PACKING_ISSUE_DETAILS.COLUMNS.WHOLESALE_RATE]: packingDetailsData.wholesale_rate,
            [PACKING_ISSUE_DETAILS.COLUMNS.MRP]: packingDetailsData.mrp,
            [PACKING_ISSUE_DETAILS.COLUMNS.GST]: packingDetailsData.gst
          });

      }
    }

    const issueBasedSettingQuery = knex(ISSUE_BASED_SETTING.NAME)


    const issueBasedSettingResponse = await issueBasedSettingQuery;

    const issue_based = issueBasedSettingResponse[0].issue_based

    // inwared create   

    if (issue_based == false) {

      const packingInwardDataQuery = await knex(`${PACKING_INWARD_MASTER.NAME}`).returning("id").insert({
        [PACKING_INWARD_MASTER.COLUMNS.DOCNO]: docno,
        [PACKING_INWARD_MASTER.COLUMNS.DOCDATE]: packingIssueData.docdate,
        [PACKING_INWARD_MASTER.COLUMNS.PACK_ISSUE_ID]: packingIssueId,
        [PACKING_INWARD_MASTER.COLUMNS.WH_ID]: packingIssueData.wh_id,
        [PACKING_INWARD_MASTER.COLUMNS.TOTAL_ITEMS]: packingIssueData.total_items,
        [PACKING_INWARD_MASTER.COLUMNS.TOTAL_QTY]: packingIssueData.total_qty,
        [PACKING_INWARD_MASTER.COLUMNS.CREATED_BY]: userDetails.id
      });

      const packingInwardId = packingInwardDataQuery[0].id

      // packing issue update is_inwared

      const updatePackingIssueIsInwaredQuery = await knex(`${PACKING_ISSUE_MASTER.NAME}`)
        .where(`${PACKING_ISSUE_MASTER.COLUMNS.ID}`, packingIssueId)
        .update({
          [PACKING_ISSUE_MASTER.COLUMNS.IS_INWARD]: true
        });

      if (body.packing_details.length > 0) {

        for (var i = 0; i < body.packing_details.length; i++) {
          var packing_detail = body.packing_details[i];

          var packingDetailsData = {
            docdate: packing_detail.docdate,
            wh_id: body.wh_id,
            prod_id: packing_detail.prod_id,
            total_qty: packing_detail.total_qty,
            cat_id: packing_detail.cat_id,
            sub_cat_id: packing_detail.sub_cat_id,
            head_id: packing_detail.head_id,
            type_design_id: packing_detail.type_design_id,
            uom_id: packing_detail.uom_id,
            pur_rate: packing_detail.pur_rate,
            sale_rate: packing_detail.sale_rate,
            wholesale_rate: packing_detail.wholesale_rate,
            mrp: packing_detail.mrp,
            gst: packing_detail.gst
          }

          const query_insert2 = await knex(`${PACKING_INWARD_DETAILS.NAME}`).insert
            ({
              [PACKING_INWARD_DETAILS.COLUMNS.DOCNO]: docno,
              [PACKING_INWARD_DETAILS.COLUMNS.PACKING_INWARD_MST_ID]: packingInwardId,
              [PACKING_INWARD_DETAILS.COLUMNS.PACK_ISSUE_ID]: packingIssueId,
              [PACKING_INWARD_DETAILS.COLUMNS.DOCDATE]: packingDetailsData.docdate,
              [PACKING_INWARD_DETAILS.COLUMNS.WH_ID]: packingDetailsData.wh_id,
              [PACKING_INWARD_DETAILS.COLUMNS.PROD_ID]: packingDetailsData.prod_id,
              [PACKING_INWARD_DETAILS.COLUMNS.TOTAL_QTY]: packingDetailsData.total_qty,
              [PACKING_INWARD_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
              [PACKING_INWARD_DETAILS.COLUMNS.CAT_ID]: packingDetailsData.cat_id,
              [PACKING_INWARD_DETAILS.COLUMNS.SUB_CAT_ID]: packingDetailsData.sub_cat_id,
              [PACKING_INWARD_DETAILS.COLUMNS.HEAD_ID]: packingDetailsData.head_id,
              [PACKING_INWARD_DETAILS.COLUMNS.TYPE_DESIGN_ID]: packingDetailsData.type_design_id,
              [PACKING_INWARD_DETAILS.COLUMNS.UOM_ID]: packingDetailsData.uom_id,
              [PACKING_INWARD_DETAILS.COLUMNS.BARCODE]: packingDetailsData.barcode,
              [PACKING_INWARD_DETAILS.COLUMNS.PUR_RATE]: packingDetailsData.pur_rate,
              [PACKING_INWARD_DETAILS.COLUMNS.SALE_RATE]: packingDetailsData.sale_rate,
              [PACKING_INWARD_DETAILS.COLUMNS.WHOLESALE_RATE]: packingDetailsData.wholesale_rate,
              [PACKING_INWARD_DETAILS.COLUMNS.MRP]: packingDetailsData.mrp,
              [PACKING_INWARD_DETAILS.COLUMNS.GST]: packingDetailsData.gst
            });

        }
      }

      // item subract

      if (Array.isArray(body.packing_details)) {
        for (const element of body.packing_details) {

          if (Array.isArray(element.prod_id)) {
            for (const proid of element.prod_id) {
              const qty = element.total_qty;
              // const mrp = element.mrp;
              // const rate = element.rate;
              // const gst = element.gst_per;

              await knex(`${ITEM.NAME}`)
                .where(`${ITEM.COLUMNS.ID}`, proid)
                .update({
                  [ITEM.COLUMNS.BALANCE]: knex.raw(`${ITEM.COLUMNS.BALANCE} - ${qty}`),
                  // [ITEM.COLUMNS.MRP]: mrp,
                  // [ITEM.COLUMNS.PARCHASE_RATE]: rate,
                  // [ITEM.COLUMNS.GST]: gst
                });
            }
          } else {
            const qty = element.total_qty;
            // const mrp = element.mrp;
            // const rate = element.rate;
            // const gst = element.gst_per;

            await knex(`${ITEM.NAME}`)
              .where(`${ITEM.COLUMNS.ID}`, element.prod_id)
              .update({
                [ITEM.COLUMNS.BALANCE]: knex.raw(`${ITEM.COLUMNS.BALANCE} - ${qty}`),
                // [ITEM.COLUMNS.MRP]: mrp,
                // [ITEM.COLUMNS.PARCHASE_RATE]: rate,
                // [ITEM.COLUMNS.GST]: gst
              });
          }
        }
      } else {
        console.error("purchase_details is not an array");
      }

      // stock ledger

      const getMainWarehouseGstQuery = await knex(`${WAREHOUSE.NAME}`)
        .where(`${WAREHOUSE.COLUMNS.MAIN_WAREHOUSE}`, true)

      const warehouseGst = getMainWarehouseGstQuery[0].gstin
      if (warehouseGst) {
        const getSubWarehouseGstQuery = await knex(`${WAREHOUSE.NAME}`)
          .where(`${WAREHOUSE.COLUMNS.MAIN_WAREHOUSE}`, false)
          .andWhere(`${WAREHOUSE.COLUMNS.ID}`, packingIssueData.wh_id)

        const subWarehouseGst = getSubWarehouseGstQuery[0].gstin

        if (warehouseGst == subWarehouseGst) {

          if (Array.isArray(body.packing_details)) {
            for (const element of body.packing_details) {
              if (!Array.isArray(element.prod_id) && !Array.isArray(element.docdate)) {
                const stockLedgerQuery = knex(STOCKLEDGER.NAME)
                  .where({
                    [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                  })
                  .andWhere(STOCKLEDGER.COLUMNS.DATE, element.docdate)
                  .andWhere(STOCKLEDGER.COLUMNS.WH_ID, packingIssueData.wh_id);


                const existsResponse = await stockLedgerQuery;

                if (existsResponse.length == 0) {
                  const queryInsert = await knex(STOCKLEDGER.NAME).insert({
                    [STOCKLEDGER.COLUMNS.DATE]: element.docdate,
                    [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                    [STOCKLEDGER.COLUMNS.PARCHASE_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.SALE_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.PURCHASE_RETURN_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.WASTAGE_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.ADJUST_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.FREE_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.SALES_IN_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.TR_IN_QTY]: element.total_qty,
                    [STOCKLEDGER.COLUMNS.TR_OUT_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.COMPANY_ID]: 1,
                    [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                    [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id

                  });
                }

              }

            }
          }

        }
        else {
          if (Array.isArray(body.packing_details)) {
            for (const element of body.packing_details) {
              if (!Array.isArray(element.prod_id) && !Array.isArray(element.docdate)) {
                const stockLedgerQuery = knex(STOCKLEDGER.NAME)
                  .where({
                    [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                  })
                  .andWhere(STOCKLEDGER.COLUMNS.DATE, element.docdate)
                  .andWhere(STOCKLEDGER.COLUMNS.WH_ID, body.wh_id);


                const existsResponse = await stockLedgerQuery;

                if (existsResponse.length == 0) {
                  const queryInsert = await knex(STOCKLEDGER.NAME).insert({
                    [STOCKLEDGER.COLUMNS.DATE]: element.docdate,
                    [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                    [STOCKLEDGER.COLUMNS.PARCHASE_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.SALE_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.PURCHASE_RETURN_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.WASTAGE_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.ADJUST_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.FREE_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.SALES_IN_QTY]: element.total_qty,
                    [STOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.TR_IN_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.TR_OUT_QTY]: 0,
                    [STOCKLEDGER.COLUMNS.COMPANY_ID]: 1,
                    [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                    [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id

                  });
                }

              }
            }
          }
        }

      }


      // warehouse stock create

      if (Array.isArray(body.packing_details)) {
        for (const element of body.packing_details) {

          const warehouseStockEntry = await knex(`${WAREHOUSE_STOCKS.NAME}`)
            .where(`${WAREHOUSE_STOCKS.COLUMNS.PROD_ID}`, element.prod_id)
            .where(`${WAREHOUSE_STOCKS.COLUMNS.WH_ID}`, body.wh_id)
            .first()


          if (warehouseStockEntry) {
            // Update existing stock
            const warehouseStockUpdate = await knex(`${WAREHOUSE_STOCKS.NAME}`)
              .where(`${WAREHOUSE_STOCKS.COLUMNS.ID}`, warehouseStockEntry.id)
              .update({
                [WAREHOUSE_STOCKS.COLUMNS.STOCK]: warehouseStockEntry.stock + element.total_qty,
                [WAREHOUSE_STOCKS.COLUMNS.UPDATED_BY]: userDetails.id
                // [WAREHOUSE_STOCKS.COLUMNS.UPDATED_AT]: new Date(),
              });
          }
          else {
            const warehouseStockCreate = await knex(`${WAREHOUSE_STOCKS.NAME}`).insert({
              [WAREHOUSE_STOCKS.COLUMNS.PROD_ID]: element.prod_id,
              [WAREHOUSE_STOCKS.COLUMNS.WH_ID]: body.wh_id,
              [WAREHOUSE_STOCKS.COLUMNS.STOCK]: element.total_qty,
              [WAREHOUSE_STOCKS.COLUMNS.CREATED_BY]: userDetails.id
              // [WAREHOUSE_STOCKS.COLUMNS.CREATED_AT]: new Date(),
            })
          }
        }
      }

    }

    if (issue_based == true) {

      // stock ledger

      const getMainWarehouseGstQuery = await knex(`${WAREHOUSE.NAME}`)
        .where(`${WAREHOUSE.COLUMNS.MAIN_WAREHOUSE}`, true)

      const warehouseGst = getMainWarehouseGstQuery[0].gstin
      if (warehouseGst) {
        const getSubWarehouseGstQuery = await knex(`${WAREHOUSE.NAME}`)
          .where(`${WAREHOUSE.COLUMNS.MAIN_WAREHOUSE}`, false)
          .andWhere(`${WAREHOUSE.COLUMNS.ID}`, body.wh_id)

        const subWarehouseGst = getSubWarehouseGstQuery[0].gstin

        if (warehouseGst == subWarehouseGst) {

          if (Array.isArray(body.packing_details)) {
            for (const element of body.packing_details) {
              if (!Array.isArray(element.prod_id) && !Array.isArray(element.docdate)) {
                const stockLedgerQuery = knex(STOCKLEDGER.NAME)
                  .where({
                    [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                  })
                  .andWhere(STOCKLEDGER.COLUMNS.DATE, element.docdate);

                const existsResponse = await stockLedgerQuery;

                if (existsResponse.length > 0) {
                  const queryUpdate = await knex(STOCKLEDGER.NAME)
                    .where({
                      [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                    })
                    .andWhere(STOCKLEDGER.COLUMNS.DATE, element.docdate)
                    .update({
                      [STOCKLEDGER.COLUMNS.TR_OUT_QTY]: element.total_qty
                      // [STOCKLEDGER.COLUMNS.TR_OUT_QTY]: knex.raw(`${STOCKLEDGER.COLUMNS.PARCHASE_QTY} + ${element.total_qty}`)
                    });
                }

              }
            }

          }
        }
        else {
          if (Array.isArray(body.packing_details)) {
            for (const element of body.packing_details) {
              if (!Array.isArray(element.prod_id) && !Array.isArray(element.docdate)) {
                const stockLedgerQuery = knex(STOCKLEDGER.NAME)
                  .where({
                    [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                  })
                  .andWhere(STOCKLEDGER.COLUMNS.DATE, element.docdate);

                const existsResponse = await stockLedgerQuery;

                if (existsResponse.length > 0) {
                  const queryUpdate = await knex(STOCKLEDGER.NAME)
                    .where({
                      [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                    })
                    .andWhere(STOCKLEDGER.COLUMNS.DATE, element.docdate)
                    .update({
                      [STOCKLEDGER.COLUMNS.SALES_IN_QTY]: element.total_qty
                      // [STOCKLEDGER.COLUMNS.TR_OUT_QTY]: knex.raw(`${STOCKLEDGER.COLUMNS.PARCHASE_QTY} + ${element.total_qty}`)
                    });
                }

              }

            }

          }
        }

      }

    }




    return { success: true, docno: docno }
  }

  async function postPackingInward({ params, body, logTrace, userDetails }) {
    const knex = this;

    const packingInwardData = {
      packing_issue_docno: body.packing_issue_docno,
      pack_issue_id: body.pack_issue_id,
      docdate: body.docdate,
      wh_id: body.wh_id,
      total_items: body.total_items,
      total_qty: body.total_qty
    };
    // inward create
    const packingIssueDataQuery = await knex(`${PACKING_INWARD_MASTER.NAME}`).returning("id").insert({
      [PACKING_INWARD_MASTER.COLUMNS.PACKING_ISSUE_DOCNO]: packingInwardData.packing_issue_docno,
      [PACKING_INWARD_MASTER.COLUMNS.DOCDATE]: packingInwardData.docdate,
      [PACKING_INWARD_MASTER.COLUMNS.PACK_ISSUE_ID]: packingInwardData.pack_issue_id,
      [PACKING_INWARD_MASTER.COLUMNS.WH_ID]: packingInwardData.wh_id,
      [PACKING_INWARD_MASTER.COLUMNS.TOTAL_ITEMS]: packingInwardData.total_items,
      [PACKING_INWARD_MASTER.COLUMNS.TOTAL_QTY]: packingInwardData.total_qty,
      [PACKING_INWARD_MASTER.COLUMNS.CREATED_BY]: userDetails.id
    });

    const packingInwardId = packingIssueDataQuery[0].id;

    let docno = `WS_INW${packingInwardId}`;

    const updatePackingIssueDocnoQuery = await knex(`${PACKING_INWARD_MASTER.NAME}`)
      .where(`${PACKING_INWARD_MASTER.COLUMNS.ID}`, packingInwardId)
      .update({
        [PACKING_INWARD_MASTER.COLUMNS.DOCNO]: docno
      });
    // inward detaile create 
    if (body.packing_inward_details.length > 0) {

      for (var i = 0; i < body.packing_inward_details.length; i++) {
        var packing_inward_details = body.packing_inward_details[i];

        var packingInwardDetailsData = {
          docdate: packing_inward_details.docdate,
          pack_issue_id: packingInwardData.pack_issue_id,
          wh_id: packingInwardData.wh_id,
          prod_id: packing_inward_details.prod_id,
          total_qty: packing_inward_details.total_qty,
          cat_id: packing_inward_details.cat_id,
          sub_cat_id: packing_inward_details.sub_cat_id,
          head_id: packing_inward_details.head_id,
          type_design_id: packing_inward_details.type_design_id,
          uom_id: packing_inward_details.uom_id,
          pur_rate: packing_inward_details.pur_rate,
          sale_rate: packing_inward_details.sale_rate,
          wholesale_rate: packing_inward_details.wholesale_rate,
          mrp: packing_inward_details.mrp,
          gst: packing_inward_details.gst
        }

        const packing_issue_insert = await knex(`${PACKING_INWARD_DETAILS.NAME}`).insert
          ({
            [PACKING_INWARD_DETAILS.COLUMNS.DOCNO]: docno,
            [PACKING_INWARD_DETAILS.COLUMNS.PACKING_ISSUE_DOCNO]: packingInwardData.packing_issue_docno,
            [PACKING_INWARD_DETAILS.COLUMNS.PACK_ISSUE_ID]: packingInwardDetailsData.pack_issue_id,
            [PACKING_INWARD_DETAILS.COLUMNS.PACKING_INWARD_MST_ID]: packingInwardId,
            [PACKING_INWARD_DETAILS.COLUMNS.DOCDATE]: packingInwardDetailsData.docdate,
            [PACKING_INWARD_DETAILS.COLUMNS.WH_ID]: packingInwardDetailsData.wh_id,
            [PACKING_INWARD_DETAILS.COLUMNS.PROD_ID]: packingInwardDetailsData.prod_id,
            [PACKING_INWARD_DETAILS.COLUMNS.TOTAL_QTY]: packingInwardDetailsData.total_qty,
            [PACKING_INWARD_DETAILS.COLUMNS.CAT_ID]: packingInwardDetailsData.cat_id,
            [PACKING_INWARD_DETAILS.COLUMNS.SUB_CAT_ID]: packingInwardDetailsData.sub_cat_id,
            [PACKING_INWARD_DETAILS.COLUMNS.HEAD_ID]: packingInwardDetailsData.head_id,
            [PACKING_INWARD_DETAILS.COLUMNS.TYPE_DESIGN_ID]: packingInwardDetailsData.type_design_id,
            [PACKING_INWARD_DETAILS.COLUMNS.UOM_ID]: packingInwardDetailsData.uom_id,
            [PACKING_INWARD_DETAILS.COLUMNS.BARCODE]: packingInwardDetailsData.barcode,
            [PACKING_INWARD_DETAILS.COLUMNS.PUR_RATE]: packingInwardDetailsData.pur_rate,
            [PACKING_INWARD_DETAILS.COLUMNS.SALE_RATE]: packingInwardDetailsData.sale_rate,
            [PACKING_INWARD_DETAILS.COLUMNS.WHOLESALE_RATE]: packingInwardDetailsData.wholesale_rate,
            [PACKING_INWARD_DETAILS.COLUMNS.MRP]: packingInwardDetailsData.mrp,
            [PACKING_INWARD_DETAILS.COLUMNS.GST]: packingInwardDetailsData.gst,
            [PACKING_INWARD_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
          });

      }
    }

    // packing issue update is_inwared

    const updatePackingIssueIsInwaredQuery = await knex(`${PACKING_ISSUE_MASTER.NAME}`)
      .where(`${PACKING_ISSUE_MASTER.COLUMNS.ID}`, packingInwardData.pack_issue_id)
      .update({
        [PACKING_ISSUE_MASTER.COLUMNS.IS_INWARD]: true
      });


    // item subract

    if (Array.isArray(body.packing_inward_details)) {
      for (const element of body.packing_inward_details) {

        console.log(element.prod_id, "element.prod_id");
        console.log(element, "element");


        if (Array.isArray(element.prod_id)) {
          for (const proid of element.prod_id) {
            const qty = element.total_qty;
            // const mrp = element.mrp;
            // const rate = element.rate;
            // const gst = element.gst_per;

            await knex(`${ITEM.NAME}`)
              .where(`${ITEM.COLUMNS.ID}`, proid)
              .update({
                [ITEM.COLUMNS.BALANCE]: knex.raw(`${ITEM.COLUMNS.BALANCE} - ${qty}`),
                // [ITEM.COLUMNS.MRP]: mrp,
                // [ITEM.COLUMNS.PARCHASE_RATE]: rate,
                // [ITEM.COLUMNS.GST]: gst
              });
          }
        } else {
          const qty = element.total_qty;
          // const mrp = element.mrp;
          // const rate = element.rate;
          // const gst = element.gst_per;

          await knex(`${ITEM.NAME}`)
            .where(`${ITEM.COLUMNS.ID}`, element.prod_id)
            .update({
              [ITEM.COLUMNS.BALANCE]: knex.raw(`${ITEM.COLUMNS.BALANCE} - ${qty}`),
              // [ITEM.COLUMNS.MRP]: mrp,
              // [ITEM.COLUMNS.PARCHASE_RATE]: rate,
              // [ITEM.COLUMNS.GST]: gst
            });
        }
      }
    } else {
      console.error("purchase_details is not an array");
    }

    // stock ledger

    const getMainWarehouseGstQuery = await knex(`${WAREHOUSE.NAME}`)
      .where(`${WAREHOUSE.COLUMNS.MAIN_WAREHOUSE}`, true)

    const warehouseGst = getMainWarehouseGstQuery[0].gstin
    if (warehouseGst) {
      const getSubWarehouseGstQuery = await knex(`${WAREHOUSE.NAME}`)
        .where(`${WAREHOUSE.COLUMNS.MAIN_WAREHOUSE}`, false)
        .andWhere(`${WAREHOUSE.COLUMNS.ID}`, packingInwardData.wh_id)

      const subWarehouseGst = getSubWarehouseGstQuery[0].gstin

      if (warehouseGst == subWarehouseGst) {

        if (Array.isArray(body.packing_details)) {
          for (const element of body.packing_details) {
            if (!Array.isArray(element.prod_id) && !Array.isArray(element.docdate)) {
              const stockLedgerQuery = knex(STOCKLEDGER.NAME)
                .where({
                  [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                })
                .andWhere(STOCKLEDGER.COLUMNS.DATE, element.docdate)
                .andWhere(STOCKLEDGER.COLUMNS.WH_ID, packingIssueData.wh_id);


              const existsResponse = await stockLedgerQuery;

              if (existsResponse.length == 0) {
                const queryInsert = await knex(STOCKLEDGER.NAME).insert({
                  [STOCKLEDGER.COLUMNS.DATE]: element.docdate,
                  [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                  [STOCKLEDGER.COLUMNS.PARCHASE_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.SALE_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.PURCHASE_RETURN_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.WASTAGE_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.ADJUST_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.FREE_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.SALES_IN_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.TR_IN_QTY]: element.total_qty,
                  [STOCKLEDGER.COLUMNS.TR_OUT_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.COMPANY_ID]: 1,
                  [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                  [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id

                });
              }

            }

          }
        }

      }
      else {
        if (Array.isArray(body.packing_details)) {
          for (const element of body.packing_details) {
            if (!Array.isArray(element.prod_id) && !Array.isArray(element.docdate)) {
              const stockLedgerQuery = knex(STOCKLEDGER.NAME)
                .where({
                  [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                })
                .andWhere(STOCKLEDGER.COLUMNS.DATE, element.docdate)
                .andWhere(STOCKLEDGER.COLUMNS.WH_ID, packingIssueData.wh_id);


              const existsResponse = await stockLedgerQuery;

              if (existsResponse.length == 0) {
                const queryInsert = await knex(STOCKLEDGER.NAME).insert({
                  [STOCKLEDGER.COLUMNS.DATE]: element.docdate,
                  [STOCKLEDGER.COLUMNS.PROD_ID]: element.prod_id,
                  [STOCKLEDGER.COLUMNS.PARCHASE_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.SALE_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.PURCHASE_RETURN_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.WASTAGE_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.ADJUST_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.FREE_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.SALES_IN_QTY]: element.total_qty,
                  [STOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.TR_IN_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.TR_OUT_QTY]: 0,
                  [STOCKLEDGER.COLUMNS.COMPANY_ID]: 1,
                  [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                  [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id

                });
              }

            }

          }
        }
      }

    }

    // warehouse stock create

    if (Array.isArray(body.packing_inward_details)) {
      for (const element of body.packing_inward_details) {

        const warehouseStockEntry = await knex(`${WAREHOUSE_STOCKS.NAME}`)
          .where(`${WAREHOUSE_STOCKS.COLUMNS.PROD_ID}`, element.prod_id)
          .where(`${WAREHOUSE_STOCKS.COLUMNS.WH_ID}`, body.wh_id)
          .first()


        if (warehouseStockEntry) {
          // Update existing stock
          const warehouseStockUpdate = await knex(`${WAREHOUSE_STOCKS.NAME}`)
            .where(`${WAREHOUSE_STOCKS.COLUMNS.ID}`, warehouseStockEntry.id)
            .update({
              [WAREHOUSE_STOCKS.COLUMNS.STOCK]: warehouseStockEntry.stock + element.total_qty,
              [WAREHOUSE_STOCKS.COLUMNS.UPDATED_BY]: userDetails.id
              // [WAREHOUSE_STOCKS.COLUMNS.UPDATED_AT]: new Date(),
            });
        }
        else {
          const warehouseStockCreate = await knex(`${WAREHOUSE_STOCKS.NAME}`).insert({
            [WAREHOUSE_STOCKS.COLUMNS.PROD_ID]: element.prod_id,
            [WAREHOUSE_STOCKS.COLUMNS.WH_ID]: body.wh_id,
            [WAREHOUSE_STOCKS.COLUMNS.STOCK]: element.total_qty,
            [WAREHOUSE_STOCKS.COLUMNS.CREATED_BY]: userDetails.id
            // [WAREHOUSE_STOCKS.COLUMNS.CREATED_AT]: new Date(),
          })
        }
      }
    }

    return { success: true }
  }

  async function getPackingIssueDocno({ logTrace }) {
    const knex = this;

    const query = knex(PACKING_ISSUE_MASTER.NAME).returning("id")
      .orderBy(PACKING_ISSUE_MASTER.COLUMNS.ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get packing issue",
      logTrace
    });

    const response = await query;

    if (response.length === 0) {
      return { Docno: "1" };
    }

    const docno = response[0].docno;
    const numericPart = parseInt(docno.replace(/\D/g, ''), 10);

    if (isNaN(numericPart)) {
      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Invalid docno format in response",
        property: "",
        code: "INVALID_DOCNO_FORMAT"
      });
    }

    const Docno = `WS_ISSUE${numericPart + 1}`;

    return { Docno };
  }

  async function getPackingIssuePdf({ params, body, logTrace, userDetails }) {
    const knex = this;
    const docno = body.docno

    const query = knex
      .select([
        `${PACKING_ISSUE_MASTER.NAME}.*`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.PROD_ID} as packing_issue_detail_prod_id`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.TOTAL_QTY} as packing_issue_detail_total_qty`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.CAT_ID} as packing_issue_detail_cat_id`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.SUB_CAT_ID} as packing_issue_detail_sub_cat_id`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.HEAD_ID} as packing_issue_detail_head_id`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.TYPE_DESIGN_ID} as packing_issue_detail_type_design_id`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.UOM_ID} as packing_issue_detail_uom_id`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.BARCODE} as packing_issue_detail_barcode`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.PUR_RATE} as packing_issue_detail_pur_rate`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.SALE_RATE} as packing_issue_detail_sale_rate`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.WHOLESALE_RATE} as packing_issue_detail_whole_sale_rate`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.MRP} as packing_issue_detail_mrp`,
        // `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.GST} as packing_issue_detail_gst`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID} as warehouse_id`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WHNAME} as warehouse_name`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME} as warehouse_short_name`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD1} as warehouse_add1`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD2} as warehouse_add2`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD3} as warehouse_add3`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD4} as warehouse_add4`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.CITY} as warehouse_city`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.PINCODE} as warehouse_pincode`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.PHONE} as warehouse_phone`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.MOBILE} as warehouse_mobile`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.EMAIL} as warehouse_email`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.COUNTRY} as warehouse_country`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.CITYID} as warehouse_city_id`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.STATEID} as warehouse_state_id`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.COUNTRYID} as warehouse_country_id`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.LIMITATION} as warehouse_limitation`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.GSTIN} as warehouse_gstin`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.FSSAI} as warehouse_fssai`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ISGST} as warehouse_isgst`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WALLET_BALANCE} as warehouse_wallet_balance`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.BANKACNO} as warehouse_bank_acc_no`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.BANKNAME} as warehouse_bank_name`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ACNAME} as warehouse_ac_name`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IFSCCODE} as warehouse_ifsc_code`,
        // `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.MAIN_WAREHOUSE} as main_warehouse`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as warehouse_city`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as warehouse_state`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as warehouse_country`,
      ])
      .from(`${PACKING_ISSUE_MASTER.NAME} as ${PACKING_ISSUE_MASTER.NAME}`)
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.WH_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.STATEID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.CITYID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.COUNTRYID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${PACKING_ISSUE_DETAILS.NAME} as ${PACKING_ISSUE_DETAILS.NAME}`,
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.DOCNO}`,
        `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.DOCNO}`
      )
      .where(
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.DOCNO}`,
        docno
      );

    const response = await query;

    return response[0]

  }
  async function getPackingInwardDocno({ logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.DOCNO}`
      ])
      .from(`${PACKING_ISSUE_MASTER.NAME} as ${PACKING_ISSUE_MASTER.NAME}`)
      .where(
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.IS_INWARD}`,
        false
      )
      .orderBy(`${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.ID}`, "DESC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get packing issue",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "packing issue data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response
  }

  async function getPackingInward({ params, body, logTrace, userDetails }) {
    const knex = this;

    const query = knex
      .select([
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.ID}`,
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.DOCNO}`,
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.DOCDATE}`,
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.WH_ID}`,
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.TOTAL_ITEMS}`,
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.TOTAL_QTY}`,
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.AMOUNT}`,
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.IS_INWARD}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WHNAME} as warehouse_name`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME} as warehouse_short_name`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD1} as warehouse_add1`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD2} as warehouse_add2`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD3} as warehouse_add3`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ADD4} as warehouse_add4`

      ])
      .from(`${PACKING_ISSUE_MASTER.NAME} as ${PACKING_ISSUE_MASTER.NAME}`)
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.WH_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )
      .where(
        `${PACKING_ISSUE_MASTER.NAME}.${PACKING_ISSUE_MASTER.COLUMNS.DOCNO}`,
        params.docno
      );

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Packing Issue",
      logTrace,
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Packing issue data not found",
        property: "",
        code: "NOT_FOUND",
      });
    }

    const packing_issue_details = await Promise.all(
      response.map(async (packing_issue) => {
        const packing_issue_details_lines = await knex
          .select([
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.PACKING_ISSUE_MST_ID}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.DOCNO}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.DOCDATE}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.WH_ID}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.PROD_ID}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.TOTAL_QTY}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.CAT_ID}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.SUB_CAT_ID}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.HEAD_ID}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.TYPE_DESIGN_ID}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.UOM_ID}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.BARCODE}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.PUR_RATE}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.SALE_RATE}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.WHOLESALE_RATE}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.MRP}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.GST}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as item_product_code`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as item_product_name`,
            `${ITEM.NAME}.${ITEM.COLUMNS.SHORT_NAME} as item_short_name`

          ])
          .from(`${PACKING_ISSUE_DETAILS.NAME} as ${PACKING_ISSUE_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(
            `${PACKING_ISSUE_DETAILS.NAME}.${PACKING_ISSUE_DETAILS.COLUMNS.PACKING_ISSUE_MST_ID}`,
            packing_issue.id
          );

        return { ...packing_issue, packing_issue_details_lines };
      })
    );

    return packing_issue_details;
  }

  return {
    postPackingIssue,
    postPackingInward,
    getPackingIssueDocno,
    getPackingInwardDocno,
    getPackingInward,
    getPackingIssuePdf
  };
}

module.exports = allPackingIssueRepo;
