require("dotenv").config({ quiet: true });
const fastifyEnv = require("@fastify/env");
const fastifyHealthcheck = require("fastify-healthcheck");
const envSchema = require("env-schema");
const swagger = require("@fastify/swagger");
const swaggerUi = require("@fastify/swagger-ui");
const fastifyMetrics = require("fastify-metrics");
const fastifyJWT = require("@fastify/jwt");
const cors = require("@fastify/cors");
// const { Server } = require("socket.io");
// fastify.register(require('@fastify/multipart'));
const path = require("node:path");

const { envSchema: schema } = require("./app/commons/schemas/envSchemas");
const knexConfig = require("../config/index");


// For Admin
const company_router = require("./app/accounts/company/routes");
const outlet_router = require("./app/accounts/outlets/routes");
const ware_house_router = require("./app/catalog/warehouse/routes");
const role_router = require("./app/accounts/roles/routes");
const admin_router = require("./app/accounts/admin/routes");
// For Authorization
const menus_router = require("./app/authorization/menus/routes");
const sub_menus_router = require("./app/authorization/submenus/routes");
const menu_auth_router = require("./app/authorization/menu_auth/routes");
const excel_upload_router = require("./app/Excelupload/routers");
const otp_router = require("./app/accounts/login/routes");
const location_case_qty = require("./app/Product-Excel-Import/LocationWiseCaseQty/router");




//For Master
const head_router = require("./app/catalog/heads/routes");
const categories_router = require("./app/catalog/category/routes");
const sub_category_router = require("./app/catalog/subcategory/routes");
const type_design_router = require("./app/catalog/typedesign/routes");
const units_router = require("./app/catalog/units/routes");
const incharge_master_router = require("./app/catalog/inchargemaster/routes");
const incharge_group_master_router = require("./app/catalog/inchargegroupmaster/routes");
const item_router = require("./app/catalog/item/routes");
// Group
// Sub Group
// Allocate Group
const customer_router = require("./app/catalog/customer/routes");
const supplier_router = require("./app/catalog/supplier/routes");
const merchant_category_router = require("./app/catalog/merchantcategory/routes");
const picker_master_router = require("./app/catalog/pickermaster/routes");
const tray_master_router = require("./app/catalog/traymaster/routes");
const reason_router = require("./app/catalog/reason/routes");
const packing_employee_router = require("./app/catalog/PackingEmployee/routes");
const sales_margin_router = require("./app/catalog/salesmargin/routes");
const countries_router = require("./app/masterData/countries/routes");
const states_router = require("./app/masterData/states/routes");
const cities_router = require("./app/masterData/cities/routes");
// For offer
const offertype = require("./app/catalog/offertype/routes");
const offermaster = require("./app/catalog/offermaster/routes");
const discountpriceoff = require("./app/catalog/discountpriceoff/routes");
const schemes = require("./app/catalog/schemes/routes");
const promotions = require("./app/catalog/promotions/routes");
const freeproduct = require("./app/catalog/freeproduct/routes");
const outlet_wastage_router = require("./app/outlet_wastage/routes")
// const outlet_payment_router = require("./app/outlet_payment/routes")
// const outlet_receipt_router = require("./app/outlet_receipt/routes")

// For fmcg
const fmcg_purchase_order_router = require("./app/fmcg_purchase_order/routes");
//PO Approval 
const fmcg_po_setting_router = require("./app/POsettings/routes/index");
const fmcg_purchase_router = require("./app/purchase/purchase_fmcg_master/routes");
const fmcg_puchase_return_router = require("./app/purchase/purchase_fmcg_return/routes");
const fmcg_purchase_grn_fmcg_router = require("./app/fmcg_purchase_grn/routes");
const fmcg_sales_router = require("./app/sales/sales_fmcg_master/routes");
const fmcg_sales_return_router = require("./app/sales/sales_fmcg_return/routes");
const fmcg_sales_return_approval_router = require("./app/sales/sales_fmcg_return_approval/routes");
const fmcg_wastage_router = require("./app/fmcg_wastage/routes");
const fmcg_shrinkage_router = require("./app/fmcg_shrinkage/routes");
const fmcg_packing_planning_router = require("./app/fmcg_packing_planning/routes");
// fmcg planning issue
const fmcg_planning_issue = require("./app/fmcg_planning_issue/routes");
const fmcg_planning_inward = require("./app/fmcg_planning_inward/routes");
const fmcg_batch_planning = require("./app/fmcg_batch_planning/routes");
const fmcg_stock_correction = require("./app/fmcg_stock_correction/routes")
const fmcg_batch_update = require("./app/fmcg_batch_update/routes")

// For fnv 

const fnv_wastage_router = require("./app/fnv_wastage/routes");
const fnv_packing_planning_router = require("./app/fnv_packing_planning/routes");
const fnv_shrinkage_router = require("./app/fnv_shrinkage/routes");


// For Sync
const sync_fetch_router = require("./app/sync/sync_fetch/routes");
const category_sync_router = require("./app/sync/category_sync/routes");
const sub_category_Sync_router = require("./app/sync/subcategory_sync/routes");
const heads_sync_router = require("./app/sync/heads_sync/routes");
const type_design_sync_router = require("./app/sync/typedesign_sync/routes");
const units_sync_router = require("./app/sync/uom_sync/routes");
const item_sync_router = require("./app/sync/item_sync/routes");

//outlet purchase 
//outlet po
const outlet_purchase_router_manual = require("./app/outlet_po/Outlet_po_manual/routes");
const outlet_purchase_router_auto = require("./app/outlet_po/Outlet_po_auto/routes");
const outlet_vendor_mail = require("./app/outlet_po/vendor_mail/routes");
// outlet memo
const outlet_memo_router = require("./app/outlet_memo/routes");

// outlet memo temp save
const outlet_memo_temp_router = require("./app/outlet_memo_temp/routes");

// outlet purchase memo report
const outlet_purchase_memo_report = require("./app/reports/outlet_purchase_memo_report/routes");


// outlet grn
const outlet_purchase_router = require("./app/outlet_purchase/routes");


// stores common po & purchase api's
const stores_po_router = require("./app/stores/stores_purchase/routes");
//stores customer api's
const stores_customer_router = require("./app/stores/stores_customer/routes");

// bill no sequence setting
const bill_no_sequence_router = require("./app/accounts/bill_no_sequence_setting/routes");

// const clearance_sales_router = require("./app/accounts/clearance_sales/routes");



//outlet closing stocks router
const outlet_closing_stocks_router = require("./app/outlet_closing_stocks/routes");
const outlet_closing_stocks_temp_router = require("./app/outlet_closing_stocks_temp/routes");










// warehouse report
// const warehouse_purchase_report_router = require("./app/reports/warehouse_report/warhouse_purchase/routes");
// const warehouse_sales_report_router = require("./app/reports/warehouse_report/warehouse_sales/routes");



// warehouse cleaning stocks
const warehouse_cleaning_stocks_router = require("./app/warehouse_cleaning_stocks/routes");
const warehouse_payment_router = require("./app/warehouse_payment/routes")
const warehouse_expenses_router = require("./app/warehouse_expenses/routes")





// const consumerRoutes = require("./app/catalog/consumer/routes");

const accountMaster = require("./app/catalog/accountmaster/routes");
const subaccountMaster = require("./app/catalog/subaccountmaster/routes");
// const transactionProviderMaster = require("./app/catalog/transaction_provider/routes");
// const transactionTypeMaster = require("./app/catalog/transaction_type/routes");
// const phonePayHistoryLog = require("./app/phone_pay_history_log/phone_pay_history_log/routes");
// const payTypeMaster = require("./app/catalog/pay_type_master/routes");

const salesman = require("./app/catalog/salesman/routes");




// const wastage = require("./app/wastage/wastage_master/routes");
// const wastage_outlet = require("./app/wastage_outlet/wastage_master/routes");
// const closing_stock = require("./app/closing_stock/closing_stock/routes");
// const closing_stock_outlet = require("./app/closing_stock _outlet/closing_stock/routes");
// const outlet_sales_master = require("./app/outlet_sales/outlet_sales_master/routes");
// const outlet_sales_return_master = require("./app/outlet_sales/outlet_sales_return_master/routes");
// const stock_missing_master = require("./app/stock_verify/stock_missing_master/routes");
// const stock_verify_setting = require("./app/accounts/stock_verrify_setting/routes");
// const closing_cash_master = require("./app/closing_cash/closing_cash_master/routes");
// const closing_expences_master = require("./app/closing_expences/closing_expences_master/routes");
// const wallet_transfer_master = require("./app/wallet_transfer/wallet_transfer_master/routes");
// const outlet_sales_edit_log = require("./app/outlet_sales_screen/outlet_sales_screen/routes");
// const outlet_to_outlet_transfer = require("./app/outlet_to_outlet_transfer/outlet_to_outlet_transfer_master/routes");
// const closing_cash_wh_master = require("./app/closing_cash_warehouse/closing_cash_warehouse_master/routes");
// const closing_expences_wh_master = require("./app/closing_expences_warehouse/closing_expences_wh_master/routes");
// const issue_transfer_temp = require("./app/issue_and_transfer_temp/routes");
// const packing_issue = require("./app/packing_issue/packing_issue_master/routes");

// const outlet_member = require("./app/catalog/outlet_member/routes");
const indent = require("./app/indent/indent_master/routes");




// // For Reports
// const item_report = require("./app/reports/products/routes");
// const sales_report = require("./app/reports/sales/routes");
// const sales_return_report = require("./app/reports/salesreturn/routes");
// const salesledger = require("./app/reports/salesledger/routes");
// const purchase_report = require("./app/reports/purchase/routes");
// const purchaseledger = require("./app/reports/purchaseledger/routes");
// const expencesReport = require("./app/reports/expences/routes");
// const outlet_expencesReport = require("./app/reports/outletexpences/routes");
// const gstledger = require("./app/reports/gstreport/routes");
// const expence_ledgerReport = require("./app/reports/expenseledger/routes");
// const categoryWiseSalesReport = require("./app/reports/categorywisesales/routes");
// const stock_ledgerReport = require("./app/reports/stockledger/routes");
// const paymentReport = require("./app/reports/payment/routes");
// const salesmanLedgerReport = require("./app/reports/salesmanledger/routes");
// const outletSalesReport = require("./app/reports/outlet_reports/outlet_sales/routes");
// const outletSalesLedgerReport = require("./app/reports/outlet_reports/outlet_sales_ledger/routes");
// const gstledgerOutletSales = require("./app/reports/outlet_reports/gst_outlet_sales_report/routes");
// const stockledgerOutletSales = require("./app/reports/outlet_reports/stockledger_outlet_sales/routes");
// const salesReceiptReport = require("./app/reports/sales_receipt/routes");
// const outletExpencesLedgerReport = require("./app/reports/outlet_expense_ledger/routes");
// const stockMissingReport = require("./app/reports/stock_missing_report/routes");
// const outletSalesRetrunReport = require("./app/reports/outlet_sales_return_report/routes");
// const closingCashReport = require("./app/reports/closing_cash/routes");
// const closingExpencesReport = require("./app/reports/closing_expences/routes");
// const outletToOutletTransferReport = require("./app/reports/outlet_to_outlet_transfer/routes");
// const outletMemberReport = require("./app/reports/outlet_member/routes");
// const phonePayHistoryLogReport = require("./app/reports/phone_pay_history_log/routes");
// const closingCashWarehouseReport = require("./app/reports/closing_cash_warehouse/routes");
// const closingStockOutletReport = require("./app/reports/closing_stock_outlet/routes");
// const closing_stock_warehouse = require("./app/closing_stock_warehouse/routes");
// const closing_expences_warehouse = require("./app/reports/closing_expences_warehouse/routes");
// const dashboardOutletSales = require("./app/dashboard/outlet_sales/routes");



// // For Payment
// const payment = require("./app/payment/routes/index");
// const receipt = require("./app/receipt/routes/index");
// PLUGINS
const ajv = require("./app/plugins/ajv");
const knex = require("./app/plugins/knex");
const httpClient = require("./app/plugins/httpClient");
const authenticate = require("./app/plugins/jwt");
const authenticate_otp = require("./app/plugins/jwt/otpAuth");
const otpGenerator = require("./app/plugins/otpGeneratorPlugin");
const bucketOperations = require("./app/plugins/bucketOperations");

// //EXPENCES
// const expences = require("./app/expenses/expence/routes/index");
// const outlet_expences = require("./app/outlet_expences/routes/index")

// // LOYALTY
// const loyalty = require("./app/accounts/loyalty/routes");

// // FOR BARCODE
// const barcode = require("./app/accounts/barcode/routes");

const {
  extractLogTrace,
  requestLogging,
  // responseLogging,
  responseLoggingV2
} = require("./app/hooks/logging");

const {
  SWAGGER_CONFIGS,
  SWAGGER_UI_CONFIGS,
  SERVER_CONFIGS
} = require("./app/commons/configs");
const { METRICS_CONFIGS } = require("./app/commons/metrics.config");

const { errorHandler } = require("./app/errorHandler");

async function create() {
  // eslint-disable-next-line global-require
  const fastify = require("fastify")({
    ...SERVER_CONFIGS,
    bodyLimit: 100 * 1024 * 1024  // 100MB
  });

  fastify.setErrorHandler(errorHandler());
  await fastify.register(fastifyHealthcheck);

  await fastify.register(require("@fastify/multipart"), {
    attachFieldsToBody: true,
    limits: {
      fileSize: 100 * 1024 * 1024
    }
  });

  // Env vars plugin
  await fastify.register(fastifyEnv, {
    dotenv: true,
    schema
  });

  // HOOKS
  fastify.addHook("onRequest", extractLogTrace);
  fastify.addHook("preValidation", requestLogging);
  // fastify.addHook("onSend", responseLogging);
  fastify.addHook("onResponse", responseLoggingV2);

  await fastify.register(fastifyJWT, {
    secret: process.env.JWT_SECRET_KEY,
    sign: {
      // expiresIn: "7d" // Token expiration time, e.g., 1 day
      expiresIn: null // Token never expires
    }
  });

  await fastify.register(bucketOperations, {
    bucketName: process.env.GCP_BUCKET_NAME
  });
  // PLUGINS
  await fastify.register(ajv);
  await fastify.register(knex, knexConfig);
  await fastify.register(swagger, SWAGGER_CONFIGS);
  await fastify.register(swaggerUi, SWAGGER_UI_CONFIGS);
  await fastify.register(httpClient);
  await fastify.register(authenticate);
  await fastify.register(authenticate_otp);


  // Register the fastify-static plugin to serve static files
  fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "../uploads"), // Specify the root folder for static files
    prefix: "/uploads/" // Specify the prefix for the static routes
  });
  fastify.register(cors, {
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  });
  await fastify.register(otpGenerator);

  // Fastify-metrics
  if (process.env.NODE_ENV !== "test") {
    await fastify.register(fastifyMetrics, METRICS_CONFIGS);
  }

  // ROUTES

  // For Admin
  await fastify.register(admin_router, { prefix: "/v1" });
  await fastify.register(company_router, { prefix: "/v1" });
  await fastify.register(outlet_router, { prefix: "/v1" });
  await fastify.register(ware_house_router, { prefix: "/v1" });
  await fastify.register(role_router, { prefix: "/v1" });
  await fastify.register(menus_router, { prefix: "/v1" });
  await fastify.register(sub_menus_router, { prefix: "/v1" });
  await fastify.register(menu_auth_router, { prefix: "/v1" });
  await fastify.register(excel_upload_router, { prefix: "/v1" });
  await fastify.register(otp_router, { prefix: "/v1" });
  await fastify.register(location_case_qty, { prefix: "/v1" });



  // For Master
  await fastify.register(head_router, { prefix: "/v1" });
  await fastify.register(categories_router, { prefix: "/v1" });
  await fastify.register(sub_category_router, { prefix: "/v1" });
  await fastify.register(type_design_router, { prefix: "/v1" });
  await fastify.register(units_router, { prefix: "/v1" });
  await fastify.register(incharge_master_router, { prefix: "/v1" });
  await fastify.register(incharge_group_master_router, { prefix: "/v1" });
  await fastify.register(item_router, { prefix: "/v1" });
  // Group
  // Sub Group
  // Allocate Group
  await fastify.register(sales_margin_router, { prefix: "/v1" });
  await fastify.register(customer_router, { prefix: "/v1" });
  await fastify.register(supplier_router, { prefix: "/v1" });
  await fastify.register(merchant_category_router, { prefix: "/v1" });
  await fastify.register(picker_master_router, { prefix: "/v1" });
  await fastify.register(tray_master_router, { prefix: "/v1" });
  await fastify.register(reason_router, { prefix: "/v1" });
  await fastify.register(packing_employee_router, { prefix: "/v1" });
  await fastify.register(countries_router, { prefix: "/v1" });
  await fastify.register(states_router, { prefix: "/v1" });
  await fastify.register(cities_router, { prefix: "/v1" });


  // For fmcg
  await fastify.register(fmcg_purchase_order_router, { prefix: "/v1" });
  await fastify.register(fmcg_purchase_router, { prefix: "/v1" });
  await fastify.register(fmcg_puchase_return_router, { prefix: "/v1" });
  await fastify.register(fmcg_purchase_grn_fmcg_router, { prefix: "/v1" });
  await fastify.register(fmcg_sales_router, { prefix: "/v1" });
  await fastify.register(fmcg_sales_return_router, { prefix: "/v1" });
  await fastify.register(fmcg_sales_return_approval_router, { prefix: "/v1" });
  await fastify.register(fmcg_wastage_router, { prefix: "/v1" });
  await fastify.register(fmcg_shrinkage_router, { prefix: "/v1" });
  await fastify.register(fmcg_packing_planning_router, { prefix: "/v1" });
  await fastify.register(fmcg_po_setting_router, { prefix: "/v1" });
  // fmcg_planning
  await fastify.register(fmcg_planning_issue, { prefix: "/v1" });
  await fastify.register(fmcg_planning_inward, { prefix: "/v1" });
  await fastify.register(fmcg_batch_planning, { prefix: "/v1" });
  await fastify.register(fmcg_stock_correction, { prefix: "/v1" });
  await fastify.register(fmcg_batch_update, { prefix: "/v1" });

  // For fnv 
  await fastify.register(fnv_wastage_router, { prefix: "/v1" });
  await fastify.register(fnv_packing_planning_router, { prefix: "/v1" });
  await fastify.register(fnv_shrinkage_router, { prefix: "/v1" });

  // For Sync
  await fastify.register(category_sync_router, { prefix: "/v1" });
  await fastify.register(sub_category_Sync_router, { prefix: "/v1" });
  await fastify.register(heads_sync_router, { prefix: "/v1" });
  await fastify.register(type_design_sync_router, { prefix: "/v1" });
  await fastify.register(units_sync_router, { prefix: "/v1" });
  await fastify.register(item_sync_router, { prefix: "/v1" });
  await fastify.register(sync_fetch_router, { prefix: "/v1" });


  // outlet po
  await fastify.register(outlet_purchase_router_manual, { prefix: "/v1" });
  await fastify.register(outlet_purchase_router_auto, { prefix: "/v1" });
  await fastify.register(outlet_vendor_mail, { prefix: "/v1" });
  // outlet memo & grn

  await fastify.register(outlet_memo_router, { prefix: "/v1" });
  await fastify.register(outlet_memo_temp_router, { prefix: "/v1" });




  // outlet memo report

  await fastify.register(outlet_purchase_memo_report, { prefix: "/v1" });
  await fastify.register(outlet_purchase_router, { prefix: "/v1" });

  // outlet wastage 

  await fastify.register(outlet_wastage_router, { prefix: "/v1" });
  // await fastify.register(outlet_payment_router, { prefix: "/v1" });
  // await fastify.register(outlet_receipt_router, { prefix: "/v1" });



  // stores common po & purchase api's
  await fastify.register(stores_po_router, { prefix: "/v1" });

  //stores customer api's
  await fastify.register(stores_customer_router, { prefix: "/v1" });

  // bill no sequence setting

  await fastify.register(bill_no_sequence_router, { prefix: "/v1" });
  // await fastify.register(clearance_sales_router, { prefix: "/v1" });


  // outlet closing stock
  await fastify.register(outlet_closing_stocks_router, { prefix: "/v1" });
  await fastify.register(outlet_closing_stocks_temp_router, { prefix: "/v1" });

  // warehouse report
  // await fastify.register(warehouse_purchase_report_router, { prefix: "/v1" });
  // await fastify.register(warehouse_sales_report_router, { prefix: "/v1" });
  // warehouse cleaning stock router

  await fastify.register(warehouse_cleaning_stocks_router, { prefix: "/v1" });
  await fastify.register(warehouse_payment_router, { prefix: "/v1" });
  await fastify.register(warehouse_expenses_router, { prefix: "/v1" });


  /// old
  // not verify
  // await fastify.register(transactionProviderMaster, { prefix: "/v1" });
  // await fastify.register(transactionTypeMaster, { prefix: "/v1" });
  // await fastify.register(phonePayHistoryLog, { prefix: "/v1" });
  // await fastify.register(payTypeMaster, { prefix: "/v1" });

  // await fastify.register(consumerRoutes, { prefix: "/v1" });

  await fastify.register(accountMaster, { prefix: "/v1" });
  await fastify.register(subaccountMaster, { prefix: "/v1" });
  await fastify.register(salesman, { prefix: "/v1" });
  // await fastify.register(payment, { prefix: "/v1" });
  // await fastify.register(receipt, { prefix: "/v1" });
  // await fastify.register(wastage, { prefix: "/v1" });
  // await fastify.register(wastage_outlet, { prefix: "/v1" });
  // await fastify.register(closing_stock, { prefix: "/v1" });
  // await fastify.register(closing_stock_outlet, { prefix: "/v1" });
  // await fastify.register(outlet_sales_master, { prefix: "/v1" });
  // await fastify.register(outlet_sales_return_master, { prefix: "/v1" });
  // await fastify.register(stock_missing_master, { prefix: "/v1" });
  // await fastify.register(stock_verify_setting, { prefix: "/v1" });
  // await fastify.register(closing_cash_master, { prefix: "/v1" });
  // await fastify.register(closing_expences_master, { prefix: "/v1" });
  // await fastify.register(wallet_transfer_master, { prefix: "/v1" });
  // await fastify.register(outlet_sales_edit_log, { prefix: "/v1" });
  // await fastify.register(outlet_to_outlet_transfer, { prefix: "/v1" });
  // await fastify.register(closing_cash_wh_master, { prefix: "/v1" });
  // await fastify.register(closing_expences_wh_master, { prefix: "/v1" });
  // await fastify.register(issue_transfer_temp, { prefix: "/v1" });
  // await fastify.register(closing_stock_warehouse, { prefix: "/v1" });

  // For Auth

  // For Reports
  // await fastify.register(item_report, { prefix: "/v1" });
  // await fastify.register(sales_report, { prefix: "/v1" });
  // await fastify.register(sales_return_report, { prefix: "/v1" });
  // await fastify.register(salesledger, { prefix: "/v1" });
  // await fastify.register(purchase_report, { prefix: "/v1" });
  // await fastify.register(purchaseledger, { prefix: "/v1" });
  // await fastify.register(expencesReport, { prefix: "/v1" });
  // await fastify.register(outlet_expencesReport, { prefix: "/v1" });
  // await fastify.register(gstledger, { prefix: "/v1" });
  // await fastify.register(expence_ledgerReport, { prefix: "/v1" });
  // await fastify.register(categoryWiseSalesReport, { prefix: "/v1" });
  // await fastify.register(stock_ledgerReport, { prefix: "/v1" });
  // await fastify.register(paymentReport, { prefix: "/v1" });
  // await fastify.register(salesmanLedgerReport, { prefix: "/v1" });
  // await fastify.register(outletSalesReport, { prefix: "/v1" });
  // await fastify.register(outletSalesLedgerReport, { prefix: "/v1" });
  // await fastify.register(gstledgerOutletSales, { prefix: "/v1" });
  // await fastify.register(stockledgerOutletSales, { prefix: "/v1" });
  // await fastify.register(salesReceiptReport, { prefix: "/v1" });
  // await fastify.register(outletExpencesLedgerReport, { prefix: "/v1" });
  // await fastify.register(stockMissingReport, { prefix: "/v1" });
  // await fastify.register(outletSalesRetrunReport, { prefix: "/v1" });
  // await fastify.register(closingCashReport, { prefix: "/v1" });
  // await fastify.register(closingExpencesReport, { prefix: "/v1" });
  // await fastify.register(outletToOutletTransferReport, { prefix: "/v1" });
  // await fastify.register(outletMemberReport, { prefix: "/v1" });
  // await fastify.register(phonePayHistoryLogReport, { prefix: "/v1" });
  // await fastify.register(closingCashWarehouseReport, { prefix: "/v1" });
  // await fastify.register(closingStockOutletReport, { prefix: "/v1" });
  // await fastify.register(closing_expences_warehouse, { prefix: "/v1" });
  // await fastify.register(dashboardOutletSales, { prefix: "/v1" });
  // await fastify.register(packing_issue, { prefix: "/v1" });
  // await fastify.register(outlet_member, { prefix: "/v1" });
  await fastify.register(indent, { prefix: "/v1" });
  await fastify.register(offertype, { prefix: "/v1" });
  await fastify.register(offermaster, { prefix: "/v1" });
  await fastify.register(discountpriceoff, { prefix: "/v1" });
  await fastify.register(schemes, { prefix: "/v1" });
  await fastify.register(promotions, { prefix: "/v1" });
  await fastify.register(freeproduct, { prefix: "/v1" });






  // fmcg_wastage

  // // For Loyalty
  // await fastify.register(loyalty, { prefix: "/v1" });

  // // For barcode
  // await fastify.register(barcode, { prefix: "/v1" });

  // await fastify.register(expences, { prefix: "/v1" });
  // await fastify.register(outlet_expences, { prefix: "/v1" });
  return fastify;
}

async function start() {
  const fastify = await create();
  const defaultSchema = {
    type: "object",
    properties: {
      HOST: {
        type: "string",
        default: "0.0.0.0"
      },
      PORT: {
        type: "integer",
        default: 4444
      }
    }
  };
  const config = envSchema({ schema: defaultSchema, dotenv: true });
  // Run the server!
  fastify.listen({ port: config.PORT, host: config.HOST }, (err, address) => {
    /* istanbul ignore next */
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    // eslint-disable-next-line no-console
    console.log(`server listening on ${address}`);
  });
}

// async function start() {
//   const fastify = await create();

//   const defaultSchema = {
//     type: "object",
//     properties: {
//       HOST: { type: "string", default: "0.0.0.0" },
//       PORT: { type: "integer", default: 4444 }
//     }
//   };

//   const config = envSchema({ schema: defaultSchema, dotenv: true });

//   // Attach socket.io BEFORE listen()
//   const io = new Server(fastify.server, {
//     cors: { origin: "*" }
//   });

//   // Register as decorator (now available everywhere)
//   fastify.decorate("io", io);

//   // Setup socket events
//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });

//   // Now start the server
//   const address = await fastify.listen({
//     port: config.PORT,
//     host: config.HOST
//   });

//   console.log(`Server listening on ${address}`);
// }

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  start();
}

module.exports = {
  create,
  start
};
