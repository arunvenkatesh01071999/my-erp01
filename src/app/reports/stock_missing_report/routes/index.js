const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "POST",
        url: "/reports/stock_missing",
        preHandler: fastify.authenticate,
        schema: schemas.stockMissingReportSchema,
        handler: handlers.stockMissingReportHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/reports/stock_missing/new",
        // preHandler: fastify.authenticate,
        schema: schemas.stockMissingReportNewSchema,
        handler: handlers.stockMissingReportNewHandler(fastify)
    });

};
