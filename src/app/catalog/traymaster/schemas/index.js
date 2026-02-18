const getTrayMasterSchema = require("./getTrayMasterSchema");
const postTrayMasterSchema = require("./postTrayMasterSchema");
const putTrayMasterSchema = require("./putTrayMasterSchema");
const deleteTrayMasterSchema = require("./deleteTrayMasterSchema");
const getTrayMasterInfoSchema = require("./getTrayMasterInfoSchema");
const getTrayMasterPaginateSchema = require("./getTrayMasterPaginateSchema");
// const getTypeDesignByCategorySchema = require("./getTrayMasterByCategory");
module.exports = {
  getTrayMasterSchema,
  postTrayMasterSchema,
  putTrayMasterSchema,
  deleteTrayMasterSchema,
  getTrayMasterInfoSchema,
  getTrayMasterPaginateSchema,
  // getTypeDesignByCategorySchema
};
