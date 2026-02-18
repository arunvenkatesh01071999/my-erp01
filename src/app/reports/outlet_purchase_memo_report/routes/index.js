const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    
    fastify.route({
        method: "GET",
        url: "/get/purchase/order/outlets/:region_id",
        preHandler: fastify.authenticate,
        schema: schemas.purchaseOrderOutletsSchema,
        handler: handlers.purchaseOrderOutletsHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/get/purchase/order/region/list",
        preHandler: fastify.authenticate,
        schema: schemas.purchaseOrderRegionsSchema,
        handler: handlers.purchaseOrderRegionsHandler(fastify)
    }); 
   
};
