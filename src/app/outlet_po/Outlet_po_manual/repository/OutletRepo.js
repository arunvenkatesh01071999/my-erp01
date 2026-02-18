const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const _ = require("lodash");
const axios = require('axios');
const moment = require("moment");
const { OUTLET_PO_MASTER, OUTLET_PO_DETAILS, SUPPLIER_OUTLET_MAPPING, OUTLET_PO_LOGS, MAIN_CATEGORY } = require("../commons/constants")
const { STATES, COUNTRIES, CITIES } = require("../../../masterData/commons/constants")
const { USERS } = require("../../../accounts/admin/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { SUPPLIER, ITEM, } = require("../../../catalog/item/commons/constants")
const { OUTLET_PRODUCT_MAPPING, TYPEDESIGN } = require("../../../catalog/commons");
const { POSETTINGS } = require("../../Outlet_po_auto/commons/constants");
const { REGION } = require("../../../catalog/warehouse/commons/constants");
const emailRepo = require("../../vendor_mail/repository/email");
const { OUTLET_PURCHASE_MEMO_MASTER, OUTLET_PURCHASE_MEMO_DETAILS, OUTLET_PURCHASE_MEMO_BATCH_DETAILS } = require("../../../outlet_memo/commons/constants");
const { httpClient } = require("../../../plugins/httpClient/axios");

function OutletRepo(fastify) {

  async function getoutletPurchaseOrderPono({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    const { company_id, outlet_id } = params;
    const query = knex(OUTLET_PO_MASTER.NAME)
      .returning("id")
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR}`, financialYear)
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outlet_id)
      .orderBy(OUTLET_PO_MASTER.COLUMNS.ID, 'desc')
      .limit(1);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Purchase Order Master",
      logTrace
    });
    const response = await query;
    console.log(response, "response1");
    if (response.length === 0) {
      return { Docno: "1" };
    }
    const docno = Number(response[0].po_no);
    const Docno = `${docno + 1}`;
    return { Docno };
  }


  // async function getProductBySupplierRepo({ params, body, logTrace, userDetails, query }) {
  //   const knex = this;
  //   const { vendor_id, company_id, outlet_id } = params;
  //   const { search, type, product_id } = query;

  //   const query1 = knex(ITEM.NAME)
  //     .select(
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as supplier_add1`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as supplier_add2`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as supplier_add3`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as supplier_add4`,
  //       `${STATES.NAME}.${STATES.COLUMNS.NAME} as supplier_state_name`,
  //       `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as supplier_city_name`,
  //       `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as supplier_country_name`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
  //       `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
  //       knex.raw(`CAST(${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} AS INTEGER) AS numeric_product_code`),
  //       `${ITEM.NAME}.*`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as soh`,
  //       `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE} as barcode`
  //     )
  //     .leftJoin(
  //       `${VENDORS_MAPPING.NAME}`,
  //       `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_CODE}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
  //     )
  //     .leftJoin(
  //       `${BARCODE_LIST.NAME}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
  //       `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`
  //     )
  //     .leftJoin(
  //       `${SUPPLIER.NAME}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
  //       `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`
  //     )
  //     .leftJoin(
  //       `${STATES.NAME}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
  //       `${STATES.NAME}.${STATES.COLUMNS.ID}`
  //     )
  //     .leftJoin(
  //       `${CITIES.NAME}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
  //       `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
  //     )
  //     .leftJoin(
  //       `${COUNTRIES.NAME}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
  //       `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
  //     )
  //     .leftJoin(
  //       `${MAIN_CATEGORY.NAME}`,
  //       `${ITEM.NAME}.main_catgory_id`,
  //       `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
  //     )
  //     .where(`${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE}`, true)
  //     .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`, vendor_id)
  //     .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
  //     .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`, company_id)
  //     .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.IS_ACTIVE}`, true)
  //     .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
  //     .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, company_id)
  //     .orderBy('numeric_product_code', 'ASC')

  //   if (product_id) {
  //     query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, product_id);
  //   }
  //   // ✅ Apply search condition only on mapped items
  //   if (search) {
  //     query1.andWhere(function () {
  //       this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, "ilike", `%${search}%`)
  //         .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search}%`);
  //     });
  //   }

  //   // ✅ Apply filter f&v products
  //   // if (type == 2) {
  //   //   query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, 2)
  //   // } else {
  //   //   query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, 1)
  //   // }

  //   const response = await query1;

  //   if (!response.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "Outlet Purchase product not found",
  //       property: "",
  //       code: "NOT_FOUND"
  //     });
  //   }

  //   const supplierOutlets = await knex(SUPPLIER_OUTLET_MAPPING.NAME)
  //     .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID)
  //     .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, vendor_id)
  //     .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //     .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE, true);


  //   console.log(response, "response")

  //   try {
  //     // 🟢 Wrap Axios call safely
  //     const salesResponse = await axios.post(`https://erpdas.bluekode.com/v1/Itemdetails/salesQty/${outlet_id}`,
  //       response.map(item => ({ prod_code: item.pro_code }))
  //     );
  //     outletSalesQtyData = salesResponse;
  //   } catch (error) {
  //     // 🟠 Graceful error handling
  //     console.error("Sales Quantity API Error:", error.message);
  //     outletSalesQtyData = { data: [] }; // fallback
  //   }

  //   console.log("Sales Quantity API Response:", outletSalesQtyData.data);

  //   const finalResponse = response.map(item => {
  //     console.log("item pro_code", item.pro_code);
  //     let salesQtyData = outletSalesQtyData.data.find(saleItem => saleItem.prod_code === item.pro_code);
  //     let qty = 0;
  //     let stockbalance = 0;
  //     let cost_price = item.pur_rate;
  //     if (salesQtyData) {
  //       salesQtyData = salesQtyData.salesQty || 0;
  //       stockbalance = salesQtyData.stock_balance || 0;
  //     } else {
  //       console.log(`No sales data found for prod_code: ${item.pro_code}`);
  //     }

  //     const outlet_ids = supplierOutlets.map(outlet => outlet.outlet_id);
  //     console.log("salesQtyData", salesQtyData)
  //     console.log("stockbalance", stockbalance)
  //     return {
  //       ...item,
  //       qty,
  //       purchase_order_type: 0,
  //       cost_price,
  //       outlet_ids,
  //       salesQtyData: salesQtyData || 0,
  //       main_category_name: item.main_category_name,
  //       phy_qty: 0,

  //     };
  //   });

  //   return finalResponse;
  // }


  async function getProductBySupplierRepo({ params, body, logTrace, userDetails, query, financialYear }) {
    const knex = this;
    const { vendor_id, company_id, outlet_id } = params;
    const { search, product_id } = query;

    const today = new Date().toISOString().split('T')[0];

    const currentDay = moment().format('dddd').toLowerCase();
    console.log("currentDay", currentDay);

    const po_date = moment().format('YYYY-MM-DD');
    console.log("PocurrentDate", po_date);

    // Start Transaction
    const trx = await knex.transaction();

    try {
      // 🔹 Step 1: Fetch suppliers eligible for auto PO generation based on order day
      const query1 = trx
        .select([
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as supplier_add1`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as supplier_add2`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as supplier_add3`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as supplier_add4`,
          `${STATES.NAME}.${STATES.COLUMNS.NAME} as supplier_state_name`,
          `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as supplier_city_name`,
          `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as supplier_country_name`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID} as outlet_id`,
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.REGION_ID} as region_id`
        ])
        .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
        // supplier – outlet mapping
        .innerJoin(
          `${SUPPLIER_OUTLET_MAPPING.NAME}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
        )
        // supplier – outlet product mapping
        .innerJoin(
          `${OUTLET_PRODUCT_MAPPING.NAME}`,
          function () {
            this.on(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
              `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
            )
              .andOn(
                `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
              );
          }
        )
        // item join
        .innerJoin(
          `${ITEM.NAME}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`
        )
        .innerJoin(
          `${OUTLETS.NAME}`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
        )
        // LEFT JOIN states
        .leftJoin(
          `${STATES.NAME} as ${STATES.NAME}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
          `${STATES.NAME}.${STATES.COLUMNS.ID}`
        )
        // LEFT JOIN cities
        .leftJoin(
          `${CITIES.NAME} as ${CITIES.NAME}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
          `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
        )
        // LEFT JOIN countries
        .leftJoin(
          `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
          `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
        )
        // ACTIVE CHECKS (IMPORTANT)
        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE}`, true)
        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`, '>', 0)
        .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
        .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
        .where(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`, true)

        // Supplier conditions
        .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
        .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.APPROVAL}`, true)
        .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_DSD}`, 0)
        .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`, company_id)
        .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
        .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`, vendor_id)

        // Day conditions
        // .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${currentDay}`, true)
        // .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${currentDay}`, true)

        .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
        .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.APPROVAL}`, true)
        .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`, company_id)
        .groupBy([
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
          `${STATES.NAME}.${STATES.COLUMNS.NAME}`,
          `${CITIES.NAME}.${CITIES.COLUMNS.NAME}`,
          `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.REGION_ID}`
        ])
        .orderBy(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, "asc");



      const supplierDetails = await query1;
      // console.log("response1qq", supplierDetails);

      if (!supplierDetails.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Supplier not found",
          property: "",
          code: "NOT_FOUND",
        });
      }

      const { supplier_id, supplier_name, outlet_name } = supplierDetails[0];
      console.log(`🔹 Processing Supplier: ${supplier_name} | Vendor ID: ${supplier_id} | Outlet ID: ${outlet_id} | Outlet Name: ${outlet_name}`);
      const query2 = knex(`${ITEM.NAME}`)
        .distinctOn([
          `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`
        ])
        .select(
          `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID} as prd_id`,
          `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID} as brand_company_id`,
          `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID} as uom_id`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MRP} as mrp`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_RATE} as pur_rate`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as soh`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as balance`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.GST} as gst`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.CESS} as cess`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.FIXEDMARGIN}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTTYPE}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORDISCOUNTVALUE}`,
          knex.raw(`CAST(${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} AS INTEGER) AS numeric_product_code`)
        )
        // JOIN outlet_products_mapping FIRST
        .innerJoin(`${OUTLET_PRODUCT_MAPPING.NAME}`, function () {
          this.on(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`
          );
        })

        // JOIN supplier
        .innerJoin(
          `${SUPPLIER.NAME}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`
        )

        // JOIN supplier_outlet_mapping
        .innerJoin(
          `${SUPPLIER_OUTLET_MAPPING.NAME}`,
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
        )
        .andWhere(
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
          outlet_id
        )

        // Ensure OPM outlet_id matches
        .andWhere(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
          outlet_id
        )
        .andWhere(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
          vendor_id
        )

        // LEFT joins
        .leftJoin(
          `${OUTLETS.NAME}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
        )
        .leftJoin(
          `${MAIN_CATEGORY.NAME}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
        )
        // WHERE conditions
        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
        .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
        .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)

        //days condition
        // .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${currentDay}`, true)

        // ORDER BY required for DISTINCT ON
        .orderBy([
          { column: `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`, order: 'asc' },
          { column: 'numeric_product_code', order: 'asc' }
        ]);



      const productList = await query2;

      if (!productList.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: 'Outlet Purchase product not found',
          property: '',
          code: 'NOT_FOUND'
        });
      }


      // console.log(query2.toSQL());
      // console.log('productList', productList);

      if (!productList.length) {
        console.warn(`⚠️ No products found for supplier ${supplier_name}. Skipping...`);
      }

      // ------------------------------------------------------------
      // 3: Build payload for Sales Qty API
      // ------------------------------------------------------------
      let outletSalesQtyData = { data: [] };
      let outletStockBalanceData = { data: [] };
      let region_id = supplierDetails[0].region_id;
      region_id = Number(region_id === 1) ? 1 : Number(region_id === 2) ? 3 : Number(region_id === 3) ? 5 : 1;

      try {
        const productPayload = (productList || [])
          .filter(item => Number(item?.numeric_product_code))
          .map(item => ({
            prod_code: Number(item.numeric_product_code),
            prd_id: Number(item.prd_id)
          }));

        if (productPayload.length > 0) {
          const { data } = await axios.post(
            `https://erpdas.bluekode.com/v1/Itemdetails/salesQty/${outlet_id}`,
            productPayload
          );
          outletSalesQtyData.data = data || [];
        } else {
          console.log("⚠️ No valid product codes found for Sales Quantity API.");
        }

      } catch (error) {
        console.error("❌ Sales Quantity API Error:", error.message);
        outletSalesQtyData.data = [];
      }

      console.log("✅ Sales Quantity API Response:", outletSalesQtyData.data.length, "records");


      // // ------------------------------------------------------------
      // // 4:  Build payload for Stock Balance API
      // // ------------------------------------------------------------
      // try {
      //   const productIdPayload = (productList || [])
      //     .filter(item => Number(item?.prd_id))
      //     .map(item => ({
      //       prod_id: Number(item.prd_id),
      //       prod_code: Number(item.numeric_product_code)
      //     }));

      //   if (productIdPayload.length > 0) {
      //     const { data } = await axios.post(
      //       `https://outletbillsbff.kovaipazhamudir.com/v1/Itemdetails/salesQty/${outlet_id}/${region_id}`,
      //       productIdPayload
      //     );
      //     outletStockBalanceData.data = data || [];
      //   } else {
      //     console.log("⚠️ No valid product IDs found for Stock Balance API.");
      //   }

      // } catch (error) {
      //   console.error("❌ Stock Balance API Error:", error.message);
      //   outletStockBalanceData.data = [];
      // }

      // console.log("✅ Stock Balance API Response:", outletStockBalanceData.data.length, "records");


      // ------------------------------------------------------------
      // 5: Build map for PO Settings
      // ------------------------------------------------------------
      const productCodes = (productList || [])
        .map(item => Number(item.numeric_product_code))
        .filter(code => code > 0);

      let poSettingsRows = [];
      if (productCodes.length > 0) {
        poSettingsRows = await knex(POSETTINGS.NAME)
          .select('*')
          .whereIn(POSETTINGS.COLUMNS.CODE, productCodes.map(String))
          .andWhere(POSETTINGS.COLUMNS.OUTLET_ID, outlet_id);
      }

      const poSettingsMap = {};
      poSettingsRows.forEach(r => {
        poSettingsMap[r.code] = r;
      });

      // ------------------------------------------------------------
      // 6: Convert API responses to maps for fast lookup
      // ------------------------------------------------------------
      const salesMap = {};
      (outletSalesQtyData.data || []).forEach(s => {
        salesMap[Number(s.prod_code)] = s;
      });

      // const stockMap = {};
      // (outletStockBalanceData.data || []).forEach(s => {
      //   stockMap[Number(s.prod_id)] = s;
      // });

      const finalResponse = productList.map(item => {

        const productCode = Number(item.numeric_product_code);
        const productId = Number(item.prd_id);

        const saleItem = salesMap[productCode];
        // const stockItem = stockMap[productId];
        const poSetting = poSettingsMap[productCode];

        // --------------------------------------------------------
        // 1️⃣ Base Values
        // --------------------------------------------------------
        let salesQty = saleItem ? Number(saleItem.salesQty) || 0 : 0;
        let stockbalance = saleItem ? Number(saleItem.stock_balance) || 0 : 0;
        let entryDateCount = saleItem ? Number(saleItem.entry_date_count) || 0 : 0;
        let stockDays = saleItem ? Number(saleItem.entry_date_count) || 0 : 0;
        // let entryDateCount = stockItem ? Number(stockItem.daily_run_rate) || 0 : 0;
        // let stockDays = stockItem ? Number(stockItem.active_days) || 0 : 0;

        // --------------------------------------------------------
        // 2️⃣ PO Settings
        // --------------------------------------------------------
        const sales_days = Number(poSetting?.saledays) || 1;
        const minMbqValue = Number(poSetting?.minmbq) || 0;
        const ts = Number(poSetting?.TS) || 70;
        const vlt = Number(poSetting?.vlt) || 1;
        const paway = Number(poSetting?.paway) || 0;
        const pack_qty = Number(poSetting?.packqty) || 1;
        // --------------------------------------------------------
        // 3️⃣ Purchase Rate Calculation
        // --------------------------------------------------------
        // --------------------------------------------------------
        // 3️⃣ Purchase Rate Calculation
        // --------------------------------------------------------
        const mrp = Number(item?.mrp) || 0;
        const gstPercentage = Number(item?.gst) || 0;
        const margin = Number(item?.fixedmargin) || 0;
        const discountType = Number(item?.vendordiscounttype) || 0;
        const discountValue = Number(item?.vendordiscountvalue) || 0;
        let landingPrice = 0;
        let basicPrice = 0;

        // if (margin > 0) {
        landingPrice = mrp - (mrp * margin / 100);
        // Apply discount
        if (discountType === 1) {
          // Percentage discount
          landingPrice = Number(landingPrice - (mrp * discountValue / 100));
        } else if (discountType === 0) {
          // Flat value discount
          landingPrice = Number(landingPrice - discountValue);
        }
        landingPrice = Number(landingPrice.toFixed(3));
        basicPrice = Number((landingPrice / (1 + gstPercentage / 100)).toFixed(2));
        // }

        // --------------------------------------------------------
        // 4️⃣ Daily Run Rate + Average Qty
        // --------------------------------------------------------
        const daily_Run_Rate = entryDateCount || 2;

        // const averageQty = stockDays > 0
        //   ? (salesQty / stockDays)
        //   : 0;

        const averageQty = salesQty > 0
          ? (salesQty / 28)
          : 0;

        // --------------------------------------------------------
        // 5️⃣ Transit + Stock
        // --------------------------------------------------------
        const Transit_Qty = 0;
        const Totalbalance = stockbalance + Transit_Qty;

        // --------------------------------------------------------
        // 6️⃣ MBQ Calculation
        // --------------------------------------------------------
        const factor = sales_days + vlt;

        let MBQ = Math.ceil(averageQty * factor) || 0;
        let findMaxMBQ = Math.max(MBQ, minMbqValue);

        const maxMBQ = Number(findMaxMBQ);
        const totalBal = Number(Totalbalance);
        const tSafe = Number(ts);

        // --------------------------------------------------------
        // 7️⃣ Required Qty (with paway condition)
        // --------------------------------------------------------
        let RequiredQty = 0;

        if (paway === 1) {
          const compareVal = maxMBQ * tSafe;
          if (totalBal < compareVal) RequiredQty = maxMBQ - totalBal;
          else RequiredQty = 0;
        } else {
          RequiredQty = maxMBQ - totalBal;
        }

        RequiredQty = Math.max(0, RequiredQty);

        // --------------------------------------------------------
        // 8️⃣ Pack Qty + Final Qty
        // --------------------------------------------------------
        const packSize = Number(pack_qty) || 1;
        const PackQty = packSize;

        const caseQty = Math.floor(RequiredQty / packSize);
        const finalPackQty = Math.floor(caseQty) * packSize;

        // --------------------------------------------------------
        // 9️⃣ Final MBQ
        // --------------------------------------------------------
        const finalMBQ = Math.max(MBQ, minMbqValue);
        // Split GST percentage
        const cgstPercent = gstPercentage / 2;
        const sgstPercent = gstPercentage / 2;
        // const landingRate = purchaseRate + (purchaseRate * gstPercentage / 100);
        // --------------------------------------------------------
        // 🔟 Return Final
        // --------------------------------------------------------
        return {
          ...item,
          id: productId,
          pro_code: productCode,
          pro_name: String(item.pro_name),
          sales_days: stockDays,
          //  salesQtyData: salesQty,
          min_mbq: minMbqValue,
          PackQty,
          sales_qty: salesQty,
          soh: stockbalance,
          Transit_Qty,
          suggested_Qty: RequiredQty,
          RequiredQty,
          orderQty: finalPackQty,
          qty: finalPackQty,
          margin,
          vendor_discount_type: discountType,
          vendor_discount_value: discountValue,
          mrp,
          cost_price: basicPrice,
          pur_rate: basicPrice,
          gst: gstPercentage,
          landing_price: landingPrice,
          balance: stockbalance,
          phy_qty: 0,
          cgst: cgstPercent,
          sgst: sgstPercent,
          mbqdays: sales_days,
          // store report purpose
          purchase_order_type: 0,
          averageQty,
          Daily_Run_Rate: daily_Run_Rate,
          stock_days: stockDays,
          mbq: MBQ,
          MAXMBQ: maxMBQ,
          Totalbalance,
          stockbalance,
          finalPackQty,
          finalMBQ,
          purchaseRate: basicPrice,
          ts,
          vlt,
          paway,
          caseQty
        };
      });

      await trx.commit();

      return {
        status: "success",
        po_date,
        supplierDetails: supplierDetails[0],
        items: finalResponse,
      };

    } catch (error) {
      // Rollback Transaction on Error
      await trx.rollback();
      console.error("Error in Supplier Details:", error);
      if (error?._code === 404 || error?._code === 400) {
        throw error;
      }
      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Outlet Purchase Order transaction failed.",
        property: "",
        code: "AUTO_PO_GENERATION_FAILED",
      });
    }
  }


  async function postOutletPurchaseOrder({ params, body, userDetails, financialYear }) {
    const knex = this;
    const { company_id } = params;

    const trx = await knex.transaction();

    try {
      const today = new Date().toISOString().split('T')[0];

      const supplierDetails = await trx(SUPPLIER.NAME)
        .select(SUPPLIER.COLUMNS.GST_TYPE)
        .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
        .first();

      if (!supplierDetails) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Supplier details not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const { gst_type } = supplierDetails;

      const [{ max_id }] = await trx(OUTLET_PO_MASTER.NAME)
        .max("id as max_id")
        .where(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
        .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear);

      const nextId = (max_id || 0) + 1;

      const lastPo = await trx(OUTLET_PO_MASTER.NAME)
        .select(OUTLET_PO_MASTER.COLUMNS.PO_NO)
        .where(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
        .andWhere(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, body.outlet_id)
        .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear)
        .orderBy(OUTLET_PO_MASTER.COLUMNS.ID, "desc")
        .first();
      console.log(lastPo, "lastPo");


      const nextPoNo = Number(lastPo?.po_no || 0) + 1;

      let totalOrderQty = 0;
      let subTotalAmt = 0;
      let totalGstAmt = 0;
      let totalCessAmt = 0;
      let grandTotalAmt = 0;

      if (body.outlet_po_details && body.outlet_po_details.length > 0) {
        brand_company_id = body.outlet_po_details[0]?.brand_company_id;
        
        body.outlet_po_details.forEach(detail => {
          const rate = parseFloat(detail.rate || 0);
          const gst = parseFloat(detail.gst || 0);
          const cess = parseFloat(detail.cess || 0);
          const ordQty = parseFloat(detail.quantity || 0);
          const gstAmount = rate * gst / 100;
          const cessAmount = rate * cess / 100;
          const landingRate = rate + gstAmount;
          const amount = landingRate * ordQty;

          totalOrderQty += ordQty;
          subTotalAmt += rate * ordQty;
          totalGstAmt += gstAmount * ordQty;
          totalCessAmt += cessAmount * ordQty;
          grandTotalAmt += amount;
        });
      }

      grandTotalAmt = Math.round(grandTotalAmt * 1000) / 1000;
      const roundOff = Math.round((Math.round(grandTotalAmt) - grandTotalAmt) * 1000) / 1000;
      grandTotalAmt = Math.round(grandTotalAmt * 1000) / 1000;

      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const outletPoMasterData = {
        [OUTLET_PO_MASTER.COLUMNS.ID]: nextId,
        [OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
        [OUTLET_PO_MASTER.COLUMNS.PO_NO]: String(nextPoNo),
        [OUTLET_PO_MASTER.COLUMNS.PO_DATE]: body.po_date,
        [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
        [OUTLET_PO_MASTER.COLUMNS.TOTAL_ITEMS]: body.total_items,
        [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
        [OUTLET_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY]: totalOrderQty,
        [OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotalAmt,
        [OUTLET_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? totalGstAmt : 0,
        [OUTLET_PO_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? totalGstAmt : 0,
        [OUTLET_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: totalCessAmt || 0,
        [OUTLET_PO_MASTER.COLUMNS.ROFF]: roundOff,
        [OUTLET_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmt,
        [OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
        [OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE]: expiryDate,
        [OUTLET_PO_MASTER.COLUMNS.APPROVAL]: 1,
        [OUTLET_PO_MASTER.COLUMNS.IS_APPROVED_BY]: userDetails.id || 1,
        [OUTLET_PO_MASTER.COLUMNS.EXPIRED]: false,
        [OUTLET_PO_MASTER.COLUMNS.CREATED_BY]: userDetails.id || 1,
        [OUTLET_PO_MASTER.COLUMNS.CREATED_AT]: new Date(),
        [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id || 1,
        [OUTLET_PO_MASTER.COLUMNS.TYPE]: "auto",
        [OUTLET_PO_MASTER.COLUMNS.IS_MANUAL]: true,
        [OUTLET_PO_MASTER.COLUMNS.BRAND_COMPANY_ID]: brand_company_id || 0,
        [OUTLET_PO_MASTER.COLUMNS.SET_QTY_FLAG]: body.set_qty_flag || false
      };

      const [{ id: outletPoMasterId }] = await trx(OUTLET_PO_MASTER.NAME)
        .insert(outletPoMasterData)
        .returning("id");

      if (body.outlet_po_details && body.outlet_po_details.length > 0) {
        const outletPoDetailsData = body.outlet_po_details.map((detail, index) => {
          const rate = parseFloat(detail.rate || 0);
          const gst = parseFloat(detail.gst || 0);
          const cess = parseFloat(detail.cess || 0);
          const ordQty = parseFloat(detail.quantity || 0);
          // per unit landing rate
          const landingRate = rate + (rate * gst / 100);
          // base
          const taxableAmount = rate * ordQty;

          // tax
          const gstAmount = taxableAmount * gst / 100;
          const cessAmount = taxableAmount * cess / 100;

          const amount = landingRate * ordQty;
          const averageQty = Number(detail.averageQty) || 0;
          const stockbalance = Number(detail.stockbalance) || 0;
          const doh = averageQty > 0 ? stockbalance / averageQty : 0;

          return {
            [OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID]: outletPoMasterId,
            [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
            [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
            [OUTLET_PO_DETAILS.COLUMNS.OUTLET_NAME]: body.outlet_name,
            [OUTLET_PO_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
            [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: String(nextPoNo),
            [OUTLET_PO_DETAILS.COLUMNS.PO_DATE]: body.po_date,
            [OUTLET_PO_DETAILS.COLUMNS.PROD_ID]: detail.prod_id,
            [OUTLET_PO_DETAILS.COLUMNS.PROD_CODE]: detail.prod_code,
            [OUTLET_PO_DETAILS.COLUMNS.PROD_NAME]: detail.prod_name,
            [OUTLET_PO_DETAILS.COLUMNS.SALES_DAYS]: detail.sales_days,
            [OUTLET_PO_DETAILS.COLUMNS.MIN_MBQ]: detail.min_mbq,
            [OUTLET_PO_DETAILS.COLUMNS.PACK_QTY]: detail.pack_qty,
            [OUTLET_PO_DETAILS.COLUMNS.SALES_QUANTITY]: detail.sales_quantity,
            [OUTLET_PO_DETAILS.COLUMNS.T_QTY]: detail.t_qty,
            [OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN]: detail.fixedmargin,
            [OUTLET_PO_DETAILS.COLUMNS.MRP]: detail.mrp,
            [OUTLET_PO_DETAILS.COLUMNS.CP]: rate,
            [OUTLET_PO_DETAILS.COLUMNS.RATE]: rate,
            [OUTLET_PO_DETAILS.COLUMNS.QUANTITY]: ordQty,
            [OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE]: landingRate,
            [OUTLET_PO_DETAILS.COLUMNS.GST]: gst,
            [OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT]: gstAmount,
            [OUTLET_PO_DETAILS.COLUMNS.CESS]: cess,
            [OUTLET_PO_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,
            [OUTLET_PO_DETAILS.COLUMNS.AMOUNT]: amount,
            [OUTLET_PO_DETAILS.COLUMNS.SERIAL_NO]: index + 1,
            [OUTLET_PO_DETAILS.COLUMNS.DOH]: doh,
            [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
            [OUTLET_PO_DETAILS.COLUMNS.TYPE]: "manual",
            [OUTLET_PO_DETAILS.COLUMNS.CREATED_BY]: userDetails.id || 1,
            [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id || 1,
            [OUTLET_PO_DETAILS.COLUMNS.CREATED_AT]: new Date(),
            [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date()
          };
        });

        await trx(OUTLET_PO_LOGS.NAME).insert({
          [OUTLET_PO_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
          [OUTLET_PO_LOGS.COLUMNS.NEWDATA]: JSON.stringify({
            outlet_po_master: outletPoMasterData,
            outlet_po_details: outletPoDetailsData
          }),
          [OUTLET_PO_LOGS.COLUMNS.USER_ID]: userDetails.id,
          [OUTLET_PO_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
          [OUTLET_PO_LOGS.COLUMNS.PO_NO]: String(nextPoNo),
          [OUTLET_PO_LOGS.COLUMNS.PO_DATE]: body.po_date,
          [OUTLET_PO_LOGS.COLUMNS.CREATED_AT]: new Date()
        });

        await trx.batchInsert(
          OUTLET_PO_DETAILS.NAME,
          outletPoDetailsData,
          500
        );
      }

      await trx.commit();
      return { success: true, outlet_po_no: nextPoNo };

    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }


  async function getOutletPurchaseOrderUnApprovedListRepo({ params, body, logTrace, userDetails, query }) {
    const knex = this;
    const { company_id, region_id, outlet_id } = params;
    const { bill_no, from_date, to_date } = query;

    const query1 = knex
      .select([
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
      ])
      .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .where({
        [`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`]: company_id,
        [`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`]: "auto",
        [`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`]: 0
      })
      .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`, "desc");


    if (bill_no) {
      query1.andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`, String(bill_no).toLocaleUpperCase());
    }

    // filter one
    if (Number(region_id) && Number(outlet_id) === -1) {

      const outletIdsResult = await knex(OUTLETS.NAME)
        .pluck(OUTLETS.COLUMNS.ID)
        .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

      if (outletIdsResult.length === 0) {
        return [];
      }

      query1.andWhere(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`,
        Number(region_id)
      );

      query1.whereIn(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        outletIdsResult
      );

    }

    // filter two
    if (Number(outlet_id) !== -1) {
      query1.andWhere(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        Number(outlet_id)
      );

    }

    if (from_date && to_date) {
      query1.whereRaw(
        `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) >= ?`,
        [from_date]
      )
      query1.whereRaw(
        `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) <= ?`,
        [to_date]
      )
    }

    query1.orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`, "DESC");

    const response = await query1;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Purchase Order not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatedPurchaseDetails = response.map((detail) => ({
      ...detail,
      isEdit: detail.approval === 0 ? true : false
    }));

    return updatedPurchaseDetails;
  }


  async function getOutletPurchaseOrderApprovedItem({ body, params, logTrace }) {
    const knex = this;
    const { po_no, company_id, outlet_id } = params;
    // Step 1: Chek PURCHASE_MASTER_ID Already Exists
    const existingPurchaseOrderDetails = await knex(OUTLET_PO_MASTER.NAME)
      .select(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`
      )
      .where({
        [OUTLET_PO_MASTER.COLUMNS.PO_NO]: String(po_no),
        [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
        [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id
      })
      .first();

    if (!existingPurchaseOrderDetails && !existingPurchaseOrderDetails?.id) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Purchase Order Details was not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const purchaseOrderId = existingPurchaseOrderDetails?.id;
    console.log(purchaseOrderId, "purchaseOrderId>>>>>>>>>>");

    const query = knex
      .select([
        knex.raw(`to_jsonb(${OUTLETS.NAME}.*) as outlet`),
        knex.raw(`to_jsonb(${REGION.NAME}.*) as region`),

        // supplier full json but alias name = supplier_id
        knex.raw(`to_jsonb(${SUPPLIER.NAME}.*) as supplier_id`),

        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TOTAL_ITEMS}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SET_QTY_FLAG}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_MEMO_COMPLETE}`,
        `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IMAGE_URL}`,
        `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_NO}`,
        `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_DATE}`,
        knex.raw('0::integer as invoice_discount_amount')
      ])
      .from(`${OUTLET_PO_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLET_PURCHASE_MEMO_MASTER.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
        `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO}`
      )
      .leftJoin(
        `${OUTLETS.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${REGION.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`,
        `${REGION.NAME}.${REGION.COLUMNS.ID}`
      )
      .where(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`,
        purchaseOrderId
      )
      .andWhere(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`,  // FIXED: removed double dot
        company_id
      )
      .andWhere(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        outlet_id
      );


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Po details",
      logTrace
    });
    const response = await query;

    console.log("query response", response)
    console.log("******************************")

    const purchaseOrderDetails = await Promise.all(
      response.map(async po => {
        const poDetailsQuery = knex
          .select([
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID} as id`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE} as pro_code`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_NAME} as pro_name`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CATEGORY_ID} as main_catgory_id`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CATEGORY_NAME} as main_category_name`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID} as brand_company_id`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.UNIT_ID} as uom_id`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MRP}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN} as margin`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE} as vendor_discount_type`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE} as vendor_discount_value`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.RATE} as pur_rate`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MEMO_MRP}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MEMO_COST_PRICE}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GST}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CESS}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CGST}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SGST}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CP} as cost_price`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE} as landing_price`,
            `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_MEMO_COMPLETE}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.STK_HOLD} as soh`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.STK_HOLD} as balance`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SALES_QUANTITY} as sales_qty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MIN_MBQ} as min_mbq`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PACK_QTY} as PackQty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.T_QTY} as Transit_Qty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUGG_QTY} as suggested_Qty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.REQ_QTY} as RequiredQty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.QUANTITY} as orderQty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.QUANTITY} as qty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.TYPE} as purchase_order_type`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.AVERAGE_QTY} as averageQty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SALES_DAYS} as Daily_Run_Rate`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SALES_DAYS} as sales_days`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.STOCK_BALANCE} as stockbalance`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.TOTAL_BALANCE} as Totalbalance`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.QUANTITY} as finalPackQty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.FINAL_MBQ} as finalMBQ`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CASE_QTY} as caseQty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.TS} as ts`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VLT}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PAWAY}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MBQ}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GRN_APPROVAL_STATUS}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GRN_APPROVED_By}`
          ])
          .from(`${OUTLET_PO_DETAILS.NAME} as ${OUTLET_PO_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
          )
          .leftJoin(
            `${MAIN_CATEGORY.NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
          )
          .leftJoin(
            `${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`,
            `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`
          );

        if (Boolean(po.is_memo_complete)) {
          poDetailsQuery.leftJoin(
            `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}`,
            function () {
              this.on(
                `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PO_NO}`,
                '=',
                `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`
              )
                .andOn(
                  `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.OUTLET_ID}`,
                  '=',
                  `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`
                )
                .andOn(
                  `${OUTLET_PURCHASE_MEMO_DETAILS.NAME}.${OUTLET_PURCHASE_MEMO_DETAILS.COLUMNS.PROD_ID}`,
                  '=',
                  `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`
                );
            }
          )
          poDetailsQuery.andWhere(
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MEMO_MRP}`,
            '>', 0
          )
        }

        poDetailsQuery.where(
          `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`,
          purchaseOrderId
        )
          .andWhere(
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID}`,
            company_id
          )
          .andWhere(
            `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
            outlet_id
          )
          .andWhere(
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.QUANTITY}`,
            '>', 0
          )
          .orderBy(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`, "ASC");

        const po_details_lines = await poDetailsQuery;

        const updatedPoDetailsLines = po_details_lines.map((detail) => {
          const memoCostPrice = Number(detail.memo_cost_price) || 0;
          const cp = Number(detail.pur_rate) || 0;
          const gst = Number(detail.gst) || 0;
          const memogstAmount = Number(((memoCostPrice * gst) / 100).toFixed(2));
          const memoPurchaseRate = Number((memoCostPrice + memogstAmount).toFixed(2));
          const gstAmount = Number(((cp * gst) / 100).toFixed(2));
          const purchaseRate = Number((cp + gstAmount).toFixed(2));

          return {
            ...detail,
            phy_qty: 0,

            cost_price: cp,          // ✅ number
            gst_amount: memogstAmount,          // ✅ number
            pur_rate: purchaseRate,          // ✅ number
            memo_purchase_rate: memoPurchaseRate,          // ✅ number

            po_type_id: String(po.type) === 'auto' ? 1 : 2,

            averageQty: detail.averageQty ?? 0,
            stockbalance: detail.stockbalance ?? 0,
            Totalbalance: detail.Totalbalance ?? 0,
            ts: detail.ts ?? 0,
            vlt: detail.vlt ?? 0,
            paway: detail.paway ?? 0,

            // Integer fields
            sales_days: Math.round(Number(detail.sales_days) || 0),
            Daily_Run_Rate: Math.round(Number(detail.Daily_Run_Rate) || 0),
            min_mbq: Math.round(Number(detail.min_mbq) || 0),
            PackQty: Math.round(Number(detail.PackQty) || 0),
            sales_qty: Math.round(Number(detail.sales_qty) || 0),
            soh: Math.round(Number(detail.soh) || 0),
            Transit_Qty: Math.round(Number(detail.Transit_Qty) || 0),
            suggested_Qty: Math.round(Number(detail.suggested_Qty) || 0),

            // Approval (numeric-safe)
            approval: Number(detail.cost_price) !== Number(detail.memo_cost_price) ? 1 : 0
          };
        });



        return {
          ...po,
          memo_invoice_url: po.image_url,
          po_details_lines: updatedPoDetailsLines
        };
      })
    );

    return purchaseOrderDetails;

  }


  async function putOutletPurchaseOrderProductRepo({ params, body, userDetails }) {
    const knex = this;
    const { po_no, company_id, outlet_id } = params;

    const trx = await knex.transaction();

    try {
      //  values
      // ----------------------------------------
      // Step 1: Fetch PO master
      // ----------------------------------------
      const poMaster = await trx(OUTLET_PO_MASTER.NAME)
        .where({
          [OUTLET_PO_MASTER.COLUMNS.PO_NO]: String(po_no),
          [OUTLET_PO_MASTER.COLUMNS.PO_DATE]: String(body.po_date),
          [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
          [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id
        })
        .first();

      if (!poMaster) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Outlet Purchase Order not found",
          property: "",
          code: "NOT_FOUND"
        });
      }
      // console.log("poMaster", poMaster)
      const purchaseOrderId = poMaster.id;

      const supplierDetails = await trx(SUPPLIER.NAME)
        .select(SUPPLIER.COLUMNS.GST_TYPE)
        .where(SUPPLIER.COLUMNS.ID, body.supplier_id)
        .first();

      const { gst_type } = supplierDetails;

      // ----------------------------------------
      // Step 2: Recalculate Master Totals
      // ----------------------------------------
      let totalOrderQty = 0;
      let totalItems = body.outlet_po_details?.length || 0;
      let subTotalAmt = 0;
      let totalCessAmt = 0;
      let totalGstAmt = 0;
      let totalDiscountAmt = 0;
      let totalDebitNoteAmt = 0;
      let grandTotalAmt = 0;

      console.log(poMaster, "poMaster");


      if ([1, 2].includes(Number(body.grn_approval))) {

        totalDiscountAmt = Number(poMaster.invoice_discount_amount);

        body.outlet_po_details.forEach(detail => {

          const gst = Number(detail.gst) || 0;
          const cess = Number(detail.cess) || 0;
          const qty = Number(detail.quantity) || 0;

          let rate = 0;
          let memoRate = 0;
          let gstAmount = 0;
          let cessAmount = 0;
          let landingRate = 0;
          let basicAmount = 0;
          let poAmount = 0;
          let memoAmount = 0;
          let debitNoteAmt = 0;

          // ===== RATE SELECTION =====
          if (Number(detail.grn_approval_status) === 1) {
            rate = Number(detail.memo_rate) || 0;
            memoRate = Number(detail.memo_rate) || 0;

            // ===== PO CALCULATION =====
            gstAmount = (rate * gst) / 100;
            cessAmount = (rate * cess) / 100;
            landingRate = rate + gstAmount;
            basicAmount = landingRate * qty;
            poAmount = basicAmount + cessAmount;
          }

          if (Number(detail.grn_approval_status) === 2) {
            rate = Number(detail.rate) || 0;
            memoRate = Number(detail.memo_rate) || 0;
            // ===== PO CALCULATION =====
            gstAmount = (rate * gst) / 100;
            cessAmount = (rate * cess) / 100;
            landingRate = rate + gstAmount;
            basicAmount = landingRate * qty;
            poAmount = basicAmount + cessAmount;

            const memoGst = (memoRate * gst) / 100;
            const memoCess = (memoRate * cess) / 100;
            const memoLanding = memoRate + memoGst;
            const memoBasic = memoLanding * qty;

            memoAmount = memoBasic + memoCess;
            debitNoteAmt = memoAmount - poAmount;
          }

          totalOrderQty += qty;
          subTotalAmt += basicAmount;
          totalGstAmt += gstAmount;
          totalCessAmt += cessAmount;
          totalDebitNoteAmt += debitNoteAmt;
        })

        // ✅ ROUNDING ONLY ONCE
        grandTotalAmt =
          Number(subTotalAmt.toFixed(2)) + Number(totalCessAmt.toFixed(2));

        const roundedGrandTotal = Math.round(grandTotalAmt - totalDiscountAmt);
        roundOff = roundedGrandTotal - (grandTotalAmt - totalDiscountAmt);
        grandTotalAmt = roundedGrandTotal;

        console.log("totalOrderQty", totalOrderQty);
        console.log("subTotalAmt", subTotalAmt);
        console.log("totalGstAmt", totalGstAmt);
        console.log("totalCessAmt", totalCessAmt);
        console.log("grandTotalAmt", grandTotalAmt);
        console.log("totalDiscountAmt", totalDiscountAmt);
        console.log("roundedGrandTotal", roundedGrandTotal);
        console.log("roundOff", roundOff);
        console.log("totalDebitNoteAmt", totalDebitNoteAmt);

        await trx(OUTLET_PO_MASTER.NAME)
          .where({
            [OUTLET_PO_MASTER.COLUMNS.ID]: purchaseOrderId,
            [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
            [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id
          })
          .update({
            [OUTLET_PO_MASTER.COLUMNS.TOTAL_ITEMS]: totalItems,
            [OUTLET_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY]: totalOrderQty,
            [OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotalAmt,
            [OUTLET_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: gst_type === 2 ? totalGstAmt : 0,
            [OUTLET_PO_MASTER.COLUMNS.TOTAL_IGST_AMT]: gst_type === 1 ? totalGstAmt : 0,
            [OUTLET_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: totalCessAmt,
            [OUTLET_PO_MASTER.COLUMNS.ROFF]: roundOff,
            [OUTLET_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmt,
            [OUTLET_PO_MASTER.COLUMNS.PO_SYNC]: 0,
            [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
            [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date()
          });


        // ----------------------------------------
        // Step 5: Insert new PO details
        // ----------------------------------------
        const poDetailRows = body.outlet_po_details.map(d => {

          const gst = Number(d.gst) || 0;
          const cess = Number(d.cess) || 0;
          const qty = Number(d.quantity) || 0;

          let rate = 0;
          let memoRate = 0;
          let gstAmount = 0;
          let cessAmount = 0;
          let landingRate = 0;
          let basicAmount = 0;

          // ===== RATE SELECTION =====
          if (Number(d.grn_approval_status) === 1) {
            rate = Number(d.memo_rate) || 0;
            memoRate = rate;
          }

          if (Number(d.grn_approval_status) === 2) {
            rate = Number(d.rate) || 0;
            memoRate = Number(d.memo_rate) || 0;
          }

          // ===== PO CALCULATION =====
          gstAmount = (rate * gst) / 100;
          cessAmount = (rate * cess) / 100;
          landingRate = rate + gstAmount;
          basicAmount = landingRate * qty;

          return {
            [OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID]: purchaseOrderId,
            [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
            [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
            [OUTLET_PO_DETAILS.COLUMNS.PROD_ID]: Number(d.prod_id),
            [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
            [OUTLET_PO_DETAILS.COLUMNS.MRP]: Number(d.mrp),
            [OUTLET_PO_DETAILS.COLUMNS.CP]: rate,
            [OUTLET_PO_DETAILS.COLUMNS.MEMO_MRP]: Number(d.mrp),
            [OUTLET_PO_DETAILS.COLUMNS.MEMO_COST_PRICE]: memoRate,
            [OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT]: gst_type === 2 ? gstAmount : 0,
            [OUTLET_PO_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,
            [OUTLET_PO_DETAILS.COLUMNS.RATE]: rate,
            [OUTLET_PO_DETAILS.COLUMNS.QUANTITY]: qty,
            [OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE]: landingRate,
            [OUTLET_PO_DETAILS.COLUMNS.AMOUNT]: basicAmount,
            [OUTLET_PO_DETAILS.COLUMNS.PO_SYNC]: 0,
            [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
            [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
          };
        });

        // console.log("poDetailRows", poDetailRows)

        await trx(OUTLET_PO_DETAILS.NAME)
          .insert(poDetailRows)
          .onConflict([
            OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID,
            OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID,
            OUTLET_PO_DETAILS.COLUMNS.PO_NO,
            OUTLET_PO_DETAILS.COLUMNS.PROD_ID
          ])
          .merge();


        const formattedDate = new Date(poMaster.po_date).toISOString().slice(0, 10);

        // Insert log for UPDATE operation 
        const updateLogData = {
          [OUTLET_PO_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
          [OUTLET_PO_LOGS.COLUMNS.USER_ID]: userDetails.id,
          [OUTLET_PO_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
          [OUTLET_PO_LOGS.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_LOGS.COLUMNS.PO_DATE]: formattedDate,
          [OUTLET_PO_LOGS.COLUMNS.OLDDATA]: JSON.stringify({ outlet_po_master: poMaster }),
          [OUTLET_PO_LOGS.COLUMNS.NEWDATA]: JSON.stringify({ body }),
          [OUTLET_PO_LOGS.COLUMNS.CREATED_AT]: new Date()
        };

        await trx(OUTLET_PO_LOGS.NAME).insert(updateLogData);

        await trx.commit();


        const memoMasterDetails = await knex(OUTLET_PURCHASE_MEMO_MASTER.NAME)
          .where(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO, String(po_no))
          .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
          .andWhere(OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.SUPPLIER_ID, Number(body.supplier_id))
          .first();

        if (!memoMasterDetails) {
          throw new Error(`Purchase memo not found for PO ${po_no}`);
        }


        await knex(OUTLET_PO_MASTER.NAME)
          .where({
            [OUTLET_PO_MASTER.COLUMNS.ID]: purchaseOrderId,
            [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
            [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id
          })
          .update({
            [OUTLET_PO_MASTER.COLUMNS.IS_AMENDMENT_APPROVAL_STATUS]: Number(body.grn_approval),
            [OUTLET_PO_MASTER.COLUMNS.IS_AMENDMENT_APPROVAL_BY]: userDetails.id,
            [OUTLET_PO_MASTER.COLUMNS.IS_DEBITE_NOTE]: Number(body.grn_approval) === 1 && totalDebitNoteAmt > 0,
            [OUTLET_PO_MASTER.COLUMNS.DEBITE_NOTE_AMT]: Number(body.grn_approval) === 1 ? totalDebitNoteAmt : 0,
            [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
            [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date()
          });
        // // console.log("memoMasterDetails", memoMasterDetails)

        const outletPurchaseDetails = [];

        for (const element of body.outlet_po_details) {
          const memoBatchDetails = await knex(OUTLET_PURCHASE_MEMO_BATCH_DETAILS.NAME)
            .where(
              OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.OUTLET_PO_MEMO_MST_ID,
              Number(memoMasterDetails.id)
            )
            .andWhere(
              OUTLET_PURCHASE_MEMO_BATCH_DETAILS.COLUMNS.PRODUCT_ID,
              Number(element.prod_id)
            );


          const outletPoDetails = await knex(OUTLET_PO_DETAILS.NAME)
            .select(
              OUTLET_PO_DETAILS.COLUMNS.MEMO_MRP,
              OUTLET_PO_DETAILS.COLUMNS.HSN
            )
            .where(
              OUTLET_PO_DETAILS.COLUMNS.PO_NO,
              String(po_no)
            )
            .andWhere(
              OUTLET_PO_DETAILS.COLUMNS.PROD_ID,
              Number(element.prod_id)
            )
            .first();

          console.log("outletpodetail", outletPoDetails)
          const orderQty = Number(element.quantity) || 0;
          outletPurchaseDetails.push({
            product_id: Number(element.prod_id),
            product_code: String(element.prod_code),
            qty: orderQty,
            return_qty: 0,
            free_qty: Number(element.free_qty) || 0,
            mrp: Number(element.mrp) || 0,
            mrp_mismatch_flag:
              Number(element.grn_approval_status) === 2
                ? Number(element.rate) !== Number(element.memo_rate)
                : false,
            purchase_rate: Number(element.grn_approval_status) === 1 ? Number(element.memo_rate) : Number(element.rate),
            gst: Number(element.gst) || 0,
            cess: Number(element.cess) || 0,
            hsn: outletPoDetails.hsn,
            sale_rate: Number(element.mrp) || 0,
            accepted_margin: Number(element.accepted_margin) || 0,
            self_life_qty: 0,
            outlet_purchase_batch_details: memoBatchDetails.map(batch => ({
              batch_no: String(batch.batch_no),
              qty: Number(batch.qty) || 0,
              mrp: Number(batch.mrp) || 0,
              self_life_qty: 0,
              return_qty: Number(batch.return_qty) || 0
            }))
          });
        }

        console.log("outletPurchaseDetails", outletPurchaseDetails)
        function toPgDate(value) {
          if (!value) return null;
          return new Date(value).toISOString().slice(0, 10); // YYYY-MM-DD
        }

        const purchasePayload = {
          supplier_id: memoMasterDetails.supplier_id,
          company_id: memoMasterDetails.company_id || 1,
          outlet_id: memoMasterDetails.outlet_id,
          wh_id: memoMasterDetails.warehouse_id,

          invoice_no: memoMasterDetails.invoice_no,
          invoice_date: toPgDate(memoMasterDetails.invoice_date),

          pono: memoMasterDetails.pono,
          podate: memoMasterDetails.podate,

          memo_no: memoMasterDetails.docno,
          memo_date: toPgDate(memoMasterDetails.docdate),
          memo_invoice_amt: memoMasterDetails.invoice_amount,
          discount: totalDiscountAmt,
          total_items: body.outlet_po_details.length,
          is_debit_note: Number(totalDebitNoteAmt) > 0 ? true : false,
          total_debit_note_amount: totalDebitNoteAmt,
          remark:
            Number(body.grn_approval) === 1
              ? "CP Approved"
              : "CP Rejected",
          purchase: true,
          purchase_return: false,
          outlet_purchase_details: outletPurchaseDetails
        }


        let base_url = process.env.BASE_URL;
        token = process.env.TOKEN;

        console.log("purchanse paylaod", purchasePayload)


        await httpClient({
          url: `${base_url}/outlet/purchase`,
          method: "POST",
          body: purchasePayload,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      }

      if (Number(body.grn_approval) === 0) {
        const discountAmt = Number(body.invoice_discount_amount) || 0;
        // ✅ Update PO MASTER ONCE
        await trx(OUTLET_PO_MASTER.NAME)
          .where({
            [OUTLET_PO_MASTER.COLUMNS.ID]: purchaseOrderId,
            [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
            [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id
          })
          .update({
            [OUTLET_PO_MASTER.COLUMNS.IS_FINANCE_APPROVAL]: true,
            [OUTLET_PO_MASTER.COLUMNS.INVOICE_DISCOUNT_AMOUNT]: discountAmt,
            [OUTLET_PO_MASTER.COLUMNS.IS_FINANCE_APPROVAL_BY]: userDetails.id,
            [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
            [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date()
          });

        // ✅ Update PO DETAILS per product
        for (const detail of body.outlet_po_details || []) {
          await trx(OUTLET_PO_DETAILS.NAME)
            .where({
              [OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID]: purchaseOrderId,
              [OUTLET_PO_DETAILS.COLUMNS.PROD_ID]: Number(detail.prod_id),
              [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
              [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id
            })
            .update({
              [OUTLET_PO_DETAILS.COLUMNS.MEMO_MRP]: Number(detail.memo_mrp) || 0,
              [OUTLET_PO_DETAILS.COLUMNS.MEMO_COST_PRICE]: Number(detail.memo_cost_price) || 0,
              [OUTLET_PO_DETAILS.COLUMNS.FINANCE_APPROVAL]: detail.approval,
              [OUTLET_PO_DETAILS.COLUMNS.QUANTITY]: detail.quantity,
              [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
              [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date()
            });
        }

        await trx.commit();
      }


      return { success: true };

    } catch (error) {
      await trx.rollback();
      console.log("Update Outlet Purchase Order transaction failed:", error)
      if (error?._code === 404 || error?._code === 400) {
        throw error;
      }
      throw CustomError.create({
        httpCode: 500,
        message: "Outlet Purchase Order transaction failed.",
        code: "TRANSACTION_FAILED"
      });
    }
  }


  async function deleteOutletPurchaseOrderProductRepo({ body, params, logTrace, userDetails }) {
    const knex = this;
    const { po_no, company_id, outlet_id } = params;
    const trx = await knex.transaction();

    try {
      const query = await trx(OUTLET_PO_MASTER.NAME)
        .where({
          [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
          [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id
        });

      const exists_response = await query;

      if (!Array.isArray(exists_response) || exists_response.length === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Outlet Purchase order ${po_no} is not found`,
          property: "",
          code: "NOT_FOUND"
        });
      }

      const query1 = trx(OUTLET_PO_MASTER.NAME)
        .where({
          [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
          [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id
        })
        .whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, [1, 2, 3]);

      const exists_response1 = await query1;

      if (exists_response1.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Outlet Purchase Order ${po_no} is approved and cannot be deleted`,
          property: "",
          code: "NOT_FOUND"
        });
      }

      const outletPoMasterData = await trx(OUTLET_PO_MASTER.NAME)
        .where({
          [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
          [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id
        })
        .first();

      console.log("outletPoMasterData", outletPoMasterData)

      const outletPoDetailsData = await trx(OUTLET_PO_DETAILS.NAME)
        .where({
          [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
          [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id
        });

      console.log("outletPoDetailsData", outletPoDetailsData)


      const logData = {
        [OUTLET_PO_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
        [OUTLET_PO_LOGS.COLUMNS.OLDDATA]: JSON.stringify({
          outlet_po_master: outletPoMasterData,
          outlet_po_details: outletPoDetailsData
        }),
        [OUTLET_PO_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [OUTLET_PO_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [OUTLET_PO_LOGS.COLUMNS.PO_NO]: po_no,
        [OUTLET_PO_LOGS.COLUMNS.PO_DATE]: outletPoMasterData?.[OUTLET_PO_MASTER.COLUMNS.PO_DATE] || null,
        [OUTLET_PO_LOGS.COLUMNS.CREATED_AT]: new Date()
      };

      await trx(OUTLET_PO_LOGS.NAME).insert(logData);

      await trx(OUTLET_PO_DETAILS.NAME)
        .where({
          [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id
        })
        .del();

      const queryDeleteMaster = await trx(OUTLET_PO_MASTER.NAME)
        .where({
          [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
          [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id
        })
        .del();

      if (!queryDeleteMaster) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: `Error while deleting Outlet purchase order ${po_no}`,
          property: "",
          code: "DELETE_FAILED"
        });
      }

      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback();
      console.error("Outlet Purchase Order Transaction Failed:", error);

      if (error instanceof CustomError) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: error._errors?.[0]?.message || "Something went wrong",
          property: "",
          code: "NOT_FOUND"
        });
      } else {
        throw {
          statusCode: 500,
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR"
        };
      }
    }
  }


  async function putoutletPoUnApprovedProduct({ body, params, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;

    const { outlet_id, company_id } = params;

    const { un_approved_pono } = body;

    if (!Array.isArray(un_approved_pono) || un_approved_pono.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "No Outlet purchase orders provided for approval",
        property: "",
        code: "BAD_REQUEST"
      });
    }

    for (const po of un_approved_pono) {
      const { pono, approved, comments } = po;

      const query = knex(OUTLET_PO_MASTER.NAME)
        .where(OUTLET_PO_MASTER.COLUMNS.PO_NO, pono)
        .where(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
        .where(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id);

      const exists_response = await query;

      if (!exists_response.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Outlet Purchase order ${pono} is not found`,
          property: "",
          code: "NOT_FOUND"
        });
      }
      const updateData = {
        [OUTLET_PO_MASTER.COLUMNS.APPROVAL]: Number(approved),
        [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
        [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: created_by
      };

      if (Number(approved) === 1) {
        updateData[OUTLET_PO_MASTER.COLUMNS.IS_APPROVED_BY] = created_by;
      }

      if (Number(approved) === 2) {
        updateData[OUTLET_PO_MASTER.COLUMNS.UN_APPROVAL_COMMENTS] = comments || "";
      }

      const query_update = await knex(OUTLET_PO_MASTER.NAME)
        .where(OUTLET_PO_MASTER.COLUMNS.PO_NO, pono)
        .where(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
        .where(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
        .update(updateData);

      if (!query_update) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: `Failed to update Outlet purchase order ${pono}`,
          code: "UPDATE_FAILED"
        });
      }

    }

    return { success: true };
  }


  async function getOutletPoUnApprovedProduct({ body, params, queryString, logTrace }) {
    const knex = this;
    const { approved, from_date, to_date, company_id, outlet_id } = params;
    const currentDate = new Date().toISOString().split('T')[0];
    console.log(currentDate); // Example output: "2025-03-05"

    // find expired date purchase order
    const check_expried_query = knex
      .select([
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`
      ])
      .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outlet_id)
      .whereRaw(
        `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE}) <  ?`,
        [currentDate]
      )

    const expriedPoResponse = await check_expried_query;
    console.log(expriedPoResponse, "po response")
    const expried_po = expriedPoResponse.map(i => String(i.pono))
    console.log(expried_po, "expred po")
    // Update expired purchase orders (only if there are expired POs)
    // Ensure expired POs exist before updating
    if (expried_po.length > 0) {
      await knex(OUTLET_PO_MASTER.NAME) // ✅ Use actual table name (not alias)
        .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
        .whereIn(OUTLET_PO_MASTER.COLUMNS.PO_NO, expried_po) // ✅ Use column name directly
        .update({ [OUTLET_PO_MASTER.COLUMNS.EXPIRED]: true }); // ✅ Correct update syntax
    }

    console.log("Expired POs updated successfully!");

    const query = knex
      .select([
        `${OUTLET_PO_MASTER.NAME}.*`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.UN_APPROVAL_COMMENTS} as reason`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
        `${USERS.NAME}.${USERS.COLUMNS.USER_NAME} as approver_name`
      ])
      .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${USERS.NAME} as ${USERS.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_APPROVED_BY}`,
        `${USERS.NAME}.${USERS.COLUMNS.ID}`
      )
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .whereRaw(
        `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) >= ?`,
        [from_date]
      )
      .whereRaw(
        `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) <= ?`, // Fixed this condition
        [to_date]
      )
      .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`, "DESC");

    // Additional conditions for `approved` field
    if (Number(approved) === 0) {
      query.where(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`,
        0
      )
      query.andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.EXPIRED}`, false)
    }
    if (Number(approved) === 1) {
      query.where(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`,
        1
      )
    }

    if (Number(approved) === 2) {
      query.where(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`,
        2
      );
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Po details",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Purchase Order not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const purchaseOrderDetails = await Promise.all(
      response.map(async (po, index) => {
        const po_details_lines = await knex
          .select([
            `${OUTLET_PO_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`
          ])
          .from(`${OUTLET_PO_DETAILS.NAME} as ${OUTLET_PO_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`,
            po.id
          );

        let po_status;
        switch (po.approval) {
          case 0:
            po_status = "Pending";
            break;
          case 1:
            po_status = "Approval";
            break;
          case 2:
            po_status = "UnApproval";
            break;
          case 3:
            po_status = "GRN Complete";
            break;
          default:
            po_status = "Pending";
        }
        return {
          ...po,
          Sno: index + 1,
          po_status,
          po_type_name: po.type,
          po_details_lines,
        };
      })
    );


    return purchaseOrderDetails;
  }

  // async function getOutletPoApprovalReportProduct({ body, params, queryString, logTrace }) {
  //   const knex = this;
  //   const { from_date, to_date, company_id, outlet_id } = params;
  //   const { approved, type } = queryString;
  //   const currentDate = new Date().toISOString().split('T')[0];
  //   console.log(currentDate); // Example output: "2025-03-05"

  //   // find expired date purchase order
  //   const check_expried_query = knex
  //     .select([
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`
  //     ])
  //     .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
  //     .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
  //     .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outlet_id)
  //     .whereRaw(
  //       `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE}) <  ?`,
  //       [currentDate]
  //     )

  //   const expriedPoResponse = await check_expried_query;
  //   console.log(expriedPoResponse, "po response")
  //   const expried_po = expriedPoResponse.map(i => String(i.pono))
  //   console.log(expried_po, "expred po")
  //   // Update expired purchase orders (only if there are expired POs)
  //   // Ensure expired POs exist before updating
  //   if (expried_po.length > 0) {
  //     await knex(OUTLET_PO_MASTER.NAME) // ✅ Use actual table name (not alias)
  //       .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
  //       .whereIn(OUTLET_PO_MASTER.COLUMNS.PO_NO, expried_po) // ✅ Use column name directly
  //       .update({ [OUTLET_PO_MASTER.COLUMNS.EXPIRED]: true }); // ✅ Correct update syntax
  //   }

  //   console.log("Expired POs updated successfully!");

  //   const query = knex
  //     .select([
  //       `${OUTLET_PO_MASTER.NAME}.*`,
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.UN_APPROVAL_COMMENTS} as reason`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
  //       `${USERS.NAME}.${USERS.COLUMNS.USER_NAME} as approver_name`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as store_code`,
  //     ])
  //     .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
  //     .leftJoin(
  //       `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
  //     )
  //     .leftJoin(
  //       `${USERS.NAME} as ${USERS.NAME}`,
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_APPROVED_BY}`,
  //       `${USERS.NAME}.${USERS.COLUMNS.ID}`
  //     )
  //     .leftJoin(
  //       `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
  //     )
  //     .leftJoin(
  //       `${REGION.NAME} as ${REGION.NAME}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`,
  //       `${REGION.NAME}.${REGION.COLUMNS.ID}`
  //     )
  //     .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
  //     .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outlet_id)
  //     .whereRaw(
  //       `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) >= ?`,
  //       [from_date]
  //     )
  //     .whereRaw(
  //       `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) <= ?`, // Fixed this condition
  //       [to_date]
  //     )
  //     .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`, "DESC");

  //   // Additional conditions for `approved` field
  //   if (Number(approved) === 0) {
  //     // query.where(
  //     //   `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`,
  //     //   0
  //     // )
  //     // query.andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.EXPIRED}`, false)
  //   }
  //   if (Number(approved) === 1) {
  //     query.where(
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`,
  //       1
  //     )
  //   }

  //   if (Number(approved) === 2) {
  //     query.where(
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`,
  //       2
  //     );
  //   }
  //   console.log(type, "type")
  //   if (String(type).toLocaleLowerCase() !== "all") {
  //     query.where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`, type);
  //   }

  //   logQuery({
  //     logger: fastify.log,
  //     query,
  //     context: "Get Po details",
  //     logTrace
  //   });
  //   const response = await query;
  //   if (!response.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "Outlet Purchase Order not found",
  //       property: "",
  //       code: "NOT_FOUND"
  //     });
  //   }
  //   const purchaseOrderDetails = await Promise.all(
  //     response.map(async (po, index) => {
  //       const po_details_lines = await knex
  //         .select([
  //           `${OUTLET_PO_DETAILS.NAME}.*`,
  //           `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
  //           `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
  //           `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`
  //         ])
  //         .from(`${OUTLET_PO_DETAILS.NAME} as ${OUTLET_PO_DETAILS.NAME}`)
  //         .leftJoin(
  //           `${ITEM.NAME} as ${ITEM.NAME}`,
  //           `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`,
  //           `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
  //         )
  //         .where(
  //           `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`,
  //           po.id
  //         )
  //         .where(
  //           `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`,
  //           outlet_id
  //         )
  //         .orderBy(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, "DESC")

  //       let po_status;
  //       switch (po.approval) {
  //         case 0:
  //           po_status = "Pending";
  //           break;
  //         case 1:
  //           po_status = "Approval";
  //           break;
  //         case 2:
  //           po_status = "UnApproval";
  //           break;
  //         case 3:
  //           po_status = "GRN Complete";
  //           break;
  //         default:
  //           po_status = "Pending";
  //       }
  //       return {
  //         ...po,
  //         Sno: index + 1,
  //         po_status,
  //         po_type_name: po.type,
  //         po_details_lines,
  //       };
  //     })
  //   );


  //   return purchaseOrderDetails;
  // }

  async function getOutletPoApprovalReportProduct({ body, params, queryString, logTrace }) {
    const knex = this;
    const { from_date, to_date, company_id } = params;
    const { region_id, supplier_id, brand_company_id, outlet_id } = body;

    const { approved, type } = queryString;
    const currentDate = new Date().toISOString().split('T')[0];

    // -----------------------
    // Validation
    // -----------------------
    if (!Number(region_id)) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "region_id required",
        code: "INVALID_INPUT"
      });
    }

    // outlet_id must be an array like [-1], [124], [115,114,98]
    if (!Array.isArray(outlet_id) || outlet_id.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "outlet_id required",
        code: "INVALID_INPUT"
      });
    }

    // Normalize provided outlet ids to numbers
    const providedOutletIds = outlet_id.map(id => Number(id));

    // -----------------------
    // Resolve actual outlets under region (apply provided outlet filter unless [-1])
    // -----------------------
    let outletIdsQuery = knex(OUTLETS.NAME)
      .pluck(OUTLETS.COLUMNS.ID)
      .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

    if (!(providedOutletIds.length === 1 && providedOutletIds[0] === -1)) {
      outletIdsQuery.whereIn(OUTLETS.COLUMNS.ID, providedOutletIds);
    }

    const outletIds = await outletIdsQuery;
    if (!outletIds || outletIds.length === 0) return [];

    // -----------------------
    // find expired purchase order (use resolved outletIds)
    // -----------------------
    const check_expried_query = knex
      .select([`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`])
      .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outletIds)
      .whereRaw(
        `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE}) < ?`,
        [currentDate]
      );

    const expriedPoResponse = await check_expried_query;

    // Use constant name for po_no if available, fallback to common keys
    const poNoCol = OUTLET_PO_MASTER.COLUMNS.PO_NO || 'po_no';
    const expried_po = expriedPoResponse.map(i => String(i[poNoCol] || i.po_no || i.PO_NO || "")).filter(Boolean);

    if (expried_po.length > 0) {
      await knex(OUTLET_PO_MASTER.NAME)
        .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
        .whereIn(OUTLET_PO_MASTER.COLUMNS.PO_NO, expried_po)
        .update({ [OUTLET_PO_MASTER.COLUMNS.EXPIRED]: true });
    }

    // -----------------------
    // Build main query
    // -----------------------
    const query = knex
      .select([
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE} as podate`,
        `${OUTLET_PO_MASTER.NAME}.*`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.UN_APPROVAL_COMMENTS} as reason`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
        `${USERS.NAME}.${USERS.COLUMNS.USER_NAME} as approver_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as store_code`,
      ])
      .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${USERS.NAME} as ${USERS.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_APPROVED_BY}`,
        `${USERS.NAME}.${USERS.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${REGION.NAME} as ${REGION.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`,
        `${REGION.NAME}.${REGION.COLUMNS.ID}`
      )
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outletIds)
      .whereRaw(`DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) >= ?`, [from_date])
      .whereRaw(`DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) <= ?`, [to_date])

    // -----------------------
    // supplier filter (master)
    // -----------------------
    if (supplier_id && Array.isArray(supplier_id) && supplier_id.length > 0) {
      const supIds = supplier_id.map(id => Number(id));
      query.whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`, supIds)
    }

    // -----------------------
    // brand filter (exists only in PO DETAILS) -> get matching master ids and filter master
    // -----------------------
    if (brand_company_id && Array.isArray(brand_company_id) && brand_company_id.length > 0) {
      const bcIds = brand_company_id.map(id => Number(id));
      const poIdsForBrand = await knex(OUTLET_PO_DETAILS.NAME)
        .distinct(OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID)
        .whereIn(OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID, bcIds)
        .pluck(OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID);

      if (!poIdsForBrand || poIdsForBrand.length === 0) return [];

      query.whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`, poIdsForBrand)
    }

    // -----------------------
    // approval filter
    // -----------------------
    if (Number(approved) === 1) {
      query.where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, 1)
    } else if (Number(approved) === 2) {
      query.where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, 2)
    }

    // -----------------------
    // type filter — apply only if column exists in constants (defensive)
    // -----------------------
    if (OUTLET_PO_MASTER.COLUMNS.TYPE && String(type).toLowerCase() !== "all") {
      query.where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`, type)
    }

    query.orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Po details",
      logTrace
    });

    const response = await query;
    if (!response || response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Purchase Order not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // -----------------------
    // Fetch details for each PO (use resolved outletIds for details outlet filter)
    // -----------------------
    const purchaseOrderDetails = await Promise.all(
      response.map(async (po, index) => {
        const po_details_lines = await knex
          .select([
            `${OUTLET_PO_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`
          ])
          .from(`${OUTLET_PO_DETAILS.NAME} as ${OUTLET_PO_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`, po.id)
          .whereIn(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, outletIds)
          .orderBy(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, "DESC");

        let po_status;
        switch (po.approval) {
          case 0:
            po_status = "Pending";
            break;
          case 1:
            po_status = "Approval";
            break;
          case 2:
            po_status = "UnApproval";
            break;
          case 3:
            po_status = "GRN Complete";
            break;
          default:
            po_status = "Pending";
        }

        return {
          ...po,
          Sno: index + 1,
          po_status,
          po_type_name: po.type,
          po_details_lines,
        };
      })
    );

    return purchaseOrderDetails;
  }

  async function getOutletPoOverview({ body, params, queryString, logTrace }) {
    const knex = this;

    const query = knex(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
      .select([
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID} as supplier_id`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        knex.raw(`SUM(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY}) as total_order_qty`),
        knex.raw(`SUM(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TOTAL_ITEMS}) as total_order_items`),
        knex.raw(`SUM(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT}) as total_amount`),
        knex.raw(`COUNT(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}) as no_of_outlets`)
      ])
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .groupBy(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`
      )
      .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet PO Overview",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier overall view not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getOutletPoDetailsBySupplierRepo({ body, params, queryString, logTrace }) {
    const knex = this;
    const { supplier_id } = params;
    const query = knex(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
      .select([
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO} as purchase_order_number`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE} as purchase_order_date`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT} as sub_total_amount`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT} as grand_total_amount`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID} as supplier_id`
      ])
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`, supplier_id)
      .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet PO Overview",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Po Data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getOutletPoProductDateWiseRepo({ params, queryString, logTrace }) {
    const knex = this;
    const { brand_company_id, region_id, outlet_id } = params;
    // const { region_id, outlet_id } = queryString;

    const currentDate = new Date().toISOString().split('T')[0];
    console.log(currentDate); // Example output: "2025-03-05"

    // find expired date purchase order
    const expiredPoResponse = await knex
      .select([
        `${OUTLET_PO_MASTER.COLUMNS.ID} as id`,
        `${OUTLET_PO_MASTER.COLUMNS.PO_NO} as po_no`,
        `${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID} as outlet_id`
      ])
      .from(OUTLET_PO_MASTER.NAME)
      .where(`${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, 1)
      .where(`${OUTLET_PO_MASTER.COLUMNS.EXPIRED}`, true)
      .whereRaw(
        `DATE(${OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE}) < ?`,
        [currentDate]
      );

    if (expiredPoResponse.length > 0) {
      const updatedRows = await knex(OUTLET_PO_MASTER.NAME)
        .whereIn(
          [
            OUTLET_PO_MASTER.COLUMNS.ID,
            OUTLET_PO_MASTER.COLUMNS.PO_NO,
            OUTLET_PO_MASTER.COLUMNS.OUTLET_ID
          ],
          expiredPoResponse.map(i => [
            i.id,
            i.po_no,
            i.outlet_id
          ])
        )
        .whereRaw(
          `DATE(${OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE}) < ?`,
          [currentDate]
        )
        .update({
          [OUTLET_PO_MASTER.COLUMNS.EXPIRED]: true
        })
        .returning([
          OUTLET_PO_MASTER.COLUMNS.ID,
          OUTLET_PO_MASTER.COLUMNS.PO_NO,
          OUTLET_PO_MASTER.COLUMNS.OUTLET_ID
        ]);

      console.log("Expired POs updated successfully:", updatedRows);
    }


    // console.log('expiredPoResponse=====', expiredPoResponse);


    const query = knex(`${OUTLET_PO_DETAILS.NAME} as ${OUTLET_PO_DETAILS.NAME}`)
      .distinct([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE} as product_code`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as store_code`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MRP} as mrp`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.RATE} AS base_price`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GST} AS gst_percentage`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE} AS landing_rate`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CASE_QTY}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PACK_QTY} as pack_qty`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MIN_MBQ} as min_mbq_qty`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MBQDAYS} as mbqdays`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SALES_QUANTITY} as sale_qty`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.STOCK_DAYS} as stock_days`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.STK_HOLD} as soh`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.DOH}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.AVERAGE_QTY} as average_qty`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO} as pono`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.ORD_QTY} as po_qty`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_DATE} as po_date`
      ])
      .innerJoin(
        `${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`,
        function () {
          this.on(
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`,
            `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
          ).on(
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID}`,
            `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
          );
        }
      )
      .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID}`, brand_company_id)
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, 0)
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_DSD}`, 0)
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.EXPIRED}`, false)
      .whereRaw(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}::date = ?`, [currentDate])
      .whereRaw(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_DATE}::date = ?`, [currentDate])
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)

    // REGION FILTER (region selected & outlet_id = -1)
    if (Number(region_id)) {

      // Get outlets under region
      let outletIdsQuery = knex(OUTLETS.NAME)
        .pluck(OUTLETS.COLUMNS.ID)
        .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

      // If specific outlet also passed → restrict to that
      if (Number(outlet_id) !== -1) {
        outletIdsQuery.andWhere(OUTLETS.COLUMNS.ID, Number(outlet_id));
      }

      const outletIds = await outletIdsQuery;

      if (outletIds.length === 0) return [];

      // Apply in main query
      query.whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outletIds);
    }

    // query.orderBy(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ASC");
    query.orderBy([
      { column: `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, order: "ASC" },
      { column: `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, order: "ASC" },
    ]);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet PO Product-Date Wise",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No product PO data found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const finalResponse = response.map(e => {
      const formatted = moment(e.po_date, "YYYY-MM-DD").format("DD-MM-YYYY");
      return {
        ...e,
        po_date: formatted,
        mrp: Number(e.mrp).toFixed(2),
        base_price: Number(e.base_price).toFixed(2),
        lp: Number(e.landing_rate).toFixed(2),
        average_qty: Math.round(Number(e.average_qty)),
        doh: Math.round(Number(e.doh))
      };
    });

    return finalResponse;
  }

  async function updatePoQtyRepo({ body, params, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    const { product_details } = body;

    if (!Array.isArray(product_details) || product_details.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "No Outlet purchase orders provided for approval",
        property: "",
        code: "BAD_REQUEST"
      });
    }

    return await knex.transaction(async (trx) => {
      for (const po of product_details) {
        const { product_code, po_no, quantity, supplier_id, outlet_id } = po;

        // Validate existence
        const exists = await trx(OUTLET_PO_DETAILS.NAME)
          .where(OUTLET_PO_DETAILS.COLUMNS.PO_NO, po_no)
          .andWhere(OUTLET_PO_DETAILS.COLUMNS.PROD_CODE, product_code)
          .andWhere(OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID, outlet_id)
          .andWhere(OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID, supplier_id)
          .first();

        if (!exists) {
          throw CustomError.create({
            httpCode: StatusCodes.NOT_FOUND,
            message: `Outlet Purchase order detail not found for product_code ${product_code}`,
            property: "",
            code: "NOT_FOUND"
          });
        }

        // Update with the incoming quantity
        const updateDetail = {
          [OUTLET_PO_DETAILS.COLUMNS.QUANTITY]: quantity,
          [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
          [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: created_by
        };

        await trx(OUTLET_PO_DETAILS.NAME)
          .where(OUTLET_PO_DETAILS.COLUMNS.PO_NO, po_no)
          .andWhere(OUTLET_PO_DETAILS.COLUMNS.PROD_CODE, product_code)
          .andWhere(OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID, outlet_id)
          .andWhere(OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID, supplier_id)
          .update(updateDetail);
      }

      return { success: true };
    }).catch((error) => {
      console.error("Transaction Failed:", error);

      if (error._code === 404 || error._code === 400) {
        throw error;
      }

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Supplier Approval Process Failed.",
        property: "",
        code: "SUPPLIER_APPROVAL_FAILED"
      });
    });
  }

  async function putoutletPoApprovedRepo({ body, params, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    const { company_id, supplier_id } = params;
    const { product_details } = body;

    const trx = await knex.transaction();

    try {
      if (!product_details || product_details.length === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "Product details are required",
          code: "INVALID_PAYLOAD"
        });
      }

      // Assume all products belong to same PO (as per your payload)
      const { po_no, po_date, outlet_id } = product_details[0];
      const formattedPoDate = moment(po_date, "DD-MM-YYYY").format("YYYY-MM-DD");

      /* --------------------------------------------------
         STEP 1: Validate PO MASTER ONCE
      -------------------------------------------------- */
      const masterRow = await trx(OUTLET_PO_MASTER.NAME)
        .where({
          [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_MASTER.COLUMNS.PO_DATE]: formattedPoDate,
          [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
          [OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID]: supplier_id,
          [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id
        })
        .first();

      if (!masterRow) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `PO master not found. PO_NO ${po_no}`,
          code: "PO_MASTER_NOT_FOUND"
        });
      }

      /* --------------------------------------------------
         STEP 2: Update PO DETAILS (LOOP)
      -------------------------------------------------- */
      for (const product of product_details) {
        const { product_code, quantity } = product;
        const new_qty = Number(quantity) || 0;

        const detailRow = await trx(OUTLET_PO_DETAILS.NAME)
          .where({
            [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
            [OUTLET_PO_DETAILS.COLUMNS.PO_DATE]: formattedPoDate,
            [OUTLET_PO_DETAILS.COLUMNS.PROD_CODE]: product_code,
            [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
            [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id,
            [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id
          })
          .first();

        if (!detailRow) {
          throw CustomError.create({
            httpCode: StatusCodes.NOT_FOUND,
            message: `PO detail not found. Product ${product_code}`,
            code: "PO_DETAIL_NOT_FOUND"
          });
        }

        const rate = Number(detailRow.rate) || 0;
        const gstPercent = Number(detailRow.gst) || 0;
        const cessPercent = Number(detailRow.cess) || 0;
        // per unit landing rate
        const landingRate = Number(rate + (rate * gstPercent / 100)).toFixed(2);
        // base
        const taxableAmount = rate * new_qty;
        const subTotal = Number(new_qty * landingRate).toFixed(2);
        const gstAmount = (taxableAmount * gstPercent) / 100;
        const cessAmount = (taxableAmount * cessPercent) / 100;

        await trx(OUTLET_PO_DETAILS.NAME)
          .where({
            [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
            [OUTLET_PO_DETAILS.COLUMNS.PO_DATE]: formattedPoDate,
            [OUTLET_PO_DETAILS.COLUMNS.PROD_CODE]: product_code,
            [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
            [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id,
            [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id
          })
          .update({
            [OUTLET_PO_DETAILS.COLUMNS.QUANTITY]: new_qty,
            [OUTLET_PO_DETAILS.COLUMNS.AMOUNT]: subTotal,
            [OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE]: landingRate,
            [OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT]: gstAmount,
            [OUTLET_PO_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,
            [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: knex.fn.now(),
            [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: created_by
          });
      }

      /* --------------------------------------------------
         STEP 3: Recalculate TOTALS FROM DETAILS (ONCE)
      -------------------------------------------------- */
      const totals = await trx(OUTLET_PO_DETAILS.NAME)
        .where({
          [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_DETAILS.COLUMNS.PO_DATE]: formattedPoDate,
          [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
          [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id,
          [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id
        })
        .sum({
          total_sub_total_amt: OUTLET_PO_DETAILS.COLUMNS.AMOUNT,
          total_gst_amt: OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT,
          total_cess_amt: OUTLET_PO_DETAILS.COLUMNS.CESS_AMOUNT,
          total_order_qty: OUTLET_PO_DETAILS.COLUMNS.QUANTITY
        })
        .first();

      // ✅ SAFELY CONVERT
      const subTotalAmt = Number(totals?.total_sub_total_amt) || 0;
      const gstTotal = Number(totals?.total_gst_amt) || 0;
      const cessTotal = Number(totals?.total_cess_amt) || 0;
      const totalOrderQty = Number(totals?.total_order_qty) || 0;

      // ✅ ROUND ONLY ONCE
      const totalBeforeRoundOff =
        Number(subTotalAmt.toFixed(2)) +
        // Number(gstTotal.toFixed(2)) +
        Number(cessTotal.toFixed(2));

      const grandTotalAmt = Math.round(totalBeforeRoundOff);
      const roundOff = Number((grandTotalAmt - totalBeforeRoundOff).toFixed(2));

      /* --------------------------------------------------
         STEP 4: UPDATE PO MASTER (ONCE)
      -------------------------------------------------- */
      await trx(OUTLET_PO_MASTER.NAME)
        .where({
          [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_MASTER.COLUMNS.PO_DATE]: formattedPoDate,
          [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
          [OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID]: supplier_id,
          [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id
        })
        .update({
          [OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotalAmt,
          [OUTLET_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: gstTotal,
          [OUTLET_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: cessTotal,
          [OUTLET_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmt,
          [OUTLET_PO_MASTER.COLUMNS.ROFF]: roundOff,
          [OUTLET_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY]: Number(totalOrderQty) || 0,
          [OUTLET_PO_MASTER.COLUMNS.APPROVAL]: 1,
          [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: knex.fn.now(),
          [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: created_by
        });

      await trx.commit();
      return { success: true };

    } catch (error) {
      await trx.rollback();
      console.log("PO Approval Failed:", error);

      if (error?._code === 400 || error?._code === 404) {
        throw error;
      }

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Outlet PO approval failed",
        code: "OUTLET_PO_APPROVAL_FAILED"
      });
    }
  }


  async function putOutletPomasterGrndetailsRepo({ params, body, userDetails, logTrace }) {
    const knex = this;
    const { po_no, outlet_id } = params;
    const trx = await knex.transaction();

    try {
      const existingPurchaseOrderDetails = await trx(OUTLET_PO_MASTER.NAME)
        .select(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`)
        .where({
          [OUTLET_PO_MASTER.COLUMNS.PO_NO]: String(po_no),
          [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
        })
        .first();

      if (!existingPurchaseOrderDetails?.id) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Outlet Purchase Order Details was not found.",
          code: "NOT_FOUND",
        });
      }

      const purchaseOrderId = existingPurchaseOrderDetails.id;

      for (const grn of body.grn_details) {
        const updateData = {};

        for (const key of ["grn_number", "grn_date", "invoice_number", "grn_quantity", "invoice_copy_url", "payment_status"]) {
          if (key in grn) {
            const value = grn[key];
            if (value === null || value === "") {
              throw CustomError.create({
                httpCode: StatusCodes.BAD_REQUEST,
                message: `Invalid value for '${key}': null or empty string is not allowed.`,
                property: key,
                code: "INVALID_FIELD_VALUE",
              });
            }
            updateData[key] = value;
          }
        }

        if (Object.keys(updateData).length === 0) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: "At least one GRN field must contain a valid non-empty value.",
            code: "NO_UPDATE_FIELDS",
          });
        }

        const oldPoMasterData = await trx(OUTLET_PO_MASTER.NAME)
          .where({
            [OUTLET_PO_MASTER.COLUMNS.ID]: purchaseOrderId,
            [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
          })
          .first();

        const dbUpdateData = {
          ...(updateData.grn_number !== undefined && { [OUTLET_PO_MASTER.COLUMNS.GRN_NUMBER]: updateData.grn_number }),
          ...(updateData.grn_date !== undefined && { [OUTLET_PO_MASTER.COLUMNS.GRN_DATE]: updateData.grn_date }),
          ...(updateData.invoice_number !== undefined && { [OUTLET_PO_MASTER.COLUMNS.INVOICE_NUMBER]: updateData.invoice_number }),
          ...(updateData.grn_quantity !== undefined && { [OUTLET_PO_MASTER.COLUMNS.GRN_QTY]: updateData.grn_quantity }),
          ...(updateData.invoice_copy_url !== undefined && { [OUTLET_PO_MASTER.COLUMNS.INVOICE_COPY_URL]: updateData.invoice_copy_url }),
          ...(updateData.payment_status !== undefined && { [OUTLET_PO_MASTER.COLUMNS.PAYMENT_STATUS]: updateData.payment_status }),
          [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
          [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
        };


        const updateCount = await trx(OUTLET_PO_MASTER.NAME)
          .where({
            [OUTLET_PO_MASTER.COLUMNS.ID]: purchaseOrderId,
            [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
          })
          .update(dbUpdateData);

        if (updateCount === 0) {
          throw CustomError.create({
            httpCode: StatusCodes.NOT_FOUND,
            message: "Failed to update Outlet Purchase Order GRN details.",
            code: "NOT_FOUND",
          });
        }

        const updatedPoMasterData = await trx(OUTLET_PO_MASTER.NAME)
          .where({
            [OUTLET_PO_MASTER.COLUMNS.ID]: purchaseOrderId,
            [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
          })
          .first();

        const updateLogData = {
          [OUTLET_PO_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
          [OUTLET_PO_LOGS.COLUMNS.USER_ID]: userDetails.id,
          [OUTLET_PO_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
          [OUTLET_PO_LOGS.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_LOGS.COLUMNS.PO_DATE]: updatedPoMasterData?.[OUTLET_PO_MASTER.COLUMNS.PO_DATE] || null,
          [OUTLET_PO_LOGS.COLUMNS.OLDDATA]: JSON.stringify({ outlet_po_master: oldPoMasterData }),
          [OUTLET_PO_LOGS.COLUMNS.NEWDATA]: JSON.stringify({ outlet_po_master: updatedPoMasterData }),
          [OUTLET_PO_LOGS.COLUMNS.CREATED_AT]: new Date(),
        };

        await trx(OUTLET_PO_LOGS.NAME).insert(updateLogData);
      }

      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback();
      console.error("Transaction Failed:", error);

      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Outlet Purchase Order transaction failed.",
        code: "TRANSACTION_FAILED",
      });
    }

  }


  async function getPurchaseOrdereOutletListRepo({ params, logTrace }) {
    const knex = this;
    const { region_id } = params;

    const query = knex
      .distinct([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
      ])
      .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`, Number(region_id))
      .orderBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`, "asc");


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet list",
      logTrace
    });

    const response = await query;
    if (!response || response.length == 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `Outlets not found`,
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getPurchaseOrderBrandCompanyListRepo({ params, body, userDetails, logTrace }) {
    const knex = this;
    const { region_id, outlet_id } = body;

    if (!Number(region_id)) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "region_id required",
        code: "INVALID_INPUT"
      });
    }

    if (!outlet_id || !outlet_id.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "outlet_id required",
        code: "INVALID_INPUT"
      });
    }

    const query = knex
      .distinct([
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID} as brand_company_id`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,
      ])
      .from(`${OUTLET_PO_DETAILS.NAME} as ${OUTLET_PO_DETAILS.NAME}`)
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .where(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE}`, true)
      .orderBy(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "asc");

    let outletIdArray = outlet_id.map(id => Number(id));

    let outletIdsQuery = knex(OUTLETS.NAME)
      .pluck(OUTLETS.COLUMNS.ID)
      .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

    if (!(outletIdArray.length === 1 && outletIdArray[0] === -1)) {
      outletIdsQuery.whereIn(OUTLETS.COLUMNS.ID, outletIdArray);
    }

    const outletIds = await outletIdsQuery;
    if (outletIds.length === 0) return [];

    query.whereIn(
      `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`,
      outletIds
    );


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Brand Company list",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Brand Company for Po Data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }


  async function getPurchaseOrderSupplierListRepo({ params, body, userDetails, logTrace }) {
    const knex = this;
    const { region_id, outlet_id } = body;

    if (!Number(region_id)) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "region_id required",
        code: "INVALID_INPUT"
      });
    }

    if (!outlet_id || !outlet_id.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "outlet_id required",
        code: "INVALID_INPUT"
      });
    }


    const query = knex
      .distinct([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_CODE} as supplier_code`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
      ])
      .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
      .orderBy(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, "asc");

    let outletIdArray = outlet_id.map(id => Number(id));

    let outletIdsQuery = knex(OUTLETS.NAME)
      .pluck(OUTLETS.COLUMNS.ID)
      .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

    if (!(outletIdArray.length === 1 && outletIdArray[0] === -1)) {
      outletIdsQuery.whereIn(OUTLETS.COLUMNS.ID, outletIdArray);
    }

    const outletIds = await outletIdsQuery;
    if (outletIds.length === 0) return [];

    query.whereIn(
      `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
      outletIds
    );

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Supplier list",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier for Po Data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getOutletVendorMailDetailsRepo({ body, logTrace }) {
    const knex = this;

    try {
      const { product_details = [] } = body;

      if (!product_details.length) return [];

      // Step 1: Normalize date
      const products = product_details.map(po => ({
        ...po,
        po_date_db: moment(po.po_date, "DD-MM-YYYY").format("YYYY-MM-DD")
      }));

      // Step 2: Get all unique POs
      const uniquePOs = [
        ...new Map(
          products.map(po => [
            `${po.po_no}_${po.po_date_db}_${po.outlet_id}`,
            {
              po_no: po.po_no,
              po_date_db: po.po_date_db,
              outlet_id: po.outlet_id
            }
          ])
        ).values()
      ];

      const results = [];

      // Step 3: For each PO → fetch supplier + brand_company → fetch mail list
      for (const po of uniquePOs) {
        const { po_no, po_date_db, outlet_id } = po;

        const poInfo = await knex("outlet_po_details")
          .select("supplier_id", "brand_company_id")
          .where("po_no", po_no)
          .andWhere("po_date", po_date_db)
          .andWhere("outlet_id", outlet_id)
          .first();

        if (!poInfo) {
          logTrace?.error?.(`PO not found in DB → ${po_no}`);
          continue;
        }

        const mailRows = await knex("vendor_email")
          .select("*")
          .where("outlet_id", outlet_id)
          .andWhere("supplier_id", poInfo.supplier_id)
          .andWhere("brand_company_id", poInfo.brand_company_id)
          .andWhere("is_active", true);

        const mailRow = mailRows[0] || {};

        console.log('mailRow', mailRow)

        results.push({
          po_no,
          outlet_id,

          mailData: {
            brand_company_id: poInfo.brand_company_id,
            // brand_company_id: mailRow.brand_company_id,
            outlet_email: safe(mailRow.outlet_email),
            brand_company_email: safe(mailRow.brand_company_email),
            supplier_email: safe(mailRow.supplier_email)
          }
        });
      }

      return results;

    } catch (err) {
      logTrace?.error?.("getOutletVendorMailDetailsRepo failed", err);
      return [];
    }

    function safe(v) {
      try { return JSON.parse(v || "[]"); } catch { return []; }
    }
  }


  async function getOutletGrnVendorMailDetailsRepo({ body, logTrace }) {
    const knex = this;

    try {
      const { outlet_purchase_details = [], outlet_id, supplier_id } = body;

      if (!outlet_purchase_details.length) {
        logTrace?.info?.("No outlet_purchase_details found");
        return [];
      }

      /* -------- docno comes from master insert response or body -------- */

      const docno = body.docno; // IMPORTANT

      if (!docno || !outlet_id) {
        logTrace?.error?.("Missing docno or outlet_id for GRN mail");
        return [];
      }

      /* -------- Fetch supplier & brand company -------- */

      const grnInfo = await knex("outlet_purchase_details")
        .select("supplier_id", "type_design_id")
        .where({ docno, outlet_id })
        .first();

      if (!grnInfo) {
        logTrace?.error?.(`GRN not found in DB → ${docno}`);
        return [];
      }

      /* -------- Fetch vendor emails -------- */

      const mailRow = await knex("vendor_email")
        .where({
          outlet_id,
          supplier_id: grnInfo.supplier_id,
          brand_company_id: grnInfo.type_design_id,
          is_active: true
        })
        .first();

      return [
        {
          docno,
          outlet_id,
          mailData: {
            supplier_id: grnInfo.supplier_id,
            brand_company_id: grnInfo.type_design_id,
            outlet_email: safe(mailRow?.outlet_email),
            brand_company_email: safe(mailRow?.brand_company_email),
            supplier_email: safe(mailRow?.supplier_email)
          }
        }
      ];

    } catch (err) {
      logTrace?.error?.("getOutletGrnVendorMailDetailsRepo failed", err);
      return [];
    }

    function safe(v) {
      try {
        return JSON.parse(v || "[]");
      } catch {
        return [];
      }
    }
  }




  async function resendPoMailRepo({ body, logTrace }) {
    const knex = this;

    try {
      const { po_details = [] } = body;

      if (!po_details.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "po_details are required",
          code: "INVALID_INPUT"
        });
      }

      const uniquePOs = [
        ...new Map(
          po_details.map(po => [
            `${po.po_no}_${po.outlet_id}`,
            { po_no: po.po_no, outlet_id: po.outlet_id }
          ])
        ).values()
      ];

      const results = [];

      for (const po of uniquePOs) {
        const { po_no, outlet_id } = po;

        const poInfo = await knex("outlet_po_details")
          .select("supplier_id", "brand_company_id")
          .where({ po_no, outlet_id })
          .first();

        if (!poInfo) {
          throw CustomError.create({
            httpCode: StatusCodes.NOT_FOUND,
            message: `PO ${po_no} not found for Outlet ${outlet_id}`,
            code: "NOT_FOUND"
          });
        }

        console.log("poInfo", poInfo);


        const mailRow = await knex("vendor_email")
          .where({
            outlet_id,
            supplier_id: poInfo.supplier_id,
            brand_company_id: poInfo.brand_company_id,
            is_active: true
          })
          .first();

        results.push({
          po_no,
          outlet_id,
          mailData: {
            brand_company_id: poInfo.brand_company_id,
            outlet_email: safe(mailRow?.outlet_email),
            brand_company_email: safe(mailRow?.brand_company_email),
            supplier_email: safe(mailRow?.supplier_email)
          }
        });
      }

      return {
        success: true,
        data: results
      };

    } catch (err) {
      logTrace?.error?.("Resend Vendor Mail Fetch Error", err);
      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Vendor mail resend failed",
        code: "INTERNAL_SERVER_ERROR"
      });
    }

    function safe(v) {
      try { return JSON.parse(v || "[]"); } catch { return []; }
    }
  }

  async function getOutletPoAmendmentReportRepo({ body, params, queryString, logTrace }) {
    const knex = this;
    const { from_date, to_date, company_id } = params;
    const { region_id, supplier_id, brand_company_id, outlet_id } = body;
    const { type } = queryString;

    const providedOutletIds = outlet_id.map(id => Number(id));


    if (isNaN(Number(region_id))) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "Invalid region_id",
        code: "INVALID_INPUT"
      });
    }

    if (!Array.isArray(outlet_id) || outlet_id.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "outlet_id required",
        code: "INVALID_INPUT"
      });
    }

    let outletIdsQuery = knex(OUTLETS.NAME)
      .pluck(OUTLETS.COLUMNS.ID);

    if (Number(region_id) !== -1) {
      outletIdsQuery.where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));
    }

    if (!(providedOutletIds.length === 1 && providedOutletIds[0] === -1)) {
      outletIdsQuery.whereIn(OUTLETS.COLUMNS.ID, providedOutletIds);
    }

    const outletIds = await outletIdsQuery;
    if (!outletIds || outletIds.length === 0) return [];

    const query = knex
      .select([
        `${OUTLET_PO_MASTER.NAME}.*`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.UN_APPROVAL_COMMENTS} as reason`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
        `approver.user_name as approver_name`,
        `finance.user_name as po_finance_sender_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as store_code`,
        `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_AMOUNT} as memo_invoice_amount`,
        `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IMAGE_URL} as memo_invoice_url`,
        `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_NO} as memo_invoice_no`,
        `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.INVOICE_DATE} as memo_invoice_date`
      ])
      .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${USERS.NAME} as approver`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_APPROVED_BY}`,
        `approver.${USERS.COLUMNS.ID}`
      )
      .leftJoin(
        `${USERS.NAME} as finance`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_FINANCE_SENDER_ID}`,
        `finance.${USERS.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${REGION.NAME} as ${REGION.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`,
        `${REGION.NAME}.${REGION.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLET_PURCHASE_MEMO_MASTER.NAME} as ${OUTLET_PURCHASE_MEMO_MASTER.NAME}`,
        function () {
          this.on(
            `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
            '=',
            `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO}`
          ).andOn(
            `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
            '=',
            `${OUTLET_PURCHASE_MEMO_MASTER.NAME}.${OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID}`
          );
        }
      )
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_AMENDMENT_APPROVAL_STATUS}`, 0)
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_FINANCE_APPROVAL}`, false)
      .whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outletIds)
      .whereRaw(`DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) >= ?`, [from_date])
      .whereRaw(`DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) <= ?`, [to_date])

    if (supplier_id && Array.isArray(supplier_id) && supplier_id.length > 0) {
      const supIds = supplier_id.map(id => Number(id));
      query.whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`, supIds)
    }

    if (brand_company_id && Array.isArray(brand_company_id) && brand_company_id.length > 0) {
      const bcIds = brand_company_id.map(id => Number(id));
      const poIdsForBrand = await knex(OUTLET_PO_DETAILS.NAME)
        .distinct(OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID)
        .whereIn(OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID, bcIds)
        .pluck(OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID);

      if (!poIdsForBrand || poIdsForBrand.length === 0) return [];

      query.whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`, poIdsForBrand)
    }

    if (Number(type) === 1) {
      query.where(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_AMENDMENT}`,
        true
      );
    } else if (Number(type) === 2) {
      query.where(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_DEBITE_NOTE}`,
        true
      );
    } else {
      query.where(function () {
        this.where(
          `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_AMENDMENT}`,
          true
        ).orWhere(
          `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_DEBITE_NOTE}`,
          true
        );
      });
    }


    query.orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Po details",
      logTrace
    });

    const response = await query;
    if (!response || response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet Purchase Order not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const purchaseOrderDetails = await Promise.all(
      response.map(async (po, index) => {
        const po_details_lines = await knex
          .select([
            `${OUTLET_PO_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`
          ])
          .from(`${OUTLET_PO_DETAILS.NAME} as ${OUTLET_PO_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`, po.id)
          .whereIn(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, outletIds)
          .orderBy(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, "DESC");

        let po_status;
        switch (po.approval) {
          case 0:
            po_status = "Pending";
            break;
          case 1:
            po_status = "Approval";
            break;
          case 2:
            po_status = "UnApproval";
            break;
          case 3:
            po_status = "GRN Complete";
            break;
          default:
            po_status = "Pending";
        }

        return {
          ...po,
          Sno: index + 1,
          po_status,
          po_type_name: po.type,
          po_details_lines,
        };
      })
    );

    return purchaseOrderDetails;
  }

  return {
    getoutletPurchaseOrderPono,
    getProductBySupplierRepo,
    postOutletPurchaseOrder,
    getOutletPurchaseOrderUnApprovedListRepo,
    getOutletPurchaseOrderApprovedItem,
    putOutletPurchaseOrderProductRepo,
    deleteOutletPurchaseOrderProductRepo,
    putoutletPoUnApprovedProduct,
    getOutletPoUnApprovedProduct,
    getOutletPoApprovalReportProduct,
    updatePoQtyRepo,
    getOutletPoOverview,
    getOutletPoDetailsBySupplierRepo,
    getOutletPoProductDateWiseRepo,
    putoutletPoApprovedRepo,
    putOutletPomasterGrndetailsRepo,
    getPurchaseOrdereOutletListRepo,
    getPurchaseOrderSupplierListRepo,
    getPurchaseOrderBrandCompanyListRepo,
    getOutletVendorMailDetailsRepo,
    resendPoMailRepo,
    getOutletPoAmendmentReportRepo,
    getOutletGrnVendorMailDetailsRepo
  };
}
module.exports = OutletRepo
