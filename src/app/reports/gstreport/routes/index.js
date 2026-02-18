const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "POST",
        url: "/reports/gst/gstledger",
        preHandler: fastify.authenticate,
        schema: schemas.gstLedgerReportSchema,
        handler: handlers.gstLedgerReportHandler(fastify)
    });
    fastify.route({
        method: "POST",
        url: "/reports/hsn/gstledger",
        preHandler: fastify.authenticate,
        schema: schemas.gstHsnLedgerReportSchema,
        handler: handlers.gstHsnLedgerReportHandler(fastify)
    });

}; 