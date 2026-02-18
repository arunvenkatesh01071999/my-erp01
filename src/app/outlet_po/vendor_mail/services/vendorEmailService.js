const { StatusCodes } = require("http-status-codes");
const vendorEmailRepo = require("../repository/vendorEmailRepo.js");

const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 4) {
    return `${year}_${year + 1}`;
  } else {
    return `${year - 1}_${year}`;
  }
};

function getVendorMailService(fastify) {
  const { getVendorEmailRepo } = vendorEmailRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = getVendorEmailRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear,
      queryString: query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getVendorMailByIdService(fastify) {
  const { getVendorEmailByIdRepo } = vendorEmailRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = getVendorEmailByIdRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear,
      queryString: query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getVendorMailExcelExportService(fastify) {
  const { getVendorEmailExcelExportRepo } = vendorEmailRepo(fastify);
  return async ({ params, body, logTrace, userDetails, query }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = getVendorEmailExcelExportRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear,
      queryString: query
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postVendorEmailService(fastify) {
  const { postVendorEmailRepo } = vendorEmailRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = postVendorEmailRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function postVendorEmailExcelImportService(fastify) {
  const { vendorMailExcelImportRepo } = vendorEmailRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = vendorMailExcelImportRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function putVendorEmailService(fastify) {
  const { putVendorEmailRepo } = vendorEmailRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = putVendorEmailRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function deleteVendorEmailService(fastify) {
  const { deleteVendorEmailRepo } = vendorEmailRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const financialYear = getFinancialYear();
    const promise1 = deleteVendorEmailRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
      financialYear
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getVendorEmailSupplierListServices(fastify) {
  const { getVendorMailSupplierListRepo } = vendorEmailRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getVendorMailSupplierListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

function getVendorMailBrandCompanyListServices(fastify) {
  const { getVendorMailBrandCompanyListRepo } = vendorEmailRepo(fastify);
  return async ({ params, body, logTrace, userDetails }) => {
    const knex = fastify.knexMedical;
    const promise1 = getVendorMailBrandCompanyListRepo.call(knex, {
      params,
      body,
      logTrace,
      userDetails,
    });
    const [response] = await Promise.all([promise1]);
    return response;
  };
}

module.exports = {
  getVendorMailService,
  postVendorEmailService,
  putVendorEmailService,
  getVendorEmailSupplierListServices,
  getVendorMailBrandCompanyListServices,
  getVendorMailByIdService,
  deleteVendorEmailService,
  getVendorMailExcelExportService,
  postVendorEmailExcelImportService
};
