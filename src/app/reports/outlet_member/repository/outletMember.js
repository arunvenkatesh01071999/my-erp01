const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLETMEMBERS, OUTLETSALESMASTER, OUTLETS } = require("../../../../app/outlet_sales/outlet_sales_master/commons/constants");


function outletMemberReport(fastify) {
  async function getOutletMemberReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${OUTLETMEMBERS.NAME}.*`,
      ])
      .from(`${OUTLETMEMBERS.NAME} as ${OUTLETMEMBERS.NAME}`)

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Member",
      logTrace
    });

    if (params.search && params.search.length >= 1) {
      query
        .where(`${OUTLETMEMBERS.NAME}.${OUTLETMEMBERS.COLUMNS.MOBILE}`, "ilike", `%${params.search}%`)
    }
    const response = await query.paginate({
      pageSize: params.page_size,
      currentPage: params.current_page
    });

    // const response = await query;
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Member Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    return response;
  }

  async function getOutletMemberWithOutletSalesMstReport({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${OUTLETMEMBERS.NAME}.*`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCNO}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.AMOUNT}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.MODE}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.LOYALTY_EARNED}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.LOYALTY_REDEM}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.BALANCE_POINTS}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.RETURN_AMOUNT}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.RETURN_BILLNO}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`,



      ])
      .from(`${OUTLETMEMBERS.NAME} as ${OUTLETMEMBERS.NAME}`)
      .leftJoin(
        `${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`,
        `${OUTLETMEMBERS.NAME}.${OUTLETMEMBERS.COLUMNS.MOBILE}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.MOBILE}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .where(`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.MOBILE}`, params.search)
      .orderBy(`${OUTLETSALESMASTER.COLUMNS.ID}`, 'DESC');


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Member",
      logTrace
    });

    if (params.search && params.search.length >= 1) {
      query
        .where(`${OUTLETMEMBERS.NAME}.${OUTLETMEMBERS.COLUMNS.MOBILE}`, "ilike", `%${params.search}%`)
    }
    const response = await query.paginate({
      pageSize: params.page_size,
      currentPage: params.current_page
    });

    // const response = await query;
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Member Not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    return response;
  }
  return {
    getOutletMemberReport,
    getOutletMemberWithOutletSalesMstReport
  };
}

module.exports = outletMemberReport;
