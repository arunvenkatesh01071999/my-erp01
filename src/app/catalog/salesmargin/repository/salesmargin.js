const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const _ = require("lodash")
const { SUPPLIER, SUPPLIER_LOGS, PURCHASE_MASTER, VENDORS_MAPPING, COMPANY, ITEM, MAIN_CATEGORY, HEADS, SALES_MARGIN, SALES_MARGIN_LOGS, SALES_MARGIN_NEW, SALES_MARGIN_NEW_LOGS } = require("../commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { PURCHASE_FMCG_MASTER, PURCHASE_FMCG_DETAILS } = require("../../../purchase/commons");
const { TYPEDESIGN } = require("../../commons");

function saleMarginRepo(fastify) {

  async function postSalesMargin({ params, body, logTrace, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();

    try {
      if (_.isArray(body.sales_margin_details) && body.sales_margin_details.length > 0) {
        const saleMarginDetailsData = _.map(body.sales_margin_details, (element) => ({
          [SALES_MARGIN.COLUMNS.PRODUCT_ID]: element.product_id,
          [SALES_MARGIN.COLUMNS.PRODUCT_CODE]: element.product_code,
          [SALES_MARGIN.COLUMNS.PRODUCT_NAME]: element.product_name,
          [SALES_MARGIN.COLUMNS.HEAD_ID]: element.brand_id,
          [SALES_MARGIN.COLUMNS.CATEGORY_ID]: element.main_catgory_id,
          [SALES_MARGIN.COLUMNS.HEAD_NAME]: element.brand_name,
          [SALES_MARGIN.COLUMNS.CATEGORY_NAME]: element.category_name,
          [SALES_MARGIN.COLUMNS.COST_PRICE]: element.cost_price,
          [SALES_MARGIN.COLUMNS.GST]: element.gst,
          [SALES_MARGIN.COLUMNS.CESS]: element.cess,
          [SALES_MARGIN.COLUMNS.MARGIN]: element.margin,
          [SALES_MARGIN.COLUMNS.SALES_RATE]: element.sales_rate,
          [SALES_MARGIN.COLUMNS.MRP]: element.mrp,
          [SALES_MARGIN.COLUMNS.ACCEPTED_MARGIN]: element.accept_margin,
          [SALES_MARGIN.COLUMNS.GRN_MARGIN]: element.grn_margin,
          [SALES_MARGIN.COLUMNS.SALES_MARGIN]: element.sales_margin,
          [SALES_MARGIN.COLUMNS.DISCOUNT]: element.discount,
          [SALES_MARGIN.COLUMNS.CREATED_AT]: new Date(),
          [SALES_MARGIN.COLUMNS.CREATED_BY]: userDetails.id,
          [SALES_MARGIN.COLUMNS.UPDATED_AT]: new Date(),
          [SALES_MARGIN.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        // Step 2: Update Item Stock
        if (_.isArray(saleMarginDetailsData)) {
          await Promise.all(
            _.map(saleMarginDetailsData, async (element) => {
              const updateData = {
                [ITEM.COLUMNS.SALE_RATE]: parseFloat(element.sales_rate) || 0,
                [ITEM.COLUMNS.WAREHOUSE_MARGIN]: parseFloat(element.margin) || 0,
                [ITEM.COLUMNS.SALES_MARGIN]: parseFloat(element.sales_margin) || 0,
                [ITEM.COLUMNS.DISCOUNT]: parseFloat(element.discount) || 0
              };

              if (parseFloat(element.mrp) > 0) {
                updateData[ITEM.COLUMNS.PURCHASE_RATE] = parseFloat(element.cost_price);
                updateData[ITEM.COLUMNS.MRP] = parseFloat(element.mrp);
                updateData[ITEM.COLUMNS.WAREHOUSE_MARGIN] = parseFloat(element.margin);
              }

              await trx(ITEM.NAME)
                .where(ITEM.COLUMNS.ID, element.product_id)
                .update(updateData)
            })
          );
        }

      }

      await trx(SALES_MARGIN_LOGS.NAME).insert({
        [SALES_MARGIN_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
        [SALES_MARGIN_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [SALES_MARGIN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [SALES_MARGIN_LOGS.COLUMNS.OPERATION_DATE]: new Date(),
        [SALES_MARGIN_LOGS.COLUMNS.OPERATION_TIME]: new Date().toTimeString().split(' ')[0]
      });

      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback();
      console.log("postSalesMargin error", error);
      throw new Error("Failed to insert sales margin data");
    }
  }


  async function getSaleMarginList({ logTrace, queryString }) {
    const knex = this;
    const { category_id, brand_id, supplier_id, company_brand_id } = queryString;
    const query = knex
      .distinct([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID} as brand_id`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as brand_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID} as company_brand_id`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as company_brand_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as product_code`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE} as cost_price`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SALE_RATE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.DISCOUNT}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.SALES_MARGIN}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MARGIN}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.WAREHOUSE_MARGIN}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.GST}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        `${VENDORS_MAPPING.NAME}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUPPLIER.NAME}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .orderBy(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, 'ASC') // or use `docdate` if available


    if (category_id) {
      query.where(
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`,
        Number(category_id)
      );
    }

    if (brand_id) {
      query.where(
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`,
        Number(brand_id)
      );
    }

    if (supplier_id) {
      query.where(
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`,
        Number(supplier_id)
      );
    }

    if (company_brand_id) {
      query.where(
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`,
        Number(company_brand_id)
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Product Details",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product Details not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const productIds = response.map(p => p.product_id);

    const latestPurchasePrices = await knex
      .select(
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID} as product_id`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.RATE} as cost_price`
      )
      .from(`${PURCHASE_FMCG_MASTER.NAME} as ${PURCHASE_FMCG_MASTER.NAME}`)
      .leftJoin(
        `${PURCHASE_FMCG_DETAILS.NAME} as ${PURCHASE_FMCG_DETAILS.NAME}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`
      )
      .whereIn(`${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID}`, productIds)
      .orderBy(`${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`, 'DESC')

    // Reduce to latest cost per product_id
    const latestCostMap = {};
    for (const detail of latestPurchasePrices) {
      if (!latestCostMap[detail.product_id]) {
        latestCostMap[detail.product_id] = detail.cost_price;
      }
    }

    const purchaseDetails = _.map(response, (element => {
      const cost_price = latestCostMap[element.product_id]
        ? Number(latestCostMap[element.product_id])
        : Number(element.cost_price);
      let margin = Number(element.warehouse_margin);
      let sale_rate = Number(element.sale_rate);
      const mrp = Number(element.mrp) === 0 ? Number(element.sale_rate) : Number(element.mrp);
      let accept_margin = Number(element.margin);
      let grn_margin = 0;
      let sales_margin = Number(element.sales_margin);
      let discount = Number(element.discount);
      let gst = Number(element.gst);
      let cess = Number(element.cess);
      let cpgst = 0;
      let pur_rate_gst = cost_price * gst / 100;
      let pur_rate_cess = cost_price * cess / 100;
      const totalTax = gst + cess;
      const totalPurRate = cost_price + pur_rate_gst + pur_rate_cess;
      // console.log(cost_price, "cost_price")
      // console.log(margin, "margin")
      // console.log(sale_rate, "sale_rate")
      // console.log(mrp, "mrp")
      // console.log(accept_margin, "accept_margin")
      // console.log(sales_margin, "sales_margin")
      // console.log(gst, "gst")
      // console.log(cess, "cess")
      // console.log(pur_rate_gst, "rate gst")
      // console.log(pur_rate_cess, "rate cess")
      // console.log(discount, "discount")


      //find GRN Margin
      if (Number(cost_price) === 0 || mrp === 0) {
        margin = 0;
      } else if (sales_margin > 0) {
        grn_margin = Math.round(((mrp - totalPurRate) / mrp) * 100 * 100) / 100;
        margin = Math.round((grn_margin - sales_margin) * 100) / 100;
        cpgst = mrp - (mrp * sales_margin / 100);
        cpgst = parseFloat(cpgst.toFixed(2));
        sale_rate = cpgst - (cpgst * totalTax / (100 + totalTax));
        sale_rate = parseFloat(sale_rate.toFixed(2));
      } else if (margin == 0) {
        grn_margin = Math.round(((mrp - totalPurRate) / mrp) * 100 * 100) / 100;
        sales_margin = ((mrp - (sale_rate + gst + cess)) / mrp) * 100;
        margin = grn_margin - sales_margin;
      } else {
        grn_margin = Math.round(((mrp - totalPurRate) / mrp) * 100 * 100) / 100;
        sales_margin = grn_margin - margin;
      }

      return {
        ...element,
        cost_price,
        margin,
        accept_margin,
        grn_margin,
        sales_margin,
        discount,
        sale_rate,
        mrp
      };
    }));

    return purchaseDetails;
  }

  async function postSalesMarginNew({ params, body, logTrace, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    try {
      if (_.isArray(body.sales_margin_new_details) && body.sales_margin_new_details.length > 0) {
        const saleMarginDetailsData = _.map(body.sales_margin_new_details, (element) => ({
          [SALES_MARGIN_NEW.COLUMNS.PRODUCT_ID]: element.product_id,
          [SALES_MARGIN_NEW.COLUMNS.PRODUCT_CODE]: element.product_code,
          [SALES_MARGIN_NEW.COLUMNS.PRODUCT_NAME]: element.product_name,
          [SALES_MARGIN_NEW.COLUMNS.TRANSPORT_KG]: element.transportKg,
          [SALES_MARGIN_NEW.COLUMNS.TRANSPORT]: element.transport,
          [SALES_MARGIN_NEW.COLUMNS.COVER]: element.cover,
          [SALES_MARGIN_NEW.COLUMNS.PRINTING]: element.printing,
          [SALES_MARGIN_NEW.COLUMNS.LABOUR]: element.labour,
          [SALES_MARGIN_NEW.COLUMNS.WASTAGE_PERCENTAGE]: element.wastage_percentage,
          [SALES_MARGIN_NEW.COLUMNS.MARGIN]: element.margin,
          [SALES_MARGIN_NEW.COLUMNS.WAREHOUSE_MARGIN]: element.warehouse_margin,
          [SALES_MARGIN_NEW.COLUMNS.BILLING_COST]: element.billing_cost,
          [SALES_MARGIN_NEW.COLUMNS.PROFIT]: element.profit,
          [SALES_MARGIN_NEW.COLUMNS.COMPANY_ID]: element.company_id,
          [SALES_MARGIN_NEW.COLUMNS.CREATED_AT]: new Date(),
          [SALES_MARGIN_NEW.COLUMNS.CREATED_BY]: userDetails.id,
          [SALES_MARGIN_NEW.COLUMNS.UPDATED_AT]: new Date(),
          [SALES_MARGIN_NEW.COLUMNS.UPDATED_BY]: userDetails.id
        }));
        console.log(saleMarginDetailsData, "sales margin new")
        // Step 2: Update Item Stock
        if (_.isArray(saleMarginDetailsData)) {
          await Promise.all(
            _.map(saleMarginDetailsData, async (element) => {
              const updateData = {};

              const billingCost = parseFloat(element.billing_cost || 0);
              const salesRate = parseFloat(element.sales_rate || 0);
              const mrp = parseFloat(element.mrp || 0);
              const cost_price = parseFloat(element.cost_price || 0);
              if (billingCost > 0 && salesRate > 0) {
                updateData[ITEM.COLUMNS.SALE_RATE] = billingCost;
                updateData[ITEM.COLUMNS.MRP] = mrp;
                updateData[ITEM.COLUMNS.OUTLET_RATE] = salesRate;
                updateData[ITEM.COLUMNS.PURCHASE_RATE] = cost_price;
              }

              // Only perform update if updateData has fields
              if (Object.keys(updateData).length > 0) {
                await trx(ITEM.NAME)
                  .where(ITEM.COLUMNS.ID, element.product_id)
                  .update(updateData);
              }
            })
          );
        }
      }

      await trx(SALES_MARGIN_NEW_LOGS.NAME).insert({
        [SALES_MARGIN_NEW_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
        [SALES_MARGIN_NEW_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [SALES_MARGIN_NEW_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [SALES_MARGIN_NEW_LOGS.COLUMNS.OPERATION_DATE]: new Date(),
        [SALES_MARGIN_NEW_LOGS.COLUMNS.OPERATION_TIME]: new Date().toTimeString().split(' ')[0]
      });

      await trx.commit();
      return { success: true };
    } catch (error) {
      await trx.rollback();
      console.log("postSalesMarginNew error", error);
      throw new Error("Failed to insert sales margin new data");
    }
  }


  async function getSaleMarginNewListRepo({ logTrace, queryString }) {
    const knex = this;
    const { category_id, brand_id, supplier_id, company_brand_id } = queryString;
    const query = knex
      .distinct([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID} as brand_id`,
        `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as brand_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID} as company_brand_id`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as company_brand_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as product_code`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_WEIGHT} as weight`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE_RATE} as cost_price`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MRP}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.GST}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.CESS}`,
        // `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
        // `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        // `${ITEM.NAME}.${ITEM.COLUMNS.SALE_RATE}`,
        // `${ITEM.NAME}.${ITEM.COLUMNS.DISCOUNT}`,
        // `${ITEM.NAME}.${ITEM.COLUMNS.SALES_MARGIN}`,
        // `${ITEM.NAME}.${ITEM.COLUMNS.MARGIN}`,
        // `${ITEM.NAME}.${ITEM.COLUMNS.WAREHOUSE_MARGIN}`,
      ])
      .from(`${ITEM.NAME} as ${ITEM.NAME}`)
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .leftJoin(
        `${HEADS.NAME} as ${HEADS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`
      )
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        `${VENDORS_MAPPING.NAME}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.PRODUCT_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUPPLIER.NAME}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .orderBy(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, 'ASC') // or use `docdate` if available


    if (category_id) {
      query.where(
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`,
        Number(category_id)
      );
    }

    if (brand_id) {
      query.where(
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`,
        Number(brand_id)
      );
    }

    if (supplier_id) {
      query.where(
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`,
        Number(supplier_id)
      );
    }

    if (company_brand_id) {
      query.where(
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`,
        Number(company_brand_id)
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Product Details",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product Details not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const purchaseDetails = _.map(response, (element => {
      const mrp = Number(element.mrp);
      const cost_price = Number(element.cost_price);
      let gst = Number(element.gst);
      let cess = Number(element.cess);
      const tax = gst + cess;
      return {
        ...element,
        cost_before: 0,
        tax,
        purchase_cost: 0,
        transportkg: 0,
        transport: 0,
        cover: 0,
        printing: 0,
        labour: 0,
        wastage_percentage: 0,
        purchase_cost1: 0,
        warehouse_margin: 0,
        billing_cost: 0,
        margin: 0,
        sale_rate: 0,
        profit: 0,
        cost_price,
        mrp
      };
    }));

    return purchaseDetails;
  }

  async function putSupplier({ supplier_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(SUPPLIER.NAME)
      .where(SUPPLIER.COLUMNS.ID, supplier_id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "supplier not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(SUPPLIER.NAME)
      .where(SUPPLIER.COLUMNS.SUPPLIER_NAME, body.supplier_name)
      .whereNot(SUPPLIER.COLUMNS.ID, supplier_id);

    const exists_response1 = await query1;
    console.log(exists_response1, "response1")
    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Suppiler Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${SUPPLIER.NAME}`)
      .where(`${SUPPLIER.COLUMNS.ID}`, supplier_id)
      .update({
        [SUPPLIER.COLUMNS.SUPPLIER_NAME]: body.supplier_name,
        [SUPPLIER.COLUMNS.SHORTNAME]: body.short_name,
        [SUPPLIER.COLUMNS.ADD1]: body.add1,
        [SUPPLIER.COLUMNS.ADD2]: body.add2,
        [SUPPLIER.COLUMNS.ADD3]: body.add3 || "",
        [SUPPLIER.COLUMNS.ADD4]: body.add4 || "",
        [SUPPLIER.COLUMNS.COMPANY_ID]: body.company_id,
        [SUPPLIER.COLUMNS.COUNTRY_ID]: body.country,
        [SUPPLIER.COLUMNS.STATE_ID]: body.state,
        [SUPPLIER.COLUMNS.CITY_ID]: body.city,
        [SUPPLIER.COLUMNS.PINCODE]: body.pincode,
        [SUPPLIER.COLUMNS.PHONE]: body.phone,
        [SUPPLIER.COLUMNS.MOBILE]: body.mobile,
        [SUPPLIER.COLUMNS.EMAIL]: body.email,
        [SUPPLIER.COLUMNS.WEBSITE]: body.website,
        [SUPPLIER.COLUMNS.GSTIN]: body.gstin,
        [SUPPLIER.COLUMNS.CUSTTYPE]: body.custtype,
        [SUPPLIER.COLUMNS.BANK_AC_NO]: body.bankacno,
        [SUPPLIER.COLUMNS.BANKNAME]: body.bankname,
        [SUPPLIER.COLUMNS.AC_NAME]: body.acname,
        [SUPPLIER.COLUMNS.IFSCCODE]: body.ifsccode,
        [SUPPLIER.COLUMNS.FSSAI]: body.fssai,
        [SUPPLIER.COLUMNS.OP_BAL]: body.op_bal,
        [SUPPLIER.COLUMNS.IS_ACTIVE]: body.is_active,
        [SUPPLIER.COLUMNS.CREATED_BY]: userDetails.id,
        [SUPPLIER.COLUMNS.UPDATED_BY]: userDetails.id
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating  supplier",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    // Update log entry
    await knex(SUPPLIER_LOGS.NAME).insert({
      [SUPPLIER_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [SUPPLIER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [SUPPLIER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_ID]: supplier_id,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_NAME]: String(body.supplier_name).trim()
    });

    return { success: true };
  }

  async function deleteSupplier({ supplier_id, body, logTrace, userDetails }) {
    const knex = this;
    const existssupplierquery = knex(SUPPLIER.NAME).
      where(SUPPLIER.COLUMNS.ID, supplier_id);

    const exists_response = await existssupplierquery;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "supplier not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const validationquery = knex(PURCHASE_MASTER.NAME).
      where(PURCHASE_MASTER.COLUMNS.PARTYCODE, supplier_id);

    const exists_response1 = await validationquery;
    console.log(exists_response1)
    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Cannot delete supplier,Associated with a purchase.",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query = knex(SUPPLIER.NAME)
      .where(SUPPLIER.COLUMNS.ID, supplier_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete supplier",
      logTrace
    });
    const response = await query;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "supplier not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Delete log entry
    await knex(SUPPLIER_LOGS.NAME).insert({
      [SUPPLIER_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [SUPPLIER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [SUPPLIER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_ID]: supplier_id,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_NAME]: String(exists_response[0].supplier_name).trim()
    });

    return { success: true };
  }


  async function getSupplierInfo({ params, logTrace }) {
    const knex = this;
    // const query = knex(SUPPLIER.NAME).where(SUPPLIER.COLUMNS.ID, params.id);

    const query = knex
      .select([
        `${SUPPLIER.NAME}.*`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`, params.supplier_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SUPPLIER Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SUPPLIER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }


  async function getSupplierByProducts({ logTrace }) {
    const knex = this;

    const query = knex
      .distinct([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN} as supplier_gstin`, // ✅ Fixed alias
        `${COMPANY.NAME}.${COMPANY.COLUMNS.GSTIN} as company_gstin`
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .innerJoin(
        `${VENDORS_MAPPING.NAME} as ${VENDORS_MAPPING.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`
      )
      .innerJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Supplier",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const updatedSupplierDetails = response.map((detail) => ({
      ...detail,
      gst: detail.supplier_gstin.slice(0, 2) === detail.company_gstin.slice(0, 2),
      igst: detail.supplier_gstin.slice(0, 2) !== detail.company_gstin.slice(0, 2),

    }));

    return updatedSupplierDetails;
  }


  return {
    postSalesMargin,
    getSaleMarginList,
    getSaleMarginNewListRepo,
    postSalesMarginNew,
    putSupplier,
    deleteSupplier,
    getSupplierInfo,
    getSupplierByProducts
  };
}

module.exports = saleMarginRepo;
