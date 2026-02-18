const getAccountMasterSchema = require("./getAccountMaster");
const postAccountMasterSchema = require("./postAccountMasterSchema");
const putAccountMasterSchema = require("./putAccountMasterSchema");
const deleteAccountMasterSchema = require("./deleteAccountMasterSchema");
const getAccountMasterInfoSchema = require("./getAccountMasterInfoSchema");
const getAccountMasterPaginateSchema = require("./getAccountMasterPaginateSchema");

module.exports = {
  getAccountMasterSchema,
  postAccountMasterSchema,
  putAccountMasterSchema,
  deleteAccountMasterSchema,
  getAccountMasterInfoSchema,
  getAccountMasterPaginateSchema
};
