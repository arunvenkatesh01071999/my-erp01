const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

    fastify.route({
        method: "POST",
        url: "/barcode/check",
        preHandler: fastify.authenticate,
        // schema: schemas.postBarcodeCheckSchema,
        handler: handlers.postBarcodeCheckHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/barcode/setting",
        preHandler: fastify.authenticate,
        schema: schemas.postBarcodeSettingSchema,
        handler: handlers.postBarcodeSettingHandler(fastify)
    });


    fastify.route({
        method: "POST",
        url: "/barcode/list",
        preHandler: fastify.authenticate,
        schema: schemas.postBarcodeListSchema,
        handler: handlers.postBarcodeListHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/barcode/entry/check",
        preHandler: fastify.authenticate,
        schema: schemas.postEntryCheckSchema,
        handler: handlers.postEntryCheckHandler(fastify)
    });


    fastify.route({
        method: "DELETE",
        url: "/barcode/list/:barcode_id",
        preHandler: fastify.authenticate,
        schema: schemas.deleteBarcodeListSchema,
        handler: handlers.deleteBarcodeListDelHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/barcode/list/del",
        preHandler: fastify.authenticate,
        schema: schemas.delBarcodeListSchema,
        handler: handlers.delBarcodeListDelHandler(fastify)
    });


    fastify.route({
        method: "GET",
        url: "/barcode/setting/:company_id",
        preHandler: fastify.authenticate,
        schema: schemas.getBarcodeSettingSchema,
        handler: handlers.getBarcodeSettingHandler(fastify)
    });
    fastify.route({
        method: "POST",
        url: "/barcode/generate",
        preHandler: fastify.authenticate,
        schema: schemas.generateBarcodeSchema,
        handler: handlers.generateBarcodeHandler(fastify)
    });
    fastify.route({
        method: "GET",
        url: "/barcode/against/purcahse/:company_id/:prod_id/:purchase_no/:purchase_details_id?",
        preHandler: fastify.authenticate,
        schema: schemas.getBarcodeListAginstPurchaseSchema,
        handler: handlers.getBarcodeListAginstPurchaseHandler(fastify)
    });
    fastify.route({
        method: "POST",
        url: "/barcode/deactivate",
        preHandler: fastify.authenticate,
        schema: schemas.deactivateBarcodeSchema,
        handler: handlers.deactivateBarcodeHandler(fastify)
    });
    fastify.route({
        method: "POST",
        url: "/barcode/deactivate/isclose",
        preHandler: fastify.authenticate,
        schema: schemas.iscloseBarcodeSchema,
        handler: handlers.iscloseBarcodeHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/barcode/deactivate/ismissed",
        preHandler: fastify.authenticate,
        schema: schemas.isMissedBarcodeSchema,
        handler: handlers.isMissedBarcodeHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/barcode/complete/history",
        // preHandler: fastify.authenticate,
        // schema: schemas.getBarcodeCompleteHistorySchema,
        handler: handlers.barocdeCompleteHistoryHandler(fastify)
    });
    fastify.route({
        method: "GET",
        url: "/barcode/lists/:company_id/:page_size/:current_page/:outlet_id/:g_v_status/:s_us_status/:search?",
        preHandler: fastify.authenticate,
        schema: schemas.getBarcodeListSchema,
        handler: handlers.getBarcodeListHandler(fastify)
    });


};
