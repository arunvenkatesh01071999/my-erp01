const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

    fastify.route({
        method: "GET",
        url: "/reports/sales/year/sales/:from_year/:to_year/:outlet_id?",
        schema: schemas.yearSalesSchema,
        preHandler: fastify.authenticate,
        handler: handlers.yearSalesHandler(fastify)
    });
    fastify.route({
        method: "GET",
        url: "/reports/sales/month/sales/:year/:month/:outlet_id?",
        schema: schemas.monthSalesSchema,
        preHandler: fastify.authenticate,
        handler: handlers.monthSalesHandler(fastify)
    });
    fastify.route({
        method: "GET",
        url: "/reports/sales/day/:page_size/:current_page/:date/:outlet_id?",
        schema: schemas.getSalesByDatePaginateSchema,
        preHandler: fastify.authenticate, // Apply JWT authentication decorator
        handler: handlers.getSalesByDatePaginateHandler(fastify)
    });
    fastify.route({
        method: "GET",
        url: "/reports/alloutlets/issues/:from_year/:to_year/:outlet_id?",
        schema: schemas.allOutletsIssueSchema,
        preHandler: fastify.authenticate,
        handler: handlers.allOutletsIssueHandler(fastify)
    });
};
