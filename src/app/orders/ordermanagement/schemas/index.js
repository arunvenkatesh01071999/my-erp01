const placeOrderSchema = require("./placeOrderSchema");
const getOrderSchema = require("./getOrderSchema");
const getOrderByIdSchema = require("./getOrderByIdSchema");
const getOrderPaginateSchema = require("./getOrderPaginateSchema");
const orderStatusCountSchema = require("./orderStatusCountSchema");
const orderStatusChangeSchema = require("./orderStatusChangeSchema");
const orderYearSalesSchema = require("./orderYearSalesSchema");
const orderMonthSalesSchema = require("./orderMonthSalesSchema");
const getOrderByDatePaginateSchema = require("./getOrderByDatePaginateSchema");
const orderItemsSalesSchema = require("./orderItemsSalesSchema");
const orderCategorySalesSchema = require("./orderCategorySalesSchema");

module.exports = {
  placeOrderSchema,
  getOrderSchema,
  getOrderByIdSchema,
  getOrderPaginateSchema,
  orderStatusCountSchema,
  orderStatusChangeSchema,
  orderYearSalesSchema,
  orderMonthSalesSchema,
  getOrderByDatePaginateSchema,
  orderItemsSalesSchema,
  orderCategorySalesSchema
};
