const postPuchasereturnSchema = require("./postPurchaseReturnSchema");
const putPurchaseReturnSchema = require("./putPurchaseReturnSchema");
const deletePurchaseReturnSchema = require("./deletePurchaseReturnSchema");
const getPuchasereturnSchema = require("./getPurchaseSchema")
const getPurchaseDocNoSchema = require("./getPurchaseDocnoSchema")
const getAllPurchase = require("./getAllPurchase")
const getPurchaseReturnNoSchema = require("./generatePurchaseReturnNoSchema");
const getProductDetailsBySupplierSchema = require("./getProductDetailsBySupplierSchema");
const getPurchaseReturnListSchema = require("./getPurchaseReturnListSchema");
const getPurchaseNoDetailsSchema = require("./getPurchaseNoDetailsSchema");
const getPurchaseReturnEditListSchema = require("./getPurchaseReturnEditListSchema");
const getPurchaseReturnByIdSchema = require("./getPurchaseReturnByIdSchema");
module.exports = {
  postPuchasereturnSchema,
  putPurchaseReturnSchema,
  deletePurchaseReturnSchema,
  getPuchasereturnSchema,
  getPurchaseDocNoSchema,
  getAllPurchase,
  getPurchaseReturnNoSchema,
  getProductDetailsBySupplierSchema,
  getPurchaseReturnListSchema,
  getPurchaseNoDetailsSchema,
  getPurchaseReturnEditListSchema,
  getPurchaseReturnByIdSchema
};
