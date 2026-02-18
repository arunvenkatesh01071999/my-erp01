const getGroupMasterSchema = require("./getGroupMasterSchema");
const postGroupMasterSchema = require("./postGroupMasterSchema");
const putGroupMasterSchema = require("./putGroupMasterSchema");
const deleteGroupMasterSchema = require("./deleteGroupMasterSchema");
const getGroupMasterInfoSchema = require("./getGroupMasterInfoSchema");
const getGroupMasterPaginateSchema = require("./getGroupMasterPaginateSchema");
const getTypeDesignByCategorySchema = require("./getTypeDesignByCategory");
module.exports = {
  getGroupMasterSchema,
  postGroupMasterSchema,
  putGroupMasterSchema,
  deleteGroupMasterSchema,
  getGroupMasterInfoSchema,
  getGroupMasterPaginateSchema,
  getTypeDesignByCategorySchema
};
