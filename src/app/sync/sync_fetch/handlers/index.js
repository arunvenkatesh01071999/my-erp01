const getBrandDetailsHandler = require("./getBrandDetailsHandler");
const getUnitDetailsHandler = require("./getUnitDetailsHandler");
const getBrandCompanyDetailsHandler = require("./getBrandCompanyDetailsHandler");
const getMerchantCategoryDetailsHandler = require("./getMerchantCategoryHandler");
const getCategoryDetailsHandler = require("./getCategoryDetailsHandler");
const getCategoryEditDetailsHandler = require("./getCategoryEditDetailsHandler");
const getBrandEditDetailsHanlder = require("./getBrandEditDetailsHanlder");
const getMerchantCategoryEditDetailsHanlder = require("./getMerchantCategoryEditDetailsHanlder");
const getBrandCompanyEditDetailsHanlder = require("./getBrandCompanyEditDetailsHanlder");
const getItemBarcodeDetailsHandler = require("./getItemBarcodeDetailsHandler");
const getItemSettingsDetailsHandler = require("./getItemSettingsDetailsHandler");
const getProductMasterDetailsHandler = require("./getProductMasterDetailsHandler");
const getProductMasterEditDetailsHandler = require("./getProductMasterEditDetailsHandler");
const putItemsyncDetailsHandler = require("./putItemsyncDetailsHandler");
const getSyncSupplierOutletMappingHandler = require("./getSyncSupplierOutletMappingHandler");
const putSyncSupplierOutletMappingHandler = require("./putSyncSupplierOutletMappingHandler");
const getSyncSupplierInsertUpdateDetailsHandler = require("./getSyncSupplierInsertUpdateDetailsHandler");
const putSyncSupplierFlagUpdateHandler = require("./putSyncSupplierFlagUpdateHandler");
const getSyncOutletPoDetailsHandler = require("./getSyncOutletPoDetailsHandler");
const getRedetailsHandler = require("./getRedetailsHandler");
const putReDetailsHandler = require("./putReDetailsHandler");
const getPosyncHandler = require("./getPosyncHandler")
const putOutletPOSyncHandler = require("./putOutletPOSyncHandler")
const getPurchaseSyncHandler = require("./getPurchaseSyncHandler")
const putOutletGrnSyncHandler = require("./putOutletGrnSyncHandler")
const getPurchaseReturnSyncHandler = require("./getPurchaseReturnSyncHandler")
const putOutletPurchaseReturnSyncHandler=require("./putOutletPurchaseReturnSyncHandler")
const getOutletDebitNoteSyncHandler=require("./getOutletDebitNoteSyncHandler")
const putOutletDebitNoteSyncHandler=require("./putOutletDebitNoteSyncHandler")
const getWarehouseSalesSyncHandler = require("./getWarehouseSalesSyncHandler")
const updateWarehouseSalesSyncHandler = require("./updateWarehouseSalesSyncHandler")
const getWarehouseSalesReturnSyncHandler = require("./getWarehouseSalesReturnSyncHandler")
const updateWarehouseSalesReturnSyncHandler = require("./updateWarehouseSalesReturnSyncHandler")
module.exports = {
    getBrandDetailsHandler,
    getUnitDetailsHandler,
    getBrandCompanyDetailsHandler,
    getMerchantCategoryDetailsHandler,
    getCategoryEditDetailsHandler,
    getCategoryDetailsHandler,
    getBrandEditDetailsHanlder,
    getMerchantCategoryEditDetailsHanlder,
    getBrandCompanyEditDetailsHanlder,
    getItemBarcodeDetailsHandler,
    getItemSettingsDetailsHandler,
    getProductMasterDetailsHandler,
    getProductMasterEditDetailsHandler,
    putItemsyncDetailsHandler,
    getSyncSupplierOutletMappingHandler,
    putSyncSupplierOutletMappingHandler,
    getSyncSupplierInsertUpdateDetailsHandler,
    putSyncSupplierFlagUpdateHandler,
    getSyncOutletPoDetailsHandler,
    getRedetailsHandler,
    putReDetailsHandler,
    getPosyncHandler,
    putOutletPOSyncHandler,
    getPurchaseSyncHandler,
    putOutletGrnSyncHandler,
    getPurchaseReturnSyncHandler,
    putOutletPurchaseReturnSyncHandler,
    getOutletDebitNoteSyncHandler,
    putOutletDebitNoteSyncHandler,
    getWarehouseSalesSyncHandler,
    updateWarehouseSalesSyncHandler,
    getWarehouseSalesReturnSyncHandler,
    updateWarehouseSalesReturnSyncHandler
}