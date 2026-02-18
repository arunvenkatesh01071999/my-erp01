const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "POST",
        url: "/sales/return",
        preHandler: fastify.authenticate,
        schema: schemas.postSalesReturnSchema,
        handler: handlers.postSalesReturnHandler(fastify)
    });

    fastify.route({
        method: "PUT",
        url: "/sales/return/:id",
        preHandler: fastify.authenticate,
        schema: schemas.putSalesReturnSchema,
        handler: handlers.putSalesReturnHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/direct/sales/:customer_id/:page_size/:current_page",
        preHandler: fastify.authenticate,
        schema: schemas.GetAllDirectSalesSchema,
        handler: handlers.GetAllDirectSalesHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/billwise/sales",
        preHandler: fastify.authenticate,
        schema: schemas.GetAllBillWiseSalesSchema,
        handler: handlers.getAllBillWiseSalesHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/return/verify",
        preHandler: fastify.authenticate,
        schema: schemas.GetAllStoreReturnVerifySchema,
        handler: handlers.GetAllStoreReturnVerifyHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/sales/return/doc/no",
        preHandler: fastify.authenticate,
        schema: schemas.generateSaleReturnNoSchema,
        handler: handlers.generateSaleReturnNoHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/sales/return",
        preHandler: fastify.authenticate,
        schema: schemas.GetAllSalesReturnSchema,
        handler: handlers.GetAllSalesReturnHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/sales/return/:id",
        preHandler: fastify.authenticate,
        schema: schemas.GetByIdSalesReturnSchema,
        handler: handlers.GetByIdSalesReturnHandler(fastify)
    });

};
