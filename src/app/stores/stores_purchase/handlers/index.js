
const postStoreManualPurchaseHandler = require("./postStoreManualPurchaseHandler")
const postStoresPOHandler = require("./postStoresPOHandler")
const getStorePoUnApprovedProductHandler = require("./getStorePoUnApprovedProductHandler")
const getStorePurchaseOrderApprovedItemHandler = require("./getStorePurchaseOrderApprovedItemHandler")
const putStorePurchaseOrderProductHandler = require("./putStorePurchaseOrderProductHandler")
const putStoresPoUnApprovedProductHandler = require("./putStoresPoUnApprovedProductHandler")
const postStorePoPurchaseHandler = require("./postStorePoPurchaseHandler.js")
const postStorepurchaseReturnHandler = require("./postStorepurchaseReturnHandler")
const putStorePurchaseReturnHandler = require("./putStorePurchaseReturnHandler")
const getStorePurchaseReturnByIdHandler = require("./getStorePurchaseReturnByIdHandler")
const deleteStorePurchaseReturnHandler = require("./deleteStorePurchaseReturnHandler")
module.exports = {

  postStoreManualPurchaseHandler,
  postStoresPOHandler,
  getStorePoUnApprovedProductHandler,
  getStorePurchaseOrderApprovedItemHandler,
  putStorePurchaseOrderProductHandler,
  putStoresPoUnApprovedProductHandler,
  postStorePoPurchaseHandler,
  postStorepurchaseReturnHandler,
  putStorePurchaseReturnHandler,
  getStorePurchaseReturnByIdHandler,
  deleteStorePurchaseReturnHandler
};
