const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const salesmanLedgerRepo = require("../repository/salesmanLedger");



function getSalesmanReportGetallService(fastify) {
  const { getsalesmanReportGetall } = salesmanLedgerRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getsalesmanReportGetall.call(knex, {
      params,
      logTrace,
      body
    });


    return response;
  };
}

function getSalesmanReportGetallNewService(fastify) {
  const { getsalesmanReportGetallNew } = salesmanLedgerRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getsalesmanReportGetallNew.call(knex, {
      params,
      logTrace,
      body
    });


    return response;
  };
}
function getSalesmanReportService(fastify) {
  const { getsalesmanReport } = salesmanLedgerRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getsalesmanReport.call(knex, {
      params,
      logTrace,
      body
    });


    return response;
  };
}

function getSalesmanLedgerService(fastify) {
  const { getsalesmanLedger } = salesmanLedgerRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getsalesmanLedger.call(knex, {
      params,
      logTrace,
      body
    });


    return response;
  };
}

function getSalesmanLedgerFulldetailsService(fastify) {
  const { getsalesmanLedgerFullDetail } = salesmanLedgerRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await getsalesmanLedgerFullDetail.call(knex, {
      params,
      logTrace,
      body
    });


    return response;
  };
}




module.exports = {
  getSalesmanLedgerService,
  getSalesmanLedgerFulldetailsService,
  getSalesmanReportService,
  getSalesmanReportGetallService,
  getSalesmanReportGetallNewService
};
