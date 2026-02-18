const postSalesMasterSchema = require("./postSalesMasterSchema");
const putSalesMasterSchema = require("./putSalesMasterSchema.js");
const getSalesMasterByIdSchema = require("./getSalesMasterByIdSchema.js");
const deleteSalesMasterSchema = require("./deleteSalesMasterSchema.js");
const getCustomerMappingSchema = require("./getCustomerMappingSchema.js");
const getSalesEditListSchema = require("./getSalesEditListSchema.js");
const getSalesMasterUniqueDocnoSchema = require("./getSalesMasterUniqueDocnoSchema.js");
const getCustomerDetailsSchema = require("./getCustomerDetailsSchema.js");
const getProductDetailsSchema = require("./getProductDetailsSchema.js");
const getSalenoSchema = require("./getSalenoSchema.js");
const getExportPendingSchema = require("./getExportPendingSchema.js");
const putExportPendingSchema = require("./putExportPendingSchema.js");
module.exports = {
  postSalesMasterSchema,
  putSalesMasterSchema,
  getSalesMasterByIdSchema,
  deleteSalesMasterSchema,
  getCustomerMappingSchema,
  getSalesMasterUniqueDocnoSchema,
  getCustomerDetailsSchema,
  getProductDetailsSchema,
  getSalesEditListSchema,
  getSalenoSchema,
  getExportPendingSchema,
  putExportPendingSchema
};
