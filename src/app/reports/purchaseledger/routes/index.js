const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

    fastify.route({
        method: "GET",
        url: "/reports/purchase/year/sales/:from_year/:to_year",
        schema: schemas.yearPurchaseSchema,
        preHandler: fastify.authenticate,
        handler: handlers.yearPurchaseHandler(fastify)
    });
    fastify.route({
        method: "GET",
        url: "/reports/purchase/month/sales/:year/:month",
        schema: schemas.monthPurchaseSchema,
        preHandler: fastify.authenticate,
        handler: handlers.monthPurchaseHandler(fastify)
    });
    fastify.route({
        method: "GET",
        url: "/reports/purchase/day/:page_size/:current_page/:date",
        schema: schemas.getPurchaseByDatePaginateSchema,
        preHandler: fastify.authenticate, // Apply JWT authentication decorator
        handler: handlers.getPurchaseByDatePaginateHandler(fastify)
    });
};
