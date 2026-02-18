const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CLOSINGSTOCK, CLOSING_STOCK_TEMP, CLOSING_STOCK_OUTLET,
  MISSING_STOCKS } = require("../../commons");
const { MAIN_CATEGORY, SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
const { ITEM, OUTLET_PRODUCT_MAPPING, SALESMAN } = require("../../../catalog/commons");
const { BARCODE_LIST } = require("../../../accounts/barcode/commons/constant")
const { OUTLETS } = require("../../../accounts/outlets/commons/constants")
// const { CLOSINGSTOCK, MISSING_STOCKS, PENDING_MISSING_STOCKS } = require("../../../closing_stock _outlet/commons");


function ClosingStockRepo(fastify) {

  async function postClosingStock({ params, body, logTrace, userDetails }) {
    const knex = this;
    var remaingArrayOfClosingStock = [];

    await Promise.all(body.closing_data.map(async item => {
      var prodid = item.prodid
      var docdate = item.docdate
      var physical_qty = item.physical_qty
      var company_id = item.company_id

      var closing_stock_data = {
        prodid: prodid,
        docdate: docdate,
        physical_qty: physical_qty,
        company_id: company_id
      }

      var itemData = await knex(`${ITEM.NAME}`)
        .where(`${ITEM.COLUMNS.ID}`, closing_stock_data.prodid)

      var closing_stock_data_with_item =
      {
        computer_qty: itemData[0].balance ?? 0,
        sales_rate: itemData[0].sale_rate ?? 0,
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
        mrp_ins: purchase_details_result.mrp
      }

      const closingStockQuery = knex(CLOSINGSTOCK.NAME)
        .where({
          [CLOSINGSTOCK.COLUMNS.PRODID]: closing_stock_data.prodid,
        })

      const existsResponseStock = await closingStockQuery;

      if (existsResponseStock.length === 0) {
        const closing_stock_insert_new = await knex(`${CLOSINGSTOCK.NAME}`).insert({
          [CLOSINGSTOCK.COLUMNS.DOCDATE]: closing_stock_insert.docdate_ins,
          [CLOSINGSTOCK.COLUMNS.PRODID]: closing_stock_insert.prodid_ins,
          [CLOSINGSTOCK.COLUMNS.PHYSICAL_QTY]: closing_stock_insert.physical_qty_ins,
          [CLOSINGSTOCK.COLUMNS.COMPUTER_QTY]: closing_stock_insert.computer_qty_ins,
          [CLOSINGSTOCK.COLUMNS.PURCHASE_RATE]: closing_stock_insert.purchase_rate_ins,
          [CLOSINGSTOCK.COLUMNS.SALES_RATE]: closing_stock_insert.sales_rate_ins,
          [CLOSINGSTOCK.COLUMNS.MRP]: closing_stock_insert.mrp_ins,
          [CLOSINGSTOCK.COLUMNS.COMPANY_ID]: closing_stock_insert.company_id_ins
        });
      }
      else {
        const closingStockQuery_get = knex.raw(`select docdate from closing_stock where prodid=${closing_stock_data.prodid} order by created_at desc limit 1`)

        const closingStockQuery_get_date_table = await closingStockQuery_get;

        var get_docdate = closingStockQuery_get_date_table.rows[0].docdate

        var dateObject = new Date(get_docdate);

        dateObject.setDate(dateObject.getDate() + 1);

        var formattedDate = dateObject.toISOString().split('T')[0]

        var formattedDate_table_date1 = new Date(formattedDate);
        var formattedDate_postMan_date2 = new Date(closing_stock_data.docdate);

        if (formattedDate_postMan_date2 > formattedDate_table_date1) {
          const closing_stock_insert_new = await knex(`${CLOSINGSTOCK.NAME}`).insert({
            [CLOSINGSTOCK.COLUMNS.DOCDATE]: closing_stock_insert.docdate_ins,
            [CLOSINGSTOCK.COLUMNS.PRODID]: closing_stock_insert.prodid_ins,
            [CLOSINGSTOCK.COLUMNS.PHYSICAL_QTY]: closing_stock_insert.physical_qty_ins,
            [CLOSINGSTOCK.COLUMNS.COMPUTER_QTY]: closing_stock_insert.computer_qty_ins,
            [CLOSINGSTOCK.COLUMNS.PURCHASE_RATE]: closing_stock_insert.purchase_rate_ins,
            [CLOSINGSTOCK.COLUMNS.SALES_RATE]: closing_stock_insert.sales_rate_ins,
            [CLOSINGSTOCK.COLUMNS.MRP]: closing_stock_insert.mrp_ins,
            [CLOSINGSTOCK.COLUMNS.COMPANY_ID]: closing_stock_insert.company_id_ins
          });
        }
        else {

          remaingArrayOfClosingStock.push(closing_stock_insert);
        }
      }

    }));

    return remaingArrayOfClosingStock;
  }
  //new
  async function postClosingStockCount({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { outlet_id, cat_id, sub_cat_id } = body;

    const query = knex(BARCODE_LIST.NAME)
      .count('* as total')
      .select(`${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`)
      .whereIn(BARCODE_LIST.COLUMNS.PROD_ID, function () {
        this.select(ITEM.COLUMNS.ID)
          .from(ITEM.NAME)
          .where({ [ITEM.COLUMNS.CATID]: cat_id });

        if (sub_cat_id != 0) {
          this.andWhere({ [ITEM.COLUMNS.SUB_CATEGORY]: sub_cat_id });
        }
      })
      .where({
        [BARCODE_LIST.COLUMNS.OUTLET_ID]: outlet_id,
        [BARCODE_LIST.COLUMNS.IS_VERIFIED]: 1,
        [BARCODE_LIST.COLUMNS.IS_CLOSED]: 0,
        [BARCODE_LIST.COLUMNS.IS_SOLD]: false,
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
      .leftJoin(
        `${MAIN_CATEGORY.NAME}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`
      );

    if (sub_cat_id != 0) {
      query
        .select(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_category_name`)
        .leftJoin(
          `${SUB_CATEGORY.NAME}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`
        )
        .groupBy(
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
        );
    } else {
      query.groupBy(`${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`);
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Count barcode",
      logTrace,
    });

    const response = await query;

    return response[0];
  }


  async function postAvailableStockCount({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { outlet_id, cat_id, sub_cat_id } = body;

    const query = knex(BARCODE_LIST.NAME)
      .count('* as total')
      .select(
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_category_name`
      )
      .whereIn(BARCODE_LIST.COLUMNS.PROD_ID, function () {
        this.select(ITEM.COLUMNS.ID)
          .from(ITEM.NAME)
          .where({
            [ITEM.COLUMNS.SUB_CATEGORY]: sub_cat_id,
            [ITEM.COLUMNS.CATID]: cat_id,
          });
      })
      .where({
        [BARCODE_LIST.COLUMNS.OUTLET_ID]: outlet_id,
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
      .leftJoin(`${ITEM.NAME}`, `${ITEM.NAME}.${ITEM.COLUMNS.ID}`, `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`)
      .leftJoin(`${SUB_CATEGORY.NAME}`, `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`, `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`)
      .leftJoin(`${MAIN_CATEGORY.NAME}`, `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`, `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`)
      .groupBy(
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
      );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Count barcode",
      logTrace
    });

    const response = await query

    return response[0];
  }
  //.........
  // async function postClosingStockCount({ params, body, logTrace, userDetails }) {
  //   const knex = this;
  //   const { outlet_id, cat_id, sub_cat_id } = body;

  //   const query = knex(BARCODE_LIST.NAME)
  //     .count('* as total')
  //     .select(
  //       `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
  //       `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as sub_category_name`
  //     )
  //     .whereIn(BARCODE_LIST.COLUMNS.PROD_ID, function () {
  //       this.select(ITEM.COLUMNS.ID)
  //         .from(ITEM.NAME)
  //         .where({
  //           [ITEM.COLUMNS.SUB_CATEGORY]: sub_cat_id,
  //           [ITEM.COLUMNS.CATID]: cat_id,
  //         });
  //     })
  //     .where({
  //       [BARCODE_LIST.COLUMNS.OUTLET_ID]: outlet_id,
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
  //     .andWhere({
  //       [BARCODE_LIST.COLUMNS.IS_MISSED]: false,
  //     })
  //     .andWhereRaw(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} < DATE_TRUNC('month', CURRENT_DATE) 
  //     OR ${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} >= DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'`)
  //     .leftJoin(`${ITEM.NAME}`, `${ITEM.NAME}.${ITEM.COLUMNS.ID}`, `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`)
  //     .leftJoin(`${SUB_CATEGORY.NAME}`, `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`, `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`)
  //     .leftJoin(`${MAIN_CATEGORY.NAME}`, `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`, `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`)
  //     .groupBy(
  //       `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
  //       `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
  //     );
  //   logQuery({
  //     logger: fastify.log,
  //     query,
  //     context: "Get Count barcode",
  //     logTrace
  //   });

  //   const response = await query

  //   return response[0];
  // }

  async function getClosingStockTempDetails({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { cat_id, sub_cat_id, outlet_id } = body;

    const query = knex
      .select([
        `${CLOSING_STOCK_TEMP.NAME}.*`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE} as outlet_code`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_shortname`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_fullname`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANCODE} `,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME} `,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SHORT_NAME} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} `
      ])
      .from(`${CLOSING_STOCK_TEMP.NAME} as ${CLOSING_STOCK_TEMP.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${CLOSING_STOCK_TEMP.NAME}.${CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
        `${CLOSING_STOCK_TEMP.NAME}.${CLOSING_STOCK_TEMP.COLUMNS.SALES_MAN_ID}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`
      )
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${CLOSING_STOCK_TEMP.NAME}.${CLOSING_STOCK_TEMP.COLUMNS.PROD_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .where(
        `${CLOSING_STOCK_TEMP.NAME}.${CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID}`,
        outlet_id
      )
      .where(
        `${CLOSING_STOCK_TEMP.NAME}.${CLOSING_STOCK_TEMP.COLUMNS.CAT_ID}`,
        cat_id
      )

    if (sub_cat_id != 0) {
      query.where(
        `${CLOSING_STOCK_TEMP.NAME}.${CLOSING_STOCK_TEMP.COLUMNS.SUB_CAT_ID}`,
        sub_cat_id
      );
    }

    const response = await query

    return response;
  }

  async function postClosingStockTemp({ params, body, logTrace, userDetails }) {
    const knex = this;

    var prod_id = body.prod_id
    var barcode = body.barcode
    var outlet_id = body.outlet_id
    var sales_man_id = body.sales_man_id
    var cat_id = body.cat_id
    var sub_cat_id = body.sub_cat_id

    var closing_stock_Temp_data = {
      prod_id: prod_id,
      barcode: barcode,
      cat_id: cat_id,
      sub_cat_id: sub_cat_id,
      outlet_id: outlet_id,
      sales_man_id: sales_man_id
    }

    // console.log(closing_stock_Temp_data, "closing_stock_Temp_data");

    const barcodeListQuery = knex(BARCODE_LIST.NAME)
      .where({
        [BARCODE_LIST.COLUMNS.BARCODE]: closing_stock_Temp_data.barcode,
        [BARCODE_LIST.COLUMNS.PROD_ID]: closing_stock_Temp_data.prod_id,
        [BARCODE_LIST.COLUMNS.OUTLET_ID]: closing_stock_Temp_data.outlet_id,
        [BARCODE_LIST.COLUMNS.IS_VERIFIED]: 1,
        // [BARCODE_LIST.COLUMNS.IS_MISSED]: false,

      });

    const existsBarcodeList = await barcodeListQuery;

    if (existsBarcodeList.length > 0) {
      const updated_at = existsBarcodeList[0].updated_at;


      const isCurrentMonth = (date) => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();

        const createdDate = new Date(date);
        return createdDate.getMonth() === month && createdDate.getFullYear() === year;
      };


      if (!isCurrentMonth(updated_at)) {
        const closingStockTempQuery = knex(CLOSING_STOCK_TEMP.NAME)
          .where({
            [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: closing_stock_Temp_data.barcode,
            [CLOSING_STOCK_TEMP.COLUMNS.CAT_ID]: closing_stock_Temp_data.cat_id,
            [CLOSING_STOCK_TEMP.COLUMNS.SUB_CAT_ID]: closing_stock_Temp_data.sub_cat_id,
          })

        const existsResponseStockTemp = await closingStockTempQuery;

        console.log(existsResponseStockTemp.length, "existsResponseStockTemp.length");

        if (existsResponseStockTemp.length === 0) {

          var closing_stock_insert_new = await knex(`${CLOSING_STOCK_TEMP.NAME}`).insert({
            [CLOSING_STOCK_TEMP.COLUMNS.PROD_ID]: closing_stock_Temp_data.prod_id,
            [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: closing_stock_Temp_data.barcode,
            [CLOSING_STOCK_TEMP.COLUMNS.CAT_ID]: closing_stock_Temp_data.cat_id,
            [CLOSING_STOCK_TEMP.COLUMNS.SUB_CAT_ID]: closing_stock_Temp_data.sub_cat_id,
            [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: closing_stock_Temp_data.outlet_id,
            [CLOSING_STOCK_TEMP.COLUMNS.SALES_MAN_ID]: closing_stock_Temp_data.sales_man_id
          });
        }
        else {

          var closing_stock_update = await knex(`${CLOSING_STOCK_TEMP.NAME}`)
            .update({
              [CLOSING_STOCK_TEMP.COLUMNS.PROD_ID]: closing_stock_Temp_data.prod_id,
              [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: closing_stock_Temp_data.barcode,
              [CLOSING_STOCK_TEMP.COLUMNS.CAT_ID]: closing_stock_Temp_data.cat_id,
              [CLOSING_STOCK_TEMP.COLUMNS.SUB_CAT_ID]: closing_stock_Temp_data.sub_cat_id,
              [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: closing_stock_Temp_data.outlet_id,
              [CLOSING_STOCK_TEMP.COLUMNS.SALES_MAN_ID]: closing_stock_Temp_data.sales_man_id
            })
            .where({
              [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: closing_stock_Temp_data.barcode,
              [CLOSING_STOCK_TEMP.COLUMNS.CAT_ID]: closing_stock_Temp_data.cat_id,
              [CLOSING_STOCK_TEMP.COLUMNS.SUB_CAT_ID]: closing_stock_Temp_data.sub_cat_id,
            })

        }
      } else {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "This is current month data",
          property: "",
          code: "NOT_FOUND"
        });
      }
    }
    else {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Barcode not verified",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const query = await knex(BARCODE_LIST.NAME)
      .select(
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as prod_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
      )
      .leftJoin(
        ITEM.NAME,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        '=',
        `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`
      )
      .where(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`, closing_stock_Temp_data.barcode)


    const data = query[0]



    return { data, success: true };

  }

  async function deleteClosingStockTemp({ params, body, logTrace, userDetails }) {
    const knex = this;


    var prod_id = body.prod_id
    var barcode = body.barcode



    const closingStockTempQuery = knex(CLOSING_STOCK_TEMP.NAME)
      .where({
        [CLOSING_STOCK_TEMP.COLUMNS.PROD_ID]: prod_id,
        [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: barcode

      })

    const existsResponseStockTemp = await closingStockTempQuery;

    console.log(existsResponseStockTemp, "existsResponseStockTemp");


    if (existsResponseStockTemp.length != 0) {

      var closing_stock_delete = await knex(`${CLOSING_STOCK_TEMP.NAME}`)
        .where({
          [CLOSING_STOCK_TEMP.COLUMNS.PROD_ID]: prod_id,
          [CLOSING_STOCK_TEMP.COLUMNS.BARCODE]: barcode,

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

  async function deleteAllClosingStockTemp({ params, body, logTrace, userDetails }) {
    const knex = this;


    // var prod_id = body.prod_id
    var outlet_id = body.outlet_id
    var cat_id = body.cat_id
    var sub_cat_id = body.sub_cat_id



    const closingStockTempQuery = knex(CLOSING_STOCK_TEMP.NAME)
      .where({
        [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
        [CLOSING_STOCK_TEMP.COLUMNS.CAT_ID]: cat_id,
        // [CLOSING_STOCK_TEMP.COLUMNS.SUB_CAT_ID]: sub_cat_id

      })

    const existsResponseStockTemp = await closingStockTempQuery;


    if (existsResponseStockTemp.length != 0) {

      var closing_stock_delete = await knex(`${CLOSING_STOCK_TEMP.NAME}`)
        .where({
          [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
          [CLOSING_STOCK_TEMP.COLUMNS.CAT_ID]: cat_id,
          // [CLOSING_STOCK_TEMP.COLUMNS.SUB_CAT_ID]: sub_cat_id

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


  async function deleteAllClosingStockOutlet({ params, body, logTrace, userDetails }) {
    const knex = this;


    var outlet_id = body.outlet_id

    const closingStockTempQuery = knex(CLOSING_STOCK_OUTLET.NAME)
      .where({
        [CLOSING_STOCK_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,

      })

    const existsResponseStockTemp = await closingStockTempQuery;


    if (existsResponseStockTemp.length != 0) {

      var closing_stock_delete = await knex(`${CLOSING_STOCK_OUTLET.NAME}`)
        .where({
          [CLOSING_STOCK_TEMP.COLUMNS.OUTLET_ID]: outlet_id,

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

  async function deleteAllMissingStock({ params, body, logTrace, userDetails }) {
    const knex = this;


    var outlet_id = body.outlet_id

    const closingStockTempQuery = knex(MISSING_STOCKS.NAME)
      .where({
        [MISSING_STOCKS.COLUMNS.OUTLET_ID]: outlet_id,

      })

    const existsResponseStockTemp = await closingStockTempQuery;


    if (existsResponseStockTemp.length != 0) {

      var closing_stock_delete = await knex(`${MISSING_STOCKS.NAME}`)
        .where({
          [MISSING_STOCKS.COLUMNS.OUTLET_ID]: outlet_id,

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
    postClosingStock,
    postClosingStockCount,
    postClosingStockTemp,
    getClosingStockTempDetails,
    deleteClosingStockTemp,
    deleteAllClosingStockTemp,
    deleteAllClosingStockOutlet,
    deleteAllMissingStock,
    postAvailableStockCount
  };
}


module.exports = ClosingStockRepo;
