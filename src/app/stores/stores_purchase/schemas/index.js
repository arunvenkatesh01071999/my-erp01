
const postStoreManualPurchaseSchema = require("./postStoreManualPurchaseSchema")
const postStoresPOSchema = require("./postStoresPOSchema")
const getStoresUnApprovedPurchaseOrderProductSchema = require("./getStoresUnApprovedPurchaseOrderProductSchema")
const getStorePurchaseOrderApprovedPonoSchema = require("./getStorePurchaseOrderApprovedPonoSchema")
const putStorePurchaseOrderProductsSchema = require("./putStorePurchaseOrderProductsSchema")
const putStoresUnApprovedPoProductSchema = require("./putStoresUnApprovedPoProductSchema")
const postStorePoPurchaseSchema = require("./postStorePoPurchaseSchema")
const postStorePurchaseReturnSchema = require("./postStorePurchaseReturnSchema")
const putStorePurchaseReturnSchema = require("./putStorePurchaseReturnSchema")
const deleteStorePurchaseReturnSchema = require("./deleteStorePurchaseReturnSchema")
const getStorePurchaseReturnByIdSchema = require("./getStorePurchaseReturnByIdSchema")
module.exports = {

  postStoreManualPurchaseSchema,
  postStoresPOSchema,
  getStoresUnApprovedPurchaseOrderProductSchema,
  getStorePurchaseOrderApprovedPonoSchema,
  putStorePurchaseOrderProductsSchema,
  putStoresUnApprovedPoProductSchema,
  postStorePoPurchaseSchema,
  postStorePurchaseReturnSchema,
  putStorePurchaseReturnSchema,
  deleteStorePurchaseReturnSchema,
  getStorePurchaseReturnByIdSchema
};
