const salesReportSchema = require("./salesReportSchema");
const salesItemWiseReportSchema = require("./salesItemWiseReportSchema");
const salesItemWiseBreakupReportSchema = require("./salesItemWiseBreakupReportSchema");
const salesItemWiseAllReportSchema = require("./salesItemWiseAllReportSchema");
const salesGroupWiseAllReportSchema = require("./salesGroupWiseAllReportSchema");

const salesItemWiseBreakupReportProdidSchema = require("./salesItemWiseBreakupReportProdidSchema");
const getSalesOutletTypeReportSchema = require("./getSalesOutletTypeReportSchema")
const getSalesTransferReportSchema = require("./getSalesTransferReportSchema.js")
module.exports = {
  salesReportSchema,
  salesItemWiseReportSchema,
  salesItemWiseBreakupReportSchema,
  salesItemWiseAllReportSchema,
  salesGroupWiseAllReportSchema,
  salesItemWiseBreakupReportProdidSchema,
  getSalesOutletTypeReportSchema,
  getSalesTransferReportSchema
};
