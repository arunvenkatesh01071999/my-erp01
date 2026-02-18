const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "GET",
        url: "/sync/typedesign/details",
        schema: schemas.getTypeDesignSchema,
        preHandler: fastify.authenticate,
        handler: handlers.getTypeDesignDetailsSyncHanlder(fastify)
    })
    fastify.route({
        method: "POST",
        url: "/sync/typedesign/details",
        schema: schemas.postTypeDesignSchema,
        preHandler: fastify.authenticate,
        handler: handlers.postTypeDesignSyncHanlder(fastify)
    })
    fastify.route({
        method: "PUT",
        url: "/sync/typedesign/status/change",
        preHandler: fastify.authenticate,
        handler: handlers.putTypeDesignDetailsHandler(fastify)
    })

    fastify.route({
        method: "PUT",
        url: "/sync/typedesign/false/change",
        preHandler: fastify.authenticate,
        handler: handlers.putTypeDesignStatusHanlder(fastify)
    })
}