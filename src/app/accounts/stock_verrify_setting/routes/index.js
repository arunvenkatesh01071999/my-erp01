const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "GET",
        url: "/stock_verify_setting",
        preHandler: fastify.authenticate,
        schema: schemas.getStockVerifySettingSchema,
        handler: handlers.getStockVerifySettingHandler(fastify)
    });
    fastify.route({
        method: "POST",
        url: "/stock_verify_setting",
        schema: schemas.postStockVerifySettingSchema,
        preHandler: fastify.authenticate,
        handler: handlers.postStockVerifySettingHandler(fastify)
    });

};
