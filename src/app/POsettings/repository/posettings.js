const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler/handler");
const { logQuery } = require("../../commons/helpers");
const { POSETTINGS, POSETTINGSTEST, OUTLETS } = require("../commons/constants");
const { ITEM, OUTLET_PRODUCT_MAPPING } = require("../../catalog/item/commons/constants")
function grnRepo(fastify) {
  async function poSettingsPaginate({
    params,
    body,
    logTrace,
    page_size,
    current_page
  }) {
    const knex = this;
    const response = await knex.transaction(async trx => {
      const subQuery = knex
        .select(`*`)
        .distinct()
        .from(`${POSETTINGS.NAME} as ${POSETTINGS.NAME}`)
        .where(`${POSETTINGS.NAME}.${POSETTINGS.COLUMNS.LOCID}`, body.Locid)
        .where(`${POSETTINGS.NAME}.${POSETTINGS.COLUMNS.FLAG}`, body.Flag)
        .as("distinctPOSettings");

      const query = knex.select("*").from(subQuery);

      logQuery({
        logger: fastify.log,
        query,
        context: "Get POSettings list details",
        logTrace
      });

      const dcs = await query.orderBy(POSETTINGS.COLUMNS.CODE, "ASC").paginate({
        pageSize: page_size, // Customize as needed
        currentPage: current_page // Customize as needed
      });

      if (!dcs.data.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "DC data not found",
          property: "",
          code: "NOT_FOUND"
        });
      }
      return {
        ...dcs,
        meta: dcs.meta
      };
    });

    return response;
  }
  async function poSettingsFlag({ body, params, logTrace, userDetails }) {
    const knex = this;
    const query = knex(POSETTINGS.NAME)
      .where(POSETTINGS.COLUMNS.LOCID, body.Locid)
      .where(POSETTINGS.COLUMNS.CODE, body.Code)
      .whereNot(POSETTINGS.COLUMNS.FLAG, body.Flag);
    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "POSettings details not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const query_update = knex(`${POSETTINGS.NAME}`)
      .where(POSETTINGS.COLUMNS.LOCID, body.Locid)
      .where(POSETTINGS.COLUMNS.CODE, body.Code)
      .whereNot(POSETTINGS.COLUMNS.FLAG, body.Flag)
      .update({
        [POSETTINGS.COLUMNS.FLAG]: body.Flag
      });

    logQuery({
      logger: fastify.log,
      query: query_update,
      context: `Update POSettings flag is ${body.Flag}`,
      logTrace
    });

    const response = await query_update;

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating  POSetting Flag",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { status: StatusCodes.OK, message: "success" };
  }
  // async function mbqPoSettings({ body, logTrace }) {
  //   const knex = this;
  //   const CHUNK_SIZE = 1;

  //   const existingRecords = [];

  //   // Fetch existing records in chunks using direct where conditions
  //   for (let i = 0; i < body.length; i += CHUNK_SIZE) {
  //     const chunk = body.slice(i, i + CHUNK_SIZE);
  //     const chunkRecords = await knex(POSETTINGS.NAME)
  //       .where(function () {
  //         chunk.forEach(item => {
  //           this.orWhere(function () {
  //             this.where(POSETTINGS.COLUMNS.LOCID, item.Locid).andWhere(
  //               POSETTINGS.COLUMNS.CODE,
  //               item.Code
  //             );
  //           });
  //         });
  //       })
  //       .timeout(30000); // Set timeout to 30 seconds

  //     existingRecords.push(...chunkRecords);
  //   }

  //   // Normalize date format in existing records
  //   const normalizedRecords = existingRecords.map(record => ({
  //     ...record
  //   }));

  //   // Create a map of existing records for quick lookup
  //   const existingMap = new Map(
  //     normalizedRecords.map(record => [
  //       `${record[POSETTINGS.COLUMNS.LOCID]}_${
  //         record[POSETTINGS.COLUMNS.CODE]
  //       }`,
  //       record
  //     ])
  //   );

  //   // Separate data into updates and inserts
  //   const deletes = [];
  //   const inserts = [];

  //   for (const item of body) {
  //     const normalizedKey = `${item.Locid}_${item.Code}`;
  //     if (existingMap.has(normalizedKey)) {
  //       // Add to updates
  //       deletes.push({
  //         condition: {
  //           [POSETTINGS.COLUMNS.LOCID]: item.Locid,
  //           [POSETTINGS.COLUMNS.CODE]: item.Code
  //         }
  //       });
  //     } else {
  //       // Add to inserts
  //       inserts.push({
  //         [POSETTINGS.COLUMNS.LOCID]: item.Locid,
  //         [POSETTINGS.COLUMNS.CODE]: item.Code,
  //         [POSETTINGS.COLUMNS.SALEDAYS]: item.SaleDays,
  //         [POSETTINGS.COLUMNS.TIMES]: item.Times,
  //         [POSETTINGS.COLUMNS.MINMBQ]: item.MinMbq,
  //         [POSETTINGS.COLUMNS.FLAG]: item.Flag,
  //         [POSETTINGS.COLUMNS.U_ID]: item.U_ID,
  //         [POSETTINGS.COLUMNS.LASTUPDATE]: item.LastUpdate,
  //         [POSETTINGS.COLUMNS.CTYPE]: item.Ctype,
  //         [POSETTINGS.COLUMNS.VLT]: item.VLT,
  //         [POSETTINGS.COLUMNS.PAWAY]: item.Paway,
  //         [POSETTINGS.COLUMNS.PACKQTY]: item.PackQty
  //       });
  //     }
  //   }

  //   // Perform batch deletes in chunks
  //   for (let i = 0; i < deletes.length; i += CHUNK_SIZE) {
  //     const chunk = deletes.slice(i, i + CHUNK_SIZE);
  //     for (const condition of chunk) {
  //       await knex(POSETTINGS.NAME).where(condition).del().timeout(30000); // Set timeout to 30 seconds
  //     }
  //   }

  //   // Perform batch inserts in chunks
  //   for (let i = 0; i < inserts.length; i += CHUNK_SIZE) {
  //     const chunk = inserts.slice(i, i + CHUNK_SIZE);
  //     await knex(POSETTINGS.NAME).insert(chunk).timeout(30000); // Set timeout to 30 seconds
  //   }

  //   return { success: true, message: "Batch operation completed successfully" };
  // }

  async function fetchLocation({ body, params, logTrace, userDetails }) {
    const knex = this;

    try {
      const locationsMap = new Map();
      const materialMap = new Map();

      // Fetch location IDs based on LocName
      const locNames = body.map(item => item.OutletName);
      // console.log("OutletName", locNames);
      // const locNames = body.map(item => item.LocName);
      const locations = await knex(OUTLETS.NAME)
        .select(
          OUTLETS.COLUMNS.ID,
          OUTLETS.COLUMNS.FULLNAME)
        .whereIn(OUTLETS.COLUMNS.FULLNAME, locNames);

      // Map LocName to LocId
      locations.forEach(location => {
        locationsMap.set(
          location[OUTLETS.COLUMNS.FULLNAME],
          location[OUTLETS.COLUMNS.ID]
        );
      });

      // Fetch relevant MT_CODE values from BK_Material
      const codes = body.map(item => item.SKUCode); // Extract unique Codes
      const materialData = await knex(ITEM.NAME)
        .select(
          ITEM.COLUMNS.PRODUCT_CODE,
          ITEM.COLUMNS.PACK_QTY, // PackQty
          ITEM.COLUMNS.PUTAWAY // Paway
        )
        .whereIn(ITEM.COLUMNS.PRODUCT_CODE, codes); // Apply WHERE condition

      // Map Code to PackQty & Paway
      materialData.forEach(material => {
        materialMap.set(material[ITEM.COLUMNS.PRODUCT_CODE], {
          PackQty: material[ITEM.COLUMNS.PACK_QTY] || 0,
          Paway: material[ITEM.COLUMNS.PUTAWAY] || 0
        });
      });

      // Append LocId, PackQty, and Paway to the response body
      const response = body.map(item => ({
        ...item,
        Locid: locationsMap.get(item.OutletName) || null,
        // PackQty: materialMap.get(item.SKUCode)?.PackQty || item.PACKQTY,
        PackQty: item.PACKQTY,
        Paway: materialMap.get(item.SKUCode)?.Paway || null,
        LastUpdate: new Date()
      }));

      return response;
    } catch (error) {
      logTrace(error);
      throw new Error("Failed to fetch locations and material data");
    }
  }
  // async function fetchLocation({ body, params, logTrace, userDetails }) {
  //   const knex = this;

  //   try {
  //     const locationsMap = new Map();
  //     const materialMap = new Map();

  //     // Fetch location IDs based on LocName
  //     const locNames = body.map(item => item.LocName);
  //     const locations = await knex(OUTLETS.NAME)
  //       .select(
  //         OUTLETS.COLUMNS.ID,
  //         OUTLETS.COLUMNS.FULLNAME)
  //       .whereIn(OUTLETS.COLUMNS.FULLNAME, locNames);

  //     // Map LocName to LocId
  //     locations.forEach(location => {
  //       locationsMap.set(
  //         location[OUTLETS.COLUMNS.FULLNAME],
  //         location[OUTLETS.COLUMNS.ID]
  //       );
  //     });

  //     // Fetch relevant MT_CODE values from BK_Material
  //     const codes = body.map(item => item.Code); // Extract unique Codes
  //     const materialData = await knex(ITEM.NAME)
  //       .select(
  //         ITEM.COLUMNS.PRODUCT_CODE,
  //         ITEM.COLUMNS.PACK_QTY, // PackQty
  //         ITEM.COLUMNS.PUTAWAY // Paway
  //       )
  //       .whereIn(ITEM.COLUMNS.PRODUCT_CODE, codes); // Apply WHERE condition

  //     // Map Code to PackQty & Paway
  //     materialData.forEach(material => {
  //       materialMap.set(material[ITEM.COLUMNS.PRODUCT_CODE], {
  //         PackQty: material[ITEM.COLUMNS.PACK_QTY] || 0,
  //         Paway: material[ITEM.COLUMNS.PUTAWAY] || 0
  //       });
  //     });

  //     // Append LocId, PackQty, and Paway to the response body
  //     const response = body.map(item => ({
  //       ...item,
  //       Locid: locationsMap.get(item.LocName) || null,
  //       PackQty: materialMap.get(item.Code)?.PackQty || null,
  //       Paway: materialMap.get(item.Code)?.Paway || null,
  //       LastUpdate: new Date()
  //     }));

  //     return response;
  //   } catch (error) {
  //     logTrace(error);
  //     throw new Error("Failed to fetch locations and material data");
  //   }
  // }

  // async function mbqPoSettings({ body, logTrace }) {
  //   const knex = this;
  //   const CHUNK_SIZE = 1;
  //   console.log(body,"body of values")
  //   const existingRecords = [];

  //   // Fetch existing records in chunks using direct where conditions
  //   for (let i = 0; i < body.length; i += CHUNK_SIZE) {
  //     const chunk = body.slice(i, i + CHUNK_SIZE);
  //     const chunkRecords = await knex(POSETTINGSTEST.NAME)
  //       .where(function () {
  //         chunk.forEach(item => {
  //           this.orWhere(function () {
  //             this.where(POSETTINGSTEST.COLUMNS.LOCID, item.Locid).andWhere(
  //               POSETTINGSTEST.COLUMNS.CODE,
  //               item.Code
  //             );
  //           });
  //         });
  //       })
  //       .timeout(30000); // Set timeout to 30 seconds

  //     existingRecords.push(...chunkRecords);
  //   }

  //   // Normalize date format in existing records
  //   const normalizedRecords = existingRecords.map(record => ({
  //     ...record
  //   }));

  //   // Create a map of existing records for quick lookup
  //   const existingMap = new Map(
  //     normalizedRecords.map(record => [
  //       `${record[POSETTINGSTEST.COLUMNS.LOCID]}_${record[POSETTINGSTEST.COLUMNS.CODE]
  //       }`,
  //       record
  //     ])
  //   );

  //   // Separate data into deletes and inserts
  //   const deletes = [];
  //   const inserts = [];

  //   for (const item of body) {
  //     const normalizedKey = `${item.Locid}_${item.Code}`;
  //     if (existingMap.has(normalizedKey)) {
  //       // Add to deletes
  //       deletes.push({
  //         [POSETTINGSTEST.COLUMNS.LOCID]: item.Locid,
  //         [POSETTINGSTEST.COLUMNS.CODE]: item.Code
  //       });
  //     }

  //     // Add to inserts
  //     inserts.push({
  //       [POSETTINGSTEST.COLUMNS.LOCID]: item.Locid,
  //       [POSETTINGSTEST.COLUMNS.CODE]: item.Code,
  //       [POSETTINGSTEST.COLUMNS.SALEDAYS]: item.SaleDays,
  //       [POSETTINGSTEST.COLUMNS.TIMES]: item.Times,
  //       [POSETTINGSTEST.COLUMNS.MINMBQ]: item.MinMbq,
  //       [POSETTINGSTEST.COLUMNS.FLAG]: item.Flag,
  //       [POSETTINGSTEST.COLUMNS.U_ID]: item.U_ID,
  //       [POSETTINGSTEST.COLUMNS.LASTUPDATE]: item.LastUpdate,
  //       [POSETTINGSTEST.COLUMNS.CTYPE]: item.Ctype,
  //       [POSETTINGSTEST.COLUMNS.VLT]: item.VLT,
  //       [POSETTINGSTEST.COLUMNS.PAWAY]: item.Paway,
  //       [POSETTINGSTEST.COLUMNS.PACKQTY]: item.PackQty,

  //     });
  //   }

  //   // Perform batch deletes in chunks
  //   for (let i = 0; i < deletes.length; i += CHUNK_SIZE) {
  //     const chunk = deletes.slice(i, i + CHUNK_SIZE);
  //     for (const condition of chunk) {
  //       await knex(POSETTINGSTEST.NAME).where(condition).del().timeout(30000); // Set timeout to 30 seconds
  //     }
  //   }

  //   // Perform batch inserts in chunks
  //   for (let i = 0; i < inserts.length; i += CHUNK_SIZE) {
  //     const chunk = inserts.slice(i, i + CHUNK_SIZE);
  //     await knex(POSETTINGSTEST.NAME).insert(chunk).timeout(30000); // Set timeout to 30 seconds
  //   }

  //   return {
  //     success: true,
  //     message: "Batch delete and insert operation completed successfully"
  //   };
  // }

  async function mbqPoSettings({ body, logTrace }) {
    const knex = this;
    const CHUNK_SIZE = 1;

    console.log(body, "Incoming body");

    const uniqueMap = new Map();
    const failedSlos = [];
    const successfulSlos = [];

    // ✅ Step 1: Remove duplicates by Locid + Code combo
    for (const item of body) {
      // console.log("item", item);
      const key = `${item.OutletName}_${item.SKUCode}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }

    const uniqueBody = Array.from(uniqueMap.values());

    // ✅ Step 2: Normalize LocNames and fetch outlet IDs
    const locNameToItemMap = new Map();
    for (const item of uniqueBody) {
      if (item.OutletName) {
        const normalizedLocName = item.OutletName.toLowerCase().replace(/\s+/g, '');
        if (!locNameToItemMap.has(normalizedLocName)) {
          locNameToItemMap.set(normalizedLocName, []);
        }
        locNameToItemMap.get(normalizedLocName).push(item);
      }
    }

    const normalizedLocNames = Array.from(locNameToItemMap.keys());

    const outletRecords = await knex(OUTLETS.NAME)
      .whereIn(
        knex.raw("LOWER(REPLACE(fullname, ' ', ''))"),
        normalizedLocNames
      )
      .select('id', 'fullname');

    const outletMap = new Map();
    for (const outlet of outletRecords) {
      console.log("outletRecords", outletRecords);
      const normalizedFullName = outlet.fullname.toLowerCase().replace(/\s+/g, '');
      outletMap.set(normalizedFullName, outlet.id);
    }

    // ✅ Step 3: Map outlet_id or push to failed list
    for (const item of uniqueBody) {
      // console.log("uniqueBody", uniqueBody);
      const normalizedLocName = item.OutletName?.toLowerCase().replace(/\s+/g, '');
      // console.log("normalizedLocName", normalizedLocName);
      if (normalizedLocName && outletMap.has(normalizedLocName)) {
        item.outlet_id = outletMap.get(normalizedLocName);
      } else {
        item.outlet_id = null;
        failedSlos.push({
          Locid: item.Locid,
          Code: item.SKUCode,
          LocName: item.OutletName,
          reason: "Outlet not found"
        });
      }
    }

    const validItems = uniqueBody.filter(item => item.outlet_id !== null);

    // ✅ Step 4: Check for existing records to prepare deletes
    const existingRecords = [];

    for (let i = 0; i < validItems.length; i += CHUNK_SIZE) {
      const chunk = validItems.slice(i, i + CHUNK_SIZE);
      const chunkRecords = await knex(POSETTINGS.NAME)
        .where(function () {
          chunk.forEach(item => {
            this.orWhere(function () {
              this.where(POSETTINGS.COLUMNS.LOC_ID, item.Locid)
                .andWhere(POSETTINGS.COLUMNS.CODE, item.SKUCode);
            });
          });
        })
        .timeout(30000);

      existingRecords.push(...chunkRecords);
    }

    const existingMap = new Map(
      existingRecords.map(record => [
        `${record[POSETTINGS.COLUMNS.LOC_ID]}_${record[POSETTINGS.COLUMNS.CODE]}`,
        record
      ])
    );

    const deletes = [];
    const inserts = [];
    const outletProductUpdates = [];


    for (const item of validItems) {
      const key = `${item.Locid}_${item.SKUCode}`;
      if (existingMap.has(key)) {
        deletes.push({
          [POSETTINGS.COLUMNS.LOC_ID]: item.Locid,
          [POSETTINGS.COLUMNS.CODE]: item.SKUCode
        });
      }

      inserts.push({
        [POSETTINGS.COLUMNS.CODE]: item.SKUCode,
        [POSETTINGS.COLUMNS.SALEDAYS]: item.MBQDays,
        [POSETTINGS.COLUMNS.TIMES]: 0,
        [POSETTINGS.COLUMNS.MINMBQ]: parseInt(item.MinimumMBQ || 0),
        [POSETTINGS.COLUMNS.FLAG]: item.Flag || true,
        [POSETTINGS.COLUMNS.U_ID]: 1,
        [POSETTINGS.COLUMNS.LASTUPDATE]: new Date(),
        // [POSETTINGS.COLUMNS.CTYPE]: item.Type === "Dynamic" ? 0 : 1,
        [POSETTINGS.COLUMNS.CTYPE]:
          (item.Type === "Dynamic" || item.Type === "Variable") ? 0 : 1,

        [POSETTINGS.COLUMNS.VLT]: item.VLT,
        [POSETTINGS.COLUMNS.PAWAY]: parseInt(item.paway || 0),
        [POSETTINGS.COLUMNS.PACKQTY]: parseInt(item.PackQty || 0),
        [POSETTINGS.COLUMNS.MAXMBQ]: parseInt(item.MaxMBQ || 0),
        [POSETTINGS.COLUMNS.TS]: item.TS,
        [POSETTINGS.COLUMNS.OUTLET_ID]: item.outlet_id,
        [POSETTINGS.COLUMNS.LOC_ID]: item.outlet_id
      });

      successfulSlos.push({
        Locid: item.Locid,
        Code: item.SKUCode
      });

      outletProductUpdates.push({
        outlet_id: item.outlet_id,
        pro_code: item.SKUCode,
        caseqty: parseInt(item.PackQty || 0)
      });

    }

    // ✅ Step 5: Perform deletes
    for (let i = 0; i < deletes.length; i += CHUNK_SIZE) {
      const chunk = deletes.slice(i, i + CHUNK_SIZE);
      for (const condition of chunk) {
        await knex(POSETTINGS.NAME).where(condition).del().timeout(30000);
      }
    }

    // ✅ Step 6: Perform inserts
    for (let i = 0; i < inserts.length; i += CHUNK_SIZE) {
      const chunk = inserts.slice(i, i + CHUNK_SIZE);
      await knex(POSETTINGS.NAME).insert(chunk).timeout(30000);
    }

    for (let i = 0; i < outletProductUpdates.length; i += CHUNK_SIZE) {
      const chunk = outletProductUpdates.slice(i, i + CHUNK_SIZE);

      for (const row of chunk) {
        await knex(OUTLET_PRODUCT_MAPPING.NAME)
          .where({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: row.outlet_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: row.pro_code
          })
          .update({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PACK_QTY]: row.caseqty,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
          })
          .timeout(30000);
      }
    }

    // ✅ Step 7: Final response
    return {
      success: true,
      message: "Batch operation completed",
      inserted: successfulSlos,
      failed: failedSlos,
      duplicatesRemoved: body.length - uniqueBody.length
    };
  }
  // async function mbqPoSettings({ body, logTrace }) {
  //   const knex = this;
  //   const CHUNK_SIZE = 1;

  //   console.log(body, "Incoming body");

  //   const uniqueMap = new Map();
  //   const failedSlos = [];
  //   const successfulSlos = [];

  //   // ✅ Step 1: Remove duplicates by Locid + Code combo
  //   for (const item of body) {
  //     const key = `${item.LocName}_${item.Code}`;
  //     if (!uniqueMap.has(key)) {
  //       uniqueMap.set(key, item);
  //     }
  //   }

  //   const uniqueBody = Array.from(uniqueMap.values());

  //   // ✅ Step 2: Normalize LocNames and fetch outlet IDs
  //   const locNameToItemMap = new Map();
  //   for (const item of uniqueBody) {
  //     if (item.LocName) {
  //       const normalizedLocName = item.LocName.toLowerCase().replace(/\s+/g, '');
  //       if (!locNameToItemMap.has(normalizedLocName)) {
  //         locNameToItemMap.set(normalizedLocName, []);
  //       }
  //       locNameToItemMap.get(normalizedLocName).push(item);
  //     }
  //   }

  //   const normalizedLocNames = Array.from(locNameToItemMap.keys());

  //   const outletRecords = await knex(OUTLETS.NAME)
  //     .whereIn(
  //       knex.raw("LOWER(REPLACE(fullname, ' ', ''))"),
  //       normalizedLocNames
  //     )
  //     .select('id', 'fullname');

  //   const outletMap = new Map();
  //   for (const outlet of outletRecords) {
  //     const normalizedFullName = outlet.fullname.toLowerCase().replace(/\s+/g, '');
  //     outletMap.set(normalizedFullName, outlet.id);
  //   }

  //   // ✅ Step 3: Map outlet_id or push to failed list
  //   for (const item of uniqueBody) {
  //     const normalizedLocName = item.LocName?.toLowerCase().replace(/\s+/g, '');
  //     if (normalizedLocName && outletMap.has(normalizedLocName)) {
  //       item.outlet_id = outletMap.get(normalizedLocName);
  //     } else {
  //       item.outlet_id = null;
  //       failedSlos.push({
  //         Locid: item.Locid,
  //         Code: item.Code,
  //         LocName: item.LocName,
  //         reason: "Outlet not found"
  //       });
  //     }
  //   }

  //   const validItems = uniqueBody.filter(item => item.outlet_id !== null);

  //   // ✅ Step 4: Check for existing records to prepare deletes
  //   const existingRecords = [];

  //   for (let i = 0; i < validItems.length; i += CHUNK_SIZE) {
  //     const chunk = validItems.slice(i, i + CHUNK_SIZE);
  //     const chunkRecords = await knex(POSETTINGS.NAME)
  //       .where(function () {
  //         chunk.forEach(item => {
  //           this.orWhere(function () {
  //             this.where(POSETTINGS.COLUMNS.LOC_ID, item.Locid)
  //               .andWhere(POSETTINGS.COLUMNS.CODE, item.Code);
  //           });
  //         });
  //       })
  //       .timeout(30000);

  //     existingRecords.push(...chunkRecords);
  //   }

  //   const existingMap = new Map(
  //     existingRecords.map(record => [
  //       `${record[POSETTINGS.COLUMNS.LOC_ID]}_${record[POSETTINGS.COLUMNS.CODE]}`,
  //       record
  //     ])
  //   );

  //   const deletes = [];
  //   const inserts = [];

  //   for (const item of validItems) {
  //     const key = `${item.Locid}_${item.Code}`;
  //     if (existingMap.has(key)) {
  //       deletes.push({
  //         [POSETTINGS.COLUMNS.LOC_ID]: item.Locid,
  //         [POSETTINGS.COLUMNS.CODE]: item.Code
  //       });
  //     }

  //     inserts.push({
  //       [POSETTINGS.COLUMNS.CODE]: item.Code,
  //       [POSETTINGS.COLUMNS.SALEDAYS]: item.SaleDays,
  //       [POSETTINGS.COLUMNS.TIMES]: item.Times,
  //       [POSETTINGS.COLUMNS.MINMBQ]: parseInt(item.MinMbq || 0),
  //       [POSETTINGS.COLUMNS.FLAG]: item.Flag,
  //       [POSETTINGS.COLUMNS.U_ID]: item.U_ID,
  //       [POSETTINGS.COLUMNS.LASTUPDATE]: new Date(),
  //       [POSETTINGS.COLUMNS.CTYPE]: item.Ctype,
  //       [POSETTINGS.COLUMNS.VLT]: item.VLT,
  //       [POSETTINGS.COLUMNS.PAWAY]: parseInt(item.paway || 0),
  //       [POSETTINGS.COLUMNS.PACKQTY]: parseInt(item.packqty || 0),
  //       [POSETTINGS.COLUMNS.MAXMBQ]: parseInt(item.maxmbq || 0),
  //       [POSETTINGS.COLUMNS.TS]: item.ts,
  //       [POSETTINGS.COLUMNS.OUTLET_ID]: item.outlet_id
  //     });

  //     successfulSlos.push({
  //       Locid: item.Locid,
  //       Code: item.Code
  //     });
  //   }

  //   // ✅ Step 5: Perform deletes
  //   for (let i = 0; i < deletes.length; i += CHUNK_SIZE) {
  //     const chunk = deletes.slice(i, i + CHUNK_SIZE);
  //     for (const condition of chunk) {
  //       await knex(POSETTINGS.NAME).where(condition).del().timeout(30000);
  //     }
  //   }

  //   // ✅ Step 6: Perform inserts
  //   for (let i = 0; i < inserts.length; i += CHUNK_SIZE) {
  //     const chunk = inserts.slice(i, i + CHUNK_SIZE);
  //     await knex(POSETTINGS.NAME).insert(chunk).timeout(30000);
  //   }

  //   // ✅ Step 7: Final response
  //   return {
  //     success: true,
  //     message: "Batch operation completed",
  //     inserted: successfulSlos,
  //     failed: failedSlos,
  //     duplicatesRemoved: body.length - uniqueBody.length
  //   };
  // }


  async function purchaseOrdeSettingsOutletsRepo({ params, logTrace }) {
    const knex = this;
    const { region_id } = params;

    const query = knex
      .distinct([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
      ])
      .from(`${POSETTINGS.NAME} as ${POSETTINGS.NAME}`)
      .leftJoin(`${OUTLETS.NAME} as ${OUTLETS.NAME}`, function () {
        this.on(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, ` ${POSETTINGS.NAME}.${POSETTINGS.COLUMNS.OUTLET_ID}`);
      })
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`, Number(region_id))
      .orderBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, "desc");


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

  return {
    poSettingsPaginate,
    poSettingsFlag,
    mbqPoSettings,
    fetchLocation,
    purchaseOrdeSettingsOutletsRepo
  };
}

module.exports = grnRepo;
