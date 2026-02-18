const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/outlet/memo/supplier/list/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletMemoSupplierListSchema,
    handler: handlers.getOutletMemoSupplierListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/memo/po/no/list/:outlet_id/:supplier_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletMemoPoNoListSchema,
    handler: handlers.getOutletMemoPoNoListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/memo/po/item/list/:outlet_id/:supplier_id/:po_no",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletMemoPoItemListSchema,
    handler: handlers.getOutletMemoPoItemListHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase/memo",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletPurchaseMemoSchema,
    handler: handlers.postOutletPurchaseMemoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/memo/details/:outlet_id/:memo_no",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletMemoDetailsSchema,
    handler: handlers.getOutletPurchaseMemoDetailsHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/purchase/memo/invoice/pdf/clear/:outlet_id/:supplier_id/:po_no",
    preHandler: fastify.authenticate,
    schema: schemas.putOutletMemoInvoicePdfClearSchema,
    handler: handlers.putOutletPurchaseMemoInvoicePdfHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/purchase/memo/invoice/pdf/upload/:outlet_id/:supplier_id/:po_no",
    preHandler: fastify.authenticate,
    schema: schemas.putOutletMemoInvoicePdfUploadSchema,
    handler: handlers.putOutletPurchaseMemoInvoicePdfUploadHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/memo/invoice/pdf/upload/summary/list/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletMemoInvoicePdfUploadSummaryListSchema,
    handler: handlers.getOutletMemoInvoicePdfUploadSummaryListHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/purchase/memo/invoice/no/:outlet_id/:po_no",
    preHandler: fastify.authenticate,
    schema: schemas.putOutletMemoInvoiceNoSchema,
    handler: handlers.putOutletPurchaseMemoInvoiceNoHandler(fastify)
  });

};
