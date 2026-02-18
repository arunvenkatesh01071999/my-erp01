const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/supplier",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierSchema,
    handler: handlers.getSupplierHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/supplier",
    preHandler: fastify.authenticate,
    schema: schemas.postSupplierSchema,
    handler: handlers.postSupplierHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/supplier/:supplier_id",
    schema: schemas.putSupplierSchema,
    preHandler: fastify.authenticate,
    handler: handlers.putSupplierHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/supplier/:supplier_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteSupplierSchema,
    handler: handlers.deleteSupplierHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/supplier/:supplier_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierInfoSchema,
    handler: handlers.getSupplierInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/supplier/:page_size/:current_page/:search?",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierPaginateSchema,
    handler: handlers.getSupplierPaginateHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/supplier/mapping/product/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierByProductSchema,
    handler: handlers.getSupplierByProductsHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/upload/documents",
    // preHandler: fastify.authenticate, 
    handler: handlers.uploadDocumentHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/upload/supplier/documents",
    // preHandler: fastify.authenticate, 
    handler: handlers.uploadSupplierDocumentHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/supplier/approval/pending/list/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierPaginateSchema,
    handler: handlers.getSupplierApprovalHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/supplier/mapping/product/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierByProductSchema,
    handler: handlers.getOutletSupplierByProductsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/supplier/mapping/currentday/product/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierByProductSchema,
    handler: handlers.getOutletSupplierBydayProductsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/supplier/outlet/mapping/details",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierByOutletSchema,
    handler: handlers.getSupplierByOutletsHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/supplier/import/validation/:company_id/:status",
    preHandler: fastify.authenticate,
    schema: schemas.postSupplierImportVaidationSchema,
    handler: handlers.postImportValidationSupplierExcelHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/supplier/import/excel/:status/:company_id",
    preHandler: fastify.authenticate,
    handler: handlers.postExcelSupplierHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/supplier/outlet/mapping/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierOutletMappingSchema,
    handler: handlers.getSupplierOutletMappingHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/supplier/outlet/mapping/order/days/:region_id/:outlet_id/:company_id/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierOutletMappingOrderDaysSchema,
    handler: handlers.getSupplierOutletMappingOrderDaysHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/supplier/outlet/mapping/order/days/with/brandname/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierOrderDaysWithBrandNameSchema,
    handler: handlers.getSuplierOrderDaysWithBrandNameExportHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/brandcompany/wise/order/days/:region_id/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierOrderDaysBrandSchema,
    handler: handlers.getSuplierOrderDaysBrandBasedExportHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/supplier/outlet/mapping/order/days/:supplier_id/:outlet_id/:company_id/:brand_company_id",
    preHandler: fastify.authenticate,
    schema: schemas.putSupplierOutletMappingOrderDaysSchema,
    handler: handlers.putSupplierOutletMappingOrderDaysHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/supplier/outlet/mapping/order/days/brandwise/:brand_company_id/:outlet_id/:company_id/:region_id",
    preHandler: fastify.authenticate,
    schema: schemas.putSupplierOutletMappingOrderDaysBrandBasedSchema,
    handler: handlers.putSupplierOutletMappingOrderDaysBrandHandler(fastify)
  });


  fastify.route({
    method: "GET",
    url: "/supplier/details/export/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierOutletMappingExportSchema,
    handler: handlers.getSupplierDetailsExportHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/supplier/po/order/days/export/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierOutletMappingExportSchema,
    handler: handlers.getSupplierOutletOrderDaysExportHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/supplier/outlet/order/days/export/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSupplierOutletOrderDaysExportSchema,
    handler: handlers.getSupplierOutletOrderDaysExportHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/supplier/outlet/order/days/import/excel/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    handler: handlers.postSupplierExcelPoOrderDaysHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/brandcompany/wise/order/days/excel/import/:region_id/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    handler: handlers.postSupplierExcelPoOrderDaysBrandbasedHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/excel/sku/mapping",
    preHandler: fastify.authenticate,
    // schema: schemas.excelSkuMappingSchema,
    handler: handlers.excelSkuMappingHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/excel/sku/mapping/remove",
    preHandler: fastify.authenticate,
    // schema: schemas.excelSkuMappingSchema,
    handler: handlers.removeExcelSkuMappingHandler(fastify)
  });
  fastify.route({
    method: "GET",
    url: "/excel/sku/mapping/:region_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getProductMappingBySupplierIdSchema,
    handler: handlers.getExcelSkuMappingHandler(fastify)
  });


  fastify.route({
    method: "POST",
    url: "/excel/supplier/outletOrwarehouse/mapping",
    preHandler: fastify.authenticate,
    // schema: schemas.excelSkuMappingSchema,
    handler: handlers.excelSupplierOuteletMappingHandler(fastify)
  });


};
