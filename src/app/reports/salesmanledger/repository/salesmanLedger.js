const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SALESMAN } = require("../../../catalog/commons");
const { SALESMANLEDGER, OUTLETS, OUTLETSALESMASTER, OUTLETSALESDETAILS } = require("../../../outlet_sales/outlet_sales_master/commons/constants");


function salesmanRepo(fastify) {


  async function getsalesmanReportGetall({ params, body, logTrace }) {
    const knex = this;

    var from_date = body.from_date;
    var to_date = body.to_date;

    const query = knex
      .select([
        'd.sales_man_code',
        'd.sales_man_name',
        'a.salesman_id',
        'ot.fullname',
        knex.raw('(select count(*) from outlet_sales_master as b where b.salesman_id = a.salesman_id and a.outletid=b.outletid   ) as total_bills'),
        knex.raw('sum(a.sales) as sales'),
        knex.raw('sum(a.return) as return'),
        knex.raw('(sum(a.sales) / (select count(*) from outlet_sales_master as b where b.salesman_id = a.salesman_id  and a.outletid=b.outletid  )) as avg_bills')
      ])
      .from('public.salesman_ledger as a')
      .innerJoin('salesman as d', 'd.id', '=', 'a.salesman_id')
      // .innerJoin('salesman_ledger as o', function () {
      //   this.on('o.salesman_id', '=', 'a.salesman_id')
      //     .andOn(knex.raw('DATE(o.docdate) >= ?', [from_date]))
      //     .andOn(knex.raw('DATE(o.docdate) <= ?', [to_date]))
      // })
      .innerJoin('outlets as ot', 'ot.id', '=', 'a.outletid')
      .where(knex.raw('DATE(a.docdate) >= ?', [from_date]))
      .where(knex.raw('DATE(a.docdate) <= ?', [to_date]))
      .groupBy('d.sales_man_code', 'd.sales_man_name', 'a.salesman_id', 'ot.fullname', 'a.outletid');
    // const query = knex
    //   .select([
    //     'd.sales_man_code',
    //     'd.sales_man_name',
    //     'a.salesman_id',
    //     'ot.fullname',
    //     knex.raw('(select count(*) from outlet_sales_master as b where b.salesman_id = a.salesman_id ) as total_bills'),
    //     knex.raw('sum(a.sales) as sales'),
    //     knex.raw('sum(a.return) as return'),
    //     knex.raw('(sum(a.sales) / (select count(*) from outlet_sales_master as b where b.salesman_id = a.salesman_id )) as avg_bills')
    //   ])
    //   .from('public.salesman_ledger as a')
    //   .leftJoin('salesman as d', 'd.id', '=', 'a.salesman_id')
    //   .leftJoin('salesman_ledger as o', function () {
    //     this.on('o.salesman_id', '=', 'a.salesman_id')
    //       .andOn(knex.raw('DATE(o.docdate) >= ?', [from_date]))
    //       .andOn(knex.raw('DATE(o.docdate) <= ?', [to_date]))
    //   })
    //   .leftJoin('outlets as ot', 'ot.id', '=', 'a.outletid')
    //   .groupBy('d.sales_man_code', 'd.sales_man_name', 'a.salesman_id', 'ot.fullname');



    const response = await query;

    logQuery({
      logger: fastify.log,
      query,
      context: "Salesman Report Get All",
      logTrace
    });
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Salesman Report not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getsalesmanReportGetallNew({ params, body, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as fullname`,
        knex.raw('COUNT(*) as total_bill'),
        knex.raw('SUM(??) as total_amount', [`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.AMOUNT}`]),
        knex.raw('SUM(??) / COUNT(*) as avg_amount', [`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.AMOUNT}`]),
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
      ])
      .from(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .whereRaw(
        `DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}) >= ?`,
        [body.from_date]
      )
      .whereRaw(
        `DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}) <= ?`,
        [body.to_date]
      )
      .groupBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,

      );

    if (body.outlet && body.outlet !== 0 && body.outlet !== "") {
      query.where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        body.outlet
      );
    }

    if (body.salesman && body.salesman !== 0 && body.salesman !== "") {
      query.where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.SALESMAN_ID}`,
        body.salesman
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Salesman report",
      logTrace,
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Salesman report data not found",
        property: "",
        code: "NOT_FOUND",
      });
    }

    console.log(response, "response");


    const salesmandetails = await Promise.all(
      response.map(async salesman => {
        const salesman_lines_query = knex
          .select([
            `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANCODE}`,
            `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`,
            // knex.raw('COUNT(*) as total_bill'),
            knex.raw('COUNT(DISTINCT ??) as total_bill', [`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`]),
            knex.raw('SUM(??) as total_amount', [`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.MRP}`]),
            knex.raw('SUM(??) / COUNT(DISTINCT ??) as salesman_avg_amount', [
              `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.MRP}`,
              `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`
            ])
          ])
          .from(`${OUTLETSALESDETAILS.NAME} as ${OUTLETSALESDETAILS.NAME}`)
          .leftJoin(
            `${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`,
            `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
            `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`
          )
          .leftJoin(
            `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
            `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.SALESMAN_ID}`,
            `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`
          )
          .whereRaw(
            `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) >= ?`,
            [body.from_date]
          )
          .whereRaw(
            `DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) <= ?`,
            [body.to_date]
          )
          .where(
            `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID}`,
            salesman.id
          )
          .groupBy(
            `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANCODE}`,
            `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`
          )

        if (body.salesman && body.salesman !== 0 && body.salesman !== "") {

          salesman_lines_query.where(
            `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.SALESMAN_ID}`,
            body.salesman
          );
        }

        const salesman_lines = await salesman_lines_query;
        return { ...salesman, salesman_lines };
      })
    );

    return salesmandetails;
  }
  //   async function getsalesmanReportGetallNew({ params, body, logTrace }) {
  //     const knex = this;

  //     // Collect where conditions dynamically
  //     const mainQueryConditions = [
  //         knex.raw(`DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}) >= ?`, [body.from_date]),
  //         knex.raw(`DATE(${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}) <= ?`, [body.to_date]),
  //     ];

  //     // Add optional filters
  //     if (body.outlet) {
  //         mainQueryConditions.push(
  //             `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID} = ${Number(body.outlet)}`
  //         );
  //     }

  //     if (body.salesman) {
  //         mainQueryConditions.push(
  //             `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.SALESMAN_ID} = ${Number(body.salesman)}`
  //         );
  //     }

  //     // Build the main query
  //     const query = knex
  //         .select([
  //             `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as fullname`,
  //             knex.raw('COUNT(*) as total_bill'),
  //             knex.raw('SUM(??) as total_amount', [`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.AMOUNT}`]),
  //             knex.raw('SUM(??) / COUNT(*) as avg_amount', [`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.AMOUNT}`]),
  //             `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as id`,
  //         ])
  //         .from(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`)
  //         .leftJoin(
  //             `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
  //             `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
  //             `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
  //         )
  //         .where(mainQueryConditions)
  //         .groupBy(
  //             `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
  //             `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
  //         );

  //     logQuery({
  //         logger: fastify.log,
  //         query,
  //         context: "Get Salesman report",
  //         logTrace,
  //     });

  //     const response = await query;

  //     if (!response.length) {
  //         throw CustomError.create({
  //             httpCode: StatusCodes.NOT_FOUND,
  //             message: "Salesman report data not found",
  //             property: "",
  //             code: "NOT_FOUND",
  //         });
  //     }

  //     // Fetch detailed salesman data for each outlet
  //     const salesmandetails = await Promise.all(
  //         response.map(async (salesman) => {
  //           console.log(salesman,"salesman");

  //             const detailedQueryConditions = [
  //                 knex.raw(`DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) >= ?`, [body.from_date]),
  //                 knex.raw(`DATE(${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}) <= ?`, [body.to_date]),
  //                 `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID} = ${salesman.id}`,
  //             ];

  //             if (body.salesman) {
  //                 detailedQueryConditions.push(
  //                     `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.SALESMAN_ID} = ${Number(body.salesman)}`
  //                 );
  //             }

  //             const salesman_lines_query = knex
  //                 .select([
  //                     `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANCODE} as sales_man_code`,
  //                     `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME} as sales_man_name`,
  //                     knex.raw('COUNT(DISTINCT ??) as total_bill', [`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`]),
  //                     knex.raw('SUM(??) as total_amount', [`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.MRP}`]),
  //                     knex.raw('SUM(??) / COUNT(DISTINCT ??) as salesman_avg_amount', [
  //                         `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.MRP}`,
  //                         `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`
  //                     ]),
  //                 ])
  //                 .from(`${OUTLETSALESDETAILS.NAME} as ${OUTLETSALESDETAILS.NAME}`)
  //                 .leftJoin(
  //                     `${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`,
  //                     `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
  //                     `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`
  //                 )
  //                 .leftJoin(
  //                     `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
  //                     `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.SALESMAN_ID}`,
  //                     `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`
  //                 )
  //                 .where(detailedQueryConditions)
  //                 .groupBy(
  //                     `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANCODE}`,
  //                     `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`
  //                 );

  //             const salesman_lines = await salesman_lines_query;

  //             return { ...salesman, salesman_lines };
  //         })
  //     );

  //     return salesmandetails;
  // }


  async function getsalesmanReport({ params, body, logTrace }) {
    const knex = this;


    var from_date = body.from_date;
    var to_date = body.to_date;

    // var outletid = body.outletid

    const query = knex
      .select([
        'd.sales_man_name',
        'a.salesman_id',
        'c.fullname',
        'a.outletid',
        knex.raw('(select count(*) from outlet_sales_master as b where b.salesman_id = a.salesman_id and a.outletid=b.outletid) as total_bills'),
        knex.raw('sum(a.sales) as sales'),
        knex.raw('sum(a.return) as return'),
        knex.raw('(sum(a.sales) / (select count(*) from outlet_sales_master as b where b.salesman_id = a.salesman_id and a.outletid=b.outletid)) as avg_bills')
      ])
      .from('salesman_ledger as a')
      .innerJoin('outlets as c', 'c.id', '=', 'a.outletid')
      .innerJoin('salesman as d', 'd.id', '=', 'a.salesman_id')
      // .innerJoin('salesman_ledger as o', function () {
      //   this.on('o.salesman_id', '=', 'a.salesman_id')
      //     .andOn(knex.raw('DATE(o.docdate) >= ?', [from_date]))
      //     .andOn(knex.raw('DATE(o.docdate) <= ?', [to_date]))
      // })
      .where(knex.raw('DATE(a.docdate) >= ?', [from_date]))
      .where(knex.raw('DATE(a.docdate) <= ?', [to_date]))
      .groupBy('d.sales_man_name', 'a.salesman_id', 'c.fullname', 'a.outletid');
    // const query = knex
    //   .select([
    //     'd.sales_man_name',
    //     'a.salesman_id',
    //     'c.fullname',
    //     'a.outletid',
    //     knex.raw('(select count(*) from outlet_sales_master as b where b.salesman_id = a.salesman_id) as total_bills'),
    //     knex.raw('sum(a.sales) as sales'),
    //     knex.raw('sum(a.return) as return'),
    //     knex.raw('(sum(a.sales) / (select count(*) from outlet_sales_master as b where b.salesman_id = a.salesman_id)) as avg_bills')
    //   ])
    //   .from('salesman_ledger as a')
    //   .leftJoin('outlets as c', 'c.id', '=', 'a.outletid')
    //   .leftJoin('salesman as d', 'd.id', '=', 'a.salesman_id')
    //   .leftJoin('salesman_ledger as o', function () {
    //     this.on('o.salesman_id', '=', 'a.salesman_id')
    //       .andOn(knex.raw('DATE(o.docdate) >= ?', [from_date]))
    //       .andOn(knex.raw('DATE(o.docdate) <= ?', [to_date]))
    //   })
    //   .groupBy('d.sales_man_name', 'a.salesman_id', 'c.fullname', 'a.outletid');

    if (body.outletid && body.outletid !== 0) {
      query.where('a.outletid', body.outletid);
    }
    if (body.salesman_id && body.salesman_id !== 0) {
      query.where('a.salesman_id', body.salesman_id);
    }



    const response = await query;

    logQuery({
      logger: fastify.log,
      query,
      context: "Salesman Report Get One",
      logTrace
    });
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Salesman Report  not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getsalesmanLedger({ params, body, logTrace }) {
    const knex = this;

    var from_date = body.from_date;
    var to_date = body.to_date;

    const query = knex
      .select([
        `${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.SALESMAN_ID}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME} as fullname`,
        knex.raw(`SUM(${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.SALES}) as total_sales`),
        knex.raw(`SUM(${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.RETURN}) as total_return`)
      ])
      .from(`${SALESMANLEDGER.NAME} as ${SALESMANLEDGER.NAME}`)
      .leftJoin(
        `${SALESMAN.NAME} as ${SALESMAN.NAME}`,
        `${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.SALESMAN_ID}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`,
      )
      .whereRaw(
        `DATE(${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.DOCDATE}) >= ? `,
        [from_date]
      )
      .whereRaw(
        `DATE(${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.DOCDATE}) <= ? `,
        [to_date]
      )
      .groupBy(
        `${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.SALESMAN_ID}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.SALESMANNAME}`
      );


    const response = await query;

    logQuery({
      logger: fastify.log,
      query,
      context: "Get salesman ledger",
      logTrace
    });
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "salesman ledger  not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getsalesmanLedgerFullDetail({ params, body, logTrace }) {
    const knex = this;

    var salesman_id = body.salesman_id;
    // var to_date = body.to_date;

    const query = knex
      .select([
        `${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.DOCDATE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.SALES}`,
        `${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.RETURN}`
      ])
      .from(`${SALESMANLEDGER.NAME} as ${SALESMANLEDGER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.OUTLETID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .where(`${SALESMANLEDGER.NAME}.${SALESMANLEDGER.COLUMNS.SALESMAN_ID}`, '=', salesman_id)

    const response = await query;

    // logQuery({
    //     logger: fastify.log,
    //     query,
    //     context: "Get salesman ledger",
    //     logTrace
    // });

    // if (!response.length) {
    //     throw CustomError.create({
    //         httpCode: StatusCodes.NOT_FOUND,
    //         message: "salesman ledger  not found",
    //         property: "",
    //         code: "NOT_FOUND"
    //     });
    // }

    return response;
  }

  return {
    getsalesmanLedger,
    getsalesmanLedgerFullDetail,
    getsalesmanReport,
    getsalesmanReportGetall,
    getsalesmanReportGetallNew
  };
}

module.exports = salesmanRepo;
