const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");

const { CLOSINGSTOCK_W } = require("../../../reports/closing_stock_outlet/commons");
const { CLOSINGSTOCK } = require("../../../closing_stock _outlet/commons");

const { ITEM, SALESMAN, BARCODE_LIST } = require("../../../catalog/commons");
// const { CLOSING_STOCK_TEMP_W } = require("../../../closing_stock_warehouse/commons/constants");


const { MAIN_CATEGORY, SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");


function getClosingStockOutletRepo(fastify) {

  // async function postClosingStockOutlet({ params, body, logTrace, userDetails }) {
  //   const knex = this;

  //   const query = knex
  //     .select([
  //       // `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.ID}`,
  //       `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.DOCDATE}`,
  //       // `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
  //       `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.BARCODE}`,
  //       `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`,
  //       `mc.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as category_name`,
  //       `sc.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as subcategory_name`,
  //       knex.raw(`COUNT(${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.ID}) as item_count`)
  //     ])
  //     .from(`${CLOSINGSTOCK.NAME} as ${CLOSINGSTOCK.NAME}`)
  //     .join(
  //       `${ITEM.NAME} as ${ITEM.NAME}`,
  //       `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.PRODID}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
  //     )
  //     .join(
  //       `${MAIN_CATEGORY.NAME} as mc`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
  //       `mc.${MAIN_CATEGORY.COLUMNS.ID}`
  //     )
  //     .join(
  //       `${SUB_CATEGORY.NAME} as sc`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
  //       `sc.${SUB_CATEGORY.COLUMNS.ID}`
  //     )
  //     .join(
  //       `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
  //       `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.OUTLET_ID}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
  //     )
  //     .join(
  //       `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
  //       `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.UID}`,
  //       `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`
  //     )

  //     .whereRaw(
  //       `DATE(${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.DOCDATE}) >= ?`,
  //       [body.from_date]
  //     )
  //     .whereRaw(
  //       `DATE(${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.DOCDATE}) <= ?`,
  //       [body.to_date]
  //     )
  //     .groupBy([
  //       // `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.ID}`,
  //       `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.DOCDATE}`,
  //       // `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
  //       `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.BARCODE}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
  //       `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`,
  //       'mc.category_name',
  //       'sc.subcategory_name'
  //     ])
  //     .orderBy(['mc.category_name', 'sc.subcategory_name']);

  //   if (body.outlet && body.outlet !== 0) {
  //     query.where(
  //       `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.OUTLET_ID}`,
  //       body.outlet
  //     );
  //   }

  //   if (body.category_id && body.category_id !== 0) {
  //     query.where(
  //       `mc.${MAIN_CATEGORY.COLUMNS.ID}`,
  //       body.category_id
  //     );
  //   }

  //   if (body.subcategory_id && body.subcategory_id !== 0) {
  //     query.where(
  //       `sc.${SUB_CATEGORY.COLUMNS.ID}`,
  //       body.subcategory_id
  //     );
  //   }



  //   logQuery({
  //     logger: fastify.log,
  //     query,
  //     context: "Get Closing Stock Outlet",
  //     logTrace
  //   });

  //   const response = await query;

  //   if (!response.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "Closing Stock Outlet Data Not Found",
  //       property: "",
  //       code: "NOT_FOUND"
  //     });
  //   }
  //   console.log(response, "response for closing stock");


  //   const salesdetails = await Promise.all(
  //     response.map(async sales => {
  //       const sales_lines = await knex
  //         .select([
  //           // `${BARCODE_LIST.NAME}.`,
  //           `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
  //           `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
  //           `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
  //           `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
  //           // `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
  //           // `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
  //           // `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
  //           `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
  //           `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
  //         ])
  //         .from(`${BARCODE_LIST.NAME} as ${BARCODE_LIST.NAME}`)
  //         .leftJoin(
  //           `${ITEM.NAME} as ${ITEM.NAME}`,
  //           `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`,
  //           `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
  //         )
  //         .leftJoin(
  //           `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
  //           `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
  //           `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
  //         )
  //         .leftJoin(
  //           `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
  //           `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
  //           `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
  //         )
  //         .where(
  //           `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
  //           sales.barcode
  //         );

  //       return { ...sales, sales_lines };
  //     })
  //   );


  //   return salesdetails

  // }

  async function postClosingStockOutlet({ params, body, logTrace, userDetails }) {
    const knex = this;

    const query = knex
      .select([
        `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.DOCDATE} as docdate`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as fullname`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME} as sales_man_name`,
        `mc.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as category_name`,
        `sc.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as subcategory_name`,
        knex.raw(`COUNT(${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.ID}) as item_count`),
        // knex.raw(`SUM(${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.MRP}) as total`),
        knex.raw(`ARRAY_AGG(${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.BARCODE}) as barcodes`)
      ])
      .from(`${CLOSINGSTOCK.NAME} as ${CLOSINGSTOCK.NAME}`)
      .join(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .join(
        `${MAIN_CATEGORY.NAME} as mc`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
        `mc.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .join(
        `${SUB_CATEGORY.NAME} as sc`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        `sc.${SUB_CATEGORY.COLUMNS.ID}`
      )
      .join(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .join(
        `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
        `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.UID}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`
      )
      .whereRaw(
        `DATE(${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .groupBy([
        `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.DOCDATE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`,
        `mc.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `sc.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
      ])
      .orderBy(['mc.category_name', 'sc.subcategory_name']);
    // .orderBy([
    //   { column: `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.ID}`, order: 'desc' },
    //   { column: 'mc.category_name', order: 'asc' },
    //   { column: 'sc.subcategory_name', order: 'asc' }
    // ])


    if (body.outlet && body.outlet !== 0) {
      query.where(
        `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.OUTLET_ID}`,
        body.outlet
      );
    }

    if (body.category_id && body.category_id !== 0) {
      query.where(
        `mc.${MAIN_CATEGORY.COLUMNS.ID}`,
        body.category_id
      );
    }

    if (body.subcategory_id && body.subcategory_id !== 0) {
      query.where(
        `sc.${SUB_CATEGORY.COLUMNS.ID}`,
        body.subcategory_id
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Closing Stock Outlet",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Closing Stock Outlet Data Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const salesdetails = await Promise.all(
      response.map(async sales => {
        const sales_lines = await knex
          .select([
            `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE} as barcode`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as pro_name`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as pro_code`,
            `${ITEM.NAME}.${ITEM.COLUMNS.MRP} as mrp`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as category_name`,
            `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as subcategory_name`
          ])
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
          .whereIn(
            `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE}`,
            sales.barcodes
          );

        const total_mrp = sales_lines.reduce((sum, line) => sum + parseFloat(line.mrp || 0), 0);

        return { ...sales, sales_lines, total_mrp };

        // return { ...sales, sales_lines };
      })
    );

    return salesdetails;
  }

  async function postClosingStockWarehouse({ params, body, logTrace, userDetails }) {
    const knex = this;

    const query = knex
      .select([
        `${CLOSINGSTOCK_W.NAME}.${CLOSINGSTOCK_W.COLUMNS.DOCDATE}`,
        // `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`,
        `mc.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as category_name`,
        `sc.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME} as subcategory_name`,
        knex.raw(`COUNT(${CLOSINGSTOCK_W.NAME}.${CLOSINGSTOCK_W.COLUMNS.ID}) as item_count`)
      ])
      .from(`${CLOSINGSTOCK_W.NAME} as ${CLOSINGSTOCK_W.NAME}`)
      .join(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${CLOSINGSTOCK_W.NAME}.${CLOSINGSTOCK_W.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .join(
        `${MAIN_CATEGORY.NAME} as mc`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
        `mc.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .join(
        `${SUB_CATEGORY.NAME} as sc`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        `sc.${SUB_CATEGORY.COLUMNS.ID}`
      )
      // .join(
      //   `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
      //   `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.UID}`,
      //   `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`
      // )

      .whereRaw(
        `DATE(${CLOSINGSTOCK_W.NAME}.${CLOSINGSTOCK_W.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${CLOSINGSTOCK_W.NAME}.${CLOSINGSTOCK_W.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .groupBy([
        `${CLOSINGSTOCK_W.NAME}.${CLOSINGSTOCK_W.COLUMNS.DOCDATE}`,
        'mc.category_name',
        'sc.subcategory_name'
      ])
      .orderBy(['mc.category_name', 'sc.subcategory_name']);



    if (body.category_id && body.category_id !== 0) {
      query.where(
        `mc.${MAIN_CATEGORY.COLUMNS.ID}`,
        body.category_id
      );
    }

    if (body.subcategory_id && body.subcategory_id !== 0) {
      query.where(
        `sc.${SUB_CATEGORY.COLUMNS.ID}`,
        body.subcategory_id
      );
    }



    logQuery({
      logger: fastify.log,
      query,
      context: "Get Closing Stock Warehouse",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Closing Stock Warehouse Data Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // const result = [{
    //   category_name: response[0].category_name,
    //   subcategory_name: response[0].subcategory_name,
    //   item_count: response.reduce((total, item) => total + parseInt(item.item_count), 0).toString(),
    //   docdate: response[0].docdate,
    //   fullname: response[0].fullname,
    //   sales_man_name: response[0].sales_man_name,
    // }]

    return response
    // return result

  }

  async function postClosingStockOutletMissing({ params, body, logTrace, userDetails }) {
    var knex = this;

    var outlet_id = body.outlet_id

    const query = knex
      .select([
        `${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.PRODID}`
      ])
      .from(`${CLOSINGSTOCK.NAME} as ${CLOSINGSTOCK.NAME}`)
      .whereRaw(
        `DATE(${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${CLOSINGSTOCK.NAME}.${CLOSINGSTOCK.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .orderBy(CLOSINGSTOCK.COLUMNS.ID, 'desc');

    const prodisRes = await query
    console.log(prodisRes, "prodisRes");

    if (!prodisRes || prodisRes.length == 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        // message: "Closing stock was not found while specific outlet ",
        message: "Data was not found while specific outlet ",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // console.log(prodisRes, 'prodisRes');

    var finalArrayOfBarcode = []

    for (let i = 0; i < prodisRes.length; i++) {
      const prod_id = prodisRes[i].prodid

      // console.log(prod_id, "prod_id");

      const queryCatidSubCatid = knex
        .select([
          `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`
        ])
        .from(`${ITEM.NAME} as ${ITEM.NAME}`)
        .where(ITEM.COLUMNS.ID, prod_id)

      var resCatidSubCatid = await queryCatidSubCatid

      // console.log(resCatidSubCatid, "resCatidSubCatid");


      for (let i = 0; i < resCatidSubCatid.length; i++) {
        const sub_cat = resCatidSubCatid[i].sub_cat
        const cat_id = resCatidSubCatid[i].cat_id


        const queryB = knex('barcode_list as bl')
          .select('bl.barcode', 'i.pro_name', 'mc.category_name', 'sc.subcategory_name', 'i.mrp')
          .leftJoin('item as i', 'bl.prod_id', 'i.id')
          .leftJoin('main_category as mc', 'i.cat_id', 'mc.id')
          .leftJoin('sub_category as sc', 'i.sub_cat', 'sc.id')
          .where('bl.is_sold', false)
          .andWhere('i.cat_id', cat_id)
          .andWhere('i.sub_cat', sub_cat)
          .andWhere('bl.outlet_id', outlet_id)
          .whereNotIn('bl.barcode', function () {
            this.select('cs.barcode')
              .from('closing_stock_outlet as cs')
              .whereIn('cs.prodid', function () {
                this.select('i2.id')
                  .from('item as i2')
                  .where({
                    'i2.cat_id': cat_id,
                    'i2.sub_cat': sub_cat
                  });
              });
          });

        var resBarcode = await queryB

        // console.log(resBarcode, "resBarcode");

      }
      finalArrayOfBarcode.push(resBarcode)
    }

    console.log(finalArrayOfBarcode, "finalArrayOfBarcode");
    console.log(finalArrayOfBarcode.length, "finalArrayOfBarcode");



    if (!finalArrayOfBarcode[0].length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        // message: "No Data",
        message: "Data was not found while specific outlet ",
        property: "",
        code: "NOT_FOUND"
      });
    }



    return finalArrayOfBarcode[0]

  }
  return {
    postClosingStockOutlet,
    postClosingStockOutletMissing,
    postClosingStockWarehouse
  };
}

module.exports = getClosingStockOutletRepo;
