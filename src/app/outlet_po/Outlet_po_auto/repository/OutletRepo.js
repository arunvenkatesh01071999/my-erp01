const { StatusCodes, NOT_MODIFIED } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const _ = require("lodash");
const { PO_FINANCE_SEND_BACK_LOGS, KPN_FARM_FRESH_USER_EMAIL, OUTLET_PO_MASTER, OUTLET_PO_DETAILS, SUPPLIER_OUTLET_MAPPING, POSETTINGS, OUTLET_PO_LOGS, MAIN_CATEGORY, OUTLET_PO_MASTER_TEMP, OUTLET_PO_DETAILS_TEMP, OUTLET_SUPPLIER_ORDERDAYS, VENDOR_MAIL } = require("../commons/constants")
const { STATES, COUNTRIES, CITIES } = require("../../../masterData/commons/constants")
const { OUTLET_PURCHASE_MEMO_MASTER } = require("../../../outlet_memo/commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { SUPPLIER, ITEM, OUTLET_PRODUCT_MAPPING, TYPEDESIGN, } = require("../../../catalog/item/commons/constants")
const axios = require('axios');
const moment = require("moment");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { REGION } = require("../../../catalog/warehouse/commons/constants");
const { OUTLET_PURCHASE_MASTER } = require("../../../outlet_purchase/commons/constants");
const { dsdPoStatusEmailTemplate } = require("../../../email_template_services/dsdPoStatusEmailTemplate");
const nodemailer = require('nodemailer');


function OutletRepo(fastify) {
  async function getoutletPurchaseOrderPono({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    console.log(userDetails, "userDetails")
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

  async function getProductBySupplierRepo({ params, body, logTrace, userDetails, query, financialYear }) {
    const knex = this;
    const { vendor_id, company_id, outlet_id } = params;
    const { search, product_id } = query;

    const today = new Date().toISOString().split('T')[0];

    const currentDay = moment().format('dddd').toLowerCase();
    console.log("currentDay", currentDay);

    const po_date = moment().format('YYYY-MM-DD');
    console.log("PocurrentDate", po_date);

    const existingPO = await knex(OUTLET_PO_MASTER.NAME)
      .where(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID, vendor_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.PO_DATE, today)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear)
      .first();

    // if (existingPO) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_FOUND,
    //     message: "Purchase Order already generated for this supplier and outlet today.",
    //     property: "",
    //     code: "PO_ALREADY_EXISTS",
    //   });
    // }

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
        .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${currentDay}`, true)
        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${currentDay}`, true)

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
        .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${currentDay}`, true)

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


      const finalResponse = productList.map(item => {

        const productCode = Number(item.numeric_product_code);
        const productId = Number(item.prd_id);

        const saleItem = salesMap[productCode];
        const poSetting = poSettingsMap[productCode];

        // --------------------------------------------------------
        // 1️⃣ Base Values
        // --------------------------------------------------------
        let salesQty = saleItem ? Number(saleItem.salesQty) || 0 : 0;
        let stockbalance = saleItem ? Number(saleItem.stock_balance) || 0 : 0;
        let entryDateCount = saleItem ? Number(saleItem.daily_run_rate) || 0 : 0;
        let stockDays = saleItem ? Number(saleItem.active_days) || 0 : 0;

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
        const mrp = Number(item?.mrp) || 0;
        const margin = Number(item?.fixedmargin) || 0;
        const discountType = Number(item?.vendordiscounttype) || 0;
        const discountValue = Number(item?.vendordiscountvalue) || 0;

        let purchaseRate = Number(item?.purchase_rate) || 0;

        if (margin > 0) {
          purchaseRate = mrp - (mrp * margin / 100);

          // Apply discount
          if (discountType === 1) {
            // Percentage discount
            purchaseRate -= (purchaseRate * discountValue / 100);
          } else if (discountType === 0) {
            // Flat discount
            purchaseRate -= discountValue;
          }

          purchaseRate = Number(purchaseRate.toFixed(2));
        }


        // --------------------------------------------------------
        // 4️⃣ Daily Run Rate + Average Qty
        // --------------------------------------------------------
        const daily_Run_Rate = entryDateCount || 2;

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
        const gstPercentage = Number(item.gst) || 0;
        // Split GST percentage
        const cgstPercent = gstPercentage / 2;
        const sgstPercent = gstPercentage / 2;
        const landingRate = purchaseRate + (purchaseRate * gstPercentage / 100);
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
          margin,
          vendor_discount_type: discountType,
          vendor_discount_value: discountValue,
          mrp,
          cost_price: purchaseRate,
          pur_rate: purchaseRate,
          gst: gstPercentage,
          landing_price: landingRate,
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
          purchaseRate,
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
      console.error("Error in getAutopogeneraterRepo:", error);
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

    const today = new Date().toISOString().split('T')[0];

    const existingPO = await knex(OUTLET_PO_MASTER.NAME)
      .where(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, body.outlet_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID, body.supplier_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.PO_DATE, today)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear)
      .first();

    if (existingPO) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase Order already generated for this supplier and outlet today.",
        property: "",
        code: "PO_ALREADY_EXISTS",
      });
    }

    const supplierDetails = await knex(SUPPLIER.NAME)
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


    const [{ max_id }] = await knex(OUTLET_PO_MASTER.NAME)
      .max("id as max_id")
      .where(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear);


    const nextId = (max_id || 0) + 1;

    const lastPo = await knex(OUTLET_PO_MASTER.NAME)
      .select(OUTLET_PO_MASTER.COLUMNS.PO_NO)
      .where(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, body.outlet_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear)
      .orderBy(OUTLET_PO_MASTER.COLUMNS.ID, "desc")
      .first();

    const nextPoNo = Number(lastPo?.po_no || 0) + 1;


    let totalOrderQty = 0;
    let subTotalAmt = 0;
    let totalGstAmt = 0;
    let totalCessAmt = 0;
    let grandTotalAmt = 0;

    if (body.outlet_po_details && body.outlet_po_details.length > 0) {
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

    // Add 7 days to current date
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
      //
      [OUTLET_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY]: totalOrderQty,
      [OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotalAmt,
      [OUTLET_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? totalGstAmt : 0,
      [OUTLET_PO_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? totalGstAmt : 0,
      [OUTLET_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: totalCessAmt || 0,
      [OUTLET_PO_MASTER.COLUMNS.ROFF]: roundOff,
      [OUTLET_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmt,
      //
      [OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
      [OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE]: expiryDate,
      [OUTLET_PO_MASTER.COLUMNS.APPROVAL]: 0,
      [OUTLET_PO_MASTER.COLUMNS.IS_APPROVED_BY]: 0,
      [OUTLET_PO_MASTER.COLUMNS.EXPIRED]: false,
      [OUTLET_PO_MASTER.COLUMNS.CREATED_BY]: userDetails.id || 1,
      [OUTLET_PO_MASTER.COLUMNS.CREATED_AT]: new Date(),
      [OUTLET_PO_MASTER.COLUMNS.TYPE]: "auto",
      [OUTLET_PO_MASTER.COLUMNS.SET_QTY_FLAG]: body.set_qty_flag || false
    };


    const [{ id: outletPoMasterId }] = await knex(OUTLET_PO_MASTER.NAME)
      .insert(outletPoMasterData)
      .returning("id");



    if (body.outlet_po_details && body.outlet_po_details.length > 0) {
      const outletPoDetailsData = body.outlet_po_details.map((detail, index) => {

        const rate = parseFloat(detail.rate || 0);
        const gst = parseFloat(detail.gst || 0);
        const cess = parseFloat(detail.cess || 0);
        const ordQty = parseFloat(detail.quantity || 0);

        const gstAmount = rate * gst / 100;
        const cessAmount = rate * cess / 100;
        const landingRate = rate + (rate * gst / 100);
        const amount = landingRate * ordQty;
        const averageQty = Number(detail.averageQty) || 0;
        const stockbalance = Number(detail.stockbalance) || 0;
        console.log(landingRate, rate, gst, "landing rate")
        const doh = averageQty > 0
          ? stockbalance / averageQty
          : 0;
        return {
          [OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID]: outletPoMasterId,
          [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
          [OUTLET_PO_DETAILS.COLUMNS.OUTLET_NAME]: body.outlet_name,
          [OUTLET_PO_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: String(nextPoNo),
          [OUTLET_PO_DETAILS.COLUMNS.PO_DATE]: body.po_date,
          [OUTLET_PO_DETAILS.COLUMNS.PROD_CODE]: detail.prod_code,
          [OUTLET_PO_DETAILS.COLUMNS.PROD_ID]: detail.prod_id,
          [OUTLET_PO_DETAILS.COLUMNS.PROD_NAME]: detail.prod_name,
          [OUTLET_PO_DETAILS.COLUMNS.CATEGORY_ID]: detail.category_id,
          [OUTLET_PO_DETAILS.COLUMNS.CATEGORY_NAME]: detail.category_name,
          [OUTLET_PO_DETAILS.COLUMNS.STK_HOLD]: detail.stk_hold,
          [OUTLET_PO_DETAILS.COLUMNS.BALANCE]: detail.balance,
          [OUTLET_PO_DETAILS.COLUMNS.PHY_QTY]: detail.phy_qty,
          [OUTLET_PO_DETAILS.COLUMNS.MRP]: detail.mrp,
          [OUTLET_PO_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? Number(detail.gst) : 0,
          [OUTLET_PO_DETAILS.COLUMNS.GST]: Number(gst_type) === 2 ? detail.gst : 0,
          [OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT]: Number(gst_type) === 2 ? gstAmount : 0,
          [OUTLET_PO_DETAILS.COLUMNS.CGST]: (detail.cgst && Number(gst_type) === 2) ? Number(detail.cgst) : 0,
          [OUTLET_PO_DETAILS.COLUMNS.SGST]: (detail.sgst && Number(gst_type) === 2) ? Number(detail.sgst) : 0,
          [OUTLET_PO_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? detail.igst : 0,
          [OUTLET_PO_DETAILS.COLUMNS.CESS]: Number(detail.cess) || 0,
          [OUTLET_PO_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,
          [OUTLET_PO_DETAILS.COLUMNS.RATE]: detail.rate,
          [OUTLET_PO_DETAILS.COLUMNS.QUANTITY]: detail.quantity,
          [OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE]: landingRate,
          [OUTLET_PO_DETAILS.COLUMNS.AMOUNT]: amount,
          [OUTLET_PO_DETAILS.COLUMNS.PACK_QTY]: detail.pack_qty,
          [OUTLET_PO_DETAILS.COLUMNS.REQ_QTY]: detail.req_qty,
          [OUTLET_PO_DETAILS.COLUMNS.ORD_QTY]: detail.ord_qty,
          [OUTLET_PO_DETAILS.COLUMNS.SUGG_QTY]: detail.sugg_qty,
          [OUTLET_PO_DETAILS.COLUMNS.MIN_MBQ]: detail.min_mbq,
          [OUTLET_PO_DETAILS.COLUMNS.T_QTY]: detail.t_qty,
          [OUTLET_PO_DETAILS.COLUMNS.SALES_DAYS]: detail.sales_days,
          [OUTLET_PO_DETAILS.COLUMNS.TOTAL_BALANCE]: detail.Totalbalance,
          [OUTLET_PO_DETAILS.COLUMNS.STOCK_BALANCE]: detail.stockbalance,
          [OUTLET_PO_DETAILS.COLUMNS.FINAL_MBQ]: detail.MAXMBQ,
          [OUTLET_PO_DETAILS.COLUMNS.AVERAGE_QTY]: detail.averageQty,
          [OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID]: detail.brand_company_id,
          [OUTLET_PO_DETAILS.COLUMNS.MBQDAYS]: detail.mbqdays,
          [OUTLET_PO_DETAILS.COLUMNS.SERIAL_NO]: index + 1,   // ✅ Correct serial no
          [OUTLET_PO_DETAILS.COLUMNS.TS]: detail.ts,
          [OUTLET_PO_DETAILS.COLUMNS.VLT]: detail.vlt,
          [OUTLET_PO_DETAILS.COLUMNS.PAWAY]: detail.paway,
          [OUTLET_PO_DETAILS.COLUMNS.CASE_QTY]: detail.caseQty,
          [OUTLET_PO_DETAILS.COLUMNS.MBQ]: detail.mbq,
          [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [OUTLET_PO_DETAILS.COLUMNS.STOCK_DAYS]: detail.sales_days,
          [OUTLET_PO_DETAILS.COLUMNS.DOH]: doh,
          [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
          [OUTLET_PO_DETAILS.COLUMNS.TYPE]: "auto",
          //add column
          [OUTLET_PO_DETAILS.COLUMNS.UNIT_ID]: detail.uom_id,
          [OUTLET_PO_DETAILS.COLUMNS.SALES_QUANTITY]: detail.sales_quantity,
          [OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN]: detail.fixedmargin,
          [OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE]: detail.vendordiscounttype,
          [OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE]: detail.vendordiscountvalue,
          [OUTLET_PO_DETAILS.COLUMNS.CP]: detail.rate,
          [OUTLET_PO_DETAILS.COLUMNS.CREATED_BY]: userDetails.id || 1,
          [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id || 1,
          [OUTLET_PO_DETAILS.COLUMNS.CREATED_AT]: new Date(),
          [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date()
        }
      });

      const logData = {
        [OUTLET_PO_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
        [OUTLET_PO_LOGS.COLUMNS.NEWDATA]: JSON.stringify({
          outlet_po_master: {
            ...outletPoMasterData,
            [OUTLET_PO_MASTER.COLUMNS.PO_NO]: String(nextPoNo)
          },
          outlet_po_details: outletPoDetailsData
        }),
        [OUTLET_PO_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [OUTLET_PO_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [OUTLET_PO_LOGS.COLUMNS.PO_NO]: String(nextPoNo),
        [OUTLET_PO_LOGS.COLUMNS.PO_DATE]: body.po_date,
        [OUTLET_PO_LOGS.COLUMNS.CREATED_AT]: new Date()
      };

      await knex(OUTLET_PO_LOGS.NAME).insert(logData);

      await knex.batchInsert(OUTLET_PO_DETAILS.NAME, outletPoDetailsData, 500);


    }

    return { success: true, outlet_po_master_id: outletPoMasterId };
  }


  async function postOutletPurchaseOrderTemp({ params, body, userDetails, financialYear }) {
    const knex = this;
    const { company_id } = params;

    if (!body.outlet_id) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Missing required field: outlet_id",
        property: "",
        code: "NOT_FOUND"
      });
    }

    if (!body.supplier_id) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Missing required field: supplier_id",
        property: "",
        code: "SUPPLIER_ID_REQUIRED",
      });
    }

    const today = new Date().toISOString().split('T')[0];

    const existingPO = await knex(OUTLET_PO_MASTER_TEMP.NAME)
      .where(OUTLET_PO_MASTER_TEMP.COLUMNS.OUTLET_ID, body.outlet_id)
      .andWhere(OUTLET_PO_MASTER_TEMP.COLUMNS.SUPPLIER_ID, body.supplier_id)
      .andWhere(OUTLET_PO_MASTER_TEMP.COLUMNS.PO_DATE, today)
      .andWhere(OUTLET_PO_MASTER_TEMP.COLUMNS.COMPANY_ID, company_id)
      .andWhere(OUTLET_PO_MASTER_TEMP.COLUMNS.FINANCIAL_YEAR, financialYear)
      .andWhere(OUTLET_PO_MASTER_TEMP.COLUMNS.BRAND_COMPANY_ID, body.brand_company_id)
      .first();

    if (!existingPO) {
      console.log("No existing PO found");
      // insert new PO
    } else {
      console.log("Existing PO found:", existingPO);
      // update this PO
    }


    if (existingPO) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase Order already generated for this supplier and outlet today.",
        property: "",
        code: "PO_ALREADY_EXISTS",
      });
    }


    const [{ max_id }] = await knex(OUTLET_PO_MASTER_TEMP.NAME)
      .max("id as max_id")
      .where(OUTLET_PO_MASTER_TEMP.COLUMNS.COMPANY_ID, company_id)
      .andWhere(OUTLET_PO_MASTER_TEMP.COLUMNS.FINANCIAL_YEAR, financialYear);


    const nextId = (max_id || 0) + 1;

    let totalOrderQty = 0;
    let subTotalAmt = 0;
    let totalGstAmt = 0;
    let grandTotalAmt = 0;

    if (body.outlet_po_details && body.outlet_po_details.length > 0) {
      body.outlet_po_details.forEach(detail => {
        const rate = parseFloat(detail.rate || 0);
        const gst = parseFloat(detail.gst || 0);
        const ordQty = parseFloat(detail.ord_qty || 0);
        const gstAmount = rate * gst / 100;
        const landingRate = rate + gstAmount;
        const amount = landingRate * ordQty;
        totalOrderQty += ordQty;
        subTotalAmt += rate * ordQty;
        totalGstAmt += gstAmount * ordQty;
        grandTotalAmt += amount;
      });
    }

    grandTotalAmt = Math.round(grandTotalAmt * 1000) / 1000;

    const roundOff = Math.round((Math.round(grandTotalAmt) - grandTotalAmt) * 1000) / 1000;

    grandTotalAmt = Math.round(grandTotalAmt * 1000) / 1000;

    const outletPoMasterData = {
      [OUTLET_PO_MASTER_TEMP.COLUMNS.ID]: nextId,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.FINANCIAL_YEAR]: financialYear,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.PO_NO]: body.po_no,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.PO_DATE]: body.po_date,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.OUTLET_ID]: body.outlet_id,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.TOTAL_ITEMS]: body.total_items,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.COMPANY_ID]: company_id,
      //
      [OUTLET_PO_MASTER_TEMP.COLUMNS.TOTAL_ORDER_QTY]: totalOrderQty,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.SUB_TOTAL_AMT]: subTotalAmt,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.TOTAL_GST_AMT]: totalGstAmt,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.TOTAL_IGST_AMT]: body.total_igst_amt || 0,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.TOTAL_CESS_AMT]: body.total_cess_amt || 0,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.ROFF]: roundOff,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmt,
      //
      [OUTLET_PO_MASTER_TEMP.COLUMNS.SUPPLIER_ID]: body.supplier_id,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.EXPIRY_DATE]: body.expiry_date,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.APPROVAL]: 0,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.IS_APPROVED_BY]: 0,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.EXPIRED]: false,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.EXPIRY_DATE]: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      [OUTLET_PO_MASTER_TEMP.COLUMNS.CREATED_BY]: body.created_by || userDetails.id,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.UPDATED_BY]: body.updated_by || userDetails.id,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.CREATED_AT]: new Date(),
      [OUTLET_PO_MASTER_TEMP.COLUMNS.UPDATED_AT]: new Date(),
      [OUTLET_PO_MASTER_TEMP.COLUMNS.TYPE]: "auto",
      [OUTLET_PO_MASTER_TEMP.COLUMNS.SET_QTY_FLAG]: body.set_qty_flag || false,
      [OUTLET_PO_MASTER_TEMP.COLUMNS.BRAND_COMPANY_ID]: body.brand_company_id
    };

    const insertResult = await knex(OUTLET_PO_MASTER_TEMP.NAME)
      .returning(OUTLET_PO_MASTER_TEMP.COLUMNS.ID)
      .insert(outletPoMasterData);

    const outletPoMasterId = insertResult[0].id;



    if (body.outlet_po_details && body.outlet_po_details.length > 0) {
      const outletPoDetailsData = body.outlet_po_details.map(detail => {

        const rate = parseFloat(detail.rate || 0);
        const gst = parseFloat(detail.gst || 0);
        const ordQty = parseFloat(detail.ord_qty || 0);
        const gstAmount = rate * gst / 100;

        const landingRate = rate + (rate * gst / 100);
        const amount = landingRate * ordQty;
        return {
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.OUTLET_PO_MASTER_ID]: outletPoMasterId,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.OUTLET_ID]: body.outlet_id,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.OUTLET_NAME]: body.outlet_name,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.PO_NO]: body.po_no,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.PO_DATE]: body.po_date,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.PROD_CODE]: detail.prod_code,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.PROD_ID]: detail.prod_id,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.PROD_NAME]: detail.prod_name,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.CATEGORY_ID]: detail.category_id,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.CATEGORY_NAME]: detail.category_name,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.SALES_QUANTITY]: detail.sales_quantity,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.STK_HOLD]: detail.stk_hold,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.BALANCE]: detail.balance,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.PHY_QTY]: detail.phy_qty,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.MRP]: detail.mrp,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.CP]: detail.cp,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.GST]: detail.gst,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.GST_AMOUNT]: gstAmount,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.IGST]: detail.igst,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.CGST]: detail.cgst,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.SGST]: detail.sgst,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.RATE]: detail.rate,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.QUANTITY]: detail.quantity,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.LANDING_RATE]: landingRate,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.AMOUNT]: amount,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.SUPPLIER_ID]: body.supplier_id,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.CREATED_BY]: body.created_by || userDetails.id,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.UPDATED_BY]: body.updated_by || userDetails.id,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.CREATED_AT]: new Date(),
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.UPDATED_AT]: new Date(),
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.COMPANY_ID]: company_id,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.TYPE]: "auto",
          // [OUTLET_PO_DETAILS_TEMP.COLUMNS.MBQ]: detail.mbq,
          // [OUTLET_PO_DETAILS_TEMP.COLUMNS.MBQDAYS]: detail.mbqdays,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.PACK_QTY]: detail.pack_qty,
          // [OUTLET_PO_DETAILS_TEMP.COLUMNS.SYS_QTY]: detail.sys_qty,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.REQ_QTY]: detail.req_qty,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.ORD_QTY]: detail.ord_qty,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.SUGG_QTY]: detail.sugg_qty,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.MIN_MBQ]: detail.min_mbq,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.T_QTY]: detail.t_qty,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.SALES_DAYS]: detail.sales_days,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.STOCK_DAYS]: detail.stock_days,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.FIXEDMARGIN]: detail.fixedmargin,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.VENDORDISCOUNTTYPE]: detail.vendordiscounttype,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.VENDORDISCOUNTVALUE]: detail.vendordiscountvalue,
          [OUTLET_PO_DETAILS_TEMP.COLUMNS.BRAND_COMPANY_ID]: body.brand_company_id
        }
      });

      const logData = {
        [OUTLET_PO_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
        [OUTLET_PO_LOGS.COLUMNS.NEWDATA]: JSON.stringify({
          outlet_po_master_TEMP: {
            ...outletPoMasterData,
            [OUTLET_PO_MASTER_TEMP.COLUMNS.PO_NO]: body.po_no
          },
          outlet_po_details_TEMP: outletPoDetailsData
        }),
        [OUTLET_PO_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [OUTLET_PO_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [OUTLET_PO_LOGS.COLUMNS.PO_NO]: body.po_no,
        [OUTLET_PO_LOGS.COLUMNS.PO_DATE]: body.po_date,
        [OUTLET_PO_LOGS.COLUMNS.CREATED_AT]: new Date()
      };

      await knex(OUTLET_PO_LOGS.NAME).insert(logData);

      await knex.batchInsert(OUTLET_PO_DETAILS_TEMP.NAME, outletPoDetailsData, 500);


    }

    return { success: true, outlet_po_master_TEMP_id: outletPoMasterId };
  }

  async function postOutletPurchaseOrderFinal({ params, body, userDetails, financialYear }) {

    const knex = this;
    const { company_id } = params;

    const today = new Date().toISOString().split("T")[0];

    if (!body.outlet_id) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Missing required field: outlet_id",
        code: "NOT_FOUND"
      });
    }

    // ❗CHECK IF FINAL PO ALREADY GENERATED TODAY
    const existingFinalPO = await knex(OUTLET_PO_MASTER.NAME)
      .where(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, body.outlet_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.PO_DATE, today)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear)
      .first();

    if (existingFinalPO) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Purchase Order already generated for this outlet today.",
        code: "PO_ALREADY_EXISTS",
      });
    }

    // 🔥 GET ALL TEMP MASTERS FOR TODAY — NO .first()
    const tempMasters = await knex(OUTLET_PO_MASTER_TEMP.NAME)
      .where(OUTLET_PO_MASTER_TEMP.COLUMNS.OUTLET_ID, body.outlet_id)
      .andWhereRaw(`DATE(${OUTLET_PO_MASTER_TEMP.COLUMNS.CREATED_AT}) = ?`, [today])
      .andWhere(OUTLET_PO_MASTER_TEMP.COLUMNS.COMPANY_ID, company_id)
      .andWhere(OUTLET_PO_MASTER_TEMP.COLUMNS.FINANCIAL_YEAR, financialYear);

    if (!tempMasters || tempMasters.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No temporary Purchase Orders available for today.",
        code: "NO_TEMP_PO",
      });
    }

    const createdPOIds = [];

    // 🔥 PROCESS EACH TEMP MASTER SEPARATELY
    for (const tempMaster of tempMasters) {

      // Generate next master ID
      const [{ max_id }] = await knex(OUTLET_PO_MASTER.NAME)
        .max("id as max_id")
        .where(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
        .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear);

      const nextId = (max_id || 0) + 1;

      // Generate next PO number
      const [{ po_no }] = await knex(OUTLET_PO_MASTER.NAME)
        .max("po_no")
        .where(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
        .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear);

      const nextPoNo = (po_no || 0) + 1;

      // GET DETAILS FOR THIS TEMP MASTER
      const tempDetails = await knex(OUTLET_PO_DETAILS_TEMP.NAME)
        .where(OUTLET_PO_DETAILS_TEMP.COLUMNS.OUTLET_PO_MASTER_ID, tempMaster.id);

      if (!tempDetails || tempDetails.length === 0) {
        continue; // skip if no details
      }

      // MASTER DATA
      const outletPoMasterData = {
        id: nextId,
        financial_year: financialYear,
        po_no: nextPoNo,
        po_date: today,
        outlet_id: tempMaster.outlet_id,
        supplier_id: tempMaster.supplier_id,
        total_items: tempMaster.total_items || 0,
        total_order_qty: tempMaster.total_order_qty || 0,
        sub_total_amt: tempMaster.sub_total_amt || 0,
        total_gst_amt: tempMaster.total_gst_amt || 0,
        total_igst_amt: tempMaster.total_igst_amt || 0,
        total_cess_amt: tempMaster.total_cess_amt || 0,
        roff: tempMaster.roff || 0,
        grand_total_amt: tempMaster.grand_total_amt || 0,
        company_id,
        approval: 0,
        is_approved_by: 0,
        expired: false,
        expiry_date: tempMaster.expiry_date,
        created_by: tempMaster.created_by,
        updated_by: tempMaster.updated_by,
        created_at: new Date(),
        updated_at: new Date(),
        type: "auto",
        set_qty_flag: tempMaster.set_qty_flag
      };

      // INSERT MASTER
      await knex(OUTLET_PO_MASTER.NAME).insert(outletPoMasterData);

      // DETAILS DATA
      const outletPoDetailsData = tempDetails.map(detail => {
        const rate = parseFloat(detail.rate || 0);
        const gst = parseFloat(detail.gst || 0);
        const ordQty = parseFloat(detail.ord_qty || 0);

        const landingRate = rate + (rate * gst / 100);
        const amount = landingRate * ordQty;

        return {
          outlet_po_master_id: nextId,
          outlet_id: detail.outlet_id,
          outlet_name: detail.outlet_name,
          financial_year: financialYear,
          po_no: nextPoNo,
          po_date: today,
          prod_code: detail.prod_code,
          prod_id: detail.prod_id,
          prod_name: detail.prod_name,
          category_id: detail.category_id,
          category_name: detail.category_name,
          sales_quantity: detail.sales_quantity,
          stk_hold: detail.stk_hold,
          balance: detail.balance,
          phy_qty: detail.phy_qty,
          mrp: detail.mrp,
          cp: detail.cp,
          gst: detail.gst,
          gst_amount: rate * gst / 100,
          igst: detail.igst,
          cgst: detail.cgst,
          sgst: detail.sgst,
          rate: detail.rate,
          quantity: detail.quantity,
          landing_rate: landingRate,
          amount,
          supplier_id: tempMaster.supplier_id,
          created_by: detail.created_by,
          updated_by: detail.updated_by,
          created_at: new Date(),
          updated_at: new Date(),
          company_id,
          type: "auto",
          mbq: detail.mbq,
          mbqdays: detail.mbqdays,
          pack_qty: detail.pack_qty,
          req_qty: detail.req_qty,
          ord_qty: detail.ord_qty,
          sugg_qty: detail.sugg_qty,
          min_mbq: detail.min_mbq,
          t_qty: detail.t_qty,
          sales_days: detail.sales_days,
          stock_days: detail.stock_days,
          fixedmargin: detail.fixedmargin,
          vendordiscounttype: detail.vendordiscounttype,
          vendordiscountvalue: detail.vendordiscountvalue,
          average_qty: detail.average_qty,
          final_mbq: detail.final_mbq,
          stock_balance: detail.stock_balance,
          total_balance: detail.total_balance,
          brand_company_id: detail.brand_company_id
        };
      });

      // INSERT DETAILS
      await knex.batchInsert(OUTLET_PO_DETAILS.NAME, outletPoDetailsData, 500);

      // DELETE TEMP DETAILS
      await knex(OUTLET_PO_DETAILS_TEMP.NAME)
        .where(OUTLET_PO_DETAILS_TEMP.COLUMNS.OUTLET_PO_MASTER_ID, tempMaster.id)
        .del();

      // DELETE TEMP MASTER
      await knex(OUTLET_PO_MASTER_TEMP.NAME)
        .where(OUTLET_PO_MASTER_TEMP.COLUMNS.ID, tempMaster.id)
        .del();

      createdPOIds.push(nextId);
    }

    return {
      success: true,
      message: "Purchase Orders generated successfully for all temp data.",
      outlet_po_master_ids: createdPOIds
    };
  }

  async function getOutletPurchaseOrderUnApprovedListRepo({ params, body, logTrace, userDetails, query }) {

    const knex = this;
    const { company_id } = params;
    const { region_id, supplier_id, brand_company_id, outlet_id } = body;
    const { bill_no, from_date, to_date, is_grn } = query;

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


    const query1 = knex
      .select([
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as store_code`,
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
        [`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`]: company_id
      })
      .whereIn(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`,
        ["auto", "memo"]
      )
      .whereIn(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        outletIds
      )
      .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`, "DESC");

    if (bill_no) {
      query1.andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`, String(bill_no).toLocaleUpperCase());
    }


    if (Boolean(is_grn) === true) {
      query1.andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_FINANCE_APPROVAL}`, true)
      query1.andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_GRN_APPROVAL}`, false)
    }

    if (typeof is_grn === 'undefined') {
      query1.andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_FINANCE_APPROVAL}`, false)

    }

    // -----------------------
    // supplier filter (master)
    // -----------------------
    if (supplier_id && Array.isArray(supplier_id) && supplier_id.length > 0) {
      const supIds = supplier_id.map(id => Number(id));
      query1.whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`, supIds)
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

      if (!poIdsForBrand || poIdsForBrand.length === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Outlet Purchase Order not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      query1.whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`, poIdsForBrand)
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

    query1.andWhere(function () {
      this
        .where(function () {
          this
            .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`, 'auto')
        })
        .orWhere(function () {
          this
            .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`, 'memo')
            .andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.IS_GRN_APPROVAL}`, false)
        });
    })

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

    let updatedPurchaseDetails = response.map(detail => ({
      ...detail,
      isEdit: detail.approval === 0
    }));

    if (is_grn && updatedPurchaseDetails.length) {

      const poNos = updatedPurchaseDetails.map(i => String(i.po_no));
      const outletIds = updatedPurchaseDetails.map(i => Number(i.outlet_id));

      const invoices = await knex(OUTLET_PURCHASE_MEMO_MASTER.NAME)
        .select(
          OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO,
          OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID,
          OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.IMAGE_URL
        )
        .whereIn(
          OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.PONO,
          poNos
        )
        .whereIn(
          OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.OUTLET_ID,
          outletIds
        )
        .andWhere(
          OUTLET_PURCHASE_MEMO_MASTER.COLUMNS.COMPANY_ID,
          company_id
        );

      const imageMap = new Map();
      invoices.forEach(inv => {
        imageMap.set(`${inv.pono}_${inv.outlet_id}`, inv.image_url);
      });

      updatedPurchaseDetails = updatedPurchaseDetails.map(item => ({
        ...item,
        image_url: imageMap.get(`${item.po_no}_${item.outlet_id}`) || ""
      }));
    }

    return updatedPurchaseDetails;

  }

  // async function getOutletPurchaseOrderUnApprovedListRepo({ params, body, logTrace, userDetails, query }) {
  //   const knex = this;
  //   const { company_id, region_id, outlet_id } = params;
  //   const { bill_no, from_date, to_date } = query;

  //   const query1 = knex
  //     .select([
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}`,
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`,
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
  //     ])
  //     .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
  //     .leftJoin(
  //       `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
  //     )
  //     .leftJoin(
  //       `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
  //     )
  //     .where({
  //       [`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`]: company_id,
  //       [`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`]: "auto",
  //       [`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`]: "memo"
  //     })
  //     .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`, "desc");


  //   if (bill_no) {
  //     query1.andWhere(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`, String(bill_no).toLocaleUpperCase());
  //   }

  //   // filter one
  //   if (Number(region_id) && Number(outlet_id) === -1) {

  //     const outletIdsResult = await knex(OUTLETS.NAME)
  //       .pluck(OUTLETS.COLUMNS.ID)
  //       .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

  //     if (outletIdsResult.length === 0) {
  //       return [];
  //     }

  //     query1.andWhere(
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`,
  //       Number(region_id)
  //     );

  //     query1.whereIn(
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
  //       outletIdsResult
  //     );

  //   }

  //   // filter two
  //   if (Number(outlet_id) !== -1) {
  //     query1.andWhere(
  //       `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
  //       Number(outlet_id)
  //     );

  //   }

  //   if (from_date && to_date) {
  //     query1.whereRaw(
  //       `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) >= ?`,
  //       [from_date]
  //     )
  //     query1.whereRaw(
  //       `DATE(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}) <= ?`,
  //       [to_date]
  //     )
  //   }

  //   query1.orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`, "DESC");

  //   const response = await query1;

  //   if (!response.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "Outlet Purchase Order not found",
  //       property: "",
  //       code: "NOT_FOUND"
  //     });
  //   }

  //   const updatedPurchaseDetails = response.map((detail) => ({
  //     ...detail,
  //     isEdit: detail.approval === 0 ? true : false
  //   }));

  //   return updatedPurchaseDetails;
  // }

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

    const query = knex
      .select([
        knex.raw(`to_jsonb(${OUTLETS.NAME}.*) as outlet`),
        knex.raw(`to_jsonb(${REGION.NAME}.*) as region`),

        // supplier full json but alias name = supplier_id
        knex.raw(`to_jsonb(${SUPPLIER.NAME}.*) as supplier_id`),

        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TOTAL_ITEMS}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SET_QTY_FLAG}`,
        knex.raw('0::integer as invoice_discount_amount')

      ])
      .from(`${OUTLET_PO_MASTER.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
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
        const po_details_lines = await knex
          .select([
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID} as id`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE} as pro_code`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_NAME} as pro_name`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CATEGORY_ID} as main_catgory_id`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CATEGORY_NAME} as main_category_name`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID} as brand_company_id`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.UNIT_ID} as uom_id`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.STK_HOLD} as soh`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.STK_HOLD} as balance`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MRP}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.RATE} as pur_rate`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GST}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CESS}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CP} as cost_price`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE} as landing_price`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.AMOUNT}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN} as margin`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE} as vendor_discount_type`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE} as vendor_discount_value`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SALES_QUANTITY} as sales_qty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.CGST}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SGST}`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MIN_MBQ} as min_mbq`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PACK_QTY} as PackQty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.T_QTY} as Transit_Qty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.SUGG_QTY} as suggested_Qty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.REQ_QTY} as RequiredQty`,
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.QUANTITY} as orderQty`,
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
            `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.MBQ}`
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
          )
          .where(
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
          .orderBy(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_ID}`, "ASC");


        const updatedPoDetailsLines = po_details_lines.map((detail) => {
          const cp = Number(detail.cost_price) || 0;
          const gst = Number(detail.gst) || 0;

          return {
            ...detail,
            phy_qty: 0,
            gst_amount: Number((cp * gst) / 100).toFixed(2),
            averageQty: detail.averageQty || 0,
            stockbalance: detail.stockbalance || 0,
            Totalbalance: detail.Totalbalance || 0,
            ts: detail.ts || 0,
            vlt: detail.vlt || 0,
            paway: detail.paway || 0
          };
        });


        return { ...po, po_details_lines: updatedPoDetailsLines };
      })
    );

    return purchaseOrderDetails;

  }

  async function putOutletPurchaseOrderProductRepo({ params, body, userDetails }) {
    const knex = this;
    const { po_no, company_id, outlet_id } = params;

    const trx = await knex.transaction();

    try {

      // ----------------------------------------
      // Step 1: Fetch PO master
      // ----------------------------------------
      const poMaster = await trx(OUTLET_PO_MASTER.NAME)
        .where({
          [OUTLET_PO_MASTER.COLUMNS.PO_NO]: po_no,
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

      const purchaseOrderId = poMaster.id;

      // ----------------------------------------
      // Step 2: Fetch supplier GST type
      // ----------------------------------------
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

      const gst_type = Number(supplierDetails.gst_type);

      // ----------------------------------------
      // Step 3: Recalculate Master Totals
      // ----------------------------------------
      let totalOrderQty = 0;
      let totalItems = body.outlet_po_details?.length || 0;
      let subTotalAmt = 0;
      let totalCessAmt = 0;
      let totalGstAmt = 0;
      let grandTotalAmt = 0;

      body.outlet_po_details?.forEach(detail => {
        const rate = Number(detail.purchaseRate) || 0;
        const gst = Number(detail.gst) || 0;
        const cess = Number(detail.cess) || 0;
        const qty = Number(detail.quantity) || 0;

        const gstAmount = (rate * gst) / 100;
        const cessAmount = (rate * cess) / 100;
        const landingRate = rate + gstAmount + cessAmount;

        const amount = landingRate * qty;

        totalOrderQty += qty;
        subTotalAmt += amount;
        totalGstAmt += gstAmount;
        totalCessAmt += cessAmount;
        grandTotalAmt += amount;
      });

      grandTotalAmt = Math.round(grandTotalAmt);

      const roundOff = Math.round(grandTotalAmt) - grandTotalAmt;

      // ----------------------------------------
      // Step 4: Update PO master
      // ----------------------------------------
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
          [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
          [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date()
        });

      // ----------------------------------------
      // Step 5: Insert new PO details
      // ----------------------------------------
      const poDetailRows = body.outlet_po_details.map(d => {
        const rate = Number(d.purchaseRate) || 0;
        const gst = Number(d.gst) || 0;
        const cess = Number(d.cess) || 0;
        const qty = Number(d.quantity) || 0;

        const gstAmount = (rate * gst) / 100;
        const cessAmount = (rate * cess) / 100;
        const landingRate = rate + gstAmount + cessAmount;

        return {
          [OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID]: purchaseOrderId,
          [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
          [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: po_no,
          [OUTLET_PO_DETAILS.COLUMNS.PROD_ID]: Number(d.prod_id),
          [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
          [OUTLET_PO_DETAILS.COLUMNS.MRP]: Number(d.mrp),
          [OUTLET_PO_DETAILS.COLUMNS.CP]: rate,
          [OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT]: gst_type === 2 ? gstAmount : 0,
          [OUTLET_PO_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,
          [OUTLET_PO_DETAILS.COLUMNS.RATE]: rate,
          [OUTLET_PO_DETAILS.COLUMNS.QUANTITY]: qty,
          [OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE]: landingRate,
          [OUTLET_PO_DETAILS.COLUMNS.AMOUNT]: landingRate * qty,
          [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id,
          [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
        };
      });

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
      return { success: true };

    } catch (error) {
      await trx.rollback();
      console.log("Update Outlet Purchase Order transaction failed:", error)
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

  //auto generte po
  // async function getAutopogeneraterRepo({ params, body, logTrace, userDetails, query, financialYear }) {
  //   const knex = this;

  //   const { company_id } = params;
  //   const { search, type, product_id, head_id } = query;

  //   const currentDay = moment().format('dddd').toLowerCase();
  //   console.log("currentDay", currentDay)
  //   const PocurrentDate = moment().format('YYYY-MM-DD');
  //   console.log("PocurrentDate", PocurrentDate);


  //   const query2 = knex
  //     .distinct(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`)
  //     .select([
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`,
  //       `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID} as outlet_id`
  //     ])
  //     .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
  //     .leftJoin(
  //       `${VENDORS_MAPPING.NAME} as ${VENDORS_MAPPING.NAME}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
  //       `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`
  //     )
  //     .leftJoin(
  //       `${ITEM.NAME} as ${ITEM.NAME}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
  //       `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_ID}`
  //     )
  //     .innerJoin(
  //       `${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`,
  //       function () {
  //         this.on(
  //           `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
  //           '=',
  //           `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
  //         ).andOn(
  //           `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID}`,
  //           '=',
  //           knex.raw('?', [company_id])
  //         );
  //       }
  //     )
  //     .innerJoin(
  //       `${SUPPLIER_ORDER_DAYS.NAME} as ${SUPPLIER_ORDER_DAYS.NAME}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
  //       `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.SUPPLIER_ID}`
  //     )
  //     .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
  //     .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.APPROVAL}`, true)
  //     .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`, company_id)
  //     .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
  //     .andWhere(`${VENDORS_MAPPING.NAME}.${currentDay}`, true)
  //     .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, company_id)
  //     .andWhere(`${SUPPLIER_ORDER_DAYS.NAME}.${currentDay}`, true)
  //     .orderBy(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, `asc`)

  //   // Optional filter on item type
  //   // if (Number(type_id) === 1) {
  //   //   query2.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, 1);
  //   // } else {
  //   //   query2.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, 2);
  //   // }

  //   const response1 = await query2;
  //   console.log("response1qq", response1)
  //   if (!response1.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "Supplier not found",
  //       property: "",
  //       code: "NOT_FOUND"
  //     });
  //   }
  //   const updatedSupplierDetails = response1.map((detail) => ({
  //     ...detail,
  //     gst: Number(detail.gst_type) === 2,
  //     igst: Number(detail.gst_type) === 1,
  //   }));

  //   //test
  //   // const hardcodedSupplier = {
  //   //   id: 609,
  //   //   gst_type: 2,
  //   //   gst: true,
  //   //   igst: false,
  //   //   outlet_id: 12
  //   // };

  //   // updatedSupplierDetails.push(hardcodedSupplier);
  //   //test

  //   const allItems = [];

  //   for (const supplier of updatedSupplierDetails) {
  //     const vendor_id = supplier.id;
  //     const outlet_id = supplier.outlet_id;

  //     console.log("vendor_id", vendor_id)


  //     const query1 = knex(ITEM.NAME)
  //       .select(
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as supplier_add1`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as supplier_add2`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as supplier_add3`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4} as supplier_add4`,
  //         `${STATES.NAME}.${STATES.COLUMNS.NAME} as supplier_state_name`,
  //         `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as supplier_city_name`,
  //         `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as supplier_country_name`,
  //         `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
  //         `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
  //         knex.raw(`CAST(${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} AS INTEGER) AS numeric_product_code`),
  //         `${ITEM.NAME}.*`,
  //         `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as soh`,
  //         `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.BARCODE} as barcode`
  //       )
  //       .leftJoin(
  //         `${VENDORS_MAPPING.NAME}`,
  //         `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_CODE}`,
  //         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
  //       )
  //       .leftJoin(
  //         `${BARCODE_LIST.NAME}`,
  //         `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
  //         `${BARCODE_LIST.NAME}.${BARCODE_LIST.COLUMNS.PROD_ID}`
  //       )
  //       .leftJoin(
  //         `${SUPPLIER.NAME}`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
  //         `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`
  //       )
  //       .leftJoin(
  //         `${STATES.NAME}`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
  //         `${STATES.NAME}.${STATES.COLUMNS.ID}`
  //       )
  //       .leftJoin(
  //         `${CITIES.NAME}`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
  //         `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
  //       )
  //       .leftJoin(
  //         `${COUNTRIES.NAME}`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
  //         `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
  //       )
  //       .leftJoin(
  //         `${MAIN_CATEGORY.NAME}`,
  //         `${ITEM.NAME}.main_catgory_id`,
  //         `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
  //       )
  //       .where(`${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE}`, true)
  //       .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`, vendor_id)
  //       .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
  //       .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`, company_id)
  //       .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.IS_ACTIVE}`, true)
  //       .andWhere(`${VENDORS_MAPPING.NAME}.${currentDay}`, true)
  //       .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
  //       .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, company_id)
  //       .orderBy('numeric_product_code', 'ASC')

  //     if (product_id) {
  //       query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, product_id);
  //     }


  //     if (search) {
  //       query1.andWhere(function () {
  //         this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, "ilike", `%${search}%`)
  //           .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search}%`);
  //       });
  //     }

  //     if (type == 2) {
  //       query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, 2)
  //     } else {
  //       query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, 1)
  //     }


  //     ///count
  //     const countQuery = knex(ITEM.NAME)
  //       .leftJoin(
  //         `${VENDORS_MAPPING.NAME}`,
  //         `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_CODE}`,
  //         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
  //       )
  //       .leftJoin(
  //         `${SUPPLIER.NAME}`,
  //         `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
  //         `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`
  //       )
  //       .where(`${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE}`, true)
  //       .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`, vendor_id)
  //       .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
  //       .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`, company_id)
  //       .andWhere(`${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.IS_ACTIVE}`, true)
  //       .andWhere(`${VENDORS_MAPPING.NAME}.${currentDay}`, true)
  //       .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
  //       .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, company_id)
  //       .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, type == 2 ? 2 : 1);

  //     if (product_id) {
  //       countQuery.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, product_id);
  //     }

  //     if (search) {
  //       countQuery.andWhere(function () {
  //         this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, "ilike", `%${search}%`)
  //           .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search}%`);
  //       });
  //     }

  //     const countBeforeHeadIdResult = await countQuery.count("* as total");

  //     const countBeforeHeadId = parseInt(countBeforeHeadIdResult[0].total, 10);

  //     console.log("Count before applying head_id:", countBeforeHeadId);

  //     if (head_id) {
  //       query1.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`, head_id);
  //     }


  //     const response = await query1;

  //     if (!response.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: "Outlet Purchase product not found",
  //         property: "",
  //         code: "NOT_FOUND"
  //       });
  //     }

  //     const totalItemsCount = response.length;
  //     console.log("totalItemsCount", totalItemsCount)

  //     const supplierOutlets = await knex(SUPPLIER_OUTLET_MAPPING.NAME)
  //       .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID,)
  //       .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, vendor_id)
  //       .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //       .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE, true);


  //     const oultets = await knex(OUTLETS.NAME)
  //       .select('outlets.*')
  //       .where(OUTLETS.COLUMNS.COMPANY_ID, company_id)
  //       .where(OUTLETS.COLUMNS.ID, outlet_id)
  //       .andWhere(OUTLETS.COLUMNS.IS_ACTIVE, true);





  //     const outletSalesQtyData = await axios.post(`https://erpdas.bluekode.com/v1/Itemdetails/salesQty/${outlet_id}`,
  //       response.map(item => ({ prod_code: item.pro_code }))
  //     );

  //     console.log("Sales Quantity API Response:", outletSalesQtyData.data);


  //     const productCodes = response.map(item => parseInt(item.pro_code)).filter(Boolean);
  //     const poSettingsRows = await knex(POSETTINGS.NAME)
  //       .select('*')
  //       .whereIn(POSETTINGS.COLUMNS.CODE, productCodes)
  //       .andWhere(POSETTINGS.COLUMNS.OUTLET_ID, outlet_id);

  //     console.log("poSettingsRows", poSettingsRows)

  //     const poSettingsMap = {};
  //     poSettingsRows.forEach(row => {
  //       poSettingsMap[row.code] = row;
  //     });


  //   const finalResponse = response.map(item => {
  //     console.log("item pro_code", item.pro_code);

  //     const code = parseInt(item.pro_code);
  //     console.log("code", code);

  //     const poSetting = poSettingsMap[code];
  //     console.log("poSetting", poSetting);

  //     const saleItem = outletSalesQtyData.data.find(sale => parseInt(sale.prod_code) === code);

  //     let salesQty = 0;
  //     let stockbalance = 0;
  //     let entryDateCount = 0;
  //     let averageQty = 0;
  //     let qty = 0;
  //     let MBQ = 0;
  //     let Transit_Qty = 0;
  //     let Totalbalance = 0;
  //     let finalMBQ = 0;
  //     let RequiredQty = 0;
  //     let finalPackQty = 0;
  //     let PackQty = 0;
  //     let stockdays = 0;
  //     let stockhold = 0;
  //     let suggestedQty = 0;
  //     let minmbq = 0;



  //     const cost_price = item.pur_rate;
  //     const outlet_ids = supplierOutlets.map(outlet => outlet.outlet_id);
  //     const oultetname = oultets[0].short_name

  //     console.log("oultetsn", oultets)

  //     console.log("oultetsname", oultetname)
  //     if (saleItem) {
  //       salesQty = saleItem.salesQty || 0;
  //       stockbalance = saleItem.stock_balance || 0;
  //       entryDateCount = saleItem.entry_date_count || 0;
  //       averageQty = entryDateCount !== 0 ? salesQty / entryDateCount : 0;
  //     } else {
  //       console.log(`No sales data found for prod_code: ${code}`);
  //     }

  //     if (poSetting && typeof poSetting.saledays === 'number' && typeof poSetting.vlt === 'number') {
  //       MBQ = Math.ceil(averageQty * (poSetting.saledays + poSetting.vlt));
  //       minmbq = poSetting.minmbq;

  //     }

  //     Totalbalance = Transit_Qty + parseFloat(item.balance);


  //     if (poSetting && typeof poSetting.minmbq === 'number') {
  //       finalMBQ = Math.max(MBQ, poSetting.minmbq);
  //     } else {
  //       finalMBQ = MBQ;
  //     }

  //     if (poSetting) {
  //       if (poSetting.paway === 1) {
  //         const compareVal = finalMBQ * poSetting.ts;
  //         console.log("finalMBQ", finalMBQ)
  //         console.log("poSetting ts", poSetting.ts)
  //         console.log("compareVal", compareVal)
  //         console.log("Totalbalance", Totalbalance)
  //         if (Totalbalance < compareVal) {
  //           RequiredQty = finalMBQ - Totalbalance;
  //           console.log("condirion 1")
  //         } else {
  //           RequiredQty = 0;
  //           console.log("condirion 2")
  //         }
  //       } else if (poSetting.paway === 0) {
  //         RequiredQty = finalMBQ - Totalbalance;
  //       }
  //     }

  //     if (poSetting && typeof poSetting.packqty === 'number') {
  //       PackQty = Math.round(RequiredQty / poSetting.packqty) * poSetting.packqty;
  //     } else {
  //       console.error('Invalid poSetting or packqty not found', poSetting);
  //     }


  //     if (PackQty < finalMBQ) {
  //       finalPackQty = PackQty
  //     } else {
  //       finalPackQty = finalMBQ
  //     }

  //     console.log("salesQty:", salesQty);
  //     console.log("entryDateCount:", entryDateCount);
  //     console.log("averageQty:", averageQty);
  //     console.log("stockbalance:", stockbalance);
  //     console.log("MBQ:", MBQ);
  //     console.log("Totalbalance", Totalbalance);
  //     console.log("finalMBQ", finalMBQ)
  //     console.log("RequiredQty", RequiredQty)
  //     console.log("PackQty", PackQty)
  //     console.log("finalPackQty", finalPackQty)


  //     return {
  //       ...item,
  //       qty,
  //       purchase_order_type: 0,
  //       cost_price,
  //       outlet_ids,
  //       oultetname,
  //       salesQtyData: salesQty || 0,
  //       // stockbalance,
  //       averageQty,
  //       Transit_Qty,
  //       // MBQ,
  //       Daily_Run_Rate: entryDateCount,
  //       Totalbalance,
  //       MAXMBQ: finalMBQ,
  //       RequiredQty,
  //       PackQty,
  //       orderQty: finalPackQty,
  //       // poSetting,
  //       main_category_name: item.main_category_name,
  //       phy_qty: 0,
  //       // stock_days: stockdays || 0,
  //       // stock_hold: stockhold || 0,
  //       suggested_Qty: finalPackQty,
  //       min_mbq: minmbq,
  //       outlet_id

  //     };
  //   });

  //   allItems.push(...finalResponse);
  // }

  // function groupBySupplier(allItems) {
  //   const grouped = allItems.reduce((acc, item) => {
  //     const supplierId = item.supplier_id;

  //     if (!acc[supplierId]) {
  //       acc[supplierId] = {
  //         supplier_id: item.supplier_id,
  //         supplier_name: item.supplier_name,
  //         supplier_short_name: item.supplier_short_name,
  //         supplier_add1: item.supplier_add1,
  //         supplier_add2: item.supplier_add2,
  //         supplier_add3: item.supplier_add3,
  //         supplier_add4: item.supplier_add4,
  //         supplier_state_name: item.supplier_state_name,
  //         supplier_city_name: item.supplier_city_name,
  //         supplier_country_name: item.supplier_country_name,
  //         outlet_id: item.outlet_id,
  //         detailsCount: 0,
  //         outlet_po_details: []
  //       };
  //     }


  //     const {
  //       supplier_id, supplier_name, supplier_short_name, supplier_add1, supplier_add2, supplier_add3, supplier_add4,
  //       supplier_state_name, supplier_city_name, supplier_country_name, outlet_id,
  //       ...itemDetails
  //     } = item;

  //     acc[supplierId].outlet_po_details.push(itemDetails);
  //     acc[supplierId].detailsCount += 1;

  //     return acc;
  //   }, {});

  //   return {
  //     totalSuppliers: Object.keys(grouped).length,
  //     suppliers: Object.values(grouped)
  //   };
  // }

  // const responseout = groupBySupplier(allItems);
  // console.log("responseout", responseout)
  // console.log(JSON.stringify(responseout, null, 2));
  // console.log("***********")





  //   // post

  //   for (const supplier of responseout.suppliers) {
  //     const { supplier_id, outlet_id, detailsCount, outlet_po_details } = supplier;
  //     console.log("outlet_id", outlet_id)


  //     let Docno = "1";
  //     const ponoquery = knex(OUTLET_PO_MASTER.NAME)
  //       .returning("id")
  //       .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR}`, financialYear)
  //       .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`, company_id)
  //       .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outlet_id)
  //       .orderBy(OUTLET_PO_MASTER.COLUMNS.ID, 'desc')
  //       .limit(1);

  //     console.log('financial_year:', financialYear);
  //     console.log('company_id:', company_id);
  //     console.log('outlet_id:', outlet_id);

  //     const ponoqueryresponse = await ponoquery;
  //     console.log(ponoqueryresponse, "ponoquery");


  //     if (ponoqueryresponse.length === 0) {
  //       Docno = "1";
  //     } else {
  //       const docno = Number(ponoqueryresponse[0].po_no);
  //       Docno = `${docno + 1}`;
  //     }

  //     console.log("Docno", Docno)


  //     let totalOrderQty = 0;
  //     let subTotalAmt = 0;
  //     let totalGstAmt = 0;
  //     let grandTotalAmt = 0;
  //     let total_cess_amt = 0;
  //     let total_igst_amt = 0;
  //     let gstAmount = 0;
  //     let Amount = 0;


  //     if (outlet_po_details && outlet_po_details.length > 0) {
  //       outlet_po_details.forEach(detail => {


  //         const pur_rate = parseFloat(detail.pur_rate || 0);
  //         const gst = parseFloat(detail.gst || 0);
  //         const ordQty = parseFloat(detail.ord_qty || 0);

  //         console.log("pur_rate, gst,ordQty", pur_rate, gst, ordQty)

  //         const gstAmount = pur_rate * gst / 100;
  //         const landingRate = pur_rate + gstAmount;
  //         const amount = landingRate * ordQty;

  //         console.log("gstAmount,landingRate,amount", gstAmount, landingRate, amount)

  //         totalOrderQty += ordQty;
  //         subTotalAmt += pur_rate * ordQty;
  //         totalGstAmt += gstAmount * ordQty;
  //         grandTotalAmt += amount;

  //         console.log("totalOrderQty,subTotalAmt,totalGstAmt,grandTotalAmt", totalOrderQty, subTotalAmt, totalGstAmt, grandTotalAmt)


  //         // totalOrderQty += parseFloat(detail.orderQty || 0);
  //         // subTotalAmt += parseFloat(detail.amount || 0);
  //         // subTotalAmt += Amount;
  //         // totalGstAmt += parseFloat(detail.gst_amount || 0);
  //         // totalGstAmt += gstAmount;
  //         // grandTotalAmt += parseFloat(detail.amount || 0) + parseFloat(detail.gst_amount || 0);
  //         // grandTotalAmt += Amount + gstAmount;
  //         total_cess_amt += parseFloat(detail.cess || 0);
  //       });
  //     }


  //     grandTotalAmt = Math.round(grandTotalAmt * 100) / 100;

  //     const roundOff = Math.round(grandTotalAmt) - grandTotalAmt;

  //     grandTotalAmt = Math.round(grandTotalAmt);


  //     const [{ max_id }] = await knex(OUTLET_PO_MASTER.NAME)
  //       .max("id as max_id")
  //       .where(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
  //       .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear);


  //     const nextId = (max_id || 0) + 1;



  //     const outletPoMasterData = {
  //       [OUTLET_PO_MASTER.COLUMNS.ID]: nextId,
  //       [OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
  //       [OUTLET_PO_MASTER.COLUMNS.PO_NO]: Docno,
  //       [OUTLET_PO_MASTER.COLUMNS.PO_DATE]: PocurrentDate,
  //       [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
  //       [OUTLET_PO_MASTER.COLUMNS.TOTAL_ITEMS]: detailsCount,
  //       [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,

  //       //
  //       [OUTLET_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY]: totalOrderQty,
  //       [OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotalAmt,
  //       [OUTLET_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: totalGstAmt,
  //       [OUTLET_PO_MASTER.COLUMNS.TOTAL_IGST_AMT]: total_igst_amt || 0,
  //       [OUTLET_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: total_cess_amt || 0,
  //       [OUTLET_PO_MASTER.COLUMNS.ROFF]: roundOff,
  //       [OUTLET_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmt,
  //       //
  //       [OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID]: supplier_id,
  //       // [OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE]: body.expiry_date,
  //       [OUTLET_PO_MASTER.COLUMNS.APPROVAL]: 0,
  //       [OUTLET_PO_MASTER.COLUMNS.IS_APPROVED_BY]: 0,
  //       [OUTLET_PO_MASTER.COLUMNS.EXPIRED]: false,
  //       [OUTLET_PO_MASTER.COLUMNS.CREATED_BY]: 1 || userDetails.id,
  //       [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: 1 || userDetails.id,
  //       [OUTLET_PO_MASTER.COLUMNS.CREATED_AT]: new Date(),
  //       [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
  //       [OUTLET_PO_MASTER.COLUMNS.TYPE]: "auto",
  //       [OUTLET_PO_MASTER.COLUMNS.SET_QTY_FLAG]: false
  //     };

  //     const insertResult = await knex(OUTLET_PO_MASTER.NAME)
  //       .returning(OUTLET_PO_MASTER.COLUMNS.ID)
  //       .insert(outletPoMasterData);

  //     const outletPoMasterId = insertResult[0].id;



  //     if (outlet_po_details && outlet_po_details.length > 0) {
  //       const outletPoDetailsData = outlet_po_details.map(detail => {

  //         const rate = parseFloat(detail.pur_rate || 0);
  //         const gst = parseFloat(detail.gst || 0);
  //         const ordQty = parseFloat(detail.ord_qty || 0);
  //         const gstAmount = rate * gst / 100;

  //         const landingRate = rate + (rate * gst / 100);
  //         const amount = landingRate * ordQty;

  //         return {
  //           [OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID]: outletPoMasterId,
  //           [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
  //           [OUTLET_PO_DETAILS.COLUMNS.OUTLET_NAME]: detail.oultetname,
  //           [OUTLET_PO_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
  //           [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: Docno,
  //           [OUTLET_PO_DETAILS.COLUMNS.PO_DATE]: PocurrentDate,
  //           [OUTLET_PO_DETAILS.COLUMNS.PROD_CODE]: detail.pro_code,
  //           [OUTLET_PO_DETAILS.COLUMNS.PROD_ID]: detail.id,
  //           [OUTLET_PO_DETAILS.COLUMNS.PROD_NAME]: detail.short_name,
  //           [OUTLET_PO_DETAILS.COLUMNS.CATEGORY_ID]: detail.main_catgory_id,
  //           [OUTLET_PO_DETAILS.COLUMNS.CATEGORY_NAME]: detail.main_category_name,
  //           [OUTLET_PO_DETAILS.COLUMNS.SALES_QUANTITY]: detail.salesQtyData,
  //           [OUTLET_PO_DETAILS.COLUMNS.STK_HOLD]: detail.stock_hold,
  //           [OUTLET_PO_DETAILS.COLUMNS.BALANCE]: detail.balance,
  //           [OUTLET_PO_DETAILS.COLUMNS.PHY_QTY]: detail.phy_qty,
  //           [OUTLET_PO_DETAILS.COLUMNS.MRP]: detail.mrp,
  //           [OUTLET_PO_DETAILS.COLUMNS.CP]: detail.cp,
  //           [OUTLET_PO_DETAILS.COLUMNS.GST]: detail.gst,
  //           [OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT]: gstAmount,
  //           [OUTLET_PO_DETAILS.COLUMNS.IGST]: detail.igst,
  //           [OUTLET_PO_DETAILS.COLUMNS.CGST]: detail.cgst,
  //           [OUTLET_PO_DETAILS.COLUMNS.SGST]: detail.sgst,
  //           [OUTLET_PO_DETAILS.COLUMNS.RATE]: detail.pur_rate,
  //           [OUTLET_PO_DETAILS.COLUMNS.QUANTITY]: detail.quantity,
  //           [OUTLET_PO_DETAILS.COLUMNS.AMOUNT]: amount,
  //           [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id,
  //           [OUTLET_PO_DETAILS.COLUMNS.CREATED_BY]: 1 || userDetails.id,
  //           [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: 1 || userDetails.id,
  //           [OUTLET_PO_DETAILS.COLUMNS.CREATED_AT]: new Date(),
  //           [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
  //           [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
  //           [OUTLET_PO_DETAILS.COLUMNS.TYPE]: "auto",
  //           // [OUTLET_PO_DETAILS.COLUMNS.MBQ]: detail.mbq,
  //           // [OUTLET_PO_DETAILS.COLUMNS.MBQDAYS]: detail.mbqdays,
  //           [OUTLET_PO_DETAILS.COLUMNS.PACK_QTY]: detail.PackQty,
  //           // [OUTLET_PO_DETAILS.COLUMNS.SYS_QTY]: detail.sys_qty,
  //           [OUTLET_PO_DETAILS.COLUMNS.REQ_QTY]: detail.RequiredQty,
  //           [OUTLET_PO_DETAILS.COLUMNS.ORD_QTY]: detail.orderQty,
  //           [OUTLET_PO_DETAILS.COLUMNS.SUGG_QTY]: detail.suggested_Qty,
  //           [OUTLET_PO_DETAILS.COLUMNS.MIN_MBQ]: detail.min_mbq,
  //           [OUTLET_PO_DETAILS.COLUMNS.T_QTY]: detail.Transit_Qty,
  //           [OUTLET_PO_DETAILS.COLUMNS.SALES_DAYS]: detail.Daily_Run_Rate,
  //           [OUTLET_PO_DETAILS.COLUMNS.STOCK_DAYS]: detail.stock_days,
  //           [OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE]: landingRate
  //         }

  //       });



  //       const logData = {
  //         [OUTLET_PO_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
  //         [OUTLET_PO_LOGS.COLUMNS.NEWDATA]: JSON.stringify({
  //           outlet_po_master: {
  //             ...outletPoMasterData,
  //             [OUTLET_PO_MASTER.COLUMNS.PO_NO]: Docno
  //           },
  //           outlet_po_details: outletPoDetailsData
  //         }),
  //         [OUTLET_PO_LOGS.COLUMNS.USER_ID]: 1 || userDetails.id,
  //         [OUTLET_PO_LOGS.COLUMNS.USER_NAME]: "Super Admin" || userDetails.user_name,
  //         [OUTLET_PO_LOGS.COLUMNS.PO_NO]: Docno,
  //         [OUTLET_PO_LOGS.COLUMNS.PO_DATE]: PocurrentDate,
  //         [OUTLET_PO_LOGS.COLUMNS.CREATED_AT]: new Date()
  //       };

  //       await knex(OUTLET_PO_LOGS.NAME).insert(logData);

  //       await knex.batchInsert(OUTLET_PO_DETAILS.NAME, outletPoDetailsData, 500);

  //     }

  //   }


  //   return {
  //     success: true,
  //   };

  // }

  async function getAutopogeneraterRepo({ params, body, logTrace, userDetails, query, financialYear }) {
    const knex = this;

    const { company_id } = params;

    const currentDay = moment().format('dddd').toLowerCase();
    console.log("currentDay", currentDay);

    // Start Transaction
    const trx = await knex.transaction();
    try {
      const existingPO = await knex(OUTLET_PO_MASTER.NAME)
        .andWhere(OUTLET_PO_MASTER.COLUMNS.PO_DATE, new Date())
        .andWhere(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
        .andWhere(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear)
        .first();

      if (existingPO) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Purchase Order already generated for this supplier and outlet today.",
          property: "",
          code: "PO_ALREADY_EXISTS",
        });
      }
      // 🔹 Step 1: Fetch suppliers eligible for auto PO generation based on order day
      const query1 = trx
        .select([
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID} as outlet_id`,
          `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID} as brand_company_id`,
          `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`
        ])
        .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)

        // supplier – outlet mapping
        .innerJoin(
          `${SUPPLIER_OUTLET_MAPPING.NAME}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
        )

        // supplier – outlet mapping
        .innerJoin(
          `${OUTLETS.NAME}`,
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
        )

        // supplier_outlet_mapping - outlet_supplier_orderdays
        .innerJoin(
          `${OUTLET_SUPPLIER_ORDERDAYS.NAME}`,
          function () {
            this.on(
              `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID}`,
              `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
            )
              .andOn(
                `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
              );
          }
        )

        .innerJoin(
          `${TYPEDESIGN.NAME}`,
          `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID}`,
          `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
        )

        /* 🔑 EXISTS → prevents duplicates */
        .whereExists(function () {
          this.select(1)
            .from(OUTLET_PRODUCT_MAPPING.NAME)
            .innerJoin(
              ITEM.NAME,
              `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`,
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`
            )
            .whereRaw(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID} = ${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .andWhereRaw(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID} = ${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
            )
            .andWhere(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE}`,
              true
            )
            .andWhere(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
              true
            )
            .andWhere(
              `${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`,
              true
            )
            .whereNotNull(
              `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`
            )
            .andWhere(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${currentDay}`,
              true
            );
        })


        /* COMMON FILTERS */
        .where(qb => {
          qb.where({
            [`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`]: true,
            [`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.APPROVAL}`]: true,
            [`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_DSD}`]: 0,
            [`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`]: company_id,
            [`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`]: true,
            [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`]: true,
            [`${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${currentDay}`]: true
          })
            .whereNotNull(
              `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID}`
            );
        })


        /* GROUPING (supplier-level only) */
        .groupBy([
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
          `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID}`,
          `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`
        ])

        .orderBy(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, 'asc');


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

      const allItems = [];

      for (const supplier of supplierDetails) {
        const vendor_id = supplier.id;
        const outlet_id = supplier.outlet_id;
        const brand_company_id = supplier.brand_company_id;
        const supplier_name = supplier.supplier_name;
        const outlet_name = supplier.outlet_name;
        const brand_company_name = supplier.brand_company_name;

        console.log(`🔹 Processing Supplier: ${supplier_name} | Vendor ID: ${vendor_id} | Outlet ID: ${outlet_id}| Outlet Name: ${outlet_name} | Brand Company ID: ${brand_company_id}| Brand Company Name: ${brand_company_name} `);
        if (!supplier.brand_company_id) {
          console.warn(`⚠️ No brand company found for supplier ${supplier.supplier_name}. Skipping...`);
          continue;
        };   // ✅ Guard 1

        const query2 = knex(`${ITEM.NAME}`)
          .distinctOn([
            `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`
          ])
          .select(
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME} as supplier_short_name`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as supplier_add1`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2} as supplier_add2`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3} as supplier_add3`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID} as outlet_id`,
            `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID} as prd_id`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID} as brand_company_id`,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
            `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME} as main_category_name`,
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MRP} as mrp`,
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.HSN} as hsn`,
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
          .leftJoin(
            `${STATES.NAME}`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
            `${STATES.NAME}.${STATES.COLUMNS.ID}`
          )
          .leftJoin(
            `${CITIES.NAME}`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
            `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
          )
          .leftJoin(
            `${COUNTRIES.NAME}`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
            `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
          )

          // WHERE conditions
          .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE}`, true)
          .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)
          .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`, vendor_id)
          .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID}`, brand_company_id)
          .whereNotNull(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID}`
          )
          .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
          .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
          .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
          .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
          .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, company_id)
          .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${currentDay}`, true)


          // ORDER BY required for DISTINCT ON
          .orderBy([
            { column: `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`, order: 'asc' },
            { column: 'numeric_product_code', order: 'asc' }
          ]);


        const productList = await query2;

        // console.log(query2.toSQL());
        // console.log('productList', productList);

        if (!productList.length) {
          console.warn(`⚠️ No products found for supplier ${supplier.supplier_name}. Skipping...`);
          continue;
        }


        // ------------------------------------------------------------
        // 3: Build payload for Sales Qty API
        // ------------------------------------------------------------
        let outletSalesQtyData = { data: [] };

        try {
          const productPayload = (productList || [])
            .map(item => String(item?.pro_code || "").trim())
            .filter(code => code.length > 0)
            .map(code => ({
              prod_code: code
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

        console.log(
          "✅ Sales Quantity API Response:",
          outletSalesQtyData.data.length,
          "records"
        );


        // ------------------------------------------------------------
        // 5: Build map for PO Settings
        // ------------------------------------------------------------
        const productCodes = (productList || [])
          .map(item => String(item.pro_code).trim())
          .filter(code => code.length > 0);

        let poSettingsRows = [];
        if (productCodes.length > 0) {
          poSettingsRows = await knex(POSETTINGS.NAME)
            .select(
              POSETTINGS.COLUMNS.CODE,        // ✅ REQUIRED
              POSETTINGS.COLUMNS.SALEDAYS,
              POSETTINGS.COLUMNS.MINMBQ,
              POSETTINGS.COLUMNS.TS,
              POSETTINGS.COLUMNS.VLT,
              POSETTINGS.COLUMNS.PAWAY,
              POSETTINGS.COLUMNS.PACKQTY
            )
            .whereIn(POSETTINGS.COLUMNS.CODE, productCodes)
            .andWhere(POSETTINGS.COLUMNS.OUTLET_ID, outlet_id);
        }

        const poSettingsMap = {};
        poSettingsRows.forEach(r => {
          poSettingsMap[r.code] = r;
        });

        // console.log(poSettingsMap,"poSettigMap")
        // ------------------------------------------------------------
        // 4️⃣ Convert API responses to maps for fast lookup
        // ------------------------------------------------------------
        const salesMap = {};
        (outletSalesQtyData.data || []).forEach(s => {
          salesMap[String(s.prod_code).trim()] = s;
        });

        const finalResponse = productList.map(item => {

          const productCode = String(item?.pro_code || "").trim();
          const productId = Number(item?.prd_id);
          const poSetting = poSettingsMap[productCode];
          const saleItem = salesMap[productCode];

          let salesQty = saleItem ? Number(saleItem.salesQty) || 0 : 0;
          let stockbalance = saleItem ? Number(saleItem.stock_balance) || 0 : 0;
          let entryDateCount = saleItem ? Number(saleItem.entry_date_count) || 0 : 0;
          let stockDays = saleItem ? Number(saleItem.entry_date_count) || 0 : 0;

          const sales_days = Number(poSetting?.saledays) || 1;
          const minMbqValue = Number(poSetting?.minmbq) || 0;
          const ts = Number(poSetting?.TS) || 70;
          const vlt = Number(poSetting?.vlt) || 1;
          const paway = Number(poSetting?.paway) || 0;
          const pack_qty = Number(poSetting?.packqty) || 1;

          // console.log(poSetting, "po setting")

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

          const averageQty = salesQty > 0 ? (salesQty / 28) : 0;

          const doh = averageQty > 0 ? (stockbalance / averageQty) : 0;


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

          // if (paway === 1) {
          //   const compareVal = maxMBQ * tSafe;
          //   if (totalBal < compareVal) RequiredQty = maxMBQ - totalBal;
          //   else RequiredQty = 0;
          // } else {
          //   RequiredQty = maxMBQ - totalBal;
          // }

          RequiredQty = Math.max(0, maxMBQ);

          // --------------------------------------------------------
          // 8️⃣ Pack Qty + Final Qty
          // --------------------------------------------------------
          const packSize = Number(pack_qty) || 1;
          const PackQty = packSize;

          const caseQty = Math.ceil(RequiredQty / PackQty);

          const finalPackQty = caseQty * PackQty;


          // --------------------------------------------------------
          // 9️⃣ Final MBQ
          // --------------------------------------------------------
          const finalMBQ = Math.max(MBQ, minMbqValue);

          // --------------------------------------------------------
          // 🔟 Return Final
          // --------------------------------------------------------
          return {
            ...item,
            productCode,
            productId,
            salesQty,
            stockbalance,
            daily_Run_Rate,
            stockDays,
            sales_days,
            averageQty,
            MBQ,
            minMbqValue,
            Transit_Qty,
            maxMBQ,
            Totalbalance,
            RequiredQty,
            PackQty,
            finalPackQty,
            orderQty: finalPackQty,
            doh,
            finalMBQ,
            basicPrice,
            landingPrice,
            caseQty
          };
        });

        // console.log("finalResponse", finalResponse)

        allItems.push(...finalResponse);

        // console.log("allItems", allItems)
        // Filter data only for this supplier + outlet
        const filteredItems = allItems.filter(
          i =>
            Number(i.supplier_id) === Number(vendor_id) &&
            Number(i.outlet_id) === Number(outlet_id) &&
            Number(i.brand_company_id) === Number(brand_company_id) &&
            Number(i.orderQty) > 0           // ✅ IMPORTANT
        );


        function groupBySupplier(items) {
          const grouped = {};

          items.forEach(item => {
            const supplierId = item.supplier_id;
            const outletId = item.outlet_id;
            const brandCompanyId = item.brand_company_id; // ✅ TAKE FROM ITEM

            if (!supplierId || !outletId || !brandCompanyId) return;

            const groupKey = `${supplierId}_${outletId}_${brandCompanyId}`;

            if (!grouped[groupKey]) {
              grouped[groupKey] = {
                supplier_id: supplierId,
                supplier_name: item.supplier_name,
                supplier_short_name: item.supplier_short_name,
                supplier_add1: item.supplier_add1 || '',
                supplier_add2: item.supplier_add2 || '',
                supplier_add3: item.supplier_add3 || '',
                supplier_add4: item.supplier_add4 || '',
                gst_type: item.gst_type,
                outlet_id: outletId,
                brand_company_id: brandCompanyId, // ✅ FIXED
                detailsCount: 0,
                outlet_po_details: []
              };
            }

            const {
              supplier_id,
              supplier_name,
              supplier_short_name,
              supplier_add1,
              supplier_add2,
              supplier_add3,
              supplier_add4,
              gst_type,
              outlet_id,
              brand_company_id,
              ...details
            } = item;

            grouped[groupKey].outlet_po_details.push(details);
            grouped[groupKey].detailsCount++;
          });

          return {
            totalSuppliers: Object.keys(grouped).length,
            suppliers: Object.values(grouped)
          };
        }


        // Call grouping with filtered data
        const groupedResponse = groupBySupplier(filteredItems);

        // console.log("groupedResponse", groupedResponse);
        console.log("***********")

        function toDateOnly(date) {
          if (!date) return null;

          const d = new Date(date);
          if (isNaN(d.getTime())) return null;

          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");

          return `${year}-${month}-${day}`;
        }

        // --- Set expiry date ---
        const expiryDate = toDateOnly(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );
        // --- Set expiry date ---
        const poDate = toDateOnly(
          new Date()
        );

        for (const supplier of groupedResponse.suppliers) {
          const { supplier_id, outlet_id, gst_type, detailsCount, brand_company_id, outlet_po_details } = supplier;
          // ---------------------------
          //   PO NUMBER
          // ---------------------------
          if (Number(outlet_po_details.length) > 0) {
            const lastPo = await knex(OUTLET_PO_MASTER.NAME)
              .select(OUTLET_PO_MASTER.COLUMNS.PO_NO)
              .where(OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR, financialYear)
              .andWhere(OUTLET_PO_MASTER.COLUMNS.COMPANY_ID, company_id)
              .andWhere(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
              .orderBy(OUTLET_PO_MASTER.COLUMNS.ID, "desc")
              .first();

            const Docno = lastPo ? String(Number(lastPo.po_no) + 1) : "1";


            let totalOrderQty = 0;
            let subTotalAmt = 0;
            let totalGstAmt = 0;
            let totalCessAmt = 0;

            for (const detail of outlet_po_details) {
              const rate = Number(detail.basicPrice) || 0;
              const gst = Number(detail.gst) || 0;
              const cess = Number(detail.cess) || 0;
              const qty = Number(detail.orderQty) || 0;
              const landingRate = Number(detail.landingPrice) || 0;

              const basicAmount = landingRate * qty;
              const gstAmount = (rate * gst * qty) / 100;
              const cessAmount = (rate * cess * qty) / 100;

              totalOrderQty += qty;
              subTotalAmt += basicAmount;   // ✅ NUMBER
              totalGstAmt += gstAmount;     // ✅ NUMBER
              totalCessAmt += cessAmount;   // ✅ NUMBER
            }

            // ✅ round ONLY once
            const totalBeforeRoundOff =
              Number(subTotalAmt.toFixed(2)) +
              Number(totalCessAmt.toFixed(2));

            const grandTotalAmt = Math.round(totalBeforeRoundOff);
            const roundOff = Number((grandTotalAmt - totalBeforeRoundOff).toFixed(2));

            const outletPoMasterData = {
              [OUTLET_PO_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
              [OUTLET_PO_MASTER.COLUMNS.PO_NO]: Docno,
              [OUTLET_PO_MASTER.COLUMNS.PO_DATE]: poDate,
              [OUTLET_PO_MASTER.COLUMNS.EXPIRY_DATE]: expiryDate,
              [OUTLET_PO_MASTER.COLUMNS.OUTLET_ID]: outlet_id,
              [OUTLET_PO_MASTER.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_ITEMS]: detailsCount,
              [OUTLET_PO_MASTER.COLUMNS.COMPANY_ID]: company_id,
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_ORDER_QTY]: totalOrderQty,
              [OUTLET_PO_MASTER.COLUMNS.SUB_TOTAL_AMT]: subTotalAmt,
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_GST_AMT]: Number(gst_type) === 2 ? totalGstAmt : 0,
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_IGST_AMT]: Number(gst_type) === 1 ? totalGstAmt : 0,
              [OUTLET_PO_MASTER.COLUMNS.TOTAL_CESS_AMT]: totalCessAmt || 0,
              [OUTLET_PO_MASTER.COLUMNS.ROFF]: roundOff,
              [OUTLET_PO_MASTER.COLUMNS.GRAND_TOTAL_AMT]: grandTotalAmt,
              [OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID]: supplier_id,
              [OUTLET_PO_MASTER.COLUMNS.APPROVAL]: 1,
              [OUTLET_PO_MASTER.COLUMNS.IS_APPROVED_BY]: userDetails.id || 1,
              [OUTLET_PO_MASTER.COLUMNS.EXPIRED]: false,
              [OUTLET_PO_MASTER.COLUMNS.CREATED_BY]: 1 || userDetails.id,
              [OUTLET_PO_MASTER.COLUMNS.UPDATED_BY]: 1 || userDetails.id,
              [OUTLET_PO_MASTER.COLUMNS.CREATED_AT]: new Date(),
              [OUTLET_PO_MASTER.COLUMNS.UPDATED_AT]: new Date(),
              [OUTLET_PO_MASTER.COLUMNS.TYPE]: "auto",
              [OUTLET_PO_MASTER.COLUMNS.SET_QTY_FLAG]: false
            };

            // INSERT PO MASTER
            const [{ id: outletPoMasterId }] = await knex(OUTLET_PO_MASTER.NAME)
              .insert(outletPoMasterData)
              .returning("id");


            if (outlet_po_details && outlet_po_details.length > 0) {
              const outletPoDetailsData = outlet_po_details.map((detail, index) => {
                const rate = Number(detail.basicPrice) || 0;
                const gst = Number(detail.gst) || 0;
                const cess = Number(detail.cess) || 0;
                const qty = Number(detail.orderQty) || 0;
                // base
                const taxableAmount = Number(rate * qty);
                // tax
                const gstAmount = taxableAmount * gst / 100;
                const cessAmount = taxableAmount * cess / 100;

                // per unit landing rate
                const landingRate = Number(detail.landingPrice) || 0;

                // final amount
                const amount = Number((landingRate * qty).toFixed(2));

                return {
                  [OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID]: outletPoMasterId,
                  [OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID]: outlet_id,
                  [OUTLET_PO_DETAILS.COLUMNS.PO_DATE]: poDate,
                  [OUTLET_PO_DETAILS.COLUMNS.OUTLET_NAME]: detail.outlet_name,
                  [OUTLET_PO_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                  [OUTLET_PO_DETAILS.COLUMNS.PO_NO]: Docno,
                  [OUTLET_PO_DETAILS.COLUMNS.PROD_CODE]: detail.pro_code,
                  [OUTLET_PO_DETAILS.COLUMNS.PROD_ID]: detail.prd_id,
                  [OUTLET_PO_DETAILS.COLUMNS.PROD_NAME]: detail.pro_name,
                  [OUTLET_PO_DETAILS.COLUMNS.CATEGORY_ID]: detail.main_catgory_id,
                  [OUTLET_PO_DETAILS.COLUMNS.CATEGORY_NAME]: detail.main_category_name,
                  [OUTLET_PO_DETAILS.COLUMNS.UNIT_ID]: detail.uom_id,
                  [OUTLET_PO_DETAILS.COLUMNS.HSN]: detail.hsn,
                  [OUTLET_PO_DETAILS.COLUMNS.SALES_QUANTITY]: detail.salesQty,
                  [OUTLET_PO_DETAILS.COLUMNS.STK_HOLD]: Number(detail.stockbalance) || 0,
                  [OUTLET_PO_DETAILS.COLUMNS.BALANCE]: Number(detail.stockbalance) || 0,
                  [OUTLET_PO_DETAILS.COLUMNS.PHY_QTY]: 0,
                  [OUTLET_PO_DETAILS.COLUMNS.MRP]: Number(detail.mrp),
                  [OUTLET_PO_DETAILS.COLUMNS.CP]: rate || 0,
                  [OUTLET_PO_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? Number(detail.gst) : 0,
                  [OUTLET_PO_DETAILS.COLUMNS.GST]: Number(gst_type) === 2 ? detail.gst : 0,
                  [OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT]: Number(gst_type) === 2 ? gstAmount : 0,
                  [OUTLET_PO_DETAILS.COLUMNS.CGST]: (detail.gst && Number(detail.gst) > 0 && Number(gst_type) === 2) ? Number(detail.gst) / 2 : 0,
                  [OUTLET_PO_DETAILS.COLUMNS.SGST]: (detail.gst && Number(detail.gst) > 0 && Number(gst_type) === 2) ? Number(detail.gst) / 2 : 0,
                  [OUTLET_PO_DETAILS.COLUMNS.IGST]: Number(gst_type) === 1 ? detail.igst : 0,
                  [OUTLET_PO_DETAILS.COLUMNS.CESS]: Number(detail.cess) || 0,
                  [OUTLET_PO_DETAILS.COLUMNS.CESS_AMOUNT]: cessAmount,
                  [OUTLET_PO_DETAILS.COLUMNS.RATE]: rate,
                  [OUTLET_PO_DETAILS.COLUMNS.QUANTITY]: qty,
                  [OUTLET_PO_DETAILS.COLUMNS.AMOUNT]: amount,
                  [OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID]: supplier_id,
                  [OUTLET_PO_DETAILS.COLUMNS.CREATED_BY]: userDetails.id || 1,
                  [OUTLET_PO_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id || 1,
                  [OUTLET_PO_DETAILS.COLUMNS.CREATED_AT]: new Date(),
                  [OUTLET_PO_DETAILS.COLUMNS.UPDATED_AT]: new Date(),
                  [OUTLET_PO_DETAILS.COLUMNS.COMPANY_ID]: company_id,
                  [OUTLET_PO_DETAILS.COLUMNS.TYPE]: "auto",
                  [OUTLET_PO_DETAILS.COLUMNS.PACK_QTY]: detail.PackQty,
                  [OUTLET_PO_DETAILS.COLUMNS.REQ_QTY]: detail.RequiredQty,
                  [OUTLET_PO_DETAILS.COLUMNS.ORD_QTY]: detail.orderQty,
                  [OUTLET_PO_DETAILS.COLUMNS.CASE_QTY]: detail.caseQty,
                  [OUTLET_PO_DETAILS.COLUMNS.SUGG_QTY]: detail.RequiredQty,
                  [OUTLET_PO_DETAILS.COLUMNS.MIN_MBQ]: detail.minMbqValue,
                  [OUTLET_PO_DETAILS.COLUMNS.T_QTY]: detail.Transit_Qty,
                  [OUTLET_PO_DETAILS.COLUMNS.SALES_DAYS]: detail.daily_Run_Rate,
                  [OUTLET_PO_DETAILS.COLUMNS.STOCK_DAYS]: detail.stockDays,
                  [OUTLET_PO_DETAILS.COLUMNS.LANDING_RATE]: landingRate,
                  [OUTLET_PO_DETAILS.COLUMNS.DOH]: detail.doh,
                  [OUTLET_PO_DETAILS.COLUMNS.MBQ]: detail.MBQ || 1,
                  [OUTLET_PO_DETAILS.COLUMNS.MBQDAYS]: detail.sales_days || 1,
                  [OUTLET_PO_DETAILS.COLUMNS.AVERAGE_QTY]: detail.averageQty,
                  [OUTLET_PO_DETAILS.COLUMNS.STOCK_BALANCE]: detail.stockbalance,
                  [OUTLET_PO_DETAILS.COLUMNS.TOTAL_BALANCE]: detail.Totalbalance,
                  [OUTLET_PO_DETAILS.COLUMNS.FINAL_MBQ]: detail.maxMBQ,
                  [OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
                  [OUTLET_PO_DETAILS.COLUMNS.SERIAL_NO]: index + 1,   // ✅ Correct serial no
                  //add columns
                  [OUTLET_PO_DETAILS.COLUMNS.FIXEDMARGIN]: Number(detail.fixedmargin) || 0,
                  [OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTVALUE]: Number(detail.vendordiscountvalue) || 0,
                  [OUTLET_PO_DETAILS.COLUMNS.VENDORDISCOUNTTYPE]: Number(detail.vendordiscounttype) || 0,
                  [OUTLET_PO_DETAILS.COLUMNS.TS]: Number(detail.ts) || 0,
                  [OUTLET_PO_DETAILS.COLUMNS.VLT]: Number(detail.vlt) || 0,
                  [OUTLET_PO_DETAILS.COLUMNS.PAWAY]: Number(detail.paway) || 0
                }
              });

              if (outletPoDetailsData.length > 0) {
                await knex(OUTLET_PO_DETAILS.NAME)
                  .insert(outletPoDetailsData)
                  .onConflict([
                    OUTLET_PO_DETAILS.COLUMNS.PO_DATE,
                    OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID,
                    OUTLET_PO_DETAILS.COLUMNS.SUPPLIER_ID,
                    OUTLET_PO_DETAILS.COLUMNS.PROD_ID,
                    OUTLET_PO_DETAILS.COLUMNS.PROD_CODE,
                    OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID
                  ])
                  .ignore();
              }
            }

          }
        }
      }

      await trx.commit();

      return {
        success: true
      };

    } catch (error) {
      await trx.rollback();
      console.error("Error in getAutopogeneraterRepo:", error);
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

  async function getAutoPoBrandCompanyRepo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    const { outlet_id, supplier_id, company_id } = params;
    const currentDay = moment().format('dddd').toLowerCase();
    console.log("currentDay", currentDay);

    const query = knex(`${OUTLET_PRODUCT_MAPPING.NAME} as a`)
      .distinct("b.typedesign_id as brand_company_id", "c.type_name as brand_company")

      // Join item
      .innerJoin("item as b", "b.outlet_product_id", "a.outlet_product_id")

      // Join typedesign
      .innerJoin("typedesign as c", "c.id", "b.typedesign_id")

      // Join Supplier ↔ Outlet mapping
      .innerJoin(`${SUPPLIER_OUTLET_MAPPING.NAME} as som`, function () {
        this.on("som.outlet_id", "a.outlet_id")
          .on("som.supplier_id", "a.supplier_id")
      })

      .where("a.outlet_id", outlet_id)
      .andWhere("a.supplier_id", supplier_id)
      .andWhere("a.outlet_purchase", true)
      .andWhere("a.is_active", true)
      .andWhere("a.outlet_non_saleable", true)

      // Apply dynamic day filter on both tables
      .andWhere(`som.${currentDay}`, true)
      .andWhere(`a.${currentDay}`, true)

      .orderBy("c.type_name", "asc");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Auto Po Brand Company",
      logTrace
    });

    return await query;
  }

  // async function getpoSyncPaginate({
  //   params,
  //   body,
  //   logTrace,
  //   page_size = 30,
  //   current_page = 1
  // }) {

  //   const knex = this;

  //   const response = await knex.transaction(async trx => {

  //     const masterResponse = await knex(OUTLET_PO_MASTER.NAME)
  //       .select(
  //         `${OUTLET_PO_MASTER.NAME}.*`,
  //         `${SUPPLIER_OUTLET_MAPPING.NAME}.customer_code AS supplier_customer_code`,
  //         knex.raw(`TO_CHAR(${OUTLET_PO_MASTER.NAME}.po_date, 'YYYY-MM-DD') AS po_date`)
  //       )
  //       .join(
  //         `${SUPPLIER_OUTLET_MAPPING.NAME}`,
  //         `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
  //         `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
  //       )
  //       .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_SYNC}`, body.flag)
  //       .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, body.outlet_id)
  //       .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, 1)
  //       .where(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`, body.outlet_id)
  //       .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`, "desc")
  //       .limit(1);


  //     if (!masterResponse.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: "PO data not found",
  //         property: "",
  //         code: "NOT_FOUND"
  //       });
  //     }

  //     const master = masterResponse[0];
  //     const poNo = master.po_no;

  //     // 2. Count total details
  //     const [{ total }] = await knex(OUTLET_PO_DETAILS.NAME)
  //       .count("* as total")
  //       .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, poNo)
  //       .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, body.outlet_id)

  //     const totalRecords = Number(total);
  //     const totalPages = Math.ceil(totalRecords / page_size);

  //     // 3. Fetch paginated details
  //     // const details = await knex(OUTLET_PO_DETAILS.NAME)
  //     //   .select(
  //     //     `${OUTLET_PO_DETAILS.NAME}.*`,
  //     //     knex.raw(`TO_CHAR(${OUTLET_PO_DETAILS.NAME}.created_at, 'YYYY-MM-DD') AS created_at`),
  //     //     knex.raw(`TO_CHAR(${OUTLET_PO_DETAILS.NAME}.updated_at, 'YYYY-MM-DD') AS updated_at`),
  //     //     knex.raw(`TO_CHAR(${OUTLET_PO_DETAILS.NAME}.po_date, 'YYYY-MM-DD') AS po_date`)
  //     //   )
  //     //   .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, poNo)
  //     //   .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, body.outlet_id)
  //     //   .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_SYNC}`, body.flag)
  //     //   .orderBy("id", "asc")
  //     //   .offset((current_page - 1) * page_size)
  //     //   .limit(page_size);


  //     const details = await knex(OUTLET_PO_DETAILS.NAME)
  //       .select(
  //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`,
  //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PROD_CODE}`,
  //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.AMOUNT}`,
  //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.GST_AMOUNT}`,
  //         `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`,
  //         knex.raw(`TO_CHAR(${OUTLET_PO_DETAILS.NAME}.created_at, 'YYYY-MM-DD') AS created_at`),
  //         knex.raw(`TO_CHAR(${OUTLET_PO_DETAILS.NAME}.updated_at, 'YYYY-MM-DD') AS updated_at`),
  //         knex.raw(`TO_CHAR(${OUTLET_PO_DETAILS.NAME}.po_date, 'YYYY-MM-DD') AS po_date`)
  //       )
  //       .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_NO}`, poNo)
  //       .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_ID}`, body.outlet_id)
  //       .where(`${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.PO_SYNC}`, body.flag)
  //       .orderBy("id", "asc")
  //     // .offset((current_page - 1) * page_size)
  //     // .limit(page_size);

  //     console.log("details", details)

  //     return {
  //       po_no: poNo,
  //       master,
  //       details,
  //       meta: {
  //         current_page: Number(current_page),
  //         page_size: Number(page_size),
  //         total_records: totalRecords,
  //         total_pages: totalPages
  //       }
  //     };
  //   });

  //   return response;
  // }


  async function getOutletDsdPoStatusListRepo({ body, logTrace }) {
    const knex = this;
    const {
      from_date,
      to_date,
      company_id,
      region_id,
      outlet_id,
      page_size,
      current_page
    } = body;


    const query = knex
      .select([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE} as po_date`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
        `${REGION.NAME}.${REGION.COLUMNS.ID} as region_id`,
        `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME} as region_name`,
        knex.raw(
          `COUNT(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID})
         AS po_generated_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.approval = 1) 
         AS po_approval_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.is_normal = true) 
         AS po_grn_normal_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.is_qty_mismatch = true) 
         AS po_grn_qty_mismatch_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.is_amendment = true) 
         AS po_iv_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.is_debit_note = true) 
         AS po_debit_note_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.is_memo_complete = true) 
         AS po_memo_count`
        ),
        knex.raw(
          `COUNT(${OUTLET_PURCHASE_MASTER.NAME}.id) AS po_grn_count`
        )
      ])
      .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
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
      .leftJoin(`${OUTLET_PURCHASE_MASTER.NAME} as ${OUTLET_PURCHASE_MASTER.NAME}`, function () {
        this.on(
          `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
          '=',
          `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PONO}`
        )
          .andOn(
            `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`,
            '=',
            `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`
          )
      })
      .where(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`,
        company_id
      )
      .whereNotIn(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`,
        ['manual']
      )
      .whereBetween(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}`,
        [from_date, to_date]
      )
      .groupBy([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
        `${REGION.NAME}.${REGION.COLUMNS.ID}`,
        `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}`
      ])
      .orderBy(`${REGION.NAME}.${REGION.COLUMNS.ID}`, "ASC");


    if (region_id) {
      query.where(
        `${REGION.NAME}.${REGION.COLUMNS.ID}`,
        region_id
      );
    }

    if (outlet_id && Array.isArray(outlet_id) && outlet_id.length > 0) {
      query.whereIn(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        outlet_id
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet PO Status List",
      logTrace
    });

    const response = await query.paginate({
      pageSize: page_size,
      currentPage: current_page
    });

    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getOutletDsdPoStatusListWithEmail({ body, logTrace }) {
    const knex = this;

    function getTodayDateInIST() {
      const dateInIST = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      dateInIST.setDate(dateInIST.getDate() - 1);
      const formattedDate = dateInIST.toISOString().split("T")[0];
      return formattedDate;
    }

    const todayIST = getTodayDateInIST();

    const from_date = todayIST;
    const to_date = todayIST;
    const company_id = 1

    const query = knex
      .select([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE} as po_date`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
        `${REGION.NAME}.${REGION.COLUMNS.ID} as region_id`,
        `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME} as region_name`,
        knex.raw(
          `COUNT(${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID})
   AS po_generated_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.approval = 1) 
         AS po_approval_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.is_normal = true) 
         AS po_grn_normal_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.is_qty_mismatch = true) 
         AS po_grn_qty_mismatch_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.is_amendment = true) 
         AS po_iv_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.is_debit_note = true) 
         AS po_debit_note_count`
        ),
        knex.raw(
          `COUNT(*) FILTER (WHERE ${OUTLET_PO_MASTER.NAME}.is_memo_complete = true) 
         AS po_memo_count`
        ),
        knex.raw(
          `COUNT(${OUTLET_PURCHASE_MASTER.NAME}.id) AS po_grn_count`
        )
      ])
      .from(`${OUTLET_PO_MASTER.NAME} as ${OUTLET_PO_MASTER.NAME}`)
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
      .leftJoin(`${OUTLET_PURCHASE_MASTER.NAME} as ${OUTLET_PURCHASE_MASTER.NAME}`, function () {
        this.on(
          `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
          '=',
          `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.PONO}`
        )
          .andOn(
            `${OUTLET_PURCHASE_MASTER.NAME}.${OUTLET_PURCHASE_MASTER.COLUMNS.OUTLET_ID}`,
            '=',
            `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`
          )
      })
      .where(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.COMPANY_ID}`,
        company_id
      )
      .whereNotIn(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.TYPE}`,
        ['manual']
      )
      .whereBetween(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}`,
        [from_date, to_date]
      )
      .groupBy([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
        `${REGION.NAME}.${REGION.COLUMNS.ID}`,
        `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}`
      ])
      .orderBy(`${REGION.NAME}.${REGION.COLUMNS.ID}`, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet PO Status List",
      logTrace
    });

    const response = await query

    function formatToDDMMYYYY(dateStr) {
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    }

    const poDateFormated = formatToDDMMYYYY(todayIST);

    const userEmailsDetails = await knex(KPN_FARM_FRESH_USER_EMAIL.NAME)
      .select([`${KPN_FARM_FRESH_USER_EMAIL.NAME}.${KPN_FARM_FRESH_USER_EMAIL.COLUMNS.USER_EMAIL}`])
      .where(KPN_FARM_FRESH_USER_EMAIL.COLUMNS.IS_ACTIVE, true)

    if (response.length) {


      if (userEmailsDetails.length) {

        const emailArray = userEmailsDetails.map(e => e.user_mail.trim());

        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          secure: false,
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
          },
          tls: { rejectUnauthorized: false }
        });

        const mailOptions = {
          from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
          to: emailArray.join(','),
          subject: 'Today DSD PO Status',
          html: dsdPoStatusEmailTemplate(response, poDateFormated)
        };

        setImmediate(() => {
          transporter.sendMail(mailOptions)
            .then(() => console.log('DSD PO status email sent'))
            .catch(err => console.error('Email failed', err));
        });
      }
    }

    return { success: true };

  }

  async function updateOutletDsdPoSendBackToFinanceRepo({ body, params, logTrace, userDetails }) {
    const knex = this;
    const { outlet_id, supplier_id, po_no, po_finance_remarks } = body;

    const query = knex(OUTLET_PO_MASTER.NAME)
      .where(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID, supplier_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.PO_NO, po_no)
      .first()

    const exists_response = await query;

    const po_assigned_by = exists_response?.po_assigned_by || 0

    if (!exists_response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "dsd po data not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${OUTLET_PO_MASTER.NAME}`)
      .where(OUTLET_PO_MASTER.COLUMNS.OUTLET_ID, outlet_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID, supplier_id)
      .andWhere(OUTLET_PO_MASTER.COLUMNS.PO_NO, po_no)
      .update({
        [OUTLET_PO_MASTER.COLUMNS.IS_FINANCE_APPROVAL]: false,
        [OUTLET_PO_MASTER.COLUMNS.IS_FINANCE_APPROVAL_BY]: 0,
        [OUTLET_PO_MASTER.COLUMNS.IS_AMENDMENT]: true,
        [OUTLET_PO_MASTER.COLUMNS.IS_AMENDMENT_APPROVAL_STATUS]: 0,
        [OUTLET_PO_MASTER.COLUMNS.IS_AMENDMENT_APPROVAL_BY]: 0,
        [OUTLET_PO_MASTER.COLUMNS.PO_FINANCE_SENDER_ID]: userDetails?.id,
        [OUTLET_PO_MASTER.COLUMNS.PO_FINANCE_SEND_DATE]: new Date(),
        [OUTLET_PO_MASTER.COLUMNS.PO_FINANCE_REMARKS]: po_finance_remarks
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating dsd po data",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    await knex(PO_FINANCE_SEND_BACK_LOGS.NAME).insert({
      [PO_FINANCE_SEND_BACK_LOGS.COLUMNS.PO_NO]: po_no,
      [PO_FINANCE_SEND_BACK_LOGS.COLUMNS.OUTLET_ID]: outlet_id,
      [PO_FINANCE_SEND_BACK_LOGS.COLUMNS.SUPPLIER_ID]: supplier_id,
      [PO_FINANCE_SEND_BACK_LOGS.COLUMNS.PO_SENDER_ID]: userDetails?.id,
      [PO_FINANCE_SEND_BACK_LOGS.COLUMNS.PO_RECEIVER_ID]: po_assigned_by,
      [PO_FINANCE_SEND_BACK_LOGS.COLUMNS.CREATED_BY]: userDetails?.id
    });

    return { success: true };
  }

  async function vendorPoApprovalEmailRepo({ logTrace }) {
    const knex = this;

    const poDetailsResponse = await knex(OUTLET_PO_MASTER.NAME)
      .distinct(
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`
      )
      .leftJoin(
        `${OUTLET_PO_DETAILS.NAME} as ${OUTLET_PO_DETAILS.NAME}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`
      )
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}`, new Date())
      .orderBy(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_NO}`, "ASC");

    if (!poDetailsResponse) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Auto Po Not Generated today",
        property: "po_no",
        code: "NOT_ACCEPTABLE"
      });
    }

    function safe(v) {
      try { return JSON.parse(v || "[]"); } catch { return []; }
    }

    const mailConfigDetails = await Promise.all(
      poDetailsResponse.map(async (po) => {
        const mailDataDetails = await knex(VENDOR_MAIL.NAME)
          .select(
            `${VENDOR_MAIL.COLUMNS.OUTLET_MAIL} as outlet_email`,
            `${VENDOR_MAIL.COLUMNS.BRAND_COMPANY_MAIL} as brand_company_email`,
            `${VENDOR_MAIL.COLUMNS.SUPPLIER_MAIL} as supplier_email`
          )
          .where(`${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.OUTLET_ID}`, po.outlet_id)
          .andWhere(`${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.SUPPLIER_ID}`, po.supplier_id)
          .andWhere(`${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.BRAND_COMPANY_ID}`, po.brand_company_id)
          .andWhere(`${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.IS_ACTIVE}`, true)
          .first();

        // 🔴 IGNORE if undefined
        if (!mailDataDetails) return null;

        return {
          po_no: String(po.po_no),
          outlet_id: Number(po.outlet_id),
          mailData: {
            brand_company_id: Number(po.brand_company_id),
            outlet_email: safe(mailDataDetails.outlet_email),
            brand_company_email: safe(mailDataDetails.brand_company_email),
            supplier_email: safe(mailDataDetails.supplier_email)
          }
        };
      })
    );

    return mailConfigDetails.filter(Boolean);
  }



  return {
    getoutletPurchaseOrderPono,
    getProductBySupplierRepo,
    postOutletPurchaseOrder,
    getOutletPurchaseOrderUnApprovedListRepo,
    getOutletPurchaseOrderApprovedItem,
    putOutletPurchaseOrderProductRepo,
    deleteOutletPurchaseOrderProductRepo,
    getAutopogeneraterRepo,
    getAutoPoBrandCompanyRepo,
    postOutletPurchaseOrderTemp,
    postOutletPurchaseOrderFinal,
    getOutletDsdPoStatusListRepo,
    getOutletDsdPoStatusListWithEmail,
    updateOutletDsdPoSendBackToFinanceRepo,
    vendorPoApprovalEmailRepo
  };
}

module.exports = OutletRepo
