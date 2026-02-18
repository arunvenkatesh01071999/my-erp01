const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "GET",
        url: "/sync/subcategory/details",
        schema: schemas.getSubCategorySchema,
        preHandler: fastify.authenticate,
        handler: handlers.getSubCategoryDetailsSyncHanlder(fastify)
    })
    fastify.route({
        method: "POST",
        url: "/sync/subcategory/details",
        schema: schemas.postSubCategoryDetailsSchema,
        preHandler: fastify.authenticate,
        handler: handlers.postSubCategoryDetailsSyncHanlder(fastify)
    })
    fastify.route({
        method: "PUT",
        url: "/sync/subcategory/status/change",
        preHandler: fastify.authenticate,
        handler: handlers.putSubCategoryDetailsSyncHanlder(fastify)
    })

    fastify.route({
        method: "PUT",
        url: "/sync/subcategory/false/change",
        preHandler: fastify.authenticate,
        handler: handlers.putSubCategoryStatusHanlder(fastify)
    })
}