const supplierRepo = require("../repository/supplier");
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { v4: uuidv4 } = require('uuid');
const { queryString } = require("../schemas/getSupplierPaginateSchema");

function getSupplierService(fastify) {
  const { getSupplier } = supplierRepo(fastify);

  return async ({ logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSupplier.call(knex, {
      logTrace
    });
    return response;

  };
}

function getSupplierPaginateService(fastify) {
  const { getSupplierPaginate } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getSupplierPaginate.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };

}

function postSupplierService(fastify) {
  const { postSupplier } = supplierRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postSupplier.call(knex, {
      params,
      body,
      logTrace, userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putSupplierService(fastify) {
  const { putSupplier } = supplierRepo(fastify);
  return async ({ params, body, query, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { supplier_id } = params;
    const promise1 = putSupplier.call(knex, {
      supplier_id,
      body,
      logTrace,
      queryString: query,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteSupplierService(fastify) {
  const { deleteSupplier } = supplierRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const { supplier_id } = params;
    const promise1 = deleteSupplier.call(knex, {
      supplier_id,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function getSupplierInfoService(fastify) {
  const { getSupplierInfo } = supplierRepo(fastify);

  return async ({ params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSupplierInfo.call(knex, {
      params,
      logTrace
    });
    return response;
  };
}

function getSupplierByProductsService(fastify) {
  const { getSupplierByProducts } = supplierRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSupplierByProducts.call(knex, {
      body,
      params,
      logTrace
    });
    return response;

  };
}

function uploadDocumentService(fastify) {
  return async ({ body, logTrace, request, reply }) => {
    const { file } = body;
    const knex = fastify.knexMedical;

    if (!file) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No file uploaded",
        property: "",
        code: "NOT_FOUND"
      });
    }
    // Log the received file name and size
    // console.log('Received file:', body.file.filename);
    const inputBuffer = await body.file.toBuffer();
    // console.log('File converted to buffer:', inputBuffer.length, 'bytes');
    const originalFilename = body.file.filename;
    const media_path = `${uuidv4()}-${originalFilename}`;

    const result = await fastify.bucketOperations.saveFileBuffer({
      file_path: media_path,
      buffer: inputBuffer
    });

    if (!result) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: console.log(result),
        property: "",
        code: "NOT_FOUND"
      });
    }
    // Construct the full URL based on your cloud storage configuration
    const cloudStorageBaseUrl =
      process.env.GCS_URL + "/" + process.env.GCP_BUCKET_NAME;
    const fullUrl = `${cloudStorageBaseUrl}/${media_path}`;
    return {
      path_url: fullUrl
    };
  };
}

function getSupplierApprovalService(fastify) {
  const { getSupplierApprovalRepo } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getSupplierApprovalRepo.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    return response;
  };

}

function uploadSupplierDocumentService(fastify) {
  return async ({ body, logTrace }) => {
    const fileFields = ["pan_file", "gstin_file", "bank_passbook_file", "fssai_file"];

    const uploadPromises = fileFields.map(async (field) => {
      const file = body[field];

      if (!file || !file.filename?.trim()) {
        return [field, null];
      }

      try {
        const inputBuffer = await file.toBuffer();
        const media_path = `${uuidv4()}-${file.filename}`;

        const result = await fastify.bucketOperations.saveFileBuffer({
          file_path: media_path,
          buffer: inputBuffer,
        });

        if (!result) {
          throw CustomError.create({
            httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Failed to upload ${field}`,
            property: field,
            code: "UPLOAD_FAILED",
          });
        }

        const fullUrl = `${process.env.GCS_URL}/${process.env.GCP_BUCKET_NAME}/${media_path}`;
        return [field, fullUrl];
      } catch (err) {
        logTrace?.error(`Error uploading ${field}:`, err);
        return [field, null];
      }
    });

    const results = await Promise.all(uploadPromises);

    // Convert array back to object
    const uploadedFiles = Object.fromEntries(results);

    return uploadedFiles;
  };
}

function getOutletSupplierByProductsService(fastify) {
  const { getOutletSupplierByProducts } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSupplierByProducts.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    return response;

  };
}

function getOutletSupplierByDayProductsService(fastify) {
  const { getOutletSupplierByDayProducts } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getOutletSupplierByDayProducts.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    return response;

  };
}


function getSupplierByOutletsService(fastify) {
  const { getSupplierByOutletRepo } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getSupplierByOutletRepo.call(knex, {
      body, params, logTrace,
      queryString: query
    });
    return response;
  };

}

function postImportValidationSupplierExcelService(fastify) {
  const { postSupplierExcelValidation } = supplierRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postSupplierExcelValidation.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function postExcelSupplierService(fastify) {
  const { postExcelSupplierRepo } = supplierRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postExcelSupplierRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getSuplierOutlertMappingService(fastify) {
  const { getSuplierOutletMappingDetails } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getSuplierOutletMappingDetails.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    return response;

  };
}

function getSuplierOutlertMappingOrderDaysService(fastify) {
  const { getSuplierOutletMappingOrderDaysRepo } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query }) => {
    const knex = fastify.knexMedical;
    const response = await getSuplierOutletMappingOrderDaysRepo.call(knex, {
      body,
      params,
      logTrace,
      queryString: query
    });
    return response;

  };
}

function putSuplierOutlertMappingService(fastify) {
  const { updateSupplierOutletMapping } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await updateSupplierOutletMapping.call(knex, {
      body,
      params,
      logTrace,
      queryString: query,
      userDetails
    });
    return response;

  };
}

function putSuplierOutlertMappingBrandService(fastify) {
  const { updateSupplierOutletOrderdays } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await updateSupplierOutletOrderdays.call(knex, {
      body,
      params,
      logTrace,
      queryString: query,
      userDetails
    });
    return response;

  };
}


function getSupplierDetailsExportService(fastify) {
  const { getSuplierDetailsExportRepo } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getSuplierDetailsExportRepo.call(knex, {
      body,
      params,
      logTrace,
      queryString: query,
      userDetails
    });
    return response;

  };
}
function getSupplierOrderDaysDetailsExportService(fastify) {
  const { getSuplierOrderDaysExportRepo } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getSuplierOrderDaysExportRepo.call(knex, {
      body,
      params,
      logTrace,
      queryString: query,
      userDetails
    });
    return response;

  };
}


function getSuplierOrderDaysWithBrandNameExportService(fastify) {
  const { getSuplierOrderDaysWithBrandNameExportRepo } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getSuplierOrderDaysWithBrandNameExportRepo.call(knex, {
      body,
      params,
      logTrace,
      queryString: query,
      userDetails
    });
    return response;

  };
}

function getSuplierOrderDaysBrandBasedExportService(fastify) {
  const { getBrandCompanyBasedSupplierOrderDaysExportRepo } = supplierRepo(fastify);

  return async ({ body, params, logTrace, query, userDetails }) => {
    const knex = fastify.knexMedical;
    const response = await getBrandCompanyBasedSupplierOrderDaysExportRepo.call(knex, {
      body,
      params,
      logTrace,
      queryString: query,
      userDetails
    });
    return response;

  };
}

function postSupplierExcelPoOrderDaysService(fastify) {
  const { postSupplierOrderDaysExcelImportRepo } = supplierRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postSupplierOrderDaysExcelImportRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function postSupplierExcelPoOrderDaysBrandbasedService(fastify) {
  const { postSupplierOrderDaysExcelImportBrandBasedRepo } = supplierRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = postSupplierOrderDaysExcelImportBrandBasedRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function excelSkuMappingService(fastify) {
  const { excelSkuMapping } = supplierRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = excelSkuMapping.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}


function excelSupplierOuteletMappingService(fastify) {
  const { excelSupplierOuteletMapping } = supplierRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = excelSupplierOuteletMapping.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}






function getExcelSkuMappingService(fastify) {
  const { getExcelSkuMapping } = supplierRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const promise1 = getExcelSkuMapping.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      queryString: query,
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}
function removeExcelSkuMappingService(fastify) {
  const { removeExcelSkuMapping } = supplierRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = removeExcelSkuMapping.call(knex, {
      params,
      body,
      logTrace,
      userDetails
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  getSupplierService,
  getSupplierPaginateService,
  postSupplierService,
  putSupplierService,
  getSupplierApprovalService,
  deleteSupplierService,
  getSupplierInfoService,
  getSupplierByProductsService,
  uploadDocumentService,
  uploadSupplierDocumentService,
  getOutletSupplierByProductsService,
  getOutletSupplierByDayProductsService,
  getSupplierByOutletsService,
  postExcelSupplierService,
  getSuplierOutlertMappingService,
  getSuplierOutlertMappingOrderDaysService,
  putSuplierOutlertMappingService,
  getSupplierDetailsExportService,
  getSupplierOrderDaysDetailsExportService,
  postSupplierExcelPoOrderDaysService,
  excelSkuMappingService,
  getExcelSkuMappingService,
  removeExcelSkuMappingService,
  getSuplierOrderDaysWithBrandNameExportService,
  excelSupplierOuteletMappingService,
  postImportValidationSupplierExcelService,
  postSupplierExcelPoOrderDaysBrandbasedService,
  getSuplierOrderDaysBrandBasedExportService,
  putSuplierOutlertMappingBrandService
};
