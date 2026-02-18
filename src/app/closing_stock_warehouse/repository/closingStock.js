const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { CLOSING_STOCK_TEMP_W } = require("../../../app/closing_stock_warehouse/commons/constants");
const { MAIN_CATEGORY, SUB_CATEGORY } = require("../../catalog/category/commons/constants");
const { ITEM, SALESMAN } = require("../../catalog/commons");
const { BARCODE_LIST } = require("../../accounts/barcode/commons/constant")


function ClosingStockRepo(fastify) {


  async function postClosingStockCountW({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { cat_id, sub_cat_id } = body;

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
      .andWhere({
        [BARCODE_LIST.COLUMNS.IS_CLOSED]: 0,
      })
      .andWhere({
        [BARCODE_LIST.COLUMNS.IS_SOLD]: false,
      })
      .andWhereRaw(`${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} < DATE_TRUNC('month', CURRENT_DATE) 
        OR ${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.UPDATED_AT} >= DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'`)

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

  async function getClosingStockTempDetailsW({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { cat_id, sub_cat_id } = body;

    const query = knex
      .select([
        `${CLOSING_STOCK_TEMP_W.NAME}.*`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANCODE} `,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME} `,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SHORT_NAME} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} `,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} `
      ])
      .from(`${CLOSING_STOCK_TEMP_W.NAME} as ${CLOSING_STOCK_TEMP_W.NAME}`)
      .leftJoin(
        `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
        `${CLOSING_STOCK_TEMP_W.NAME}.${CLOSING_STOCK_TEMP_W.COLUMNS.SALES_MAN_ID}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`
      )
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${CLOSING_STOCK_TEMP_W.NAME}.${CLOSING_STOCK_TEMP_W.COLUMNS.PROD_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .where(
        `${CLOSING_STOCK_TEMP_W.NAME}.${CLOSING_STOCK_TEMP_W.COLUMNS.CAT_ID}`,
        cat_id
      )
      .where(
        `${CLOSING_STOCK_TEMP_W.NAME}.${CLOSING_STOCK_TEMP_W.COLUMNS.SUB_CAT_ID}`,
        sub_cat_id
      )




    const response = await query

    // if (response.length == 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_FOUND,
    //     message: "Prod_id Not Found",
    //     property: "",
    //     code: "NOT_FOUND"
    //   });
    // }

    return response;
  }

  async function postClosingStockTempW({ params, body, logTrace, userDetails }) {
    const knex = this;

    const prod_id = body.prod_id;
    const barcode = body.barcode;
    const sales_man_id = body.sales_man_id;
    const cat_id = body.cat_id;
    const sub_cat_id = body.sub_cat_id;

    const closing_stock_Temp_data = {
      prod_id: prod_id,
      barcode: barcode,
      cat_id: cat_id,
      sub_cat_id: sub_cat_id,
      sales_man_id: sales_man_id
    };

    const barcodeListQuery = knex(BARCODE_LIST.NAME)
      .where({
        [BARCODE_LIST.COLUMNS.BARCODE]: closing_stock_Temp_data.barcode,
        [BARCODE_LIST.COLUMNS.PROD_ID]: closing_stock_Temp_data.prod_id
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
        const closingStockTempQuery = knex(CLOSING_STOCK_TEMP_W.NAME)
          .where({
            [CLOSING_STOCK_TEMP_W.COLUMNS.BARCODE]: closing_stock_Temp_data.barcode,
            [CLOSING_STOCK_TEMP_W.COLUMNS.CAT_ID]: closing_stock_Temp_data.cat_id,
            [CLOSING_STOCK_TEMP_W.COLUMNS.SUB_CAT_ID]: closing_stock_Temp_data.sub_cat_id,
          });

        const existsResponseStockTemp = await closingStockTempQuery;

        if (existsResponseStockTemp.length === 0) {
          await knex(`${CLOSING_STOCK_TEMP_W.NAME}`).insert({
            [CLOSING_STOCK_TEMP_W.COLUMNS.PROD_ID]: closing_stock_Temp_data.prod_id,
            [CLOSING_STOCK_TEMP_W.COLUMNS.BARCODE]: closing_stock_Temp_data.barcode,
            [CLOSING_STOCK_TEMP_W.COLUMNS.CAT_ID]: closing_stock_Temp_data.cat_id,
            [CLOSING_STOCK_TEMP_W.COLUMNS.SUB_CAT_ID]: closing_stock_Temp_data.sub_cat_id,
            [CLOSING_STOCK_TEMP_W.COLUMNS.SALES_MAN_ID]: closing_stock_Temp_data.sales_man_id
          });
        } else {
          await knex(`${CLOSING_STOCK_TEMP_W.NAME}`)
            .update({
              [CLOSING_STOCK_TEMP_W.COLUMNS.PROD_ID]: closing_stock_Temp_data.prod_id,
              [CLOSING_STOCK_TEMP_W.COLUMNS.BARCODE]: closing_stock_Temp_data.barcode,
              [CLOSING_STOCK_TEMP_W.COLUMNS.CAT_ID]: closing_stock_Temp_data.cat_id,
              [CLOSING_STOCK_TEMP_W.COLUMNS.SUB_CAT_ID]: closing_stock_Temp_data.sub_cat_id,
              [CLOSING_STOCK_TEMP_W.COLUMNS.SALES_MAN_ID]: closing_stock_Temp_data.sales_man_id
            })
            .where({
              [CLOSING_STOCK_TEMP_W.COLUMNS.BARCODE]: closing_stock_Temp_data.barcode,
              [CLOSING_STOCK_TEMP_W.COLUMNS.CAT_ID]: closing_stock_Temp_data.cat_id,
              [CLOSING_STOCK_TEMP_W.COLUMNS.SUB_CAT_ID]: closing_stock_Temp_data.sub_cat_id,
            });
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
    return { success: true };
  }


  async function deleteClosingStockTempW({ params, body, logTrace, userDetails }) {
    const knex = this;


    var prod_id = body.prod_id
    var barcode = body.barcode



    const closingStockTempQuery = knex(CLOSING_STOCK_TEMP_W.NAME)
      .where({
        [CLOSING_STOCK_TEMP_W.COLUMNS.PROD_ID]: prod_id,
        [CLOSING_STOCK_TEMP_W.COLUMNS.BARCODE]: barcode

      })

    const existsResponseStockTemp = await closingStockTempQuery;

    console.log(existsResponseStockTemp, "existsResponseStockTemp");


    if (existsResponseStockTemp.length != 0) {

      var closing_stock_delete = await knex(`${CLOSING_STOCK_TEMP_W.NAME}`)
        .where({
          [CLOSING_STOCK_TEMP_W.COLUMNS.PROD_ID]: prod_id,
          [CLOSING_STOCK_TEMP_W.COLUMNS.BARCODE]: barcode,

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

  async function deleteAllClosingStockTempW({ params, body, logTrace, userDetails }) {
    const knex = this;


    var cat_id = body.cat_id
    var sub_cat_id = body.sub_cat_id



    const closingStockTempQuery = knex(CLOSING_STOCK_TEMP_W.NAME)
      .where({
        [CLOSING_STOCK_TEMP_W.COLUMNS.CAT_ID]: cat_id,
        [CLOSING_STOCK_TEMP_W.COLUMNS.SUB_CAT_ID]: sub_cat_id

      })

    const existsResponseStockTemp = await closingStockTempQuery;

    // console.log(existsResponseStockTemp, "existsResponseStockTemp");


    if (existsResponseStockTemp.length != 0) {

      var closing_stock_delete = await knex(`${CLOSING_STOCK_TEMP_W.NAME}`)
        .where({
          [CLOSING_STOCK_TEMP_W.COLUMNS.CAT_ID]: cat_id,
          [CLOSING_STOCK_TEMP_W.COLUMNS.SUB_CAT_ID]: sub_cat_id

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
    postClosingStockCountW,
    postClosingStockTempW,
    getClosingStockTempDetailsW,
    deleteClosingStockTempW,
    deleteAllClosingStockTempW
  };
}


module.exports = ClosingStockRepo;
