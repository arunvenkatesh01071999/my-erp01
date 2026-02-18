const insertInBatches = async (
    trx,
    tableName,
    dataArray,
    conflictKeys,
    mergeObject = {},
    batchSize = 500
) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) return;

    // ✅ Step 1: Deduplicate based on conflictKeys
    const seen = new Set();
    const uniqueData = dataArray.filter(item => {
        const key = conflictKeys.map(k => item[k]).join("_");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    const totalBatches = Math.ceil(uniqueData.length / batchSize);

    // ✅ Step 2: Insert in batches
    for (let i = 0; i < uniqueData.length; i += batchSize) {
        const batch = uniqueData.slice(i, i + batchSize);

        await trx(tableName)
            .insert(batch)
            .onConflict(conflictKeys)
            .merge(mergeObject);

        console.log(
            `✅ Batch ${Math.floor(i / batchSize) + 1}/${totalBatches} inserted/updated (${batch.length} unique records)`
        );
    }
};

const updateInBatches = async (
    trx,
    tableName,
    dataArray,
    conflictKeys,   // e.g. ['id']
    mergeObject = {}, // common values to merge for all rows (like updated_by, updated_at)
    batchSize = 500
) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) return;

    const totalBatches = Math.ceil(dataArray.length / batchSize);

    for (let i = 0; i < dataArray.length; i += batchSize) {
        const batch = dataArray.slice(i, i + batchSize);

        for (const row of batch) {
            // Build where clause based on conflictKeys
            let query = trx(tableName);
            conflictKeys.forEach((key) => {
                query = query.where(key, row[key]);
            });

            // Merge row-specific values + common values
            const updateData = {
                ...row,
                ...mergeObject,
            };

            await query.update(updateData);
        }

        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}/${totalBatches} updated (${batch.length} records)`);
    }
};

function markInvalidCodes(excelData, invalidCodes) {
  return excelData.map(item => {
    if (invalidCodes.includes(item.Product_Code)) {
      return {
        ...item,
        Product_Code: {
          value: item.Product_Code,
          error: true
        }
      };
    }
    return item;
  });
}

function normalize(str) {
  return String(str)
    .trim()          // remove leading/trailing spaces
    .toLowerCase()   // make lowercase
    .replace(/\s+/g, " "); // normalize multiple spaces
}

async function fetchInChunks(ids, chunkSize, callback) {
    const result = [];

    for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        const rows = await callback(chunk);
        result.push(...rows);
    }

    return result;
}

async function validateBarcodeDB(knex, uploadedBarcodes, dbProductCodes) {
    const cleanedBarcodes = uploadedBarcodes
        .map(b => String(b || "").trim())
        .filter(b => b !== "");  // skip empty strings

    if (cleanedBarcodes.length === 0) return [];

    const BARCODE_TABLE = "barcode_list"; // change to your table
    const COL_BARCODE = "barcode";
    const COL_PRODUCT = "product_code";

    const dbRows = await fetchInChunks(cleanedBarcodes, 500, async (chunk) => {
        return await knex(BARCODE_TABLE)
            .select(COL_BARCODE, COL_PRODUCT)
            .whereIn(COL_BARCODE, chunk);
    });

    const invalid = [];

    for (const row of dbRows) {
        const barcode = row[COL_BARCODE];
        const productCode = row[COL_PRODUCT];

        // If barcode exists but product is NOT allowed → error
        if (!dbProductCodes.includes(productCode)) {
            invalid.push(barcode);
        }
    }

    return invalid;
}

function findDuplicateBarcodes(barcodes) {
    const seen = new Set();
    const duplicates = new Set();

    for (const code of barcodes) {
        const barcode = String(code || "").trim();

        if (!barcode) continue; // skip empty

        if (seen.has(barcode)) {
            duplicates.add(barcode);
        } else {
            seen.add(barcode);
        }
    }

    return Array.from(duplicates);
}

function transformExcelResult({
    excelData,
    errorCodes = [],
    errorNames = [],
    errorCategoryNames = [],
    errorSubCategoryNames = [],
    errorBrandNames = [],
    errorBrandCompanyNames = [],
    errorUOMNames = [],
    errorMerchantCategoryNames = [],
    errorBarcodes = []
}) {
    const normalize = (v) => String(v || "").trim().toLowerCase();
    const safeString = (v) => (v === undefined || v === null ? "" : String(v).trim());

    return excelData.map((item) => {
        let rowHasError = false;

        // Build barcode field error objects
        const barcodeFields = {};
        const barcodeKeys = ["Barcode", "Barcode1", "Barcode2", "Barcode3", "Barcode4"];

        for (const key of barcodeKeys) {
            const value = safeString(item[key]);

            // 🔥 Skip empty barcode values — NO ERROR
            if (!value) {
                barcodeFields[key] = { value, error: false };
                continue;
            }

            // Only check errors for non-empty values
            const hasError = errorBarcodes.some(
                (e) => normalize(e.barcode) === normalize(value)
            );

            if (hasError) rowHasError = true;

            barcodeFields[key] = { value, error: hasError };
        }


        const row = {
            ...item,

            Product_Code: {
                value: safeString(item.Product_Code),
                error: errorCodes.includes(safeString(item.Product_Code))
            },

            Product_Name: {
                value: safeString(item.Product_Name),
                error: errorNames.some(
                    (name) => normalize(name) === normalize(item.Product_Name)
                )
            },

            MRP: { value: safeString(item.MRP), error: false },
            CESS: { value: safeString(item.CESS), error: false },
            GST: { value: safeString(item.GST), error: false },

            Main_Category: {
                value: safeString(item.Main_Category),
                error: errorCategoryNames.some(
                    (name) => normalize(name) === normalize(item.Main_Category)
                )
            },

            Sub_Category: {
                value: safeString(item.Sub_Category),
                error: errorSubCategoryNames.some((entry) => {
                    const subName = typeof entry === "string" ? entry : entry.subName;
                    return normalize(subName) === normalize(item.Sub_Category);
                })
            },

            Merchandise: {
                value: safeString(item.Merchandise),
                error: errorMerchantCategoryNames.some(
                    (name) => normalize(name) === normalize(item.Merchandise)
                )
            },

            Brand: {
                value: safeString(item.Brand),
                error: errorBrandNames.some(
                    (name) => normalize(name) === normalize(item.Brand)
                )
            },

            BrandCompany: {
                value: safeString(item.BrandCompany),
                error: errorBrandCompanyNames.some(
                    (name) => normalize(name) === normalize(item.BrandCompany)
                )
            },

            Unit: {
                value: safeString(item.Unit),
                error: errorUOMNames.some(
                    (name) => normalize(name) === normalize(item.Unit)
                )
            },

            HSN: { value: safeString(item.HSN), error: false },
            Batch: { value: safeString(item.Batch), error: false },

            // include barcode errors
            ...barcodeFields
        };

        // 🔥 If ANY field has error → make row.error = true
        for (const key in row) {
            if (row[key]?.error === true) {
                rowHasError = true;
                break;
            }
        }

        row.error = rowHasError;

        return row;
    });
}


module.exports = {
    insertInBatches,
    updateInBatches,
    markInvalidCodes,
    normalize,
    validateBarcodeDB,
    findDuplicateBarcodes,
    transformExcelResult
}
