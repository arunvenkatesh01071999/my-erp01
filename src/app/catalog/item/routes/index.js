const schemas = require("../schemas");
const handlers = require("../handlers");
const handler = require("../../../errorHandler/handler");

module.exports = async fastify => {

  fastify.route({
    method: "GET",
    url: "/item/:type_id/:take/:skip",
    preHandler: fastify.authenticate,
    schema: schemas.getItemSchema,
    handler: handlers.getItemHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/item",
    preHandler: fastify.authenticate,
    schema: schemas.postItemSchema,
    handler: handlers.postItemHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/item/:id",
    preHandler: fastify.authenticate,
    schema: schemas.putItemSchema,
    handler: handlers.putItemHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/item/:id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteItemSchema,
    handler: handlers.deleteItemHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/item/:id",
    preHandler: fastify.authenticate,
    schema: schemas.getItemInfoSchema,
    handler: handlers.getItemInfoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/item/details/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getItemPaginateSchema,
    handler: handlers.getItemPaginateHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/item/details/export/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getItemDetailsExportSchema,
    handler: handlers.getItemDetailsExportHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/item/import/validation/:company_id/:type_id/:status",
    preHandler: fastify.authenticate,
    schema: schemas.postItemImportVaidationSchema,
    handler: handlers.postImportValidationExcelHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/item/details/import/:company_id/:type_id/:status",
    preHandler: fastify.authenticate,
    handler: handlers.postImportExcelHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/item/active/status/:product_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.putItemActiveStatusSchema,
    handler: handlers.putItemActiveStatusHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/item/details/import/status/type",
    preHandler: fastify.authenticate,
    schema: schemas.getImportStatusTypeSchema,
    handler: handlers.getItemImportStatusHanlder(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/item/details/status/type",
    preHandler: fastify.authenticate,
    schema: schemas.getItemStatusTypeSchema,
    handler: handlers.getItemStatusHanlder(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet_item_filter/:outlet_id/:search?",
    preHandler: fastify.authenticate,
    // schema: schemas.getItemOutletSchema,
    handler: handlers.getItemOutletHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/item/purchase/product",
    preHandler: fastify.authenticate,
    schema: schemas.getItemPurchaseProductSchema,
    handler: handlers.getItemPurchaseProductHandler(fastify)
  })


  fastify.route({
    method: "POST",
    url: "/item/barcode/dis/update",
    preHandler: fastify.authenticate,
    schema: schemas.putItemDiscountSchema,
    handler: handlers.putItemDiscountHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/item/info/procode",
    // preHandler: fastify.authenticate,
    // schema: schemas.getItemInfoSchema,
    handler: handlers.getItemInfoWithProcodeHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/product/details/:product_code",
    preHandler: fastify.authenticate,
    schema: schemas.getProductcodeDetailsSchema,
    handler: handlers.getItemCodeHandler(fastify)
  });


  fastify.route({
    method: "GET",
    url: "/itemcode/:search?",
    preHandler: fastify.authenticate,
    handler: handlers.getItemSearch(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/itemdetails/barcode/:barcode/:outlet_id?",
    // preHandler: fastify.authenticate,
    schema: schemas.getBarcodeSchema,
    handler: handlers.getBarcodeSearch(fastify)
  });

  // packing issue

  fastify.route({
    method: "GET",
    url: "/itemdetails/barcode/issue/:barcode",
    preHandler: fastify.authenticate,
    // schema: schemas.getBarcodeIssueSchema,
    handler: handlers.getBarcodeIssueSearch(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/itemdetails/outlet/sales/product/:barcode/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getItemDetailsOutletsSalesProductSchema,
    handler: handlers.getItemDetailsOutletsSalesProductHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/itemdetails/closingStock/barcode/:barcode/:outlet_id/:cat_id/:sub_cat_id",
    // preHandler: fastify.authenticate,
    // schema: schemas.getBarcodeSchema,
    handler: handlers.getClosingStockBarcodeSearch(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/itemdetails/sub/warehouse/stocks/:barcode/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getSubWarehouseStocksSchema,
    handler: handlers.getSubWarehouseStocksHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/itemdetails/warehouse/mapping/list",
    preHandler: fastify.authenticate,
    schema: schemas.getWarehouseMappingCustomerSchema,
    handler: handlers.getWarehouseMappingListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/item/parent/list",
    preHandler: fastify.authenticate,
    schema: schemas.getParentListSchema,
    handler: handlers.getItemParentListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/item/outlet/mapping/order/days/:outlet_id/:supplier_id/:page_size/:current_page",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletItemOrderDaysSchema,
    handler: handlers.getOutletProductOrderDaysHandler(fastify)
  })

  fastify.route({
    method: "PUT",
    url: "/item/supplier/outlet/mapping/:supplier_id/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.putItemSupplierOrderDaysSchema,
    handler: handlers.putItemOutletOrderDaysHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/excel/sku/price/upload",
    preHandler: fastify.authenticate,
    schema: schemas.skuPriceUploadSchema,
    handler: handlers.skuPriceUploadHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/excel/sku/price/list",
    preHandler: fastify.authenticate,
    handler: handlers.skuPriceListHandler(fastify)
  });


  fastify.route({
    method: "PUT",
    url: "/excel/sku/price/update/transcation/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.putPriceUploadSchema,
    handler: handlers.updatePricePoHandler(fastify)
  });

};
