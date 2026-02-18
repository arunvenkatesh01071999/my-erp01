const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
    fastify.route({
        method: "GET",
        url: "/sync/unit/details/:id",
        schema: schemas.getUnitScheme,
        preHandler: fastify.authenticate,
        handler: handlers.getUnitDetailsHandler(fastify)
    })
    fastify.route({
        method: "GET",
        url: "/sync/brand/details/:id",
        schema: schemas.getBrandsSchema,
        preHandler: fastify.authenticate,
        handler: handlers.getBrandDetailsHandler(fastify)
    })
    fastify.route({
        method: "GET",
        url: "/sync/brandcompany/details/:id",
        preHandler: fastify.authenticate,
        schema: schemas.getBrandsCompanySchema,
        handler: handlers.getBrandCompanyDetailsHandler(fastify)
    })
    fastify.route({
        method: "GET",
        url: "/sync/merchantcategory/details/:id",
        preHandler: fastify.authenticate,
        schema: schemas.getMerchantCategorySchema,
        handler: handlers.getMerchantCategoryDetailsHandler(fastify)
    })

    fastify.route({
        method: "GET",
        url: "/sync/main/category/details/:id",
        preHandler: fastify.authenticate,
        schema: schemas.getCategoryDetailsSchema,
        handler: handlers.getCategoryDetailsHandler(fastify)
    })

    fastify.route({
        method: "GET",
        url: "/sync/category/edit/details/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getCategoryEditSchema,
        handler: handlers.getCategoryEditDetailsHandler(fastify)
    })

    fastify.route({
        method: "GET",
        url: "/sync/brand/edit/details/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getBrandEditSchema,
        handler: handlers.getBrandEditDetailsHanlder(fastify)
    })

    fastify.route({
        method: "GET",
        url: "/sync/merchantcategory/edit/details/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getMerchantCategoryEditSchema,
        handler: handlers.getMerchantCategoryEditDetailsHanlder(fastify)
    })

    fastify.route({
        method: "GET",
        url: "/sync/brand/company/edit/details/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getBrandCompanyEditSchema,
        handler: handlers.getBrandCompanyEditDetailsHanlder(fastify)
    })

    fastify.route({
        method: "GET",
        url: "/sync/item/barcode/details/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getItemBarcodeDetailsSchema,
        handler: handlers.getItemBarcodeDetailsHandler(fastify)
    })

    fastify.route({
        method: "GET",
        url: "/sync/item/setting/details/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getItemSettingDetailsSchema,
        handler: handlers.getItemSettingsDetailsHandler(fastify)
    })

    fastify.route({
        method: "GET",
        url: "/sync/product/master/details/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getProductMasterDetailsSchema,
        handler: handlers.getProductMasterDetailsHandler(fastify)
    })

    fastify.route({
        method: "GET",
        url: "/sync/product/master/edit/details/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getProductMasterEditDetailsSchema,
        handler: handlers.getProductMasterEditDetailsHandler(fastify)
    })

    fastify.route({
        method: "GET",
        url: "/sync/supplier/outlet/mapping/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getSyncSupplierOutletMappingSchema,
        handler: handlers.getSyncSupplierOutletMappingHandler(fastify)
    });


    fastify.route({
        method: "PUT",
        url: "/sync/supplier/outlet/mapping/:outlet_id/:local_supplier_mapping",
        preHandler: fastify.authenticate,
        schema: schemas.putSupplierByOutletMappingSchema,
        handler: handlers.putSyncSupplierOutletMappingHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/sync/supplier/insert/update/details/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getSyncSupplierInsertUpdateDetailsSchema,
        handler: handlers.getSyncSupplierInsertUpdateDetailsHandler(fastify)
    });

    fastify.route({
        method: "PUT",
        url: "/sync/supplier/insert/update/details/:outlet_id",
        preHandler: fastify.authenticate,
        // schema: schemas.putSupplierByOutletMappingSchema,
        handler: handlers.putSyncSupplierFlagUpdateHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/sync/outlet/po/details/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.getSyncOutletPoDetailsSchema,
        handler: handlers.getSyncOutletPoDetailsHandler(fastify)
    });

    fastify.route({
        method: "GET",
        url: "/sync/rate/entry/details/:tr_id/:loc_id/:tr_date",
        preHandler: fastify.authenticate,
        schema: schemas.getRedetailsSchema,
        handler: handlers.getRedetailsHandler(fastify)
    });

    fastify.route({
        method: "PUT",
        url: "/sync/putReDetails/:tr_id",
        preHandler: fastify.authenticate,
        schema: schemas.updateReDetailsSchema,
        handler: handlers.putReDetailsHandler(fastify)
    });

    //============Sync Outlet PO get and update ================//

    fastify.route({
        method: "GET",
        url: "/sync/outlet/po/:outlet_id/:flag",
        preHandler: fastify.authenticate,
        schema: schemas.getPoSyncPaginateSchema,
        handler: handlers.getPosyncHandler(fastify)
    });

    fastify.route({
        method: "PUT",
        url: "/sync/outlet/po/update/:po_no/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.updatePoSyncSchema,
        handler: handlers.putOutletPOSyncHandler(fastify)
    });

    //============Sync Outlet Grn get and update ================//

    fastify.route({
        method: "GET",
        url: "/sync/outlet/grn/:outlet_id/:flag",
        preHandler: fastify.authenticate,
        schema: schemas.getPurchaseSyncSchema,
        handler: handlers.getPurchaseSyncHandler(fastify)
    });

    fastify.route({
        method: "PUT",
        url: "/sync/outlet/grn/update/:grn_no/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.updateGrnSyncSchema,
        handler: handlers.putOutletGrnSyncHandler(fastify)
    });

    //============Outlet Purchase return sync get and update ================//

    fastify.route({
        method: "GET",
        url: "/sync/outlet/purchase/return/:outlet_id/:flag",
        preHandler: fastify.authenticate,
        schema: schemas.getPurchaseReturnSyncSchema,
        handler: handlers.getPurchaseReturnSyncHandler(fastify)
    });

    fastify.route({
        method: "PUT",
        url: "/sync/outlet/purchase/return/update/:doc_no/:outlet_id/:outlet_purchase_no",
        preHandler: fastify.authenticate,
        schema: schemas.updatePurchaseReturnSyncSchema,
        handler: handlers.putOutletPurchaseReturnSyncHandler(fastify)
    });

    //============Sync Outlet Debit note get and update ================//

    fastify.route({
        method: "GET",
        url: "/sync/outlet/debitNote/:outlet_id/:flag",
        preHandler: fastify.authenticate,
        schema: schemas.getOutletDebitNoteSyncSchema,
        handler: handlers.getOutletDebitNoteSyncHandler(fastify)
    });

    fastify.route({
        method: "PUT",
        url: "/sync/outlet/debitNote/update/:doc_no/:outlet_id",
        preHandler: fastify.authenticate,
        schema: schemas.updateOutletDebitNoteSyncSchema,
        handler: handlers.putOutletDebitNoteSyncHandler(fastify)
    });

     //============Sync Warehouse sales get and update ================//

      fastify.route({
        method: "GET",
        url: "/sync/warehouse/sales/:warehouse_id",
        preHandler: fastify.authenticate,
        schema: schemas.getWarehouseSalesSyncSchema,
        handler: handlers.getWarehouseSalesSyncHandler(fastify)
    });

    fastify.route({
        method: "PUT",
        url: "/sync/warehouse/sales/update/:op_doc_no",
        preHandler: fastify.authenticate,
        schema: schemas.updateWarehouseSalesSyncSchema,
        handler: handlers.updateWarehouseSalesSyncHandler(fastify)
    });

     //============Sync Warehouse sales return get and update ================//

      fastify.route({
        method: "GET",
        url: "/sync/warehouse/sales/return/:warehouse_id",
        preHandler: fastify.authenticate,
        schema: schemas.getWarehouseSalesReturnSyncSchema,
        handler: handlers.getWarehouseSalesReturnSyncHandler(fastify)
    });

    fastify.route({
        method: "PUT",
        url: "/sync/warehouse/sales/return/update/:opr_doc_no",
        preHandler: fastify.authenticate,
        schema: schemas.updateWarehouseSalesReturnSyncSchema,
        handler: handlers.updateWarehouseSalesReturnSyncHandler(fastify)
    });

}