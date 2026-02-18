const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

    fastify.route({
        method: "POST",
        url: "/reports/salesman/getall",
        schema: schemas.salesmanReportGetallSchema,
        // preHandler: fastify.authenticate,
        handler: handlers.salesmanReportGetallHandler(fastify)
    });
    fastify.route({
        method: "POST",
        url: "/reports/salesman/getall/new",
        schema: schemas.salesmanReportGetallNewSchema,
        // preHandler: fastify.authenticate,
        handler: handlers.salesmanReportGetallNewHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/reports/salesman/getone",
        schema: schemas.salesmanReportSchema,
        // preHandler: fastify.authenticate,
        handler: handlers.salesmanReportHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/reports/salesman/ledger",
        schema: schemas.salesmanLedgerSchema,
        preHandler: fastify.authenticate,
        handler: handlers.salesmanLedgerHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/reports/salesman/ledger/fulldetails",
        schema: schemas.salesmanLedgerFullDetailsSchema,
        preHandler: fastify.authenticate,
        handler: handlers.salesmanLedgerfullDetailsHandler(fastify)
    });

};
