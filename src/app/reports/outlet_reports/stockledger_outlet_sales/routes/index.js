const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

    fastify.route({
        method: "POST",
        url: "/reports/stock/ledger/outlet_sales",
        // schema: schemas.stockLedgerOutletSalesSchema,
        preHandler: fastify.authenticate,
        handler: handlers.stockLedgerOutletSalesHandler(fastify)
    });
    fastify.route({
        method: "POST",
        url: "/reports/stock/ledger/all_outlet_sales",
        schema: schemas.stockAllOutletLedgerOutletSalesSchema,
        preHandler: fastify.authenticate,
        handler: handlers.stockAllOutletLedgerOutletSalesHandler(fastify)
    });



};
