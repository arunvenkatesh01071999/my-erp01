const getParentProductSchema = require("./getParentProductSchema");
const getChildProductSchema = require("./getChildProductSchema");
const postPackingPlanningSchema = require("./postPackingPlanningSchema");
const updatePackingPlanningSchema = require("./updatePackingPlanningSchema");
const getPackingPlanningDocnoSchema = require("./getPackingPlanningDocnoSchema");
const getAllPackingPlanningSchema = require("./getAllPackingPlanningSchema");
const getPackingPlanningByIdSchema = require("./getPackingPlanningByIdSchema");
const getGrnByProductIdSchema = require("./getGrnByProductIdSchema");


module.exports = {
  getParentProductSchema,
  getChildProductSchema,
  postPackingPlanningSchema,
  updatePackingPlanningSchema,
  getPackingPlanningDocnoSchema,
  getPackingPlanningByIdSchema,
  getAllPackingPlanningSchema,
  getGrnByProductIdSchema
};
