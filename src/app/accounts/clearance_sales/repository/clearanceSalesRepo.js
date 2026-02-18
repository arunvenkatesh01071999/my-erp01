const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { CLEARANCE_SALES } = require("../commons/constants")
const excelImportRepo = require("../../../Excelupload/repository/excelmport")
const { OUTLET_PRODUCT_MAPPING, ITEM, TYPEDESIGN } = require("../../../catalog/commons");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");


function getClearanceSalesProductRepo(fastify) {


  async function postClearanceSalesProduct({ params, body, logTrace, userDetails }) {
    const knex = this;

    const successfulInserts = [];
    const failedInserts = [];

    const outlet_id = body.outlet_id?.value || body.outlet_id;
    const company_id = body.company_id?.value || 1;

    const pushError = ({ index, message, payload }) => {
      failedInserts.push({
        row: index + 1,
        message,
        payload
      });
    };

    const getDbErrorMessage = (err) => {
      switch (err.code) {
        case "23505":
          return "Duplicate product found in clearance sale";
        case "23503":
          return "Invalid product or outlet reference";
        case "22P02":
          return "Invalid number format";
        default:
          return "Failed to save clearance sale product";
      }
    };

    /* =======================================================
       STEP 1: LOAD DATA (EXCEL OR JSON)
       ======================================================= */

    let excelColumns = [];
    let excelData = [];

    if (body.excelfile) {
      // -------- Excel Upload --------
      const { uploadExcelData } = excelImportRepo(fastify);
      const result = await uploadExcelData.call(knex, { body, params, logTrace });

      excelColumns = result.headers;
      excelData = result.data;

    } else if (Array.isArray(body.products)) {
      // -------- JSON Upload --------
      if (!body.products.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "Products array cannot be empty",
          code: "INVALID_INPUT"
        });
      }

      excelColumns = Object.keys(body.products[0]);
      excelData = body.products;

    } else {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "Either Excel file or products array is required",
        code: "INVALID_INPUT"
      });
    }

    /* =======================================================
       STEP 2: COLUMN VALIDATION
       ======================================================= */

    const allowedColumns = [
      "Product_Code",
      "Product_Name",
      "MRP",
      "Srate",
      "Cqty",
      "Barcode"
    ];

    const missingColumns = allowedColumns.filter(col => !excelColumns.includes(col));
    if (missingColumns.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `Missing columns: ${missingColumns.join(", ")}`,
        code: "IMPORT_FAILED"
      });
    }

    const extraColumns = excelColumns.filter(col => !allowedColumns.includes(col));
    if (extraColumns.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `Invalid columns: ${extraColumns.join(", ")}`,
        code: "IMPORT_FAILED"
      });
    }

    /* =======================================================
       STEP 3: CLEAN EMPTY ROWS
       ======================================================= */

    const cleanedExcelData = excelData.filter(row =>
      Object.values(row || {}).some(
        v => v !== null && v !== undefined && String(v).trim() !== ""
      )
    );

    if (!cleanedExcelData.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "No valid rows found to insert",
        code: "IMPORT_FAILED"
      });
    }

    /* =======================================================
       STEP 4: ROW LEVEL VALIDATION
       ======================================================= */

    cleanedExcelData.forEach((row, index) => {
      if (isNaN(row.Product_Code)) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Row ${index + 1}: Product_Code must be numeric`,
          code: "IMPORT_FAILED"
        });
      }

      ["MRP", "Srate", "Cqty"].forEach(field => {
        if (isNaN(row[field])) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Row ${index + 1}: ${field} must be numeric`,
            code: "IMPORT_FAILED"
          });
        }
      });
    });

    /* =======================================================
       STEP 5: DUPLICATE PRODUCT_CODE CHECK (INPUT LEVEL)
       ======================================================= */

    const codes = cleanedExcelData.map(r => String(r.Product_Code));
    const duplicateCodes = codes.filter((c, i) => codes.indexOf(c) !== i);

    if (duplicateCodes.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `Duplicate Product_Code found: ${[
          ...new Set(duplicateCodes)
        ].join(", ")}`,
        code: "IMPORT_FAILED"
      });
    }

    /* =======================================================
       STEP 6: MASTER DATA FETCH
       ======================================================= */

    const doc_time = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

    const { maxDocNo } = await knex(CLEARANCE_SALES.NAME)
      .max(`${CLEARANCE_SALES.COLUMNS.DOC_NO} as maxDocNo`)
      .first();

    const nextDocNo = (maxDocNo || 0) + 1;

    const outletProducts = await knex(OUTLET_PRODUCT_MAPPING.NAME)
      .select(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE)
      .where({
        [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
        [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: company_id,
        [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true
      });

    const productCodeSet = new Set(
      outletProducts.map(p => String(p.pro_code))
    );

    const existingClearanceProducts = await knex(CLEARANCE_SALES.NAME)
      .select(
        CLEARANCE_SALES.COLUMNS.PROD_CODE,
        CLEARANCE_SALES.COLUMNS.MRP,
        CLEARANCE_SALES.COLUMNS.SRATE
      )
      .where({
        [CLEARANCE_SALES.COLUMNS.COMPANY_ID]: company_id,
        [CLEARANCE_SALES.COLUMNS.OUTLET_ID]: outlet_id
      })
      .whereNot(
        CLEARANCE_SALES.COLUMNS.UQTY,
        knex.ref(CLEARANCE_SALES.COLUMNS.CQTY)
      );

    const existingProductKeySet = new Set(
      existingClearanceProducts.map(
        p => `${p.prod_code}|${Number(p.mrp)}|${Number(p.srate)}`
      )
    );

    /* =======================================================
       STEP 7: INSERT LOOP
       ======================================================= */

    for (let i = 0; i < cleanedExcelData.length; i++) {
      const row = cleanedExcelData[i];

      const prodCode = String(row.Product_Code);
      const mrp = Number(row.MRP);
      const srate = Number(row.Srate);
      const productKey = `${prodCode}|${mrp}|${srate}`;

      try {
        if (!productCodeSet.has(prodCode)) {
          pushError({
            index: i,
            message: "Product not mapped to outlet",
            payload: { prodCode }
          });
          continue;
        }

        if (existingProductKeySet.has(productKey)) {
          pushError({
            index: i,
            message: "Product already exists in clearance sale",
            payload: { prodCode }
          });
          continue;
        }

        await knex(CLEARANCE_SALES.NAME).insert({
          [CLEARANCE_SALES.COLUMNS.DOC_NO]: nextDocNo,
          [CLEARANCE_SALES.COLUMNS.DOC_DATE]: new Date(),
          [CLEARANCE_SALES.COLUMNS.DOC_TIME]: doc_time,
          [CLEARANCE_SALES.COLUMNS.COMPANY_ID]: company_id,
          [CLEARANCE_SALES.COLUMNS.WH_ID]: 1,
          [CLEARANCE_SALES.COLUMNS.OUTLET_ID]: outlet_id,
          [CLEARANCE_SALES.COLUMNS.PROD_CODE]: prodCode,
          [CLEARANCE_SALES.COLUMNS.PRODUCT_NAME]: row.Product_Name,
          [CLEARANCE_SALES.COLUMNS.BARCODE]: row.Barcode,
          [CLEARANCE_SALES.COLUMNS.MRP]: mrp,
          [CLEARANCE_SALES.COLUMNS.SRATE]: srate,
          [CLEARANCE_SALES.COLUMNS.CQTY]: row.Cqty,
          [CLEARANCE_SALES.COLUMNS.CREATED_BY]: userDetails.id
        });

        successfulInserts.push({
          row: i + 1,
          prod_code: prodCode,
          prod_name: row.Product_Name
        });

        existingProductKeySet.add(productKey);

      } catch (err) {
        pushError({
          index: i,
          message: getDbErrorMessage(err),
          payload: { prodCode }
        });
      }
    }

    /* =======================================================
       FINAL RESPONSE
       ======================================================= */

    return {
      success: true,
      successfulInserts,
      failedInserts
    };
  }



  async function deleteClearanceSalesProduct({ doc_no, outlet_id, body, logTrace, userDetails }) {
    const knex = this;

    const existingClearanceSales = await knex(CLEARANCE_SALES.NAME)
      .where(CLEARANCE_SALES.COLUMNS.DOC_NO, doc_no)
      .andWhere(CLEARANCE_SALES.COLUMNS.OUTLET_ID, outlet_id)
      .first();

    if (!existingClearanceSales) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "clearance sales data not found",
        property: "",
        code: "NOT_ACCEPTABLE",
      });
    }

    await knex(CLEARANCE_SALES.NAME)
      .where(CLEARANCE_SALES.COLUMNS.DOC_NO, doc_no)
      .andWhere(CLEARANCE_SALES.COLUMNS.OUTLET_ID, outlet_id)
      .del();

    return {
      success: true,
      message: "Clearance sales data deleted successfully"
    };
  }

  async function getClearanceSalesProduct({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${CLEARANCE_SALES.NAME}.*`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`
      ])
      .from(`${CLEARANCE_SALES.NAME} as ${CLEARANCE_SALES.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${CLEARANCE_SALES.NAME}.${CLEARANCE_SALES.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .whereRaw(
        `DATE(${CLEARANCE_SALES.NAME}.${CLEARANCE_SALES.COLUMNS.DOC_DATE}) >= ?`,
        [params.from_date]
      )
      .whereRaw(
        `DATE(${CLEARANCE_SALES.NAME}.${CLEARANCE_SALES.COLUMNS.DOC_DATE}) <= ?`,
        [params.to_date]
      )
      .orderBy(`${CLEARANCE_SALES.NAME}.${CLEARANCE_SALES.COLUMNS.ID}`, "DESC");


    if (Number(params.outlet_id) && Number(params.outlet_id) !== 0) {
      query.where(
        `${CLEARANCE_SALES.NAME}.${CLEARANCE_SALES.COLUMNS.OUTLET_ID}`,
        params.outlet_id
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Sales",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Clearance Sales data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return { data: response };
  }

  async function getClearanceSalesProductByDocno({ body, params, logTrace }) {
    const knex = this;
    const { doc_no, outlet_id } = params

    const query = knex
      .select(
        `${CLEARANCE_SALES.NAME}.*`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`
      )
      .from(`${CLEARANCE_SALES.NAME} as ${CLEARANCE_SALES.NAME}`)
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${CLEARANCE_SALES.NAME}.${CLEARANCE_SALES.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .where(
        `${CLEARANCE_SALES.NAME}.${CLEARANCE_SALES.COLUMNS.DOC_NO}`,
        doc_no
      )
      .andWhere(
        `${CLEARANCE_SALES.NAME}.${CLEARANCE_SALES.COLUMNS.OUTLET_ID}`,
        outlet_id
      )
      .first();

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Sales",
      logTrace
    });
    const response = await query;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Clearance Sales data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function putClearanceSalesProduct({ params, body, logTrace, userDetails }) {
    const knex = this;

    const successfulUpdates = [];
    const failedUpdates = [];

    const outlet_id = body.outlet_id?.value || body.outlet_id;
    const company_id = body.company_id?.value || 1;

    const pushError = ({ index, message, payload }) => {
      failedUpdates.push({
        row: index + 1,
        message,
        payload
      });
    };

    /* =======================================================
       STEP 1: LOAD DATA (EXCEL OR JSON)
       ======================================================= */

    let excelColumns = [];
    let excelData = [];

    if (body.excelfile) {
      // -------- Excel Upload --------
      const { uploadExcelData } = excelImportRepo(fastify);
      const result = await uploadExcelData.call(knex, { body, params, logTrace });

      excelColumns = result.headers;
      excelData = result.data;

    } else if (Array.isArray(body.products)) {
      // -------- JSON Upload --------
      if (!body.products.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "Products array cannot be empty",
          code: "INVALID_INPUT"
        });
      }

      excelColumns = Object.keys(body.products[0]);
      excelData = body.products;

    } else {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "Either Excel file or products array is required",
        code: "INVALID_INPUT"
      });
    }

    /* =======================================================
       STEP 2: COLUMN VALIDATION
       ======================================================= */

    const allowedColumns = [
      "Product_Code",
      "Product_Name",
      "MRP",
      "Srate",
      "Cqty",
      "Barcode"
    ];

    const missingColumns = allowedColumns.filter(col => !excelColumns.includes(col));
    if (missingColumns.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `Missing columns: ${missingColumns.join(", ")}`,
        code: "IMPORT_FAILED"
      });
    }

    const extraColumns = excelColumns.filter(col => !allowedColumns.includes(col));
    if (extraColumns.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `Invalid columns: ${extraColumns.join(", ")}`,
        code: "IMPORT_FAILED"
      });
    }

    /* =======================================================
       STEP 3: CLEAN EMPTY ROWS
       ======================================================= */

    const cleanedExcelData = excelData.filter(row =>
      Object.values(row || {}).some(
        v => v !== null && v !== undefined && String(v).trim() !== ""
      )
    );

    if (!cleanedExcelData.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "No valid rows found to update",
        code: "IMPORT_FAILED"
      });
    }

    /* =======================================================
       STEP 4: ROW LEVEL VALIDATION
       ======================================================= */

    cleanedExcelData.forEach((row, index) => {
      if (isNaN(row.Product_Code)) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Row ${index + 1}: Product_Code must be numeric`,
          code: "IMPORT_FAILED"
        });
      }

      ["MRP", "Srate", "Cqty"].forEach(field => {
        if (isNaN(row[field])) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Row ${index + 1}: ${field} must be numeric`,
            code: "IMPORT_FAILED"
          });
        }
      });
    });

    /* =======================================================
       STEP 5: EXISTING CLEARANCE DATA
       ======================================================= */

    const existingClearanceProducts = await knex(CLEARANCE_SALES.NAME)
      .select(
        CLEARANCE_SALES.COLUMNS.ID,
        CLEARANCE_SALES.COLUMNS.PROD_CODE
      )
      .where({
        [CLEARANCE_SALES.COLUMNS.COMPANY_ID]: company_id,
        [CLEARANCE_SALES.COLUMNS.OUTLET_ID]: outlet_id
      })
      .whereNot(
        CLEARANCE_SALES.COLUMNS.UQTY,
        knex.ref(CLEARANCE_SALES.COLUMNS.CQTY)
      );

    const clearanceMap = new Map(
      existingClearanceProducts.map(p => [String(p.prod_code), p.id])
    );

    /* =======================================================
       STEP 6: UPDATE LOOP
       ======================================================= */

    for (let i = 0; i < cleanedExcelData.length; i++) {
      const row = cleanedExcelData[i];

      const prodCode = String(row.Product_Code);
      const clearanceId = clearanceMap.get(prodCode);

      if (!clearanceId) {
        pushError({
          index: i,
          message: "Clearance product not found for update",
          payload: { prodCode }
        });
        continue;
      }

      const updatePayload = {
        [CLEARANCE_SALES.COLUMNS.PRODUCT_NAME]: row.Product_Name,
        [CLEARANCE_SALES.COLUMNS.BARCODE]: row.Barcode,
        [CLEARANCE_SALES.COLUMNS.MRP]: Number(row.MRP),
        [CLEARANCE_SALES.COLUMNS.SRATE]: Number(row.Srate),
        [CLEARANCE_SALES.COLUMNS.CQTY]: Number(row.Cqty),
        [CLEARANCE_SALES.COLUMNS.UPDATED_BY]: userDetails.id,
        [CLEARANCE_SALES.COLUMNS.UPDATED_AT]: new Date()
      };

      const updatedCount = await knex(CLEARANCE_SALES.NAME)
        .where({
          [CLEARANCE_SALES.COLUMNS.ID]: clearanceId,
          [CLEARANCE_SALES.COLUMNS.COMPANY_ID]: company_id,
          [CLEARANCE_SALES.COLUMNS.OUTLET_ID]: outlet_id
        })
        .update(updatePayload);

      if (!updatedCount) {
        pushError({
          index: i,
          message: "Update failed",
          payload: { prodCode }
        });
        continue;
      }

      successfulUpdates.push({
        row: i + 1,
        prod_code: prodCode,
        prod_name: row.Product_Name
      });
    }

    /* =======================================================
       FINAL RESPONSE
       ======================================================= */

    return {
      success: true,
      successfulUpdates,
      failedUpdates
    };
  }



  return {
    postClearanceSalesProduct,
    putClearanceSalesProduct,
    deleteClearanceSalesProduct,
    getClearanceSalesProduct,
    getClearanceSalesProductByDocno
  };
}

module.exports = getClearanceSalesProductRepo;
