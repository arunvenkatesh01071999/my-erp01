const getInchargeMasterSchema = require("./getInchargeMasterSchema");
const postInchargeMasterSchema = require("./postInchargeMasterSchema");
const putInchargeMasterSchema = require("./putInchargeMasterSchema");
const deleteInchargeMasterSchema = require("./deleteInchargeMasterSchema");
const getInchargeMasterInfoSchema = require("./getInchargeMasterInfoSchema");
const getInchargeMasterPaginateSchema = require("./getInchargeMasterPaginateSchema");
const getTypeDesignByCategorySchema = require("./getTypeDesignByCategory");
module.exports = {
  getInchargeMasterSchema,
  postInchargeMasterSchema,
  putInchargeMasterSchema,
  deleteInchargeMasterSchema,
  getInchargeMasterInfoSchema,
  getInchargeMasterPaginateSchema,
  getTypeDesignByCategorySchema
};
