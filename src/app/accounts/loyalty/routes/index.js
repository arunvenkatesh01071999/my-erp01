const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "GET",
        url: "/loyalty/info/:company_id",
        preHandler: fastify.authenticate,
        schema: schemas.getLoyaltyInfoSchema,
        handler: handlers.getLoyaltyInfoHandler(fastify)
    });
    fastify.route({
        method: "POST",
        url: "/loyalty",
        schema: schemas.postLoyaltySchema,
        preHandler: fastify.authenticate,
        handler: handlers.postLoyaltyHandler(fastify)
    });

};
