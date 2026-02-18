const getBrandsSchema = require("./getBrandsSchema");
const getUnitScheme = require("./getUnitSchema");
const getBrandsCompanySchema = require("./getBrandsCompanySchema");
const getMerchantCategorySchema = require("./getMerchantCategorySchema");
const getCategoryEditSchema = require("./getCategoryEditSchema");
const getBrandEditSchema = require("./getBrandEditSchema");
const getCategoryDetailsSchema = require("./getCategoryDetailsSchema");
const getMerchantCategoryEditSchema = require("./getMerchantCategoryEditSchema");
const getBrandCompanyEditSchema = require("./getBrandCompanyEditSchema");
const getItemBarcodeDetailsSchema = require("./getItemBarcodeDetailsSchema");
const getItemSettingDetailsSchema = require("./getItemSettingDetailsSchema");
const getProductMasterDetailsSchema = require("./getProductMasterDetailsSchema");
const getProductMasterEditDetailsSchema = require("./getProductMasterEditDetailsSchema");
const getSyncSupplierOutletMappingSchema = require("./getSyncSupplierOutletMappingSchema");
const putSupplierByOutletMappingSchema = require("./putSupplierByOutletMappingSchema");
const getSyncSupplierInsertUpdateDetailsSchema = require("./getSyncSupplierInsertUpdateDetailsSchema");
const getSyncOutletPoDetailsSchema = require("./getSyncOutletPoDetailsSchema");
// const putSupplierByOutletMappingSchema = require("./putSupplierByOutletMappingSchema");
const getRedetailsSchema = require("./getRedetailsSchema");
const updateReDetailsSchema = require("./updateReDetailsSchema")
const getPoSyncPaginateSchema = require("./getPoSyncPaginateSchema")
const updatePoSyncSchema = require("./updatePoSyncSchema")
const getPurchaseSyncSchema = require("./getPurchaseSyncSchema")
const updateGrnSyncSchema = require("./updateGrnSyncSchema")
const getPurchaseReturnSyncSchema = require("./getPurchaseReturnSyncSchema")
const updatePurchaseReturnSyncSchema = require("./updatePurchaseReturnSyncSchema")
const getOutletDebitNoteSyncSchema = require("./getOutletDebitNoteSyncSchema")
const updateOutletDebitNoteSyncSchema=require("./updateOutletDebitNoteSyncSchema")
const getWarehouseSalesReturnSyncSchema = require("./getWarehouseSalesReturnSyncSchema.js")
const updateWarehouseSalesSyncSchema = require("./updateWarehouseSalesSyncSchema.js")
const getWarehouseSalesSyncSchema = require("./getWarehouseSalesSyncSchema.js")
const updateWarehouseSalesReturnSyncSchema = require("./updateWarehouseSalesReturnSyncSchema.js")

module.exports = {
    getBrandsSchema,
    getUnitScheme,
    getBrandsCompanySchema,
    getMerchantCategorySchema,
    getCategoryEditSchema,
    getCategoryDetailsSchema,
    getBrandEditSchema,
    getMerchantCategoryEditSchema,
    getBrandCompanyEditSchema,
    getItemBarcodeDetailsSchema,
    getItemSettingDetailsSchema,
    getProductMasterDetailsSchema,
    getProductMasterEditDetailsSchema,
    getSyncSupplierOutletMappingSchema,
    putSupplierByOutletMappingSchema,
    getSyncSupplierInsertUpdateDetailsSchema,
    getSyncOutletPoDetailsSchema,
    getRedetailsSchema,
    updateReDetailsSchema,
    getPoSyncPaginateSchema,
    updatePoSyncSchema,
    getPurchaseSyncSchema,
    updateGrnSyncSchema,
    getPurchaseReturnSyncSchema,
    updatePurchaseReturnSyncSchema,
    getOutletDebitNoteSyncSchema,
    updateOutletDebitNoteSyncSchema,
    getWarehouseSalesReturnSyncSchema,
    updateWarehouseSalesSyncSchema,
    getWarehouseSalesSyncSchema,
    updateWarehouseSalesReturnSyncSchema
}