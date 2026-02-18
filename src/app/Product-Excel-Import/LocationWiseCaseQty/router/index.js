const schemas = require("../schema");
const handlers = require("../handlers");

module.exports = async fastify => {

    fastify.route({
        method: "POST",
        url: "/location_case_qty",
        preHandler: fastify.authenticate,
        schema: schemas.postLocationCaseQtySchema,
        handler: handlers.postLocationCaseQtyHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/xl_import_log/:page_size/:current_page",
        preHandler: fastify.authenticate,
        schema: schemas.getXlImportLogListSchema,
        handler: handlers.getXlImportLogHandler(fastify)
    });


}