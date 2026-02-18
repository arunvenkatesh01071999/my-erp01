const getSupplierSchema = require("./getCustomerSchema");
const postSupplierSchema = require("./postSupplierSchema");
const putSupplierSchema = require("./putSupplierSchema");
const deleteSupplierSchema = require("./deleteSupplierSchema");
const getSupplierInfoSchema = require("./getSupplierInfoSchema");
const getSupplierPaginateSchema = require("./getSupplierPaginateSchema");
const getSupplierByProductSchema = require("./getSupplierByProductSchema");
module.exports = {
  getSupplierSchema,
  postSupplierSchema,
  putSupplierSchema,
  deleteSupplierSchema,
  getSupplierInfoSchema,
  getSupplierPaginateSchema,
  getSupplierByProductSchema
};
