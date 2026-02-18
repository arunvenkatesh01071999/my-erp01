const getWareHouseSchema = require("./getWareHouseSchema");
const getCompanyByIdSchema = require("./getCompanyByIdSchema");
const postWareHouseSchema = require("./postWareHouseSchema");
const putWareHouseSchema = require("./putWareHouseSchema");
const deleteWareHouseSchema = require("./deleteWareHouseSchema");
const getWareHouseInfoSchema = require("./getWareHouseInfoSchema");
const getWareHousePaginateSchema = require("./getWareHousePaginateSchema");
const getWareHouseListSchema = require("./getWarehouseListSchema");
const getWareHouseByUserSchema = require("./getWareHouseByUserSchema");
const getWareHouseListByIdSchema = require("./getWareHouseListByIdSchema");
const getWarehouseCityWiseSchema = require("./getWarehouseCityWiseSchema");
const getRegionSchema=require("./getRegionSchema")
const getWareHouseProductSchema = require("./getWareHouseProductSchema.js")
module.exports = {
  getWareHouseSchema,
  postWareHouseSchema,
  putWareHouseSchema,
  deleteWareHouseSchema,
  getWareHouseInfoSchema,
  getWareHousePaginateSchema,
  getWareHouseListSchema,
  getWareHouseByUserSchema,
  getCompanyByIdSchema,
  getWareHouseListByIdSchema,
  getWarehouseCityWiseSchema,
  getRegionSchema,
  getWareHouseProductSchema
};
