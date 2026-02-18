const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "GET",
        url: "/sync/category/details",
        schema: schemas.getCategorySchema,
        preHandler: fastify.authenticate,
        handler: handlers.getCategoryDetailsSyncHanlder(fastify)
    })
    fastify.route({
        method: "POST",
        url: "/sync/category/details",
        schema: schemas.postCategoryDetailsSchema,
        preHandler: fastify.authenticate,
        handler: handlers.postCategoryDetailsSyncHanlder(fastify)
    })
    fastify.route({
        method: "PUT",
        url: "/sync/category/status/change",
        preHandler: fastify.authenticate,
        handler: handlers.putCategoryDetailsSyncHanlder(fastify)
    })

    fastify.route({
        method: "PUT",
        url: "/sync/category/false/change",
        preHandler: fastify.authenticate,
        handler: handlers.putCategoryStatusHanlder(fastify)
    })
}