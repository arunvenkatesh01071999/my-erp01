const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { OUTLET_CLOSING_STOCKS } = require("../commons/constants");
const { OUTLET_PRODUCT_MAPPING } = require("../../catalog/commons");
const excelImportRepo = require("../../Excelupload/repository/excelmport");
const _ = require("lodash");

function ClosingStockRepo(fastify) {


  async function postOutletClosingStocksRepo({ body, params, logTrace, userDetails }) {
    const knex = this;
    let outlet_closing_stocks = [];

    const outlet_id = body.outlet_id?.value || body.outlet_id;
    const docdate = body.docdate?.value || body.docdate;


    
    if (!outlet_id) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "outlet_id is required",
        code: "INVALID_INPUT"
      });
    }


    if (body.excelfile) {

      const { uploadExcelData } = excelImportRepo(fastify);

      const excelColumnData = await uploadExcelData.call(knex, {
        body,
        params,
        logTrace
      });

      const { headers, data } = excelColumnData;

      const requiredColumns = ["CODE", "QTY"];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));

      if (missingColumns.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Missing required columns: ${missingColumns.join(", ")}`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // remove empty rows
      const cleanedExcelData = data.filter(row =>
        row &&
        Object.values(row).some(v =>
          v !== null && v !== undefined && String(v).trim() !== ""
        )
      );

      // validate rows
      cleanedExcelData.forEach((row, index) => {
        if (!Number.isFinite(Number(row.CODE))) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Row ${index + 1}: CODE must be numeric`,
            code: "EXCEL_IMPORT_FAILED"
          });
        }

        if (!Number.isFinite(Number(row.QTY))) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Row ${index + 1}: QTY must be numeric`,
            code: "EXCEL_IMPORT_FAILED"
          });
        }
      });

      const productCodes = [...new Set(cleanedExcelData.map(r => String(r.CODE)))];

      const products = await knex(OUTLET_PRODUCT_MAPPING.NAME)
        .select(
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID} as outlet_product_id`,
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE} as product_code`,
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_RATE} as purchase_rate`,
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE} as sales_rate`,
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.MRP} as mrp`,
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as computer_qty`
        )
        .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE, productCodes)
        .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outlet_id);

        console.log(products,"products");
        
      const productMap = {};
      products.forEach(p => {
        productMap[String(p.product_code)] = p;
      });

      const invalidCodes = productCodes.filter(code => !productMap[code]);
      if (invalidCodes.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Invalid product codes: ${invalidCodes.join(", ")}`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      outlet_closing_stocks = cleanedExcelData.map(row => {
        console.log(row,"row");
        
        const product = productMap[String(row.CODE)];

        return {
          docdate: docdate,
          prodid: product.outlet_product_id,
          physical_qty: Number(row.QTY),
          computer_qty: Number(product.computer_qty) || 0,
          purchase_rate: Number(product.purchase_rate) || 0,
          sales_rate: Number(product.sales_rate) || 0,
          mrp: Number(product.mrp) || 0,
          outlet_id,
          company_id: body.company_id || 1,
          created_by: userDetails?.id
        };
      });
    }


    else if (Array.isArray(body.outlet_closing_stocks)) {

      const productCodes = body.outlet_closing_stocks.map(r =>
        String(r.product_code)
      );

      const products = await knex(OUTLET_PRODUCT_MAPPING.NAME)
        .select(
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID} as outlet_product_id`,
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE} as product_code`,
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_RATE} as purchase_rate`,
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE} as sales_rate`,
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.MRP} as mrp`,
          `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as computer_qty`
        )
        .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE, productCodes)
        .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outlet_id);

      const productMap = {};
      products.forEach(p => {
        productMap[String(p.product_code)] = p;
      });

      outlet_closing_stocks = body.outlet_closing_stocks.map(row => {
        const product = productMap[String(row.product_code)];

        if (!product) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Invalid product code: ${row.product_code}`,
            code: "INVALID_INPUT"
          });
        }

        return {
          docdate: docdate,
          prodid: product.outlet_product_id,
          physical_qty: Number(row.physical_qty),
          computer_qty: Number(product.computer_qty) || 0,
          purchase_rate: Number(product.purchase_rate) || 0,
          sales_rate: Number(product.sales_rate) || 0,
          mrp: Number(product.mrp) || 0,
          outlet_id,
          company_id: body.company_id || 1,
          created_by: userDetails?.id
        };
      });
    }

    if (!Array.isArray(outlet_closing_stocks) || outlet_closing_stocks.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "No outlet closing stock data provided",
        code: "INVALID_INPUT"
      });
    }

     await knex(OUTLET_CLOSING_STOCKS.NAME).insert(outlet_closing_stocks);


    return {
      success: true
    };
  }

  return {
    postOutletClosingStocksRepo
  };
}

module.exports = ClosingStockRepo;
