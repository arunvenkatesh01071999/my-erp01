const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "POST",
        url: "/reports/purchase",
        preHandler: fastify.authenticate,
        // schema: schemas.purchaseReportSchema,
        handler: handlers.purchaseReportHandler(fastify)
    });
    fastify.route({
        method: "POST",
        url: "/reports/purchase/delete",
        preHandler: fastify.authenticate,
        schema: schemas.purchaseReportSchema,
        handler: handlers.purchaseDeleteReportHandler(fastify)
    })
    fastify.route({
        method: "POST",
        url: "/reports/purchase/return",
        preHandler: fastify.authenticate,
        schema: schemas.purchaseReturnReportSchema,
        handler: handlers.purchaseReturnReportHandler(fastify)
    });
};
