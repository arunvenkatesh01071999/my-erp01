const deleteOutletPurchaseOrderProductHandler = require("./deleteOutletPurchaseOrderProductHandler");
const getApprovalReportOutletPoHandler = require("./getApprovalReportOutletPoHandler");
const getOutletPoPonoHandler = require("./getOutletPoPonoHandler");
const getOutletPurchaseOrderApprovedItemHandler = require("./getOutletPurchaseOrderApprovedItemHandler");
const getOutletPurchaseOrderUnApprovedListHandler = require("./getOutletPurchaseOrderUnApprovedListHandler");
const getPoUnApprovedOutletProductHandler = require("./getPoUnApprovedOutletProductHandler");
const getProductBySupplierHandler = require("./getProductBySupplierHandler");
const postOutletpohandler = require("./postOutletpohandler");
const putOutletPoUnApprovedProductHandler = require("./putOutletPoUnApprovedProductHandler");
const putOutletPurchaseOrderProductHandler = require("./putOutletPurchaseOrderProductHandler");
const getOutletPoOverviewHandler = require("./getOutletPoOverviewHandler");
const getOutletPoDetailsBySupplierHandler = require("./getOutletPoDetailsBySupplierHandler");
const getOutletPoApprovalListHandler = require("./getOutletPoApprovalListHandler");
const putOutletPoApprovedHandler = require("./putOutletPoApprovedHandler");
const putOutletPoQtyUpdateHandler = require("./putOutletPoQtyUpdateHandler");

const putOutletPomasterGrndetailsHandler = require("./putOutletPomasterGrndetailsHandler");
const getPurchaseOrdereOutletListHandler = require("./getPurchaseOrdereOutletListHandler.js")
const getPurchaseOrderSupplierListHandler = require("./getPurchaseOrderSupplierListHandler.js")
const getPurchaseOrderBrandCompanyListHandler = require("./getPurchaseOrderBrandCompanyListHandler")
const resentPoMailHandler = require("./resentPoMailHandler")
const getOutletPoAmendmentReportHandler = require("./getOutletPoAmendmentReportHandler")
module.exports = {
  getOutletPoPonoHandler,
  getProductBySupplierHandler,
  postOutletpohandler,
  getOutletPurchaseOrderUnApprovedListHandler,
  getOutletPurchaseOrderApprovedItemHandler,
  putOutletPurchaseOrderProductHandler,
  deleteOutletPurchaseOrderProductHandler,
  putOutletPoUnApprovedProductHandler,
  getPoUnApprovedOutletProductHandler,
  getApprovalReportOutletPoHandler,
  getOutletPoOverviewHandler,
  getOutletPoDetailsBySupplierHandler,
  getOutletPoApprovalListHandler,
  putOutletPoApprovedHandler,
  putOutletPomasterGrndetailsHandler,
  putOutletPoQtyUpdateHandler,
  getPurchaseOrdereOutletListHandler,
  getPurchaseOrderSupplierListHandler,
  getPurchaseOrderBrandCompanyListHandler,
  resentPoMailHandler,
  getOutletPoAmendmentReportHandler
};
