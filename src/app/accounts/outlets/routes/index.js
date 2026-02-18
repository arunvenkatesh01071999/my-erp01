const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/outlet",
    schema: schemas.postOutletSchema,
    preHandler: fastify.authenticate,
    handler: handlers.postOutletHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/:outlet_id",
    schema: schemas.putOutletSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.putOutletHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/outlet/:outlet_id",
    schema: schemas.deleteOutletSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.deleteOutletHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/:company_id/:page_size/:current_page",
    schema: schemas.getOutletSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.getOutletHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/info/:outlet_id/:company_id",
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    schema: schemas.getOutletInfoSchema,
    handler: handlers.getOutletInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/list/:company_id",
    schema: schemas.getOutletListSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.getOutletListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/region/wise/outlet/list/:region_id",
    schema: schemas.getRegionwiseOutletListSchema,
    preHandler: fastify.authenticate, 
    handler: handlers.getRegionwiseOutletListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlets/list",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletSchemaList,
    handler: handlers.getOutletListByIdHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/citywise",
    schema: schemas.getOutletCityWiseSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getOutletCityWiseHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/list/supplierwise",
    schema: schemas.getOutletListBySupplierSchema,
    preHandler: fastify.authenticate, // Apply JWT authentication decorator
    handler: handlers.getOutletListBySupplierHandler(fastify)
  });
  
  fastify.route({
    method: "GET",
    url: "/purchase/order/region/wise/outlet/list/:region_id",
    schema: schemas.getPurchaseOrderRegionwiseOutletListSchema,
    preHandler: fastify.authenticate,
    handler: handlers.getPurchaseOrderRegionwiseOutletListHandler(fastify)
  });

};
