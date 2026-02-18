const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/expenceledger/year/:from_year/:to_year",
    // preHandler: fastify.authenticate,
    // schema: schemas.expenceLedgerYearlyReportSchema,
    handler: handlers.salesReportHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/reports/expenceledger/month/:year/:month",
    // schema: schemas.expenceLedgerDayReportSchema,
    // preHandler: fastify.authenticate,
    handler: handlers.monthExpenceLedgerHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/reports/expenceledger/day/:page_size/:current_page/:date",
    // schema: schemas.expenceLedgerDayReportSchema,
    // preHandler: fastify.authenticate,
    handler: handlers.getExpenceLedgerByDatePaginateHandler(fastify)
  });
};
