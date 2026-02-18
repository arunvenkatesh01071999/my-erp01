const getItemSchema = require("./getItemSchema");
const postItemSchema = require("./postItemSchema");
const putItemSchema = require("./putItemSchema");
const deleteItemSchema = require("./deleteItemSchema");
const getItemInfoSchema = require("./getItemInfoSchema");
const getItemPaginateSchema = require("./getItemPaginateSchema");
const getItemDetailsExportSchema = require("./getItemDetailsExportSchema.js");
const getProductcodeDetailsSchema = require("./getProductcodeDetailsSchema.js")
const putItemActiveStatusSchema = require("./putItemActiveStatusSchema.js")
const postItemImportVaidationSchema = require("./postItemImportVaidationSchema.js")
const getImportStatusTypeSchema = require("./getImportStatusTypeSchema.js")
const getItemStatusTypeSchema = require("./getItemStatusTypeSchema.js")
const getBarcodeSchema = require("./getBarcodeSchema")
const putItemDiscountSchema = require("./putItemDiscountSchema.js")
const getBarcodeIssueSchema = require("./getBarcodeIssueSchema.js")
const getItemPurchaseProductSchema = require("./getItemPurchaseProductSchema.js")
const getItemDetailsOutletsSalesProductSchema = require("./getItemDetailsOutletsSalesProductSchema.js")
const getSubWarehouseStocksSchema = require("./getSubWarehouseStocksSchema.js")
const getWarehouseMappingCustomerSchema = require("./getWarehouseMappingCustomerSchema.js")
const getParentListSchema = require("./getParentListSchema.js")
const getOutletItemOrderDaysSchema = require("./getOutletItemOrderDaysSchema.js")
const putItemSupplierOrderDaysSchema = require("./putItemSupplierOrderDaysSchema.js")
const skuPriceUploadSchema = require('./skuPriceUploadSchema.js')
const putPriceUploadSchema = require('./putPriceUploadSchema.js')

module.exports = {
  getItemSchema,
  postItemSchema,
  putItemSchema,
  deleteItemSchema,
  putItemActiveStatusSchema,
  getItemInfoSchema,
  getProductcodeDetailsSchema,
  getItemPaginateSchema,
  getItemDetailsExportSchema,
  getImportStatusTypeSchema,
  getItemStatusTypeSchema,
  getBarcodeSchema,
  putItemDiscountSchema,
  getBarcodeIssueSchema,
  getItemPurchaseProductSchema,
  getItemDetailsOutletsSalesProductSchema,
  getSubWarehouseStocksSchema,
  getWarehouseMappingCustomerSchema,
  getParentListSchema,
  postItemImportVaidationSchema,
  getOutletItemOrderDaysSchema,
  putItemSupplierOrderDaysSchema,
  skuPriceUploadSchema,
  putPriceUploadSchema
};
