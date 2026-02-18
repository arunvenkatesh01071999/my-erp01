const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/reports/outlet_expenceledger/year/:from_year/:to_year",
    // preHandler: fastify.authenticate,
    // schema: schemas.outletExpenceLedgerYearlyReportSchema,
    handler: handlers.outletExpencesLedgerYearHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/reports/outlet_expenceledger/month/:year/:month",
    // preHandler: fastify.authenticate,
    // schema: schemas.outletExpenceLedgerMonthlyReportSchema,
    handler: handlers.outletExpencesLedgerMonthHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/reports/outlet_expenceledger/day/:page_size/:current_page/:date",
    preHandler: fastify.authenticate,
    schema: schemas.outletExpenceLedgerDayReportSchema,
    handler: handlers.outletExpencesLedgerByDatePaginateHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/reports/outlet_expenceledger/outletwise/:from_year/:to_year/:outlet_id?",
    preHandler: fastify.authenticate,
    schema: schemas.outletExpenceLedgerOutletWiseSchema,
    handler: handlers.outletExpencesLedgerOutletWiseHandler(fastify)
  });

};
