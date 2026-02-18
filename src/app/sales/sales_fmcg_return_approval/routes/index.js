const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {

    fastify.route({
        method: "POST",
        url: "/sales/return/approval/:sales_return_id",
        preHandler: fastify.authenticate,
        schema: schemas.postSalesReturnSchema,
        handler: handlers.UpdateSalesReturnApprovalHandler(fastify)
    });

    fastify.route({
        method: "POST",
        url: "/sales/return/approval/reverse/:sales_return_id",
        preHandler: fastify.authenticate,
        schema: schemas.postSalesReturnReverseSchema,
        handler: handlers.ReverseSalesReturnApprovalHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/sales/return/list",
        preHandler: fastify.authenticate,
        schema: schemas.GetAllSalesReturnSchema,
        handler: handlers.GetAllSalesReturnApprovalHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/sales/return/list/:id",
        preHandler: fastify.authenticate,
        schema: schemas.GetByIdSalesReturnSchema,
        handler: handlers.GetByIdSalesReturnApprovalHandler(fastify)
    });

};
