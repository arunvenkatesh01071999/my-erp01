const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");

const { OUTLETS, OUTLETSALESMASTER } = require("../commons/constants");


function getDashboardRepo(fastify) {

  async function getDashboardOutletwiseCatSalesReport({ params, body, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        'f.category_name',
        knex.raw('SUM(osm.amount) as total_amount'),
        'o.short_name'
      ])
      .from('barcode_list as a')
      .leftJoin('item as b', 'b.id', 'a.prod_id')
      .leftJoin('main_category as f', 'f.id', 'b.cat_id')
      .leftJoin('public.outlet_sales_master as osm', 'osm.outletid', 'a.outlet_id')
      .leftJoin('public.outlets as o', 'o.id', 'a.outlet_id')
      .groupBy('f.category_name', 'o.short_name')
      .orderBy('f.category_name');

    if (body.customer && body.customer !== 0) {
      query.where('a.outlet_id', body.customer);
    }

    if (body.category && body.category !== 0) {
      query.where('f.id', body.category);
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Dashboard Outlet Wise Cat Sales",
      logTrace
    });

    const response = await query;

    if (response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No data found for the given outlet",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getDashboardStockCatReport({ params, body, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        'f.category_name',
        knex.raw(`COUNT(CASE WHEN a.is_sold = true AND a.is_verified = 1 AND a.outlet_id IS NOT NULL THEN 1 END) AS sold_count`),
        knex.raw(`COUNT(CASE WHEN a.is_sold = false AND a.is_verified = 1 AND a.outlet_id IS NOT NULL THEN 1 END) AS unsold_count`),
        knex.raw(`(
            COUNT(CASE WHEN a.is_sold = true AND a.is_verified = 1 AND a.outlet_id IS NOT NULL THEN 1 END) 
            + COUNT(CASE WHEN a.is_sold = false AND a.is_verified = 1 AND a.outlet_id IS NOT NULL THEN 1 END)
          ) AS total`),
        knex.raw(`COUNT(CASE WHEN a.is_sold = false AND a.outlet_id IS NULL AND a.is_verified = 0 THEN 1 END) AS inwarehouse_count`)
      ])
      .from('barcode_list as a')
      .leftJoin('item as b', 'b.id', 'a.prod_id')
      .leftJoin('main_category as f', 'f.id', 'b.cat_id')
      .leftJoin('public.outlets as o', 'o.id', 'a.outlet_id')
      .groupBy('f.category_name')
      .orderBy('f.category_name');

    if (body.customer && body.customer !== 0) {
      query.where('a.outlet_id', body.customer);
    }

    if (body.category && body.category !== 0) {
      query.where('f.id', body.category);
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Dashboard Stock Cat Report",
      logTrace
    });

    const response = await query;

    if (response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No data found for the given category",
        property: "",
        code: "NOT_FOUND"
      });
    }


    return response;
  }

  async function getDashboardOutletSales({ params, body, logTrace, userDetails }) {
    const knex = this;

    const query = knex
      .select([
        knex.raw('SUM(??.??) AS total_amount', [`${OUTLETSALESMASTER.NAME}`, `${OUTLETSALESMASTER.COLUMNS.AMOUNT}`]),
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
      ])
      .from(`${OUTLETSALESMASTER.NAME} as ${OUTLETSALESMASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .groupBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`)
      .orderBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`);

    if (body.year || body.month || body.day) {
      query.select([
        knex.raw('EXTRACT(YEAR FROM ??) AS year', [`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}`]),
      ]);

      if (body.month) {
        query.select([
          knex.raw('EXTRACT(MONTH FROM ??) AS month', [`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}`]),
        ]);
        query.groupBy(
          knex.raw('EXTRACT(MONTH FROM ??)', [`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}`])
        );
      }

      if (body.day) {
        query.select([
          knex.raw('EXTRACT(DAY FROM ??) AS day', [`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}`]),
        ]);
        query.groupBy(
          knex.raw('EXTRACT(DAY FROM ??)', [`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}`])
        );
      }

      query.groupBy(
        knex.raw('EXTRACT(YEAR FROM ??)', [`${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}`])
      );
    }

    if (body.year) {
      query.whereRaw('EXTRACT(YEAR FROM ??) = ?', [
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}`,
        body.year,
      ]);
    }

    if (body.month) {
      query.whereRaw('EXTRACT(MONTH FROM ??) = ?', [
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}`,
        body.month,
      ]);
    }

    if (body.day) {
      query.whereRaw('EXTRACT(DAY FROM ??) = ?', [
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.DOCDATE}`,
        body.day,
      ]);
    }

    if (body.customer && body.customer !== 0) {
      query.where(
        `${OUTLETSALESMASTER.NAME}.${OUTLETSALESMASTER.COLUMNS.OUTLETID}`,
        body.customer
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Sales",
      logTrace,
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Sales data not found",
        property: "",
        code: "NOT_FOUND",
      });
    }

    return response;
  }





  return {
    getDashboardOutletwiseCatSalesReport,
    getDashboardStockCatReport,
    getDashboardOutletSales,
  };
}

module.exports = getDashboardRepo;
