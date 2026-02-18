const placeOrderHandler = require("./placeOrderHandler");
const getOrderHandler = require("./getOrderHandler");
const getOrderByIdHandler = require("./getOrderByIdHandler");
const getOrderPaginateHandler = require("./getOrderPaginateHandler");
const orderStatusCountHandler = require("./orderStatusCountHandler");
const orderStatusChangeHandler = require("./orderStatusChangeHandler");
const orderYearSalesHandler = require("./orderYearSalesHandler");
const orderMonthSalesHandler = require("./orderMonthSalesHandler");
const getOrderByDatePaginateHandler = require("./getOrderByDatePaginateHandler");
const orderItemsSalesHandler = require("./orderItemsSalesHandler");
const orderCategorySalesHandler = require("./orderCategorySalesHandler");

module.exports = {
  placeOrderHandler,
  getOrderHandler,
  getOrderByIdHandler,
  getOrderPaginateHandler,
  orderStatusCountHandler,
  orderStatusChangeHandler,
  orderYearSalesHandler,
  orderMonthSalesHandler,
  getOrderByDatePaginateHandler,
  orderItemsSalesHandler,
  orderCategorySalesHandler
};
