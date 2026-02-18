const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "GET",
    url: "/generate/outlet/purchase/order/pono/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPoSchema,
    handler: handlers.getOutletPoPonoHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/order/:vendor_id/:outlet_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrderProductSchema,
    handler: handlers.getProductBySupplierHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase/order/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.postOutletPurchaseOrderSchema,
    handler: handlers.postOutletpohandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/order/unapproved/list/:company_id/:region_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseOrderApprovedListSchema,
    handler: handlers.getOutletPurchaseOrderUnApprovedListHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/order/approved/item/:po_no/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPurchaseOrderApprovedPonoSchema,
    handler: handlers.getOutletPurchaseOrderApprovedItemHandler(fastify)
  });

  fastify.route({
    method: "DELETE",
    url: "/outlet/purchase/order/delete/:po_no/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.deleteOutletPurchaseOrderProductSchema,
    handler: handlers.deleteOutletPurchaseOrderProductHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/purchase/order/update/:po_no/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.putOutletPurchaseOrderSchema,
    handler: handlers.putOutletPurchaseOrderProductHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/purchase/order/unapproved/product/update/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.putUnApprovedOutltetPoProductSchema,
    handler: handlers.putOutletPoUnApprovedProductHandler(fastify)
  });


  fastify.route({
    method: "GET",
    url: "/outlet/purchase/order/unapproved/:from_date/:to_date/:approved/:company_id/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.getUnApprovedOutletPurchaseOrderProductSchema,
    handler: handlers.getPoUnApprovedOutletProductHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase/order/approvalReport/:from_date/:to_date/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getApprovalReportOutletpo,
    handler: handlers.getApprovalReportOutletPoHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase/order/amendmentReport/:from_date/:to_date/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPoAmendmentReportSchema,
    handler: handlers.getOutletPoAmendmentReportHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/order/overview",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPoDetailsOverviewSchema,
    handler: handlers.getOutletPoOverviewHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/order/details/:supplier_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPoDetailsBySupplierIdSchema,
    handler: handlers.getOutletPoDetailsBySupplierHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/order/approval/list/:region_id/:outlet_id/:brand_company_id",
    preHandler: fastify.authenticate,
    schema: schemas.getOutletPoApprovListBySupplierIdSchema,
    handler: handlers.getOutletPoApprovalListHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/purchase/order/poqty/update",
    preHandler: fastify.authenticate,
    schema: schemas.putPoQtySchema,
    handler: handlers.putOutletPoQtyUpdateHandler(fastify)
  });
  fastify.route({
    method: "PUT",
    url: "/outlet/purchase/order/approval/:supplier_id/:company_id",
    preHandler: fastify.authenticate,
    schema: schemas.putOutletApprovedPoSchema,
    handler: handlers.putOutletPoApprovedHandler(fastify)
  });

  fastify.route({
    method: "PUT",
    url: "/outlet/purchase/order/grnDetails/:po_no/:outlet_id",
    preHandler: fastify.authenticate,
    schema: schemas.putOutletPomasterGrndetailsSchema,
    handler: handlers.putOutletPomasterGrndetailsHandler(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/outlet/purchase/order/outlet/list/:region_id",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrdereOutletListSchema,
    handler: handlers.getPurchaseOrdereOutletListHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase/order/supplier/list",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrdereSupplierListSchema,
    handler: handlers.getPurchaseOrderSupplierListHandler(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/outlet/purchase/order/brandcompany/list",
    preHandler: fastify.authenticate,
    schema: schemas.getPurchaseOrdereBrandCompanyListSchema,
    handler: handlers.getPurchaseOrderBrandCompanyListHandler(fastify)
  });


  fastify.route({
    method: "POST",
    url: "/outlet/purchase/order/resend/mail",
    preHandler: fastify.authenticate,
    schema: schemas.resentPoMailSchema,
    handler: handlers.resentPoMailHandler(fastify)
  });



};
