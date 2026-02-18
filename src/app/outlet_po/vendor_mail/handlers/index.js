const postVendorEmailHandler = require("./postVendorEmailHandler");
const putVendorEmailHandler = require("./putVendorEmailHandler");
const getVendorMailHandler = require("./getVendorMailHandler");
const getVendorMailBrandCompanyListHandler = require("./getVendorMailBrandCompanyListHandler")
const getVendorMailSupplierListHandler = require("./getVendorMailSupplierListHandler")
const getVendorMailByIdHandler = require("./getVendorMailByIdHandler")
const deleteVendorEmailHandler = require("./deleteVendorEmailHandler")
const getVendorMailExcelExportHandler = require("./getVendorMailExcelExportHandler")
const postVendorEmailExcelImportHandler=require("./postVendorEmailExcelImportHandler")
module.exports = {
    postVendorEmailHandler,
    putVendorEmailHandler,
    getVendorMailHandler,
    getVendorMailBrandCompanyListHandler,
    getVendorMailSupplierListHandler,
    getVendorMailByIdHandler,
    deleteVendorEmailHandler,
    getVendorMailExcelExportHandler,
    postVendorEmailExcelImportHandler
};
