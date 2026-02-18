// const { StatusCodes } = require("http-status-codes");
// const { CustomError } = require("../../../errorHandler");
// const { logQuery } = require("../../../commons/helpers");
// const { SALESMASTER, SALESDETAILS } = require("../../../sales/commons");
// const {
//   MAIN_CATEGORY
// } = require("../../../catalog/category/commons/constants");
// const { SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
// const { UNITS } = require("../../../catalog/units/commons/constants");
// const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
// const { OUTLETTYPE } = require("../../../accounts/outlets/commons/constants");
// const { STATES } = require("../../../masterData/commons/constants");
// const { CITIES } = require("../../../masterData/commons/constants");
// const { COUNTRIES } = require("../../../masterData/commons/constants");
// const { ITEM } = require("../../../catalog/commons");
// const { HEADS } = require("../../../catalog/commons");
// const { TYPEDESIGN } = require("../../../catalog/commons");

// function salesRepo(fastify) {
//   async function getSalesReport({ body, params, logTrace }) {
//     const knex = this;
//     const query = knex
//       .select([
//         `${SALESMASTER.NAME}.*`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD1}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD2}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ADD4}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PINCODE}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.PHONE}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.MOBILE}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.EMAIL}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.WEBSITE}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.GSTIN}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FSSAI}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKACNO}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKNAME}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ACNAME}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IFSCCODE}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ISGST}`,
//         `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.OUTLETTYPE} as outlet_type_name`,
//         `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
//         `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
//         `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
//       ])
//       .from(`${SALESMASTER.NAME} as ${SALESMASTER.NAME}`)
//       .leftJoin(
//         `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
//         `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
//       )
//       .leftJoin(
//         `${STATES.NAME} as ${STATES.NAME}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE}`,
//         `${STATES.NAME}.${STATES.COLUMNS.ID}`
//       )
//       .leftJoin(
//         `${CITIES.NAME} as ${CITIES.NAME}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY}`,
//         `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
//       )
//       .leftJoin(
//         `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY}`,
//         `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
//       )
//       .leftJoin(
//         `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
//         `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
//         `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
//       )
//       .whereRaw(
//         `DATE(${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.DOCDATE}) >= ?`,
//         [body.from_date]
//       )
//       .whereRaw(
//         `DATE(${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.DOCDATE}) <= ?`,
//         [body.to_date]
//       );

//     // Conditionally add filters based on provided parameters
//     if (body.customer && body.customer !== 0) {
//       query.where(
//         `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
//         body.customer
//       );
//     }

//     logQuery({
//       logger: fastify.log,
//       query,
//       context: "Get Sales",
//       logTrace
//     });
//     const response = await query;
//     if (!response.length) {
//       throw CustomError.create({
//         httpCode: StatusCodes.NOT_FOUND,
//         message: "Sales data not found",
//         property: "",
//         code: "NOT_FOUND"
//       });
//     }

//     const salesdetails = await Promise.all(
//       response.map(async sales => {
//         const sales_lines = await knex
//           .select([
//             `${SALESDETAILS.NAME}.*`,
//             `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
//             `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
//             `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
//             `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
//             `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
//             `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
//             `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
//           ])
//           .from(`${SALESDETAILS.NAME} as ${SALESDETAILS.NAME}`)
//           .leftJoin(
//             `${ITEM.NAME} as ${ITEM.NAME}`,
//             `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
//             `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
//           )
//           .leftJoin(
//             `${UNITS.NAME} as ${UNITS.NAME}`,
//             `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.UOM_ID}`,
//             `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
//           )
//           .leftJoin(
//             `${HEADS.NAME} as ${HEADS.NAME}`,
//             `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.HEAD_ID}`,
//             `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
//           )
//           .leftJoin(
//             `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
//             `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.TYPE_ID}`,
//             `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
//           )
//           .leftJoin(
//             `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
//             `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
//             `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
//           )
//           .leftJoin(
//             `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
//             `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
//             `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
//           )
//           .where(
//             `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SALES_MST_ID}`,
//             sales.id
//           );

//         return { ...sales, sales_lines };
//       })
//     );

//     return salesdetails;
//   }
//   async function getSalesItemwiseReport({ body, params, logTrace }) {
//     const knex = this;

//     const query = knex(SALESDETAILS.NAME)
//       .select(
//         knex.raw("prodid"),
//         knex.raw("sum(qty) as qty"),
//         knex.raw("round(sum((rate - rate*dis_per/100)*qty), 2) as amount"),
//         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
//         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
//       )
//       .join(`${ITEM.NAME} as ${ITEM.NAME}`,
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
//         `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)

//       .join(`${SALESMASTER.NAME} as ${SALESMASTER.NAME}`,
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SALES_MST_ID}`,
//         `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.ID}`)

//       .whereRaw(
//         `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
//         [body.from_date]
//       )
//       .whereRaw(
//         `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
//         [body.to_date]
//       )
//       .groupBy(
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
//         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
//         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
//       );

//     // Conditionally add filters based on provided parameters
//     if (body.customer && body.customer !== 0) {
//       query.where(
//         `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
//         body.customer
//       );
//     }
//     if (body.category && body.category !== 0) {
//       query.where(
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
//         body.category
//       );
//     }
//     if (body.subcategory && body.subcategory !== 0) {
//       query.where(
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
//         body.subcategory
//       );
//     }

//     logQuery({
//       logger: fastify.log,
//       query,
//       context: "Get Itemwise sales",
//       logTrace
//     });

//     const response = await query;

//     if (!response.length) {
//       throw CustomError.create({
//         httpCode: StatusCodes.NOT_FOUND,
//         message: "Sales not found",
//         property: "",
//         code: "NOT_FOUND"
//       });
//     }

//     return response;
//   }
//   async function getSalesItemwiseBreakupReport({ body, params, logTrace }) {
//     const knex = this;

//     const query = knex(SALESDETAILS.NAME)
//       .select(
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`,
//         knex.raw("sum(qty) as qty"),
//         knex.raw("round(sum((rate - rate*dis_per/100)*qty), 2) as amount"),
//         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
//         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
//       )
//       .join(`${ITEM.NAME} as ${ITEM.NAME}`,
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
//         `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)

//       .join(`${SALESMASTER.NAME} as ${SALESMASTER.NAME}`,
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SALES_MST_ID}`,
//         `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.ID}`)

//       .whereRaw(
//         `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
//         [body.from_date]
//       )
//       .whereRaw(
//         `DATE(${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
//         [body.to_date]
//       )
//       .orderBy(`${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`, "DESC")
//       .groupBy(
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
//         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
//         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`,
//       );

//     // Conditionally add filters based on provided parameters
//     if (body.customer && body.customer !== 0) {
//       query.where(
//         `${SALESMASTER.NAME}.${SALESMASTER.COLUMNS.PARTYCODE}`,
//         body.customer
//       );
//     }
//     if (body.category && body.category !== 0) {
//       query.where(
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.CAT_ID}`,
//         body.category
//       );
//     }
//     if (body.subcategory && body.subcategory !== 0) {
//       query.where(
//         `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.SUBCAT_ID}`,
//         body.subcategory
//       );
//     }

//     logQuery({
//       logger: fastify.log,
//       query,
//       context: "Get Itemwise sales",
//       logTrace
//     });

//     const response = await query;

//     if (!response.length) {
//       throw CustomError.create({
//         httpCode: StatusCodes.NOT_FOUND,
//         message: "Sales not found",
//         property: "",
//         code: "NOT_FOUND"
//       });
//     }

//     return response;
//   }
//   return {
//     getSalesReport,
//     getSalesItemwiseReport,
//     getSalesItemwiseBreakupReport
//   };
// }

// module.exports = salesRepo;


const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { EXPENCE_LEDGER } = require("../../../expenses/expence/commons/constants")
const { HEADS, ACCOUNTMASTER } = require("../../../catalog/commons");




function expenceLedgerRepo(fastify) {
  async function getexpenceLedger({ body, params, logTrace }) {
    const knex = this;
    const query = knex(EXPENCE_LEDGER.NAME)
      .select(
        knex.raw("TO_CHAR(created_at, 'Mon') AS month"),
        knex.raw("EXTRACT(month FROM created_at) AS month_number"),
        knex.raw("EXTRACT(year FROM created_at) AS year"),
        knex.raw("COUNT(*) AS no_of_acc_id"),
        knex.raw("SUM(amount) AS amount"),
      )
      .from("expense_ledger")
      .where(function () {
        this.whereRaw("EXTRACT(year FROM created_at) >= ?", params.from_year)
          .andWhereRaw("EXTRACT(year FROM created_at) <= ?", params.to_year);
      })
      .groupByRaw("TO_CHAR(created_at, 'Mon'), EXTRACT(year FROM created_at), EXTRACT(month FROM created_at)")
      .orderByRaw("year, month_number");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Sales",
      logTrace
    });
    const response = await query;
    console.log(response, "response");


    return response



  }

  async function getexpenceLedgerByMonth({ params, logTrace }) {
    const knex = this;

    const query = knex(EXPENCE_LEDGER.NAME)
      .select(
        knex.raw("DATE(expense_ledger.created_at) AS date"),
        knex.raw("COUNT(*) AS no_of_acc_id"),
        knex.raw("SUM(amount) AS amount"),
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME} as account_name`
      )
      .from(EXPENCE_LEDGER.NAME)
      .leftJoin(
        ACCOUNTMASTER.NAME,
        `${EXPENCE_LEDGER.NAME}.${EXPENCE_LEDGER.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`
      )
      .where(knex.raw("TO_CHAR(expense_ledger.created_at, 'Mon')  = ?", params.month))
      .where(knex.raw("EXTRACT(year FROM expense_ledger.created_at) = ?", params.year))
      .groupByRaw("DATE(expense_ledger.created_at), accountmaster.acname")
      .orderByRaw("DATE(expense_ledger.created_at)");


    logQuery({
      logger: fastify.log,
      query,
      context: "Get sales month sales",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Order not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  // async function getExpenceLedgerPaginateByDate({
  //   params,
  //   logTrace,
  //   page_size,
  //   current_page
  // }) {
  //   const knex = this;
  //   const query = knex
  //     .select([
  //       `${EXPENCE_LEDGER.NAME}.*`,
  //     ])
  //     .from(`${EXPENCE_LEDGER.NAME} as ${EXPENCE_LEDGER.NAME}`)
  //     .whereRaw(
  //       `DATE(${EXPENCE_LEDGER.NAME}.${EXPENCE_LEDGER.COLUMNS.CREATED_AT}) >= ?`,
  //       [params.date]
  //     )
  //     .whereRaw(
  //       `DATE(${EXPENCE_LEDGER.NAME}.${EXPENCE_LEDGER.COLUMNS.CREATED_AT}) <= ?`,
  //       [params.date]
  //     );


  //   logQuery({
  //     logger: fastify.log,
  //     query,
  //     context: "Get Sales",
  //     logTrace
  //   });


  //   const response = await query.paginate({
  //     pageSize: page_size, // Customize as needed
  //     currentPage: current_page // Customize as needed
  //   });
  //   if (response.meta.pagination.total_pages < current_page) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_ACCEPTABLE,
  //       message: "Requested page is beyond the available data",
  //       property: "",
  //       code: "NOT_ACCEPTABLE"
  //     });
  //   }
  //   if (!response.data.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "Sales not found",
  //       property: "",
  //       code: "NOT_FOUND"
  //     });
  //   }


  //   return {
  //     meta: response.meta
  //   };



  // }

  async function getExpenceLedgerPaginateByDate({
    params,
    logTrace,
    page_size,
    current_page
  }) {
    const knex = this;

    const date = params.date;

    const query = knex
      .select([
        `${EXPENCE_LEDGER.NAME}.*`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ACNAME} as account_name`

      ])
      .from(`${EXPENCE_LEDGER.NAME} as ${EXPENCE_LEDGER.NAME}`)
      .leftJoin(
        ACCOUNTMASTER.NAME,
        `${EXPENCE_LEDGER.NAME}.${EXPENCE_LEDGER.COLUMNS.ACC_ID}`,
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.ID}`
      )
      .whereRaw(
        `DATE(${EXPENCE_LEDGER.NAME}.${EXPENCE_LEDGER.COLUMNS.CREATED_AT}) = ?`,
        [date]
      );

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Expences Ledger",
      logTrace
    });

    const response = await query.paginate({
      pageSize: page_size,
      currentPage: current_page
    });

    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Expences Ledger not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }



  return {
    getexpenceLedger,
    getexpenceLedgerByMonth,
    getExpenceLedgerPaginateByDate
  };
}

module.exports = expenceLedgerRepo;