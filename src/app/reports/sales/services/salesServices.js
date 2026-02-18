const salesRepo = require("../repository/sales.js");

function getSalesReportService(fastify) {
  const { getSalesReport } = salesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

function getSalesOutletTypeService(fastify) {
  const { getSalesOutletTypeReport } = salesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesOutletTypeReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

function getSalesItemwiseReportService(fastify) {
  const { getSalesItemwiseReport } = salesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesItemwiseReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}


function getSalesItemwiseBreakupReportProdidService(fastify) {
  const { getSalesItemwiseBreakupReportProdid } = salesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesItemwiseBreakupReportProdid.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}

function getSalesItemwiseBreakupReportService(fastify) {
  const { getSalesItemwiseBreakupReport } = salesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesItemwiseBreakupReport.call(knex, {
      body,
      params,
      logTrace
    });
    return response;
  };
}
function getSalesItemwiseAllReportService(fastify) {
  const { getSalesItemwiseAllReport } = salesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesItemwiseAllReport.call(knex, {
      body,
      params,
      logTrace
    });
    const transformedResponse = transformSalesData(response);

    return transformedResponse;

  };
}
function transformSalesData(salesData) {
  const transformedData = {};

  salesData.forEach(item => {
    const { category_name, subcategory_name, type_name, head_name, prodid, pro_code, pro_name, outlet_code, outlet_name, qty, amount } = item;

    if (!transformedData[prodid]) {
      transformedData[prodid] = {
        category_name,
        subcategory_name,
        type_name,
        head_name,
        prodid,
        pro_code,
        pro_name,
        total_qty: 0,
        total_amount: 0,
        outlet_details: []
      };
    }

    transformedData[prodid].total_qty += parseFloat(qty);
    transformedData[prodid].total_amount += parseFloat(amount);

    transformedData[prodid].outlet_details.push({
      outlet_id: prodid, // Assuming outlet_id is the same as prodid
      outlet_code,
      outlet_name,
      qty: parseFloat(qty),
      amount: parseFloat(amount)
    });
  });
  // Extract distinct outlets
  const distinctOutlets = Object.values(transformedData)
    .reduce((acc, category) => {
      category.outlet_details.forEach(outlet => {
        if (!acc[outlet.outlet_code]) {
          acc[outlet.outlet_code] = {
            outlet_code: outlet.outlet_code,
            outlet_name: outlet.outlet_name
          };
        }
      });
      return acc;
    }, {});

  // Prepare the output
  const output = Object.values(transformedData);

  return [{ outlets_names_header: Object.values(distinctOutlets) }, ...output];
  // return Object.values(transformedData);
}
function getSalesGroupwiseAllReportService(fastify) {
  const { getSalesGroupwiseAllReport } = salesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesGroupwiseAllReport.call(knex, {
      body,
      params,
      logTrace
    });
    const transformedResponse = transformSalesDataCategoryAndOutletWise(response);

    return transformedResponse;
    // return response;

  };
}

function transformSalesDataCategoryAndOutletWise(salesData) {
  const transformedData = {};

  salesData.forEach(item => {
    const { category_name, subcategory_name, type_name, head_name, qty, amount, outlet_code, outlet_name } = item;

    if (!transformedData[category_name]) {
      transformedData[category_name] = {
        category_name,
        subcategory_name,
        type_name,
        head_name,
        total_qty: 0,
        total_amount: 0,
        outlet_details: {}
      };
    }

    transformedData[category_name].total_qty += parseFloat(qty);
    transformedData[category_name].total_amount += parseFloat(amount);

    if (!transformedData[category_name].outlet_details[outlet_code]) {
      transformedData[category_name].outlet_details[outlet_code] = {
        outlet_code,
        outlet_name,
        total_qty: 0,
        total_amount: 0
      };
    }

    transformedData[category_name].outlet_details[outlet_code].total_qty += parseFloat(qty);
    transformedData[category_name].outlet_details[outlet_code].total_amount += parseFloat(amount);
  });

  // Convert outlet_details object to array
  Object.values(transformedData).forEach(category => {
    category.outlet_details = Object.values(category.outlet_details);
  });

  // Extract distinct outlets
  const distinctOutlets = Object.values(transformedData)
    .reduce((acc, category) => {
      category.outlet_details.forEach(outlet => {
        if (!acc[outlet.outlet_code]) {
          acc[outlet.outlet_code] = {
            outlet_code: outlet.outlet_code,
            outlet_name: outlet.outlet_name
          };
        }
      });
      return acc;
    }, {});

  // Prepare the output
  const output = Object.values(transformedData);

  return [{ outlets_names_header: Object.values(distinctOutlets) }, ...output];
}

function getSalesTransferService(fastify) {
  const { getSalesTransferReport } = salesRepo(fastify);

  return async ({ body, params, logTrace }) => {
    const knex = fastify.knexMedical;
    const response = await getSalesTransferReport.call(knex, {
      body,
      params,
      logTrace
    });
    // const transformedResponse = transformSalesDataCategoryAndOutletWise(response);

    // return transformedResponse;
    return response;

  };
}

module.exports = {
  getSalesReportService,
  getSalesItemwiseReportService,
  getSalesItemwiseBreakupReportService,
  getSalesItemwiseAllReportService,
  getSalesGroupwiseAllReportService,
  getSalesItemwiseBreakupReportProdidService,
  getSalesOutletTypeService,
  getSalesTransferService
};


