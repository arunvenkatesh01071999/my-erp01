const postVendorEmailSchema = require("./postVendorEmailSchema")
const putVendorEmailSchema = require("./putVendorEmailSchema")
const getVendorMailSchema = require("./getVendorMailSchema")
const getVendorMailBrandCompanyListSchema = require("./getVendorMailBrandCompanyListSchema")
const getVendorMailSupplierListSchema = require("./getVendorMailSupplierListSchema")
const getVendorMailByIdSchema = require("./getVendorMailByIdSchema")
const deleteVendorMailSchema = require("./deleteVendorMailSchema")
const getVendorMailExcelExportSchema = require("./getVendorMailExcelExportSchema")
module.exports = {
    postVendorEmailSchema,
    putVendorEmailSchema,
    getVendorMailSchema,
    getVendorMailBrandCompanyListSchema,
    getVendorMailSupplierListSchema,
    getVendorMailByIdSchema,
    deleteVendorMailSchema,
    getVendorMailExcelExportSchema
};
