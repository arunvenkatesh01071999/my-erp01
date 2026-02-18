const deleteOutletPurchaseOrderProductSchema = require("./deleteOutletPurchaseOrderProductSchema");
const getOutletPoSchema = require("./getOutletPoSchema");
const getOutletPurchaseOrderApprovedListSchema = require("./getOutletPurchaseOrderApprovedListSchema");
const getOutletPurchaseOrderApprovedPonoSchema = require("./getOutletPurchaseOrderApprovedPonoSchema");
const getProductDetailsSchema = require("./getProductDetailsSchema");
const postOutletPurchaseOrderSchema = require("./postOutletPurchaseOrderSchema");
const putOutletPurchaseOrderProductsSchema = require("./putOutletPurchaseOrderProductsSchema");
const getPurchaseOrderProductSchema = require("./getPurchaseOrderProductSchema");
const putUnApprovedOutltetPoProductSchema = require("./putUnApprovedOutltetPoProductSchema");
const getUnApprovedOutletPurchaseOrderProductSchema = require("./getUnApprovedOutletPurchaseOrderProductSchema");
const getApprovalReportOutletpo = require("./getApprovalReportOutletpo");
const getOutletPoDetailsOverviewSchema = require("./getOutletPoDetailsOverviewSchema");
const getOutletPoDetailsBySupplierIdSchema = require("./getOutletPoDetailsBySupplierIdSchema");
const getOutletPoApprovListBySupplierIdSchema = require("./getOutletPoApprovListBySupplierIdSchema");
const putOutletApprovedPoSchema = require("./putOutletApprovedPoSchema");
const putPoQtySchema = require("./putPoQtySchema");
const putOutletPurchaseOrderSchema = require("./putOutletPurchaseOrderSchema");

const putOutletPomasterGrndetailsSchema = require("./putOutletPomasterGrndetailsSchema")
const getPurchaseOrdereOutletListSchema = require("./getPurchaseOrdereOutletListSchema.js")
const getPurchaseOrdereSupplierListSchema = require("./getPurchaseOrdereSupplierListSchema")
const getPurchaseOrdereBrandCompanyListSchema = require("./getPurchaseOrdereBrandCompanyListSchema")
const resentPoMailSchema = require("./resentPoMailSchema")
const getOutletPoAmendmentReportSchema = require("./getOutletPoAmendmentReportSchema")
module.exports = {
  getOutletPoSchema,
  getProductDetailsSchema,
  postOutletPurchaseOrderSchema,
  getOutletPurchaseOrderApprovedListSchema,
  getOutletPurchaseOrderApprovedPonoSchema,
  putOutletPurchaseOrderProductsSchema,
  deleteOutletPurchaseOrderProductSchema,
  getPurchaseOrderProductSchema,
  putUnApprovedOutltetPoProductSchema,
  getUnApprovedOutletPurchaseOrderProductSchema,
  getApprovalReportOutletpo,
  getOutletPoDetailsOverviewSchema,
  getOutletPoDetailsBySupplierIdSchema,
  putPoQtySchema,
  getOutletPoApprovListBySupplierIdSchema,
  putOutletApprovedPoSchema,
  putOutletPomasterGrndetailsSchema,
  putOutletPurchaseOrderSchema,
  getPurchaseOrdereOutletListSchema,
  getPurchaseOrdereSupplierListSchema,
  getPurchaseOrdereBrandCompanyListSchema,
  resentPoMailSchema,
  getOutletPoAmendmentReportSchema
};
