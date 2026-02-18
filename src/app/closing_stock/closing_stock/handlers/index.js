const postClosingStockHandler = require("./postClosingStockHandler");
const postClosingStockCountHandler = require("./postClosingStockCountHandler");
const postAvailableStockCountHandler = require("./postAvailableStockCountHandler.js");

const postClosingStockTempHandler = require("./postClosingStockTempHandler");
const getClosingStockTempDetailsHandler = require("./getClosingStockTempDetailsHandler")
const deleteClosingStockTempHandler = require("./deleteClosingStockTempHandler.js")
const deleteAllClosingStockTempHandler = require("./deleteAllClosingStockTempHandler.js")
const deleteAllClosingStockOutletHandler = require("./deleteAllClosingStockOutletHandler.js")
const deleteAllMissingStockHandler = require("./deleteAllMissingStockHandler.js")

module.exports = {
  postClosingStockHandler,
  postClosingStockCountHandler,
  postClosingStockTempHandler,
  getClosingStockTempDetailsHandler,
  deleteClosingStockTempHandler,
  deleteAllClosingStockTempHandler,
  deleteAllClosingStockOutletHandler,
  deleteAllMissingStockHandler,
  postAvailableStockCountHandler
};
