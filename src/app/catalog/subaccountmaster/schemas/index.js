const postSubAccountsSchema = require("./postSubAccountsSchema");
const putSubAccountsSchema = require("./putSubAccountsSchema");
const getSubAccountsSchema = require("./getSubAccountsSchema");
const deleteSubAccountsSchema = require("./deleteSubAccountsSchema");
const getSubAccountsInfoSchema = require("./getSubAccountsInfoSchema");
const getSubAccountsPaginateSchema = require("./getSubAccountsPaginateSchema");
const getSubAccountsByAccSchema = require("./getSubAccountsByAccSchema");

module.exports = {
  postSubAccountsSchema,
  putSubAccountsSchema,
  getSubAccountsSchema,
  deleteSubAccountsSchema,
  getSubAccountsInfoSchema,
  getSubAccountsPaginateSchema,
  getSubAccountsByAccSchema
};
