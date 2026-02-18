const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "POST",
        url: "/reports/outlet_sales/gst/gstledger/:outlet_id?",
        preHandler: fastify.authenticate,
        schema: schemas.gstLedgerOutletSalesReportSchema,
        handler: handlers.gstLedgerReportOutletSalesHandler(fastify)
    });
    fastify.route({
        method: "POST",
        url: "/reports/outlet_sales/hsn/gstledger/:outlet_id?",
        preHandler: fastify.authenticate,
        schema: schemas.gstHsnLedgerOutletSalesReportSchema,
        handler: handlers.gstHsnLedgerReportOutletSalesHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/reports/outlet_sales/hsn/gstledger/withDate/:outlet_id?",
        preHandler: fastify.authenticate,
        schema: schemas.gstHsnLedgerOutletSalesReportWithDateSchema,
        handler: handlers.gstHsnLedgerReportOutletSalesWithDateHandler(fastify)
    });

}; 