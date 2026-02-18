const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CLOSINGSTOCK, MISSING_STOCKS, PENDING_MISSING_STOCKS } = require("../../commons");
const { BARCODE_LIST } = require("../../../accounts/barcode/commons/constant");
const { CLOSING_STOCK_TEMP } = require("../../../closing_stock/commons");
// const { OUTLETS } = require("../../../catalog/commons");
const { MAIN_CATEGORY, SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
// const { SUB_CATEGORY } = require("../../category/commons/constants");
// const { PURCHASE_DETAILS } = require("../../../purchase/commons");
const { ITEM, OUTLET_PRODUCT_MAPPING } = require("../../../catalog/commons");

function ClosingStockRepo(fastify) {

  // old

  // async function postClosingStock({ params, body, logTrace, userDetails }) {
  //   const knex = this;
  //   var remaingArrayOfClosingStock = [];

  //   var stockmissingBarcode

  //   await Promise.all(body.closing_data_outlet.map(async item => {

  //     var prodid = item.prodid;
  //     var docdate = item.docdate
  //     var physical_qty = item.physical_qty
  //     var barcode = item.barcode
  //     var company_id = item.company_id
  //     var uid = item.uid
  //     var outlet_id = item.outlet_id

  //     var closing_stock_data = {
  //       prodid: prodid,
  //       docdate: docdate,
  //       physical_qty: physical_qty,
  //       company_id: company_id,
  //       uid: uid,
  //       outlet_id: outlet_id,
  //       barcode: barcode
  //     }

  //     var itemData = await knex(`${ITEM.NAME}`)
  //       .where(`${ITEM.COLUMNS.ID}`, closing_stock_data.prodid)


  //     var closing_stock_data_with_item =
  //     {
  //       computer_qty: 1,
  //       sales_rate: itemData[0].mrp ?? 0,
  //     }

  //     const purchase_details_Data = knex.raw(`select * from purchase_details where prodid=${closing_stock_data.prodid} order by created_at desc limit 1`)

  //     var purchase_details_Data_response = await purchase_details_Data;

  //     var purchase_details_result =
  //     {
  //       purchase_rate: purchase_details_Data_response.rows[0]?.rate ?? 0,
  //       mrp: purchase_details_Data_response.rows[0]?.mrp ?? 0
  //     }

  //     var closing_stock_insert = {
  //       prodid_ins: closing_stock_data.prodid,
  //       docdate_ins: closing_stock_data.docdate,
  //       physical_qty_ins: closing_stock_data.physical_qty,
  //       company_id_ins: closing_stock_data.company_id,
  //       computer_qty_ins: closing_stock_data_with_item.computer_qty,
  //       sales_rate_ins: closing_stock_data_with_item.sales_rate,
  //       purchase_rate_ins: purchase_details_result.purchase_rate,
  //       mrp_ins: purchase_details_result.mrp,
  //       uid: closing_stock_data.uid,
  //       outlet_id: closing_stock_data.outlet_id,
  //       barcode: closing_stock_data.barcode
  //     }

  //     const closingStockQuery = knex(CLOSINGSTOCK.NAME)
  //       .where({
  //         [CLOSINGSTOCK.COLUMNS.PRODID]: closing_stock_data.prodid,
  //       })

  //     const existsResponseStock = await closingStockQuery;


  //     if (existsResponseStock.length === 0) {

  //       const closing_stock_insert_new = await knex(`${CLOSINGSTOCK.NAME}`).insert({
  //         [CLOSINGSTOCK.COLUMNS.DOCDATE]: closing_stock_insert.docdate_ins,
  //         [CLOSINGSTOCK.COLUMNS.PRODID]: closing_stock_insert.prodid_ins,
  //         [CLOSINGSTOCK.COLUMNS.PHYSICAL_QTY]: closing_stock_insert.physical_qty_ins,
  //         [CLOSINGSTOCK.COLUMNS.COMPUTER_QTY]: closing_stock_insert.computer_qty_ins,
  //         [CLOSINGSTOCK.COLUMNS.PURCHASE_RATE]: closing_stock_insert.purchase_rate_ins,
  //         [CLOSINGSTOCK.COLUMNS.SALES_RATE]: closing_stock_insert.sales_rate_ins,
  //         [CLOSINGSTOCK.COLUMNS.MRP]: closing_stock_insert.mrp_ins,
  //         [CLOSINGSTOCK.COLUMNS.COMPANY_ID]: closing_stock_insert.company_id_ins,
  //         [CLOSINGSTOCK.COLUMNS.UID]: closing_stock_insert.uid,
  //         [CLOSINGSTOCK.COLUMNS.OUTLET_ID]: closing_stock_insert.outlet_id,
  //         [CLOSINGSTOCK.COLUMNS.BARCODE]: closing_stock_insert.barcode

  //       });

  //       const updateQuery = await knex(BARCODE_LIST.NAME)
  //         .where((query) => {
  //           query.where(`${BARCODE_LIST.COLUMNS.BARCODE}`, closing_stock_insert.barcode);

  //         })
  //         .update(`${BARCODE_LIST.COLUMNS.IS_CLOSED}`, 1);

  //       var closing_stock_delete = await knex(`${CLOSING_STOCK_TEMP.NAME}`)
  //         .where({
  //           [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: closing_stock_insert.barcode,
  //           [CLOSING_STOCK_TEMP.COLUMNS.PROD_ID]: closing_stock_insert.prodid_ins,
  //           [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: closing_stock_insert.outlet_id,

  //         })
  //         .del();

  //     }
  //     else {

  //       const closingStockQuery_get = knex.raw(`select docdate from closing_stock_outlet where prodid=${closing_stock_data.prodid} order by created_at desc limit 1`)

  //       const closingStockQuery_get_date_table = await closingStockQuery_get;

  //       var get_docdate = closingStockQuery_get_date_table.rows[0].docdate

  //       var dateObject = new Date(get_docdate);

  //       dateObject.setDate(dateObject.getDate() + 1);

  //       var formattedDate = dateObject.toISOString().split('T')[0]

  //       var formattedDate_table_date1 = new Date(formattedDate);
  //       var formattedDate_postMan_date2 = new Date(closing_stock_data.docdate);


  //       if (formattedDate_postMan_date2 > formattedDate_table_date1) {
  //         const closing_stock_insert_new = await knex(`${CLOSINGSTOCK.NAME}`).insert({
  //           [CLOSINGSTOCK.COLUMNS.DOCDATE]: closing_stock_insert.docdate_ins,
  //           [CLOSINGSTOCK.COLUMNS.PRODID]: closing_stock_insert.prodid_ins,
  //           [CLOSINGSTOCK.COLUMNS.PHYSICAL_QTY]: closing_stock_insert.physical_qty_ins,
  //           [CLOSINGSTOCK.COLUMNS.COMPUTER_QTY]: closing_stock_insert.computer_qty_ins,
  //           [CLOSINGSTOCK.COLUMNS.PURCHASE_RATE]: closing_stock_insert.purchase_rate_ins,
  //           [CLOSINGSTOCK.COLUMNS.SALES_RATE]: closing_stock_insert.sales_rate_ins,
  //           [CLOSINGSTOCK.COLUMNS.MRP]: closing_stock_insert.mrp_ins,
  //           [CLOSINGSTOCK.COLUMNS.COMPANY_ID]: closing_stock_insert.company_id_ins,
  //           [CLOSINGSTOCK.COLUMNS.UID]: closing_stock_insert.uid,
  //           [CLOSINGSTOCK.COLUMNS.OUTLET_ID]: closing_stock_insert.outlet_id,
  //           [CLOSINGSTOCK.COLUMNS.BARCODE]: closing_stock_insert.barcode
  //         });

  //         const updateQuery = await knex(BARCODE_LIST.NAME)
  //           .where((query) => {
  //             query.where(`${BARCODE_LIST.COLUMNS.BARCODE}`, closing_stock_insert.barcode);
  //           })
  //           .update(`${BARCODE_LIST.COLUMNS.IS_CLOSED}`, 1);

  //         var closing_stock_delete = await knex(`${CLOSING_STOCK_TEMP.NAME}`)
  //           .where({
  //             [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: closing_stock_insert.barcode,
  //             [CLOSING_STOCK_TEMP.COLUMNS.PROD_ID]: closing_stock_insert.prodid_ins,
  //             [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: closing_stock_insert.outlet_id,

  //           })
  //           .del();

  //       }
  //       else {

  //         remaingArrayOfClosingStock.push(closing_stock_insert);
  //       }
  //     }

  //   }))

  //   var prodid_ms = body.closing_data_outlet[0].prodid;
  //   var outlet_id_ms = body.closing_data_outlet[0].outlet_id
  //   var docdate_ms = body.closing_data_outlet[0].docdate
  //   var company_id_ms = body.closing_data_outlet[0].company_id
  //   var physical_qty_ms = body.closing_data_outlet[0].physical_qty


  //   var stock_missing_data = {
  //     prodid_ms: prodid_ms,
  //     docdate_ms: docdate_ms,
  //     physical_qty_ms: physical_qty_ms,
  //     company_id_ms: company_id_ms,
  //     outlet_id_ms: outlet_id_ms,
  //   }

  //   console.log(stock_missing_data, "stock_missing_data");


  //   var itemData = await knex(`${ITEM.NAME}`)
  //     .where(`${ITEM.COLUMNS.ID}`, stock_missing_data.prodid_ms)

  //   var stock_missing_data_with_item =
  //   {
  //     computer_qty_ms: 1,
  //     sales_rate_ms: itemData[0].mrp ?? 0,
  //   }

  //   const purchase_details_Data = knex.raw(`select * from purchase_details where prodid=${stock_missing_data.prodid_ms} order by created_at desc limit 1`)

  //   var purchase_details_Data_response = await purchase_details_Data;

  //   var purchase_details_result =
  //   {
  //     purchase_rate_ms: purchase_details_Data_response.rows[0]?.rate ?? 0,
  //     mrp_ms: purchase_details_Data_response.rows[0]?.mrp ?? 0
  //   }

  //   const stockmissingQuery = knex(BARCODE_LIST.NAME)
  //     .select([
  //       `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`
  //     ]
  //     )
  //     .whereIn(BARCODE_LIST.COLUMNS.PROD_ID, function () {
  //       this.select(ITEM.COLUMNS.ID)
  //         .from(ITEM.NAME)
  //         .where({
  //           [ITEM.COLUMNS.ID]: stock_missing_data.prodid_ms
  //         });
  //     })
  //     .where({
  //       [BARCODE_LIST.COLUMNS.OUTLET_ID]: stock_missing_data.outlet_id_ms
  //     })
  //     .where({
  //       [BARCODE_LIST.COLUMNS.IS_VERIFIED]: 1,
  //     })
  //     .andWhere({
  //       [BARCODE_LIST.COLUMNS.IS_CLOSED]: 0,
  //     })
  //     .andWhere({
  //       [BARCODE_LIST.COLUMNS.IS_SOLD]: false,
  //     })
  //     .andWhereRaw(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} < DATE_TRUNC('month', CURRENT_DATE) 
  //       OR ${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} >= DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'`)
  //     .leftJoin(`${ITEM.NAME}`, `${ITEM.NAME}.${ITEM.COLUMNS.ID}`, `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`)

  //   stockmissingBarcode = await stockmissingQuery

  //   console.log(stockmissingBarcode, "stockmissingBarcode");


  //   if (stockmissingBarcode.length > 0) {

  //     for (const barcodeObj of stockmissingBarcode) {
  //       const barcode = barcodeObj.barcode;

  //       const stock_missing_insert = {
  //         prodid_ms: stock_missing_data.prodid_ms,
  //         docdate_ms: stock_missing_data.docdate_ms,
  //         physical_qty_ms: stock_missing_data.physical_qty_ms || 0,
  //         company_id_ms: stock_missing_data.company_id_ms || 0,
  //         computer_qty_ms: stock_missing_data_with_item.computer_qty_ms || 0,
  //         sales_rate_ms: stock_missing_data_with_item.sales_rate_ms || 0,
  //         purchase_rate_ms: purchase_details_result.purchase_rate_ms || 0,
  //         mrp_ms: purchase_details_result.mrp_ms || 0,
  //         outlet_id_ms: stock_missing_data.outlet_id_ms || 0,
  //         barcode_ms: barcode
  //       };

  //       await knex(`${MISSING_STOCKS.NAME}`).insert({
  //         [MISSING_STOCKS.COLUMNS.DOCDATE]: stock_missing_insert.docdate_ms,
  //         [MISSING_STOCKS.COLUMNS.PRODID]: stock_missing_insert.prodid_ms,
  //         [MISSING_STOCKS.COLUMNS.PHYSICAL_QTY]: stock_missing_insert.physical_qty_ms,
  //         [MISSING_STOCKS.COLUMNS.COMPUTER_QTY]: stock_missing_insert.computer_qty_ms,
  //         [MISSING_STOCKS.COLUMNS.PURCHASE_RATE]: stock_missing_insert.purchase_rate_ms,
  //         [MISSING_STOCKS.COLUMNS.SALES_RATE]: stock_missing_insert.sales_rate_ms,
  //         [MISSING_STOCKS.COLUMNS.MRP]: stock_missing_insert.mrp_ms,
  //         [MISSING_STOCKS.COLUMNS.COMPANY_ID]: stock_missing_insert.company_id_ms,
  //         [MISSING_STOCKS.COLUMNS.OUTLET_ID]: stock_missing_insert.outlet_id_ms,
  //         [MISSING_STOCKS.COLUMNS.BARCODE]: stock_missing_insert.barcode_ms
  //       })

  //       const barcode_update_stock_missing = await knex(BARCODE_LIST.NAME)
  //         .where(BARCODE_LIST.COLUMNS.BARCODE, stock_missing_insert.barcode_ms)
  //         .update({
  //           [BARCODE_LIST.COLUMNS.IS_MISSED]: true
  //         });
  //     }


  //   }


  //   return remaingArrayOfClosingStock;
  // }

  async function postClosingStock({ params, body, logTrace, userDetails }) {
    const knex = this;
    var remaingArrayOfClosingStock = [];

    var stock_Missing_Barcodes
    var doc = new Date()

    const query = knex(CLOSING_STOCK_TEMP.NAME)
      .select(`${CLOSING_STOCK_TEMP.NAME}.*`)
      .where({
        [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: body.outlet_id,
        [CLOSING_STOCK_TEMP.COLUMNS.CAT_ID]: body.cat_id,
      });

    if (body.sub_cat_id != 0) {
      query.andWhere({ [CLOSING_STOCK_TEMP.COLUMNS.SUB_CAT_ID]: body.sub_cat_id });
    }

    const closing_Stock_Temp_Query = await query


    await Promise.all(closing_Stock_Temp_Query.map(async item => {

      var prodid = item.prod_id;
      var docdate = doc
      var physical_qty = 1
      var barcode = item.barcode
      var company_id = 1
      var uid = item.sales_man_id
      var outlet_id = item.outlet_id

      var closing_stock_data = {
        prodid: prodid,
        docdate: docdate,
        physical_qty: physical_qty,
        company_id: company_id,
        uid: uid,
        outlet_id: outlet_id,
        barcode: barcode
      }

      var itemData = await knex(`${ITEM.NAME}`)
        .where(`${ITEM.COLUMNS.ID}`, closing_stock_data.prodid)


      var closing_stock_data_with_item =
      {
        computer_qty: 1,
        sales_rate: itemData[0].mrp ?? 0,
      }

      const purchase_details_Data = knex.raw(`select * from purchase_details where prodid=${closing_stock_data.prodid} order by created_at desc limit 1`)

      var purchase_details_Data_response = await purchase_details_Data;

      var purchase_details_result =
      {
        purchase_rate: purchase_details_Data_response.rows[0]?.rate ?? 0,
        mrp: purchase_details_Data_response.rows[0]?.mrp ?? 0
      }

      var closing_stock_insert = {
        prodid_ins: closing_stock_data.prodid,
        docdate_ins: closing_stock_data.docdate,
        physical_qty_ins: closing_stock_data.physical_qty,
        company_id_ins: closing_stock_data.company_id,
        computer_qty_ins: closing_stock_data_with_item.computer_qty,
        sales_rate_ins: closing_stock_data_with_item.sales_rate,
        purchase_rate_ins: purchase_details_result.purchase_rate,
        mrp_ins: purchase_details_result.mrp,
        uid: closing_stock_data.uid,
        outlet_id: closing_stock_data.outlet_id,
        barcode: closing_stock_data.barcode
      }

      console.log(closing_stock_insert, "closing_stock_insert");

      const closingStockQuery = knex(CLOSINGSTOCK.NAME)
        .where({
          [CLOSINGSTOCK.COLUMNS.PRODID]: closing_stock_data.prodid,
        })

      const existsResponseStock = await closingStockQuery;


      if (existsResponseStock.length === 0) {
        // console.log("if 1");

        const closing_stock_insert_new = await knex(`${CLOSINGSTOCK.NAME}`).insert({
          [CLOSINGSTOCK.COLUMNS.DOCDATE]: closing_stock_insert.docdate_ins,
          [CLOSINGSTOCK.COLUMNS.PRODID]: closing_stock_insert.prodid_ins,
          [CLOSINGSTOCK.COLUMNS.PHYSICAL_QTY]: closing_stock_insert.physical_qty_ins,
          [CLOSINGSTOCK.COLUMNS.COMPUTER_QTY]: closing_stock_insert.computer_qty_ins,
          [CLOSINGSTOCK.COLUMNS.PURCHASE_RATE]: closing_stock_insert.purchase_rate_ins,
          [CLOSINGSTOCK.COLUMNS.SALES_RATE]: closing_stock_insert.sales_rate_ins,
          [CLOSINGSTOCK.COLUMNS.MRP]: closing_stock_insert.mrp_ins,
          [CLOSINGSTOCK.COLUMNS.COMPANY_ID]: closing_stock_insert.company_id_ins,
          [CLOSINGSTOCK.COLUMNS.UID]: closing_stock_insert.uid,
          [CLOSINGSTOCK.COLUMNS.OUTLET_ID]: closing_stock_insert.outlet_id,
          [CLOSINGSTOCK.COLUMNS.BARCODE]: closing_stock_insert.barcode

        });

        const updateStockClosedQuery = await knex(BARCODE_LIST.NAME)
          .where((query) => {
            query.where(`${BARCODE_LIST.COLUMNS.BARCODE}`, closing_stock_insert.barcode);

          })
          .update(`${BARCODE_LIST.COLUMNS.IS_CLOSED}`, 1);

        var closing_stock_temp_delete = await knex(`${CLOSING_STOCK_TEMP.NAME}`)
          .where({
            [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: closing_stock_insert.barcode,
            [CLOSING_STOCK_TEMP.COLUMNS.PROD_ID]: closing_stock_insert.prodid_ins,
            [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: closing_stock_insert.outlet_id,

          })
          .del();

      }
      else {

        const closingStockQuery_get = knex.raw(`select docdate from closing_stock_outlet where prodid=${closing_stock_data.prodid} order by created_at desc limit 1`)

        const closingStockQuery_get_date_table = await closingStockQuery_get;

        var get_docdate = closingStockQuery_get_date_table.rows[0].docdate

        console.log(get_docdate, "get_docdate for table");


        var dateObject = new Date(get_docdate);

        console.log(dateObject, 'dateObject go to date function');


        dateObject.setDate(dateObject.getDate() + 1);

        var formattedDate = dateObject.toISOString().split('T')[0]

        console.log(formattedDate, "formattedDate set date get date");


        var formattedDate_table_date1 = new Date(formattedDate);
        var formattedDate_postMan_date2 = new Date(closing_stock_data.docdate);
        console.log(formattedDate_table_date1, "formattedDate_table_date1");
        console.log(formattedDate_postMan_date2, "formattedDate_postMan_date2");


        if (formattedDate_postMan_date2 > formattedDate_table_date1) {


          const closing_stock_insert_new = await knex(`${CLOSINGSTOCK.NAME}`).insert({
            [CLOSINGSTOCK.COLUMNS.DOCDATE]: closing_stock_insert.docdate_ins,
            [CLOSINGSTOCK.COLUMNS.PRODID]: closing_stock_insert.prodid_ins,
            [CLOSINGSTOCK.COLUMNS.PHYSICAL_QTY]: closing_stock_insert.physical_qty_ins,
            [CLOSINGSTOCK.COLUMNS.COMPUTER_QTY]: closing_stock_insert.computer_qty_ins,
            [CLOSINGSTOCK.COLUMNS.PURCHASE_RATE]: closing_stock_insert.purchase_rate_ins,
            [CLOSINGSTOCK.COLUMNS.SALES_RATE]: closing_stock_insert.sales_rate_ins,
            [CLOSINGSTOCK.COLUMNS.MRP]: closing_stock_insert.mrp_ins,
            [CLOSINGSTOCK.COLUMNS.COMPANY_ID]: closing_stock_insert.company_id_ins,
            [CLOSINGSTOCK.COLUMNS.UID]: closing_stock_insert.uid,
            [CLOSINGSTOCK.COLUMNS.OUTLET_ID]: closing_stock_insert.outlet_id,
            [CLOSINGSTOCK.COLUMNS.BARCODE]: closing_stock_insert.barcode
          });

          const updateQuery = await knex(BARCODE_LIST.NAME)
            .where((query) => {
              query.where(`${BARCODE_LIST.COLUMNS.BARCODE}`, closing_stock_insert.barcode);
            })
            .update(`${BARCODE_LIST.COLUMNS.IS_CLOSED}`, 1);

          var closing_stock_delete = await knex(`${CLOSING_STOCK_TEMP.NAME}`)
            .where({
              [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: closing_stock_insert.barcode,
              [CLOSING_STOCK_TEMP.COLUMNS.PROD_ID]: closing_stock_insert.prodid_ins,
              [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: closing_stock_insert.outlet_id,

            })
            .del();

        }
        else {

          remaingArrayOfClosingStock.push(closing_stock_insert);
        }
      }

    }))

    var cat_id_ms = body.cat_id
    var outlet_id_ms = body.outlet_id
    var docdate_ms = doc
    var physical_qty_ms = 1
    var company_id_ms = 1
    var sub_cat_id_ms = body.sub_cat_id

    // let sub_cat_id_single = body.closing_data_outlet.every(
    //   item => item.sub_cat_id === body.closing_data_outlet[0].sub_cat_id
    // )

    // if (sub_cat_id_single) {
    //   var sub_cat_id_ms = body.closing_data_outlet[0].sub_cat_id

    // } else {
    //   var sub_cat_id_ms = 0
    // }


    const stock_Missing_Barcode_Query = knex(BARCODE_LIST.NAME)
      .select([
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
      ])
      .whereIn(BARCODE_LIST.COLUMNS.PROD_ID, function () {
        this.select(ITEM.COLUMNS.ID)
          .from(ITEM.NAME)
          .where({
            [ITEM.COLUMNS.CATID]: cat_id_ms,
          })
          .modify(function (stock_Missing_Barcode_Query) {
            if (sub_cat_id_ms != 0) {
              stock_Missing_Barcode_Query.andWhere({
                [ITEM.COLUMNS.SUB_CATEGORY]: sub_cat_id_ms,
              });
            }
          });
      })
      .where({
        [BARCODE_LIST.COLUMNS.OUTLET_ID]: outlet_id_ms,
      })
      .where({
        [BARCODE_LIST.COLUMNS.IS_VERIFIED]: 1,
      })
      .andWhere({
        [BARCODE_LIST.COLUMNS.IS_CLOSED]: 0,
      })
      .andWhere({
        [BARCODE_LIST.COLUMNS.IS_SOLD]: false,
      })
      .andWhere({
        [BARCODE_LIST.COLUMNS.IS_MISSED]: false,
      })
      .andWhereRaw(
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} < DATE_TRUNC('month', CURRENT_DATE) 
      OR ${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} >= DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'`
      )
      .leftJoin(
        `${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`
      )

    stock_Missing_Barcodes = await stock_Missing_Barcode_Query
    console.log(stock_Missing_Barcodes, "stock_Missing_Barcodes");


    if (stock_Missing_Barcodes.length > 0) {

      for (const barcodeObj of stock_Missing_Barcodes) {
        const barcode = barcodeObj.barcode;


        var barcode_list_Data = await knex(`${BARCODE_LIST.NAME}`)
          .where(`${BARCODE_LIST.COLUMNS.BARCODE}`, barcode)

        var stock_missing_data_with_prod_id =
        {
          prod_id_ms: barcode_list_Data[0].prod_id ?? 0,
        }

        console.log(stock_missing_data_with_prod_id.prod_id_ms, "stock_missing_data_with_prod_id.prod_id_ms");


        var itemData = await knex(`${ITEM.NAME}`)
          .where(`${ITEM.COLUMNS.ID}`, stock_missing_data_with_prod_id.prod_id_ms)

        var stock_missing_data_with_item =
        {
          computer_qty_ms: 1,
          sales_rate_ms: itemData[0].mrp ?? 0,
          // sub_cat_ms: itemData[0].sub_cat ?? 0,
        }

        const purchase_details_Data = await knex.raw(`select * from purchase_details where prodid=${stock_missing_data_with_prod_id.prod_id_ms} order by created_at desc limit 1`)


        var stock_missing_data_with_purchase =
        {
          purchase_rate_ms: purchase_details_Data.rows[0]?.rate ?? 0,
          mrp_ms: purchase_details_Data.rows[0]?.mrp ?? 0
        }



        var stock_missing_insert = {
          prodid_p: stock_missing_data_with_prod_id.prod_id_ms,
          docdate_p: docdate_ms || "2024-11-29",
          physical_qty_p: physical_qty_ms || 0,
          company_id_p: company_id_ms || 0,
          computer_qty_p: stock_missing_data_with_item.computer_qty_ms || 0,
          sales_rate_p: stock_missing_data_with_item.sales_rate_ms || 0,
          purchase_rate_p: stock_missing_data_with_purchase.purchase_rate_ms || 0,
          mrp_p: stock_missing_data_with_purchase.mrp_ms || 0,
          outlet_id_p: outlet_id_ms || 0,
          barcode_p: barcode,
          // cat_id_p: cat_id_ms,
          // sales_man_id_p: sales_man_id_ms,
          // sub_cat_id_p: stock_missing_data_with_item.sub_cat_ms,

        };

        console.log(stock_missing_insert, "stock_missing_insert data");

        await knex(`${MISSING_STOCKS.NAME}`).insert({
          [MISSING_STOCKS.COLUMNS.DOCDATE]: stock_missing_insert.docdate_p,
          [MISSING_STOCKS.COLUMNS.PRODID]: stock_missing_insert.prodid_p,
          [MISSING_STOCKS.COLUMNS.PHYSICAL_QTY]: stock_missing_insert.physical_qty_p,
          [MISSING_STOCKS.COLUMNS.COMPUTER_QTY]: stock_missing_insert.computer_qty_p,
          [MISSING_STOCKS.COLUMNS.PURCHASE_RATE]: stock_missing_insert.purchase_rate_p,
          [MISSING_STOCKS.COLUMNS.SALES_RATE]: stock_missing_insert.sales_rate_p,
          [MISSING_STOCKS.COLUMNS.MRP]: stock_missing_insert.mrp_p,
          [MISSING_STOCKS.COLUMNS.COMPANY_ID]: stock_missing_insert.company_id_p,
          [MISSING_STOCKS.COLUMNS.OUTLET_ID]: stock_missing_insert.outlet_id_p,
          [MISSING_STOCKS.COLUMNS.BARCODE]: stock_missing_insert.barcode_p
        })

        const barcode_update_stock_missing = await knex(BARCODE_LIST.NAME)
          .where(BARCODE_LIST.COLUMNS.BARCODE, stock_missing_insert.barcode_p)
          .update({
            [BARCODE_LIST.COLUMNS.IS_MISSED]: true
          });

      }

    }

    // return stock_missing_insert
    return remaingArrayOfClosingStock;
  }





  async function getPendingStock({ params, body, logTrace, userDetails }) {
    const knex = this;

    const { cat_id, outlet_id } = body;

    const query = knex
      .select([
        `${PENDING_MISSING_STOCKS.NAME}.*`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
      ])
      .from(`${PENDING_MISSING_STOCKS.NAME} as ${PENDING_MISSING_STOCKS.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${PENDING_MISSING_STOCKS.NAME}.${PENDING_MISSING_STOCKS.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${PENDING_MISSING_STOCKS.NAME}.${PENDING_MISSING_STOCKS.COLUMNS.CAT_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      ).leftJoin(
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${PENDING_MISSING_STOCKS.NAME}.${PENDING_MISSING_STOCKS.COLUMNS.SUB_CAT_ID}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .where(
        `${PENDING_MISSING_STOCKS.NAME}.${PENDING_MISSING_STOCKS.COLUMNS.CAT_ID}`,
        cat_id
      )
      .where(
        `${PENDING_MISSING_STOCKS.NAME}.${PENDING_MISSING_STOCKS.COLUMNS.OUTLET_ID}`,
        outlet_id
      )

    const response = await query

    return response;
  }


  async function getPendingStockViewNew({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { cat_id, outlet_id, sub_cat_id } = params;


    const closing_Stock_Temp_BarcodeQuery = knex(CLOSING_STOCK_TEMP.NAME)
      .select(`${CLOSING_STOCK_TEMP.NAME}.${CLOSING_STOCK_TEMP.COLUMNS.BARCODE}`)
      .where({
        [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
        [CLOSING_STOCK_TEMP.COLUMNS.CAT_ID]: cat_id,
      });

    if (Number(sub_cat_id) !== 0) {
      closing_Stock_Temp_BarcodeQuery.andWhere({
        [CLOSING_STOCK_TEMP.COLUMNS.SUB_CAT_ID]: Number(sub_cat_id),
      });
      console.log(sub_cat_id, "sub_cat_id");
    }

    console.log(closing_Stock_Temp_BarcodeQuery.toSQL());

    const closing_StockTemp_Barcode_Response = await closing_Stock_Temp_BarcodeQuery;
    const filterBarcodes = closing_StockTemp_Barcode_Response.map((barcode) => barcode.barcode);

    console.log(filterBarcodes, "filtered values");

    const responseQuery = knex
      .select(
        knex.raw('COUNT(*) as qty'),
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
      )
      .from(`${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .whereNotIn(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, filterBarcodes)
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_VERIFIED}`, 1)
      .andWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_CLOSED}`, 0)
      .andWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_SOLD}`, false)
      .andWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.IS_MISSED}`, false)
      .andWhere(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.OUTLET_ID}`, outlet_id)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.CATID}`, cat_id)
      .andWhereRaw(`
            (${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} < DATE_TRUNC('month', CURRENT_DATE) 
            OR ${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} >= DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')
        `);

    if (Number(sub_cat_id) !== 0) {
      responseQuery.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`, Number(sub_cat_id));
      console.log(sub_cat_id, "sub_cat_id");
    }

    responseQuery.groupBy(
      `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
      `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
    );

    console.log(responseQuery.toSQL());

    const response = await responseQuery;
    // console.log(response, "values");

    // const totalQty = response.reduce((total, item) => total + parseInt(item.qty, 10), 0);

    return response
    // return {
    //   data: response,
    //   totalQty: totalQty
    // }

  }



  async function postPendingStockToCloshingStock({ params, body, logTrace, userDetails }) {
    const knex = this;

    await Promise.all(body.pending_stock_to_outlet_closing_stock.map(async item => {

      var docdate = item.docdate;
      var prodid = item.prodid
      var outlet_id = item.outlet_id
      var barcode = item.barcode
      var physical_qty = item.physical_qty
      var computer_qty = item.computer_qty
      var purchase_rate = item.purchase_rate
      var sales_rate = item.sales_rate
      var mrp = item.mrp
      var company_id = item.company_id
      var sales_man_id = item.sales_man_id


      var closing_stock_insert_data = {
        docdate_ins: docdate,
        prodid_ins: prodid,
        outlet_id_ins: outlet_id,
        barcode_ins: barcode,
        physical_qty_ins: physical_qty,
        computer_qty_ins: computer_qty,
        purchase_rate_ins: purchase_rate,
        sales_rate_ins: sales_rate,
        mrp_ins: mrp,
        company_id_ins: company_id,
        sales_man_id_ins: sales_man_id,
      }

      console.log(closing_stock_insert_data, "closing_stock_insert_data");


      const closing_stock_insert_new = await knex(`${CLOSINGSTOCK.NAME}`).insert({
        [CLOSINGSTOCK.COLUMNS.DOCDATE]: closing_stock_insert_data.docdate_ins,
        [CLOSINGSTOCK.COLUMNS.PRODID]: closing_stock_insert_data.prodid_ins,
        [CLOSINGSTOCK.COLUMNS.PHYSICAL_QTY]: closing_stock_insert_data.physical_qty_ins,
        [CLOSINGSTOCK.COLUMNS.COMPUTER_QTY]: closing_stock_insert_data.computer_qty_ins,
        [CLOSINGSTOCK.COLUMNS.PURCHASE_RATE]: closing_stock_insert_data.purchase_rate_ins,
        [CLOSINGSTOCK.COLUMNS.SALES_RATE]: closing_stock_insert_data.sales_rate_ins,
        [CLOSINGSTOCK.COLUMNS.MRP]: closing_stock_insert_data.mrp_ins,
        [CLOSINGSTOCK.COLUMNS.COMPANY_ID]: closing_stock_insert_data.company_id_ins,
        [CLOSINGSTOCK.COLUMNS.UID]: closing_stock_insert_data.sales_man_id_ins,
        [CLOSINGSTOCK.COLUMNS.OUTLET_ID]: closing_stock_insert_data.outlet_id_ins,
        [CLOSINGSTOCK.COLUMNS.BARCODE]: closing_stock_insert_data.barcode_ins

      });

      const updateStockClosedQuery = await knex(BARCODE_LIST.NAME)
        .where((query) => {
          query.where(`${BARCODE_LIST.COLUMNS.BARCODE}`, closing_stock_insert_data.barcode_ins);

        })
        .update(`${BARCODE_LIST.COLUMNS.IS_CLOSED}`, 1);

      var pending_missing_stock_delete = await knex(`${PENDING_MISSING_STOCKS.NAME}`)
        .where({
          [PENDING_MISSING_STOCKS.COLUMNS.BARCODE]: closing_stock_insert_data.barcode_ins,
          [PENDING_MISSING_STOCKS.COLUMNS.PRODID]: closing_stock_insert_data.prodid_ins,
          [PENDING_MISSING_STOCKS.COLUMNS.OUTLET_ID]: closing_stock_insert_data.outlet_id_ins
        })
        .del();
    }))

  }

  async function postPendingStockToMissingStock({ params, body, logTrace, userDetails }) {
    const knex = this;

    await Promise.all(body.pending_stock_to_missing_stock.map(async item => {

      var docdate = item.docdate;
      var prodid = item.prodid
      var outlet_id = item.outlet_id
      var barcode = item.barcode
      var physical_qty = item.physical_qty
      var computer_qty = item.computer_qty
      var purchase_rate = item.purchase_rate
      var sales_rate = item.sales_rate
      var mrp = item.mrp
      var company_id = item.company_id
      var sales_man_id = item.sales_man_id


      var closing_stock_insert_data = {
        docdate_ins: docdate,
        prodid_ins: prodid,
        outlet_id_ins: outlet_id,
        barcode_ins: barcode,
        physical_qty_ins: physical_qty,
        computer_qty_ins: computer_qty,
        purchase_rate_ins: purchase_rate,
        sales_rate_ins: sales_rate,
        mrp_ins: mrp,
        company_id_ins: company_id,
        sales_man_id_ins: sales_man_id,
      }

      const closing_stock_insert_new = await knex(`${MISSING_STOCKS.NAME}`).insert({
        [MISSING_STOCKS.COLUMNS.DOCDATE]: closing_stock_insert_data.docdate_ins,
        [MISSING_STOCKS.COLUMNS.PRODID]: closing_stock_insert_data.prodid_ins,
        [MISSING_STOCKS.COLUMNS.PHYSICAL_QTY]: closing_stock_insert_data.physical_qty_ins,
        [MISSING_STOCKS.COLUMNS.COMPUTER_QTY]: closing_stock_insert_data.computer_qty_ins,
        [MISSING_STOCKS.COLUMNS.PURCHASE_RATE]: closing_stock_insert_data.purchase_rate_ins,
        [MISSING_STOCKS.COLUMNS.SALES_RATE]: closing_stock_insert_data.sales_rate_ins,
        [MISSING_STOCKS.COLUMNS.MRP]: closing_stock_insert_data.mrp_ins,
        [MISSING_STOCKS.COLUMNS.COMPANY_ID]: closing_stock_insert_data.company_id_ins,
        // [MISSING_STOCKS.COLUMNS.UID]: closing_stock_insert_data.sales_man_id_ins,
        [MISSING_STOCKS.COLUMNS.OUTLET_ID]: closing_stock_insert_data.outlet_id_ins,
        [MISSING_STOCKS.COLUMNS.BARCODE]: closing_stock_insert_data.barcode_ins

      });

      const barcode_update_stock_missing = await knex(BARCODE_LIST.NAME)
        .where(BARCODE_LIST.COLUMNS.BARCODE, closing_stock_insert_data.barcode_ins)
        .update({
          [BARCODE_LIST.COLUMNS.IS_MISSED]: true
        });

      const pending_missing_stock_delete = await knex(`${PENDING_MISSING_STOCKS.NAME}`)
        .where({
          [PENDING_MISSING_STOCKS.COLUMNS.BARCODE]: closing_stock_insert_data.barcode_ins,
          [PENDING_MISSING_STOCKS.COLUMNS.PRODID]: closing_stock_insert_data.prodid_ins,
          [PENDING_MISSING_STOCKS.COLUMNS.OUTLET_ID]: closing_stock_insert_data.outlet_id_ins
        })
        .del();
    }))
  }
  return {
    postClosingStock,
    getPendingStock,
    postPendingStockToCloshingStock,
    postPendingStockToMissingStock,
    getPendingStockViewNew
  };
}

module.exports = ClosingStockRepo;
