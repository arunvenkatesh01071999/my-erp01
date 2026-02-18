const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "GET",
        url: "/sync/heads/details",
        schema: schemas.getHeadsSchema,
        preHandler: fastify.authenticate,
        handler: handlers.getHeadsDetailsSyncHanlder(fastify)
    })
    fastify.route({
        method: "POST",
        url: "/sync/heads/details",
        schema: schemas.postHeadsSchema,
        preHandler: fastify.authenticate,
        handler: handlers.postHeadsDetailsSyncHanlder(fastify)
    })
    fastify.route({
        method: "PUT",
        url: "/sync/heads/status/change",
        preHandler: fastify.authenticate,
        handler: handlers.putHeadsDetailsSyncHanlder(fastify)
    })

    fastify.route({
        method: "PUT",
        url: "/sync/heads/false/change",
        preHandler: fastify.authenticate,
        handler: handlers.putHeadsStatusHanlder(fastify)
    })
}