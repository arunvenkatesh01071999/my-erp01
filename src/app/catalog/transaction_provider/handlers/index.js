const getTransactionProviderHandler = require("./getTransactionProvider.js");
const getTransactionProviderMerchantKeyHandler = require("./getTransactionProviderMerchantKeyHandler.js")
const putTransactionProviderHandler = require("./putTransactionProviderHandler.js");
const postTransactionProviderHandler = require("./postTransactionProviderHandler.js");
const deleteTransactionProviderHandler = require("./deleteTransactionProviderHandler.js");


module.exports = {
  getTransactionProviderHandler,
  putTransactionProviderHandler,
  postTransactionProviderHandler,
  deleteTransactionProviderHandler,
  getTransactionProviderMerchantKeyHandler
};
