const postClosingStockSchema = require("./postClosingStockSchema");
const postClosingStockCountSchema = require("./postClosingStockCountSchema");
const postClosingStockTempSchema = require("./postClosingStockTempSchema");
const getClosingStockTempDetailsSchema = require("./getClosingStockTempDetailsSchema")
const deleteClosingStockTempSchema = require("./deleteClosingStockTempSchema")
const deleteAllClosingStockTempSchema = require("./deleteAllClosingStockTempSchema")
const deleteAllClosingStockOutletSchema = require("./deleteAllClosingStockOutletSchema.js")
const deleteAllMissigStockSchema = require("./deleteAllMissigStockSchema.js")
const postAvailableStockCountSchema = require("./postAvailableStockCountSchema.js")
module.exports = {
  postClosingStockSchema,
  postClosingStockCountSchema,
  postClosingStockTempSchema,
  getClosingStockTempDetailsSchema,
  deleteClosingStockTempSchema,
  deleteAllClosingStockTempSchema,
  deleteAllClosingStockOutletSchema,
  deleteAllMissigStockSchema,
  postAvailableStockCountSchema
};
