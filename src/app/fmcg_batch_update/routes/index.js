const schemas = require("../schemas");
const handlers = require("../handlers");


module.exports = async fastify => {

    fastify.route({
        method: "POST",
        url: "/fmcg/batch/update",
        preHandler: fastify.authenticate,
        schema: schemas.postProductBatchSchema,
        handler: handlers.postBatchUpdateHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/fmcg/product/list",
        preHandler: fastify.authenticate,
        schema: schemas.getProductBalanceSchema,
        handler: handlers.GetFmcgProductListHandler(fastify)
    });
};