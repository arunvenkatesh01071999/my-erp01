const getTransactionProviderSchema = require("./getTransactionProviderSchema.js");
const postTransactionProviderSchema = require("./postTransactionProviderSchema.js");
const putTransactionProviderSchema = require("./putTransactionProviderSchema");
const deleteTransactionProviderSchema = require("./deleteTransactionProviderSchema");
const getTransactionProviderKeySchema = require("./getTransactionProviderKeySchema");

module.exports = {
  getTransactionProviderSchema,
  postTransactionProviderSchema,
  putTransactionProviderSchema,
  deleteTransactionProviderSchema,
  getTransactionProviderKeySchema
};
