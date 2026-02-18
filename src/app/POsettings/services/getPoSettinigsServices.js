const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler/handler");
const grnRepo = require("../repository/posettings");
const excelImportRepo = require("../../Excelupload/repository/excelmport");

function poSettingsPaginateService(fastify) {
  const { poSettingsPaginate } = grnRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await poSettingsPaginate.call(knex, {
      params,
      body,
      logTrace,
      page_size: 10,
      current_page: 1
    });
    const transformedResponse = {
      status: StatusCodes.OK,
      message: "success",
      data: response.data,
      meta: response.meta
    };

    return transformedResponse;
  };
}
function poSettingsFlagService(fastify) {
  const { poSettingsFlag } = grnRepo(fastify);

  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;

    const response = await poSettingsFlag.call(knex, {
      logTrace,
      params,
      body
    });
    return response;
  };
}
function mbqPoSettingsService(fastify) {
  const { mbqPoSettings, fetchLocation } = grnRepo(fastify);
  const { uploadExcelData } = excelImportRepo(fastify);


  return async ({ body, params, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    // Step 1: Upload and extract Excel data
    const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
    const excelColumns = excelColumnData.headers.map(h =>
      h.toLowerCase().trim().replace(/\s+/g, '_')
    );
    const excelData = excelColumnData.data;

    // Step 2: Required columns
    const requiredColumns = ["skucode", "outletcode", "outletname", "mbqdays", "minimummbq", "maxmbq", "type", "vlt", "packqty", "ts"];
    const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
    if (missingColumns.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `Missing required columns: ${missingColumns.join(", ")}`,
        property: "",
        code: "EXCEL_REMOVE_FAILED"
      });
    }

    if (!excelData.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "No records found in Excel.",
        property: "",
        code: "EXCEL_REMOVE_FAILED"
      });
    }


    const locationDetails = await fetchLocation.call(knex, {
      logTrace,
      params,
      body: excelData
    });
    // return locationDetails;
    const response = await mbqPoSettings.call(knex, {
      logTrace,
      params,
      body: locationDetails
    });
    return response;
  };
}


function purchaseOrdeSettingsOutletsService(fastify) {
    const { purchaseOrdeSettingsOutletsRepo } = grnRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await purchaseOrdeSettingsOutletsRepo.call(knex, {
            body,
            params,
            logTrace
        });
        return response;
    };
}

module.exports = {
  poSettingsPaginateService,
  poSettingsFlagService,
  mbqPoSettingsService,
  purchaseOrdeSettingsOutletsService
};
