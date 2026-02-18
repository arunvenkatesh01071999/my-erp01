const getDashboardRepo = require("../repository/getDashboardRepo");


function getDashboardOutletSalesServices(fastify) {
  const { getDashboardOutletSales } = getDashboardRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getDashboardOutletSales.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response1] = await Promise.all([promise1]);

    return response1;
  };
}

function getDashboardStockCatReportServices(fastify) {
  const { getDashboardStockCatReport } = getDashboardRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getDashboardStockCatReport.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);

    return response;
  };
}


function getDashboardOutletwiseCatSalesReportServices(fastify) {
  const { getDashboardOutletwiseCatSalesReport } = getDashboardRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const promise1 = getDashboardOutletwiseCatSalesReport.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);

    return response;
  };
}


function getDashboardApiServices(fastify) {
  const repo = getDashboardRepo(fastify);

  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const serviceCalls = [
      repo.getDashboardOutletSales.call(knex, { params, body, logTrace, userDetails }),
      repo.getDashboardStockCatReport.call(knex, { params, body, logTrace, userDetails }),
      // repo.getDashboardOutletwiseCatSalesReport.call(knex, { params, body, logTrace, userDetails })
    ];

    const [outletSales, stockCatReport, outletwiseCatSalesReport] = await Promise.all(serviceCalls);

    return {
      outletSales,
      stockCatReport,
      outletwiseCatSalesReport
    };
  };
}


module.exports = {
  getDashboardOutletSalesServices,
  getDashboardStockCatReportServices,
  getDashboardOutletwiseCatSalesReportServices,
  getDashboardApiServices
};
