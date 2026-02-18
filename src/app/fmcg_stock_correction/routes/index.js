const handlers = require("../handlers");
const schemas = require("../schemas");

module.exports = async fastify => {

    fastify.route({
        method: "POST",
        url: "/fmcg/stock_correction/:stock_type",
        preHandler: fastify.authenticate,
        schema: schemas.PostStockCorrectionSchema,
        handler: handlers.PostStockCorrectionHandler(fastify)
    });


    fastify.route({
        method: "POST",
        url: "/fmcg/product_stock_list",
        preHandler: fastify.authenticate,
        schema: schemas.getProductBalanceSchema,
        handler: handlers.getProductBalanceHandler(fastify)
    });

}