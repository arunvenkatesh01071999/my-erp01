const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "GET",
        url: "/sync/units/details",
        schema: schemas.getUnitSchema,
        preHandler: fastify.authenticate,
        handler: handlers.getUnitDetailsHandler(fastify)
    })
    fastify.route({
        method: "POST",
        url: "/sync/units/details",
        schema: schemas.postUnitSchema,
        preHandler: fastify.authenticate,
        handler: handlers.postUnitDetailsHandler(fastify)
    })
    fastify.route({
        method: "PUT",
        url: "/sync/units/status/change",
        preHandler: fastify.authenticate,
        handler: handlers.putUnitDetailsHandler(fastify)
    })

    fastify.route({
        method: "PUT",
        url: "/sync/units/false/change",
        preHandler: fastify.authenticate,
        handler: handlers.putUnitsStatusHanlder(fastify)
    })
}