const getSupplierSchema = require("./getSupplierSchema");
const postSupplierSchema = require("./postSupplierSchema");
const putSupplierSchema = require("./putSupplierSchema");
const deleteSupplierSchema = require("./deleteSupplierSchema");
const getSupplierInfoSchema = require("./getSupplierInfoSchema");
const getSupplierPaginateSchema = require("./getSupplierPaginateSchema");
const getSupplierByProductSchema = require("./getSupplierByProductSchema");
const getSupplierByOutletSchema = require("./getSupplierByOutletSchema");
const postExcelSupplierSchema = require("./postExcelSupplierSchema");
const getSupplierOutletMappingSchema = require("./getSupplierOutletMappingSchema");
const getSupplierOutletMappingOrderDaysSchema = require("./getSupplierOutletMappingOrderDaysSchema");
const putSupplierOutletMappingOrderDaysSchema = require("./putSupplierOutletMappingOrderDaysSchema");
const getSupplierOutletMappingExportSchema = require("./getSupplierOutletMappingExportSchema");
const getSupplierOutletOrderDaysExportSchema = require("./getSupplierOutletOrderDaysExportSchema")
const excelSkuMappingSchema = require("./excelSkuMappingSchema")
const getSupplierOrderDaysWithBrandNameSchema = require('./getSupplierOrderDaysWithBrandNameSchema')
const postSupplierImportVaidationSchema = require('./postSupplierImportVaidationSchema')
const putSupplierOutletMappingOrderDaysBrandBasedSchema = require("./putSupplierOutletMappingOrderDaysBrandBasedSchema")
const getSupplierOrderDaysBrandSchema = require("./getBrandCompanyBySupplierOrderDaysSchema")
const getProductMappingBySupplierIdSchema = require("./getProductMappingBySupplierIdSchema")
module.exports = {
  getSupplierSchema,
  postSupplierSchema,
  putSupplierSchema,
  putSupplierOutletMappingOrderDaysSchema,
  deleteSupplierSchema,
  getSupplierInfoSchema,
  getSupplierPaginateSchema,
  getSupplierByProductSchema,
  getSupplierByOutletSchema,
  postExcelSupplierSchema,
  getSupplierOutletMappingSchema,
  getSupplierOutletMappingOrderDaysSchema,
  getSupplierOutletMappingExportSchema,
  getSupplierOutletOrderDaysExportSchema,
  getProductMappingBySupplierIdSchema,
  excelSkuMappingSchema,
  getSupplierOrderDaysWithBrandNameSchema,
  postSupplierImportVaidationSchema,
  putSupplierOutletMappingOrderDaysBrandBasedSchema,
  getSupplierOrderDaysBrandSchema
};
