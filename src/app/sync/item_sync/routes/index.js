const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "GET",
        url: "/sync/items/details",
        schema: schemas.getItemSchema,
        preHandler: fastify.authenticate,
        handler: handlers.getItemDetailsHandler(fastify)
    })
    fastify.route({
        method: "POST",
        url: "/sync/items/details",
        schema: schemas.postItemSchema,
        preHandler: fastify.authenticate,
        handler: handlers.postItemDetailsHandler(fastify)
    })
    fastify.route({
        method: "PUT",
        url: "/sync/items/status/change",
        preHandler: fastify.authenticate,
        handler: handlers.putItemDetailsHandler(fastify)
    })

    fastify.route({
        method: "PUT",
        url: "/sync/items/false/change",
        preHandler: fastify.authenticate,
        handler: handlers.putItemStatusHanlder(fastify)
    })
}