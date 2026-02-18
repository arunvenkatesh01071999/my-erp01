const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

    fastify.route({
        method: "GET",
        url: "/reports/sales/year/outlet_sales/:from_year/:to_year/:outlet_id?",
        schema: schemas.yearOutletSalesSchema,
        preHandler: fastify.authenticate,
        handler: handlers.yearOutletSalesHandler(fastify)
    });
    fastify.route({
        method: "GET",
        url: "/reports/sales/month/outlet_sales/:year/:month/:outlet_id?",
        schema: schemas.monthOutletSalesSchema,
        preHandler: fastify.authenticate,
        handler: handlers.monthOutletSalesHandler(fastify)
    });
    fastify.route({
        method: "GET",
        url: "/reports/sales/day/outlet_sales/:page_size/:current_page/:date/:outlet_id?",
        // schema: schemas.getOutletSalesByDatePaginateSchema,
        preHandler: fastify.authenticate,
        handler: handlers.getOutletSalesByDatePaginateHandler(fastify)
    });
    fastify.route({
        method: "GET",
        url: "/reports/alloutlets/sales/:from_year/:to_year/:outlet_id?",
        schema: schemas.allOutletsSalesSchema,
        preHandler: fastify.authenticate,
        handler: handlers.allOutletsSalesHandler(fastify)
    });

};
