const postClosingStockOutletHandler = require("./postClosingStockOutletHandler");
const getPendingStockHandler = require("./getPendingStockHandler.js");
const postPendingStockToCloshingStockHandler = require("./postPendingStockToCloshingStockHandler.js");
const postPendingStockToMissingStockHandler = require("./postPendingStockToMissingStockHandler.js");
const getPendingStockViewNewHandler = require("./getPendingStockViewNewHandler.js");


module.exports = {
  postClosingStockOutletHandler,
  getPendingStockHandler,
  postPendingStockToCloshingStockHandler,
  postPendingStockToMissingStockHandler,
  getPendingStockViewNewHandler
};
