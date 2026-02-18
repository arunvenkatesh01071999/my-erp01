const getSupplierHandler = require("./getSupplierHandler");
const putSupplierHandler = require("./putSupplierHandler");
const postSupplierHandler = require("./postSupplierHandler");
const deleteSupplierHandler = require("./deleteSupplierHandler");
const getSupplierInfoHandler = require("./getSupplierInfoHandler");
const getSupplierPaginateHandler = require("./getSupplierPaginateHandler");
const getSupplierByProductsHandler = require("./getSupplierByProductsHandler");
const getSupplierApprovalHandler = require("./getSupplierApprovalHandler");
const uploadDocumentHandler = require("./uploadDocumentHandler");
const uploadSupplierDocumentHandler = require("./uploadSupplierDocumentHandler");
const getOutletSupplierByProductsHandler = require("./getOutletSupplierByProductsHandler");
const getOutletSupplierBydayProductsHandler = require("./getOutletSupplierBydayProductsHandler");
const getSupplierByOutletsHandler = require("./getSupplierByOutletsHandler");
const postImportValidationSupplierExcelHandler = require("./postImportValidationSupplierExcelHandler");
const postExcelSupplierHandler = require("./postExcelSupplierHandler");
const getSupplierOutletMappingHandler = require("./getSupplierOutletMappingHandler");
const getSupplierOutletMappingOrderDaysHandler = require("./getSupplierOutletMappingOrderDaysHandler");
const putSupplierOutletMappingOrderDaysHandler = require("./putSupplierOutletMappingOrderDaysHandler");
const getSupplierDetailsExportHandler = require("./getSupplierDetailsExportHandler");
const getSupplierOutletOrderDaysExportHandler = require("./getSupplierOutletOrderDaysExportHandler");
const postSupplierExcelPoOrderDaysHandler = require("./postSupplierExcelPoOrderDaysHandler");
const excelSkuMappingHandler = require("./excelSkuMappingHandler");
const getExcelSkuMappingHandler = require("./getExcelSkuMappingHandler");
const removeExcelSkuMappingHandler = require("./removeExcelSkuMappingHandler");
const excelSupplierOuteletMappingHandler = require("./excelSupplierOuteletMappingHandler");
const getSuplierOrderDaysWithBrandNameExportHandler = require("./getSupplierOrderDaysWithBrandNameHandler");
const postSupplierExcelPoOrderDaysBrandbasedHandler = require("./postSupplierExcelPoOrderDaysBrandbasedHandler")
const getSuplierOrderDaysBrandBasedExportHandler = require("./getSuplierOrderDaysBrandBasedExportHandler")
const putSupplierOutletMappingOrderDaysBrandHandler = require("./putSupplierOutletMappingOrderDaysBrandHandler")

module.exports = {
  getSupplierHandler,
  putSupplierHandler,
  postSupplierHandler,
  deleteSupplierHandler,
  getSupplierInfoHandler,
  getSupplierPaginateHandler,
  getSupplierApprovalHandler,
  getSupplierByProductsHandler,
  uploadDocumentHandler,
  uploadSupplierDocumentHandler,
  getOutletSupplierByProductsHandler,
  getOutletSupplierBydayProductsHandler,
  getSupplierByOutletsHandler,
  postExcelSupplierHandler,
  getSupplierOutletMappingHandler,
  putSupplierOutletMappingOrderDaysHandler,
  getSupplierOutletMappingOrderDaysHandler,
  getSupplierDetailsExportHandler,
  getSupplierOutletOrderDaysExportHandler,
  postSupplierExcelPoOrderDaysHandler,
  excelSkuMappingHandler,
  getExcelSkuMappingHandler,
  removeExcelSkuMappingHandler,
  getSuplierOrderDaysWithBrandNameExportHandler,
  excelSupplierOuteletMappingHandler,
  postImportValidationSupplierExcelHandler,
  postSupplierExcelPoOrderDaysBrandbasedHandler,
  getSuplierOrderDaysBrandBasedExportHandler,
  putSupplierOutletMappingOrderDaysBrandHandler
};
